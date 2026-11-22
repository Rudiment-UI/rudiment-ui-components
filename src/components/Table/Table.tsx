import { forwardRef, type CSSProperties } from 'react'
import { Table as AriaTable, type TableProps as AriaTableProps } from 'react-aria-components'
import { cn } from '@/utils/cn'
import './table.css'

type RudiTableLabelProps =
  | {
      /** Accessible name for the table. Required unless `aria-labelledby` is set. */
      'aria-label': string
      /** Id of an element that names the table. */
      'aria-labelledby'?: string
    }
  | {
      /** Accessible name for the table. */
      'aria-label'?: string
      /** Id of an element that names the table. Required unless `aria-label` is set. */
      'aria-labelledby': string
    }

export type RudiTableProps = Omit<
  AriaTableProps,
  'className' | 'style' | 'aria-label' | 'aria-labelledby'
> &
  RudiTableLabelProps & {
    /**
     * Row height and cell padding.
     * @default 'regular'
     */
    density?: 'compact' | 'regular'
    /**
     * Alternate row backgrounds (zebra striping).
     * @default false
     */
    striped?: boolean
    /**
     * Pin the header row while the body scrolls. The header sticks to the table's own
     * scroll container, so pair it with `maxHeight`.
     * @default false
     */
    stickyHeader?: boolean
    /** Max height of the scroll container (CSS length or px number). Enables vertical scrolling. */
    maxHeight?: string | number
    /** Class merged onto the outer scroll container. */
    className?: string
  }

/**
 * Accessible data table built on React Aria Components' `Table`. Wraps the grid in a scroll
 * container so wide tables scroll horizontally instead of overflowing the page. Needs an accessible
 * name: pass `aria-label` or `aria-labelledby`. Selection, sorting and row actions come from React
 * Aria (`selectionMode`, `sortDescriptor`, `onSortChange`, `onRowAction`). Compose with
 * `RudiTableHeader`, `RudiTableColumn`, `RudiTableBody`, `RudiTableRow` and `RudiTableCell`.
 *
 * @example
 * <RudiTable aria-label="Shipments" density="compact">
 *   <RudiTableHeader>
 *     <RudiTableColumn isRowHeader>Reference</RudiTableColumn>
 *     <RudiTableColumn align="end">Weight</RudiTableColumn>
 *   </RudiTableHeader>
 *   <RudiTableBody>
 *     <RudiTableRow id="1">
 *       <RudiTableCell>REF-1042</RudiTableCell>
 *       <RudiTableCell>12 kg</RudiTableCell>
 *     </RudiTableRow>
 *   </RudiTableBody>
 * </RudiTable>
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
