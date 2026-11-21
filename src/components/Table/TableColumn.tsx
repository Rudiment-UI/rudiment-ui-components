import type { ReactNode } from 'react'
import { Column as AriaColumn, type ColumnProps as AriaColumnProps } from 'react-aria-components'
import { cn } from '@/utils/cn'
import { RudiIcon } from '../Icon/Icon'

export type RudiTableAlign = 'start' | 'center' | 'end'

export interface RudiTableColumnProps
  extends Omit<
    AriaColumnProps,
    'className' | 'style' | 'children' | 'width' | 'defaultWidth' | 'minWidth' | 'maxWidth'
  > {
  /** Horizontal alignment of the header and every cell in this column. Use `end` for numbers. */
  align?: RudiTableAlign
  /** Column width (CSS length or px number). */
  width?: string | number
  /** Minimum column width (CSS length or px number). */
  minWidth?: string | number
  children?: ReactNode
  className?: string
}

const SORT_ICONS = {
  ascending: 'lucide:arrow-up',
  descending: 'lucide:arrow-down',
  none: 'lucide:arrow-up-down',
} as const

export function RudiTableColumn({
  align = 'start',
  width,
  minWidth,
  children,
  className,
  textValue,
  ...props
}: RudiTableColumnProps) {
  return (
    <AriaColumn
      {...props}
      // `data-align` is read back by RudiTableCell so cells inherit the column's alignment.
      data-align={align}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      style={width != null || minWidth != null ? { width, minWidth } : undefined}
      className={cn('rudi-table__column', className)}
    >
      {({ allowsSorting, sortDirection }) => (
        <span className="rudi-table__column-content">
          <span className="rudi-table__column-label">{children}</span>
          {allowsSorting && (
            <RudiIcon
              icon={SORT_ICONS[sortDirection ?? 'none']}
              size="sm"
              className={cn(
                'rudi-table__sort-icon',
                sortDirection && 'rudi-table__sort-icon--active',
              )}
            />
          )}
        </span>
      )}
    </AriaColumn>
  )
}
