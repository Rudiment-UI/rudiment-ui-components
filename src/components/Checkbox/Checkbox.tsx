import { forwardRef, useContext, useId } from 'react'
import { useCheckbox, useCheckboxGroupItem } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { useToggleState } from 'react-stately'
import type { CheckboxGroupState } from 'react-stately'
import { CheckboxGroupContext } from './CheckboxGroupContext'
import { cn } from '@/utils/cn'
import './checkbox.css'

/** Props for `RudiCheckbox`. */
export interface RudiCheckboxProps {
  /** Visible label, rendered next to the box. */
  children: React.ReactNode
  /**
   * Controlled checked state for a standalone checkbox. Pair with `onChange`. Ignored inside a `RudiCheckboxGroup`.
   */
  isSelected?: boolean
  /** Initial checked state for an uncontrolled standalone checkbox. */
  defaultSelected?: boolean
  /**
   * Shows the mixed state (e.g. a "select all" box when only some children are checked). Sets the native `indeterminate` property so assistive tech announces "mixed", and shows the dash. It does not change `isSelected`.
   */
  isIndeterminate?: boolean
  /**
   * Called with the new checked state (a boolean, not an event) for a standalone checkbox.
   */
  onChange?: (isSelected: boolean) => void
  /** Disables the checkbox. */
  isDisabled?: boolean
  /**
   * Required inside a RudiCheckboxGroup: the value added to the group's array when checked. On a standalone checkbox it is the value submitted under `name` in a native form.
   */
  value?: string
  /** Form field name for a standalone checkbox. When checked, `name`=`value` is included in native form submission. */
  name?: string
  /** Error shown under a standalone checkbox (e.g. an unaccepted agreement); marks it invalid. */
  errorMessage?: string
  /**
   * Extra class names, merged with the component's own classes. Always applied to the outermost element: the label, or the wrapper when `errorMessage` is set.
   */
  className?: string
}

interface CheckboxViewProps {
  props: RudiCheckboxProps
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  isSelected: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
}

function CheckboxView({ props, inputProps, isSelected, inputRef }: CheckboxViewProps) {
  const errorId = useId()
  const hasError = !!props.errorMessage
  const control = (
    <label
      className={cn(
        'rudi-checkbox',
        props.isDisabled && 'rudi-checkbox--disabled',
        !hasError && props.className,
      )}
    >
      <input
        {...inputProps}
        ref={inputRef}
        className="rudi-checkbox__input"
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : inputProps['aria-describedby']}
      />
      <span
        className={cn(
          'rudi-checkbox__control',
          isSelected && 'rudi-checkbox__control--checked',
          props.isIndeterminate && 'rudi-checkbox__control--indeterminate',
        )}
        aria-hidden="true"
      />
      <span className="rudi-checkbox__label">{props.children}</span>
    </label>
  )
  if (!hasError) return control
  return (
    <div className={cn('rudi-checkbox-field', props.className)}>
      {control}
      <p id={errorId} className="rudi-checkbox__error">
        {props.errorMessage}
      </p>
    </div>
  )
}

/** A checkbox inside a RudiCheckboxGroup: selection lives in the group. */
const GroupedCheckbox = forwardRef<HTMLInputElement, RudiCheckboxProps & { group: CheckboxGroupState }>(
  function GroupedCheckbox({ group, ...props }, forwardedRef) {
    const ref = useObjectRef(forwardedRef)
    const { inputProps } = useCheckboxGroupItem({ ...props, value: props.value ?? '' }, group, ref)
    return <CheckboxView props={props} inputProps={inputProps} isSelected={group.isSelected(props.value ?? '')} inputRef={ref} />
  },
)

const StandaloneCheckbox = forwardRef<HTMLInputElement, RudiCheckboxProps>(
  function StandaloneCheckbox(props, forwardedRef) {
    const ref = useObjectRef(forwardedRef)
    const state = useToggleState(props)
    const { inputProps } = useCheckbox({ ...props, isInvalid: !!props.errorMessage }, state, ref)
    return <CheckboxView props={props} inputProps={inputProps} isSelected={state.isSelected} inputRef={ref} />
  },
)

/**
 * A checkbox with a visible label. Inside a `RudiCheckboxGroup` it reads and updates the group's value
 * array (give it a `value`); on its own it is controlled with `isSelected` / `onChange`. The ref points at the `<input>`.
 *
 * @example
 * <RudiCheckbox isSelected={agreed} onChange={setAgreed}>I agree to the terms</RudiCheckbox>
 */
export const RudiCheckbox = forwardRef<HTMLInputElement, RudiCheckboxProps>(
  function RudiCheckbox(props, forwardedRef) {
    const group = useContext(CheckboxGroupContext)
    return group ? (
      <GroupedCheckbox {...props} group={group} ref={forwardedRef} />
    ) : (
      <StandaloneCheckbox {...props} ref={forwardedRef} />
    )
  },
)
