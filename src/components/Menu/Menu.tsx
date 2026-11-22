import {
  Menu as AriaMenu,
  type MenuProps as AriaMenuProps,
  Popover,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import './menu.css'

/** Props for `RudiMenu`. Inherits the collection, selection and `onAction` props of React Aria's `Menu`. */
export interface RudiMenuProps<T extends object> extends AriaMenuProps<T> {
  /** Class merged onto the menu list element, not the popover. */
  className?: string
}

/**
 * The popover and item list of a menu. Place it inside `RudiMenuTrigger`, after the trigger
 * element, and fill it with `RudiMenuItem`, `RudiMenuSection` and `RudiMenuSeparator`. It renders
 * its own popover, so do not wrap it in one. Handle activation with `onAction` (receives the item
 * key), or use `selectionMode` and `onSelectionChange` for checkable items.
 *
 * @example
 * <RudiMenu onAction={(key) => console.log(key)}>
 *   <RudiMenuItem id="edit" label="Edit" />
 * </RudiMenu>
 */
export function RudiMenu<T extends object>({ className, ...props }: RudiMenuProps<T>) {
  return (
    <Popover className="rudi-menu__popover">
      <AriaMenu
        {...props}
        className={cn('rudi-menu__list', className)}
      />
    </Popover>
  )
}
