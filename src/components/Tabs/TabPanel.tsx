import {
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

export interface RudiTabPanelProps extends Omit<AriaTabPanelProps, 'className' | 'style' | 'id'> {
  /** Must match the `id` of the `RudiTab` that controls this panel. */
  id: string
  className?: string
}

export function RudiTabPanel({ className, ...props }: RudiTabPanelProps) {
  return <AriaTabPanel {...props} className={cn('rudi-tab-panel', className)} />
}
