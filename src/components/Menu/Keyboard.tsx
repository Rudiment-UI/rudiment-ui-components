import type { ComponentProps } from 'react'
import { Keyboard as AriaKeyboard } from 'react-aria-components'
import { cn } from '@/utils/cn'

/** Props for `RudiKeyboard`. Accepts the props of React Aria's `Keyboard` (a `<kbd>` element). */
export type RudiKeyboardProps = ComponentProps<typeof AriaKeyboard>

/**
 * Keyboard shortcut hint, styled as the trailing shortcut text of a menu item. `RudiMenuItem`
 * renders it for you through its `shortcut` prop. Use it directly only for custom item content.
 * The hint is visual only; it does not bind the shortcut.
 *
 * @example
 * <RudiKeyboard>⌘S</RudiKeyboard>
 */
export function RudiKeyboard({ className, ...props }: RudiKeyboardProps) {
  return (
    <AriaKeyboard
      {...props}
      className={cn('rudi-menu__item-shortcut', className)}
    />
  )
}
