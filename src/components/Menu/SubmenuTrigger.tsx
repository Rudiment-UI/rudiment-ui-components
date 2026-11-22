import {
  SubmenuTrigger as AriaSubmenuTrigger,
  type SubmenuTriggerProps as AriaSubmenuTriggerProps,
} from 'react-aria-components'

/** Props for `RudiSubmenuTrigger`. Inherits `delay` from React Aria's `SubmenuTrigger`. */
export interface RudiSubmenuTriggerProps extends AriaSubmenuTriggerProps {}

/**
 * Nests a menu inside a `RudiMenu`. It takes two children: the `RudiMenuItem` that opens the
 * submenu, then a `RudiMenu` holding the nested items.
 *
 * @example
 * <RudiSubmenuTrigger>
 *   <RudiMenuItem id="share" label="Share" />
 *   <RudiMenu>
 *     <RudiMenuItem id="email" label="Email" />
 *   </RudiMenu>
 * </RudiSubmenuTrigger>
 */
export function RudiSubmenuTrigger(props: RudiSubmenuTriggerProps) {
  return <AriaSubmenuTrigger {...props} />
}
