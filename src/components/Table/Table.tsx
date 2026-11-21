import { forwardRef, type CSSProperties } from 'react'
import { Table as AriaTable, type TableProps as AriaTableProps } from 'react-aria-components'
import { cn } from '@/utils/cn'
import './table.css'

type RudiTableLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string }

export type RudiTableProps = Omit<
  AriaTableProps,
  'className' | 'style' | 'aria-label' | 'aria-labelledby'
> &
  RudiTableLabelProps & {
    /** Row height / cell padding. */
    density?: 'compact' | 'regular'
    /** Alternate row backgrounds (zebra striping). Off by default. */
    striped?: boolean
    /**
     * Pin the header row while the body scrolls. The header sticks to the table's own
     * scroll container, so pair it with `maxHeight`.
     */
    stickyHeader?: boolean
    /** Max height of the scroll container (CSS length or px number). Enables vertical scrolling. */
    maxHeight?: string | number
    /** Class merged onto the outer scroll container. */
    className?: string
  }

/**
 * Accessible data table built on React Aria Components' `Table`. Wraps the grid in a scroll
 * container so wide tables scroll horizontally instead of overflowing the page.
 */
export const RudiTable = forwardRef<HTMLTableElement, RudiTableProps>(function RudiTable(
  { density = 'regular', striped = false, stickyHeader = false, maxHeight, className, ...props },
  ref,
) {
  const style =
    maxHeight != null
      ? ({
          '--table-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        } as CSSProperties)
      : undefined

  return (
    <div
      className={cn(
        'rudi-table',
        `rudi-table--${density}`,
        striped && 'rudi-table--striped',
        stickyHeader && 'rudi-table--sticky-header',
        maxHeight != null && 'rudi-table--max-height',
        className,
      )}
      style={style}
    >
      <AriaTable {...(props as AriaTableProps)} ref={ref} className="rudi-table__grid" />
    </div>
  )
})
