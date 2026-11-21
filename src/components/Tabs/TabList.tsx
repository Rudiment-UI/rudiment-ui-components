import {
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

export interface RudiTabListProps<T extends object>
  extends Omit<AriaTabListProps<T>, 'className' | 'style' | 'aria-label'> {
  /** Accessible name for the tab list, e.g. "Shipment status". */
  'aria-label': string
  /** Visual treatment of the tabs. Defaults to `underline`. */
  variant?: 'underline' | 'pill'
  className?: string
}

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
