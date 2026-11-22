import {
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
} from 'react-aria-components'

/** Props for `RudiMenuTrigger`. Inherits `isOpen`, `defaultOpen`, `onOpenChange` and `trigger` from React Aria's `MenuTrigger`. */
export interface RudiMenuTriggerProps extends AriaMenuTriggerProps {}

/**
 * Connects a pressable trigger to a `RudiMenu`. It takes exactly two children: the trigger
 * element first (a `RudiButton` or `RudiIconButton`, which handle `onPress`), then the `RudiMenu`.
 * Open state is uncontrolled unless you pass `isOpen` and `onOpenChange`.
 *
 * @example
 * <RudiMenuTrigger>
 *   <RudiButton variant="secondary">Actions</RudiButton>
 *   <RudiMenu onAction={(key) => console.log(key)}>
 *     <RudiMenuItem id="edit" label="Edit" />
 *     <RudiMenuSeparator />
 *     <RudiMenuItem id="delete" label="Delete" isDestructive />
 *   </RudiMenu>
 * </RudiMenuTrigger>
 */
export function RudiMenuTrigger(props: RudiMenuTriggerProps) {
  return <AriaMenuTrigger {...props} />
}
