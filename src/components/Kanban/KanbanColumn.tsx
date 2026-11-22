import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDndContext, useDroppable } from '@dnd-kit/core'
import { cn } from '@/utils/cn'
import type { RudiKanbanItem } from './KanbanBoard'

/** Props for `RudiKanbanColumn`. */
export interface RudiKanbanColumnProps {
  /** Unique column id; the drop target id. */
  id: string
  /** Column heading and the region's accessible name. */
  title: string
  /** Cards in display order. The count is shown in the header. */
  items: RudiKanbanItem[]
  /** Renders one card; return a `RudiKanbanCard`. */
  renderCard: (item: RudiKanbanItem) => React.ReactNode
  /** Class merged onto the column element. */
  className?: string
}

/**
 * One droppable column of sortable cards. `RudiKanbanBoard` renders these from its `columns` prop;
 * use directly only inside a board's drag context (also available as `RudiKanbanBoard.Column`).
 *
 * @example
 * <RudiKanbanColumn id="todo" title="To do" items={items} renderCard={renderCard} />
 */
export function RudiKanbanColumn({
  id,
  title,
  items,
  renderCard,
  className,
}: RudiKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  // The board moves a dragged card into the column it will land in, so the column holding
  // the active card is the drop target.
  const { active } = useDndContext()
  const isDropTarget = isOver || (active != null && items.some((item) => item.id === active.id))

  return (
    <div
      className={cn(
        'rudi-kanban__column',
        isDropTarget && 'rudi-kanban__column--over',
        className,
      )}
      role="region"
      aria-label={title}
    >
      <div className="rudi-kanban__column-header">
        <span className="rudi-kanban__column-title">{title}</span>
        <span className="rudi-kanban__column-count">{items.length}</span>
      </div>
      <div ref={setNodeRef} className="rudi-kanban__column-body">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => renderCard(item))}
        </SortableContext>
      </div>
    </div>
  )
}
