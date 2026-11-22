import {
  TableBody as AriaTableBody,
  type TableBodyProps as AriaTableBodyProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

/** Props for `RudiTableBody`. Inherits `items`, `children` and `renderEmptyState` from React Aria's `TableBody`. */
export interface RudiTableBodyProps<T extends object>
  extends Omit<AriaTableBodyProps<T>, 'className' | 'style'> {
  /** Class merged onto the body element. */
  className?: string
}

/**
 * The table body. Pass static `RudiTableRow` children, or `items` plus a render function.
 * `renderEmptyState` renders (full width) when there are no rows — e.g. a `RudiEmptyState`.
 *
 * @example
 * <RudiTableBody items={rows}>
 *   {(row) => <RudiTableRow><RudiTableCell>{row.name}</RudiTableCell></RudiTableRow>}
 * </RudiTableBody>
 */
export function RudiTableBody<T extends object>({ className, ...props }: RudiTableBodyProps<T>) {
  return <AriaTableBody {...props} className={cn('rudi-table__body', className)} />
}
