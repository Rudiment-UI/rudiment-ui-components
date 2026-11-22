import {
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

/** Props for `RudiTabPanel`. Inherits `shouldForceMount` from React Aria's `TabPanel`. */
export interface RudiTabPanelProps extends Omit<AriaTabPanelProps, 'className' | 'style' | 'id'> {
  /** Must match the `id` of the `RudiTab` that controls this panel. */
  id: string
  /** Class merged onto the panel element. */
  className?: string
}

/**
 * Content shown when its tab is selected. Only the selected panel is rendered. Its `id` must match
 * a `RudiTab` `id`.
 *
 * @example
 * <RudiTabPanel id="all">All shipments</RudiTabPanel>
 */
export function RudiTabPanel({ className, ...props }: RudiTabPanelProps) {
  return <AriaTabPanel {...props} className={cn('rudi-tab-panel', className)} />
}
