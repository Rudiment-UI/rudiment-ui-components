import {
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import './tabs.css'

/** Props for `RudiTabs`. Inherits `selectedKey`, `defaultSelectedKey`, `onSelectionChange`, `isDisabled` and `keyboardActivation` from React Aria's `Tabs`. */
export interface RudiTabsProps extends Omit<AriaTabsProps, 'className' | 'style'> {
  /**
   * Layout and arrow-key axis. Lives on the root (not the list) because React Aria reads it
   * from `Tabs`; vertical places the list beside the panels.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /** Class merged onto the root element. */
  className?: string
}

/**
 * Root of the tabs compound. Owns selection (`selectedKey` / `defaultSelectedKey` /
 * `onSelectionChange`). Compose with `RudiTabList`, `RudiTab` and `RudiTabPanel`. Uncontrolled
 * unless `selectedKey` is set. Keys are the string `id`s of the tabs.
 *
 * @example
 * <RudiTabs defaultSelectedKey="all">
 *   <RudiTabList aria-label="Shipments"><RudiTab id="all">All</RudiTab></RudiTabList>
 *   <RudiTabPanel id="all">All shipments</RudiTabPanel>
 * </RudiTabs>
 */
export function RudiTabs({ orientation = 'horizontal', className, ...props }: RudiTabsProps) {
  return (
    <AriaTabs
      {...props}
      orientation={orientation}
      className={cn('rudi-tabs', `rudi-tabs--${orientation}`, className)}
    />
  )
}
