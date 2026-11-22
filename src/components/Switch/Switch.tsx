import { forwardRef } from 'react'
import { useSwitch, VisuallyHidden } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { useToggleState } from 'react-stately'
import { cn } from '@/utils/cn'
import './switch.css'

/** Props for `RudiSwitch`. */
export interface RudiSwitchProps {
  /** Visible label. Omit only when `aria-label` or `aria-labelledby` names the switch. */
  children?: React.ReactNode
  /** Accessible name, for switches whose visible text repeats (e.g. one per table row). */
  'aria-label'?: string
  /** Id of an element that names the switch, as an alternative to `aria-label`. */
  'aria-labelledby'?: string
  /** Controlled on/off state. Pair with `onChange`. */
  isSelected?: boolean
  /** Initial on/off state for an uncontrolled switch. */
  defaultSelected?: boolean
  /** Called with the new on/off state (a boolean, not an event). */
  onChange?: (isSelected: boolean) => void
  /** Disables the switch. */
  isDisabled?: boolean
  /** Extra class names for the wrapper label, merged with the component's own classes. */
  className?: string
}

/**
 * An on/off toggle for settings that take effect immediately; use `RudiCheckbox` for choices submitted with a form. Needs a visible label (children) or `aria-label` / `aria-labelledby`. The ref points at the `<input>`.
 *
 * @example
 * <RudiSwitch isSelected={enabled} onChange={setEnabled}>Email notifications</RudiSwitch>
 */
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
