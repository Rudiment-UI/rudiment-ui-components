import { useRef, useState, useLayoutEffect } from 'react'
import { useComboBoxState, type ComboBoxState } from 'react-stately'
import {
  useComboBox,
  useButton,
  useListBox,
  useOption,
  usePopover,
  useFilter,
  DismissButton,
} from 'react-aria'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import type { Key } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './combo-box.css'

/** Props for `RudiComboBox`. */
export interface RudiComboBoxProps<T extends object> {
  /** Visible label. Required for accessibility. */
  label: string
  /** The options. Render each with `RudiOption`; give rich content a `textValue` so it can be filtered. */
  items: Iterable<T>
  /** Render function returning a `RudiOption` for each item. */
  children: (item: T) => ReactNode
  /** The selected option key (controlled). */
  selectedKey?: Key | null
  /** The initially selected option key (uncontrolled). */
  defaultSelectedKey?: Key | null
  /** Called with the newly selected key, or `null` when the selection is cleared. */
  onSelectionChange?: (key: Key | null) => void
  /** The text in the input (controlled). */
  inputValue?: string
  /** The initial text in the input (uncontrolled). */
  defaultInputValue?: string
  /** Called with the input text whenever it changes. */
  onInputChange?: (value: string) => void
  /** Hint text shown in the input while it is empty. */
  placeholder?: string
  /** Help text under the field. Hidden while `errorMessage` is shown. */
  description?: string
  /** Error text shown under the field. Setting it marks the field invalid. */
  errorMessage?: string
  /**
   * Marks the field required and adds an asterisk to the label.
   * @default false
   */
  isRequired?: boolean
  /**
   * Disables the input and the chevron button.
   * @default false
   */
  isDisabled?: boolean
  /** Form field name. The input's text is submitted under this name. */
  name?: string
  /** What opens the list: typing (`input`), focusing the field (`focus`), or only the arrow keys / chevron button (`manual`).
   * @default 'input'
   */
  menuTrigger?: 'focus' | 'input' | 'manual'
  /** Keep typed text that matches no option instead of reverting to the selected option on blur. */
  allowsCustomValue?: boolean
  /**
   * Message shown in the popover when the typed text matches no option.
   * @default 'No matches'
   */
  emptyMessage?: string
  /** Extra class names for the wrapper element, merged with the component's own classes. */
  className?: string
}

interface PopoverInternalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: ComboBoxState<any>
  triggerRef: RefObject<HTMLDivElement | null>
  popoverRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}

function Popover({ state, triggerRef, popoverRef, children }: PopoverInternalProps) {
  const { popoverProps } = usePopover(
    { triggerRef, popoverRef, isNonModal: true, placement: 'bottom start', offset: 4 },
    state,
  )
  // Match the popover to the field width.
  const [triggerWidth, setTriggerWidth] = useState<number>()
  useLayoutEffect(() => {
    setTriggerWidth(triggerRef.current?.offsetWidth)
  }, [triggerRef])

  const style = {
    ...popoverProps.style,
    ...(triggerWidth ? { '--trigger-width': `${triggerWidth}px` } : {}),
  } as CSSProperties

  return (
    <div {...popoverProps} ref={popoverRef} style={style} className="rudi-combo-box__popover">
      {children}
      <DismissButton onDismiss={state.close} />
    </div>
  )
}

interface ListBoxInternalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: ComboBoxState<any>
  listBoxRef: RefObject<HTMLUListElement | null>
  [key: string]: unknown
}

function ListBox({ state, listBoxRef, ...props }: ListBoxInternalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { listBoxProps } = useListBox(props as any, state, listBoxRef)
  return (
    <ul {...listBoxProps} ref={listBoxRef} className="rudi-combo-box__listbox">
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
  state: ComboBoxState<any>
}

function Option({ item, state }: OptionInternalProps) {
  const optionRef = useRef<HTMLLIElement>(null)
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    optionRef,
  )
  return (
    <li
      {...optionProps}
      ref={optionRef}
      className="rudi-combo-box__option"
      data-focused={isFocused}
      data-disabled={isDisabled || undefined}
      aria-selected={isSelected}
    >
      {item.rendered}
    </li>
  )
}

/**
 * A searchable select: a text input that filters a list of options by case- and accent-insensitive substring
 * match. Options are `RudiOption` elements, the same as `RudiSelect`; prefer `RudiSelect` for short lists.
 * `label` is required. The text in the input, not the selected key, is what a `name`d form field submits.
 *
 * @example
 * <RudiComboBox label="City" items={cities} onSelectionChange={setCity}>
 *   {(c) => <RudiOption key={c.id}>{c.name}</RudiOption>}
 * </RudiComboBox>
 */
export function RudiComboBox<T extends object>(props: RudiComboBoxProps<T>) {
  const {
    label,
    description,
    errorMessage,
    isRequired = false,
    isDisabled = false,
    menuTrigger = 'input',
    emptyMessage = 'No matches',
    placeholder,
    className,
  } = props

  const { contains } = useFilter({ sensitivity: 'base' })
  const isInvalid = !!errorMessage

  // `items` is passed as `defaultItems`: react-stately treats `items` as
  // externally filtered and skips `defaultFilter`. The collection is still
  // rebuilt from it on every render, so changing `items` works as expected.
  const ariaProps = {
    ...props,
    items: undefined,
    defaultItems: props.items,
    menuTrigger,
    isRequired,
    isDisabled,
    isInvalid,
    validationBehavior: 'aria' as const,
    allowsEmptyCollection: true,
    defaultFilter: contains,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = useComboBoxState<T>(ariaProps as any)

  const fieldRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listBoxRef = useRef<HTMLUListElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const {
    labelProps,
    inputProps,
    listBoxProps,
    buttonProps: triggerProps,
    descriptionProps,
    errorMessageProps,
  } = useComboBox(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { ...(ariaProps as any), inputRef, buttonRef, listBoxRef, popoverRef },
    state,
  )

  const { buttonProps } = useButton(triggerProps, buttonRef)
  const isEmpty = state.collection.size === 0

  return (
    <div className={cn('rudi-combo-box', className)}>
      <label {...labelProps} className="rudi-combo-box__label">
        {label}
        {isRequired && (
          <span className="rudi-combo-box__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <div
        ref={fieldRef}
        className={cn(
          'rudi-combo-box__field',
          isInvalid && 'rudi-combo-box__field--error',
          isDisabled && 'rudi-combo-box__field--disabled',
        )}
      >
        <input
          {...inputProps}
          ref={inputRef}
          placeholder={placeholder}
          className="rudi-combo-box__input"
        />
        <button {...buttonProps} ref={buttonRef} className="rudi-combo-box__button">
          <RudiIcon icon="lucide:chevrons-up-down" size="sm" />
        </button>
      </div>
      {state.isOpen && (
        <Popover state={state} triggerRef={fieldRef} popoverRef={popoverRef}>
          <ListBox {...listBoxProps} state={state} listBoxRef={listBoxRef} />
          {isEmpty && <p className="rudi-combo-box__empty">{emptyMessage}</p>}
        </Popover>
      )}
      {description && !isInvalid && (
        <p {...descriptionProps} className="rudi-combo-box__description">
          {description}
        </p>
      )}
      {isInvalid && (
        <p {...errorMessageProps} className="rudi-combo-box__error">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
