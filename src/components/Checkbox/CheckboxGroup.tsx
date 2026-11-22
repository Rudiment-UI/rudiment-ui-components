import { useCheckboxGroup } from 'react-aria'
import { useCheckboxGroupState } from 'react-stately'
import { cn } from '@/utils/cn'
import { CheckboxGroupContext } from './CheckboxGroupContext'
import './checkbox.css'

/** Props for `RudiCheckboxGroup`. */
export interface RudiCheckboxGroupProps {
  /** Group legend and accessible name. Required. */
  label: string
  /** Help text under the group. Hidden while `errorMessage` is shown. */
  description?: string
  /** Controlled array of checked `RudiCheckbox` values. Pair with `onChange`. */
  value?: string[]
  /** Initial checked values for an uncontrolled group. */
  defaultValue?: string[]
  /** Called with the full array of checked values (not an event) whenever one changes. */
  onChange?: (value: string[]) => void
  /** Disables every checkbox in the group. */
  isDisabled?: boolean
  /** Error text shown under the group. Setting it marks the group invalid. */
  errorMessage?: string
  /** The `RudiCheckbox` elements. Each needs a `value`. */
  children: React.ReactNode
  /** Extra class names for the group element, merged with the component's own classes. */
  className?: string
}

/**
 * A labelled set of `RudiCheckbox` options whose selection is a string array. `label` is required. Each child
 * checkbox must have a `value`.
 *
 * @example
 * <RudiCheckboxGroup label="Toppings" value={toppings} onChange={setToppings}>
 *   <RudiCheckbox value="cheese">Cheese</RudiCheckbox>
 *   <RudiCheckbox value="olives">Olives</RudiCheckbox>
 * </RudiCheckboxGroup>
 */
export function RudiCheckboxGroup(props: RudiCheckboxGroupProps) {
  // isInvalid links the error message to the group and marks it invalid for assistive tech.
  const ariaProps = { ...props, isInvalid: !!props.errorMessage }
  const state = useCheckboxGroupState(ariaProps)
  const { groupProps, labelProps, descriptionProps, errorMessageProps } =
    useCheckboxGroup(ariaProps, state)

  return (
    <CheckboxGroupContext.Provider value={state}>
    <div
      {...groupProps}
      className={cn('rudi-checkbox-group', props.className)}
    >
      <span {...labelProps} className="rudi-checkbox-group__label">
        {props.label}
      </span>
      {props.children}
      {props.description && !props.errorMessage && (
        <p
          {...descriptionProps}
          className="rudi-checkbox-group__description"
        >
          {props.description}
        </p>
      )}
      {props.errorMessage && (
        <p {...errorMessageProps} className="rudi-checkbox-group__error">
          {props.errorMessage}
        </p>
      )}
    </div>
    </CheckboxGroupContext.Provider>
  )
}
