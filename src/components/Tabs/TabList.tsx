import {
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

/** Props for `RudiTabList`. */
export interface RudiTabListProps<T extends object>
  extends Omit<AriaTabListProps<T>, 'className' | 'style' | 'aria-label'> {
  /** Accessible name for the tab list, e.g. "Shipment status". */
  'aria-label': string
  /**
   * Visual treatment of the tabs.
   * @default 'underline'
   */
  variant?: 'underline' | 'pill'
  /** Class merged onto the tab list element. */
  className?: string
}

/**
 * Container for the `RudiTab`s inside `RudiTabs`. `aria-label` is required because the list is a
 * `tablist` landmark. Render the matching `RudiTabPanel`s as siblings of the list, not inside it.
 *
 * @example
 * <RudiTabList aria-label="Shipment status" variant="pill">
 *   <RudiTab id="all">All</RudiTab>
 * </RudiTabList>
 */
export function RudiTabList<T extends object>({
  variant = 'underline',
  className,
  ...props
}: RudiTabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={cn('rudi-tab-list', `rudi-tab-list--${variant}`, className)}
    />
  )
}
