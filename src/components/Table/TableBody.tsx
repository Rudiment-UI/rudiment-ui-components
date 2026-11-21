import {
  TableBody as AriaTableBody,
  type TableBodyProps as AriaTableBodyProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

export interface RudiTableBodyProps<T extends object>
  extends Omit<AriaTableBodyProps<T>, 'className' | 'style'> {
  className?: string
}

/**
 * The table body. Pass static `RudiTableRow` children, or `items` plus a render function.
 * `renderEmptyState` renders (full width) when there are no rows — e.g. a `RudiEmptyState`.
 */
export function RudiTableBody<T extends object>({ className, ...props }: RudiTableBodyProps<T>) {
  return <AriaTableBody {...props} className={cn('rudi-table__body', className)} />
}
