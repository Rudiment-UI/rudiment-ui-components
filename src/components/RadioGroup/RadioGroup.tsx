import { createContext } from 'react'
import { useRadioGroup } from 'react-aria'
import { useRadioGroupState } from 'react-stately'
import type { RadioGroupState } from 'react-stately'
import { cn } from '@/utils/cn'
import './radio-group.css'

/** Internal context that shares the group's selection state with `RudiRadio`. Not part of the public API. */
export const RadioGroupContext = createContext<RadioGroupState | null>(null)

/** Props for `RudiRadioGroup`. */
export interface RudiRadioGroupProps {
  /** Group legend and accessible name. Required. */
  label: string
  /** Help text under the group. Hidden while `errorMessage` is shown. */
  description?: string
  /** Controlled value of the selected `RudiRadio`. Pair with `onChange`. */
  value?: string
  /** Initial selected value for an uncontrolled group. */
  defaultValue?: string
  /** Called with the selected option's `value` (a string, not an event). */
  onChange?: (value: string) => void
  /**
   * Lays the options out in a row or a column. Also sets arrow-key behaviour for assistive tech. Unset renders vertically.
   */
  orientation?: 'horizontal' | 'vertical'
  /** Disables every option in the group. */
  isDisabled?: boolean
  /** Error text shown under the group. Setting it marks the group invalid. */
  errorMessage?: string
  /** The `RudiRadio` elements. */
  children: React.ReactNode
  /** Extra class names for the group element, merged with the component's own classes. */
  className?: string
}

/**
 * A labelled set of mutually exclusive `RudiRadio` options. `label` is required. The value is the selected
 * option's `value` string.
 *
 * @example
 * <RudiRadioGroup label="Billing" value={plan} onChange={setPlan}>
 *   <RudiRadio value="monthly">Monthly</RudiRadio>
 *   <RudiRadio value="yearly">Yearly</RudiRadio>
 * </RudiRadioGroup>
 */
export function RudiRadioGroup(props: RudiRadioGroupProps) {
  // isInvalid links the error message to the group and marks it invalid for assistive tech.
  const ariaProps = { ...props, isInvalid: !!props.errorMessage }
  const state = useRadioGroupState(ariaProps)
  const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
    useRadioGroup(ariaProps, state)

  return (
    <RadioGroupContext.Provider value={state}>
      <div
        {...radioGroupProps}
        className={cn('rudi-radio-group', props.className)}
      >
        <span {...labelProps} className="rudi-radio-group__label">
          {props.label}
        </span>
        <div
          className={cn(
            'rudi-radio-group__options',
            props.orientation === 'horizontal' &&
              'rudi-radio-group__options--horizontal',
          )}
        >
          {props.children}
        </div>
        {props.description && !props.errorMessage && (
          <p {...descriptionProps} className="rudi-radio-group__description">
            {props.description}
          </p>
        )}
        {props.errorMessage && (
          <p {...errorMessageProps} className="rudi-radio-group__error">
            {props.errorMessage}
          </p>
        )}
      </div>
    </RadioGroupContext.Provider>
  )
}
