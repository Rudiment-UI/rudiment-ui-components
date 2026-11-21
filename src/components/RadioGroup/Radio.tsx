import { forwardRef, useContext } from 'react'
import { useRadio } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import { RadioGroupContext } from './RadioGroup'
import './radio-group.css'

export interface RudiRadioProps {
  /** The value submitted and reported to the group's `onChange` when this option is selected. */
  value: string
  /** Visible label for the option. */
  children: React.ReactNode
  /** Disables just this option. A disabled group disables every option. */
  isDisabled?: boolean
  className?: string
}

/**
 * A single option inside `RudiRadioGroup`. Must be rendered as a descendant of
 * a `RudiRadioGroup`, which owns the selection state.
 */
export const RudiRadio = forwardRef<HTMLInputElement, RudiRadioProps>(
  function RudiRadio(props, forwardedRef) {
    const state = useContext(RadioGroupContext)
    if (!state) {
      throw new Error('RudiRadio must be rendered inside a RudiRadioGroup.')
    }
    const ref = useObjectRef(forwardedRef)
    const { inputProps, isSelected, isDisabled } = useRadio(props, state, ref)

    return (
      <label
        className={cn(
          'rudi-radio',
          isDisabled && 'rudi-radio--disabled',
          props.className,
        )}
      >
        <input {...inputProps} ref={ref} className="rudi-radio__input" />
        <span
          className={cn(
            'rudi-radio__control',
            isSelected && 'rudi-radio__control--selected',
          )}
          aria-hidden="true"
        />
        <span className="rudi-radio__label">{props.children}</span>
      </label>
    )
  },
)
