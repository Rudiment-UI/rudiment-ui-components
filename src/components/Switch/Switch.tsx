import { forwardRef } from 'react'
import { useSwitch, VisuallyHidden } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { useToggleState } from 'react-stately'
import { cn } from '@/utils/cn'
import './switch.css'

export interface RudiSwitchProps {
  /** Visible label. Omit only when `aria-label` or `aria-labelledby` names the switch. */
  children?: React.ReactNode
  /** Accessible name, for switches whose visible text repeats (e.g. one per table row). */
  'aria-label'?: string
  'aria-labelledby'?: string
  isSelected?: boolean
  defaultSelected?: boolean
  onChange?: (isSelected: boolean) => void
  isDisabled?: boolean
  className?: string
}

export const RudiSwitch = forwardRef<HTMLInputElement, RudiSwitchProps>(
  function RudiSwitch(props, forwardedRef) {
    const ref = useObjectRef(forwardedRef)
    const state = useToggleState(props)
    const { inputProps } = useSwitch(props, state, ref)

    return (
      <label
        className={cn(
          'rudi-switch',
          props.isDisabled && 'rudi-switch--disabled',
          props.className,
        )}
      >
        <VisuallyHidden>
          <input {...inputProps} ref={ref} />
        </VisuallyHidden>
        <span
          className={cn(
            'rudi-switch__track',
            state.isSelected && 'rudi-switch__track--on',
          )}
          aria-hidden="true"
        >
          <span className="rudi-switch__thumb" />
        </span>
        {props.children != null && <span className="rudi-switch__label">{props.children}</span>}
      </label>
    )
  },
)
