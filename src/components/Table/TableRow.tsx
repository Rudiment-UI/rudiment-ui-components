import {
  Collection,
  Row as AriaRow,
  Cell as AriaCell,
  useTableOptions,
  type RowProps as AriaRowProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import { RudiTableSelectionCheckbox } from './TableSelectionCheckbox'

export interface RudiTableRowProps<T extends object>
  extends Omit<AriaRowProps<T>, 'className' | 'style'> {
  className?: string
}

/**
 * A table row. Give it `href` to make the whole row a link (routed through
 * `RudiRouterProvider`), or handle `onAction` / the table's `onRowAction`.
 */
export function RudiTableRow<T extends object>({
  id,
  columns,
  children,
  dependencies,
  className,
  ...props
}: RudiTableRowProps<T>) {
  const { selectionBehavior } = useTableOptions()

  return (
    <AriaRow id={id} {...props} className={cn('rudi-table__row', className)}>
      {selectionBehavior === 'toggle' && (
        <AriaCell className="rudi-table__cell rudi-table__cell--selection">
          <RudiTableSelectionCheckbox />
        </AriaCell>
      )}
      <Collection items={columns} dependencies={dependencies}>
        {children}
      </Collection>
    </AriaRow>
  )
}
