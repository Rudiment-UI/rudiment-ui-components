import { useContext, type FocusEvent, type ReactNode } from 'react'
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

const NON_TEXT_INPUTS = new Set(['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file', 'image'])

function isTextEntry(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true
  if (target instanceof HTMLInputElement) return !NON_TEXT_INPUTS.has(target.type)
  return target instanceof HTMLElement && target.isContentEditable
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
  // While a text field in this cell has focus, switch the grid into React Aria's
  // edit mode (the one column resizing uses): arrow keys, Home/End and type-to-select
  // stay with the field instead of moving focus between cells and rows. Tab still leaves.
  const setEditing = (e: FocusEvent, editing: boolean) => {
    if (isTextEntry(e.target)) state?.setKeyboardNavigationDisabled(editing)
  }
  return (
    <div
      className="rudi-table__cell-content"
      data-align={resolved ?? 'start'}
      onFocus={(e) => setEditing(e, true)}
      onBlur={(e) => setEditing(e, false)}
    >
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
