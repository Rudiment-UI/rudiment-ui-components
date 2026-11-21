import {
  Collection,
  Column as AriaColumn,
  TableHeader as AriaTableHeader,
  useTableOptions,
  type TableHeaderProps as AriaTableHeaderProps,
} from 'react-aria-components'
import { VisuallyHidden } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiTableSelectionCheckbox } from './TableSelectionCheckbox'

export interface RudiTableHeaderProps<T extends object>
  extends Omit<AriaTableHeaderProps<T>, 'className' | 'style'> {
  className?: string
}

/**
 * The header row. Pass static `RudiTableColumn` children, or `columns` plus a render function.
 * A selection column is prepended automatically when the table has a `selectionMode`.
 */
export function RudiTableHeader<T extends object>({
  columns,
  children,
  dependencies,
  className,
  ...props
}: RudiTableHeaderProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions()

  return (
    <AriaTableHeader {...props} className={cn('rudi-table__header', className)}>
      {selectionBehavior === 'toggle' && (
        <AriaColumn className="rudi-table__column rudi-table__column--selection">
          {selectionMode === 'multiple' ? (
            <RudiTableSelectionCheckbox />
          ) : (
            <VisuallyHidden>Select</VisuallyHidden>
          )}
        </AriaColumn>
      )}
      <Collection items={columns} dependencies={dependencies}>
        {children}
      </Collection>
    </AriaTableHeader>
  )
}
