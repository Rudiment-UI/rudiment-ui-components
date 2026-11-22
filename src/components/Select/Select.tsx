import { useRef } from 'react'
import { useSelectState, type SelectState } from 'react-stately'
import {
  useSelect,
  useButton,
  useListBox,
  useOption,
  usePopover,
  HiddenSelect,
} from 'react-aria'
import type { RefObject } from 'react'
import type { Key } from 'react-aria'
import { cn } from '@/utils/cn'
import './select.css'

/** Props for `RudiSelect`. */
export interface RudiSelectProps<T extends object> {
  /** Visible label and the field's accessible name. Required. */
  label: string
  /**
   * The options as data. Each item is rendered by the `children` function; give items an `id` or `key` for stable selection.
   */
  items: Iterable<T>
  /** Render function returning a `RudiOption` for each item. */
  children: (item: T) => React.ReactNode
  /** Controlled selected option key. Pair with `onSelectionChange`. */
  selectedKey?: Key | null
  /** Initial selected key for an uncontrolled select. */
  defaultSelectedKey?: Key | null
  /** Called with the chosen option's key (not an event). */
  onSelectionChange?: (key: Key | null) => void
  /**
   * Text shown when nothing is selected.
   * @default 'Select an option'
   */
  placeholder?: string
  /** Help text under the field. Hidden while `errorMessage` is shown. */
  description?: string
  /** Error text shown under the field. Setting it marks the field invalid. */
  errorMessage?: string
  /** Form field name. The selected option's key is submitted under this name in a native form. */
  name?: string
  /** Marks the field required for assistive tech and adds an asterisk to the label. It does not block native form submission. */
  isRequired?: boolean
  /** Disables the field. */
  isDisabled?: boolean
  /** Extra class names for the wrapper element, merged with the component's own classes. */
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

interface PopoverInternalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: SelectState<any>
  triggerRef: RefObject<HTMLButtonElement | null>
  popoverRef: RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

function Popover({
  state,
  triggerRef,
  popoverRef,
  children,
}: PopoverInternalProps) {
  const { popoverProps } = usePopover({ triggerRef, popoverRef }, state)
  return (
    <div
      {...popoverProps}
      ref={popoverRef}
      className="rudi-select__popover"
    >
      {children}
    </div>
  )
}

interface ListBoxInternalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: SelectState<any>
  listBoxRef: RefObject<HTMLUListElement | null>
  [key: string]: unknown
}

function ListBox({ state, listBoxRef, ...props }: ListBoxInternalProps) {
  const { listBoxProps } = useListBox(props, state, listBoxRef)
  return (
    <ul {...listBoxProps} ref={listBoxRef} className="rudi-select__listbox">
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  )
}

interface OptionInternalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: SelectState<any>
}

function Option({ item, state }: OptionInternalProps) {
  const optionRef = useRef<HTMLLIElement>(null)
  const { optionProps, isSelected, isFocused } = useOption(
    { key: item.key },
    state,
    optionRef,
  )
  return (
    <li
      {...optionProps}
      ref={optionRef}
      className="rudi-select__option"
      data-focused={isFocused}
      aria-selected={isSelected}
    >
      {item.rendered}
    </li>
  )
}

/**
 * A dropdown for choosing one option from a list. Pass data via `items` and render each entry with a
 * `RudiOption` in `children`. `label` is required. Use `RudiComboBox` when the list is long enough to need search.
 *
 * @example
 * <RudiSelect label="Country" items={countries} onSelectionChange={setCountry}>
 *   {(c) => <RudiOption key={c.id}>{c.name}</RudiOption>}
 * </RudiSelect>
 */
export function RudiSelect<T extends object>(props: RudiSelectProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = useSelectState(props as any)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const listBoxRef = useRef<HTMLUListElement>(null)

  const {
    labelProps,
    triggerProps,
    valueProps,
    menuProps,
    descriptionProps,
    errorMessageProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useSelect(props as any, state, triggerRef)

  const { buttonProps } = useButton(triggerProps, triggerRef)

  return (
    <div className={cn('rudi-select', props.className)}>
      <label {...labelProps} className="rudi-select__label">
        {props.label}
        {props.isRequired && (
          <span className="rudi-select__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <HiddenSelect
        state={state}
        triggerRef={triggerRef}
        label={props.label}
        name={props.name}
        isDisabled={props.isDisabled}
      />
      <button
        {...buttonProps}
        ref={triggerRef}
        className={cn(
          'rudi-select__trigger',
          props.errorMessage && 'rudi-select__trigger--error',
        )}
      >
        <span {...valueProps}>
          {state.selectedItem
            ? state.selectedItem.rendered
            : props.placeholder || 'Select an option'}
        </span>
        <ChevronIcon aria-hidden="true" />
      </button>
      {state.isOpen && (
        <Popover state={state} triggerRef={triggerRef} popoverRef={popoverRef}>
          <ListBox {...menuProps} state={state} listBoxRef={listBoxRef} />
        </Popover>
      )}
      {props.description && !props.errorMessage && (
        <p {...descriptionProps} className="rudi-select__description">
          {props.description}
        </p>
      )}
      {props.errorMessage && (
        <p {...errorMessageProps} className="rudi-select__error">
          {props.errorMessage}
        </p>
      )}
    </div>
  )
}
