import { useContext, type ReactNode } from 'react'
import {
  Cell as AriaCell,
  TableStateContext,
  type CellProps as AriaCellProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import type { RudiTableAlign } from './TableColumn'

export interface RudiTableCellProps extends Omit<AriaCellProps, 'className' | 'style' | 'children'> {
  /** Overrides the alignment inherited from the cell's `RudiTableColumn`. */
  align?: RudiTableAlign
  children?: ReactNode
  className?: string
}

function CellContent({
  columnIndex,
  align,
  children,
}: {
  columnIndex?: number | null
  align?: RudiTableAlign
  children?: ReactNode
}) {
  const state = useContext(TableStateContext)
  const column = columnIndex != null ? state?.collection.columns[columnIndex] : undefined
  const resolved =
    align ?? (column?.props as { 'data-align'?: RudiTableAlign } | undefined)?.['data-align']
  return (
    <div className="rudi-table__cell-content" data-align={resolved ?? 'start'}>
      {children}
    </div>
  )
}

export function RudiTableCell({ align, children, className, textValue, ...props }: RudiTableCellProps) {
  return (
    <AriaCell
      {...props}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={cn('rudi-table__cell', className)}
    >
      {({ columnIndex }) => (
        <CellContent columnIndex={columnIndex} align={align}>
          {children}
        </CellContent>
      )}
    </AriaCell>
  )
}
