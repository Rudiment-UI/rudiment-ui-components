import {
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import './tabs.css'

export interface RudiTabsProps extends Omit<AriaTabsProps, 'className' | 'style'> {
  /**
   * Layout and arrow-key axis. Lives on the root (not the list) because React Aria reads it
   * from `Tabs`; vertical places the list beside the panels.
   */
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * Root of the tabs compound. Owns selection (`selectedKey` / `defaultSelectedKey` /
 * `onSelectionChange`). Compose with `RudiTabList`, `RudiTab` and `RudiTabPanel`.
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
