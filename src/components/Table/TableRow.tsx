import {
  Collection,
  Row as AriaRow,
  Cell as AriaCell,
  useTableOptions,
  type RowProps as AriaRowProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import { RudiTableSelectionCheckbox } from './TableSelectionCheckbox'

/** Props for `RudiTableRow`. Inherits `id`, `href`, `onAction`, `columns` and `isDisabled` from React Aria's `Row`. */
export interface RudiTableRowProps<T extends object>
  extends Omit<AriaRowProps<T>, 'className' | 'style'> {
  /** Class merged onto the row element. */
  className?: string
}

/**
 * A table row. Give it `href` to make the whole row a link (routed through
 * `RudiRouterProvider`), or handle `onAction` / the table's `onRowAction`. Give each row an `id`
 * so selection and actions can refer to it. A selection checkbox cell is prepended automatically
 * when the table has a `selectionMode` and its `selectionBehavior` is `toggle` (the default).
 *
 * @example
 * <RudiTableRow id="1" href="/shipments/1">
 *   <RudiTableCell>REF-1042</RudiTableCell>
 * </RudiTableRow>
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
