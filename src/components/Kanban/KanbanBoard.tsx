import { useCallback, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type Announcements,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { cn } from '@/utils/cn'
import { RudiKanbanColumn } from './KanbanColumn'
import './kanban.css'

export interface RudiKanbanItem {
  id: string
  [key: string]: unknown
}

export interface RudiKanbanColumnData {
  id: string
  title: string
  items: RudiKanbanItem[]
}

export interface RudiKanbanCardMoveEvent {
  cardId: string
  fromColumnId: string
  toColumnId: string
  fromIndex: number
  toIndex: number
}

export interface RudiKanbanBoardProps {
  columns: RudiKanbanColumnData[]
  onCardMove: (event: RudiKanbanCardMoveEvent) => void
  renderCard: (item: RudiKanbanItem) => React.ReactNode
  /** Names a card in drag announcements ("Picked up REF-1042 from Pending"). Defaults to its id. */
  getCardLabel?: (item: RudiKanbanItem) => string
  className?: string
}

function findColumnOfItem(
  columns: RudiKanbanColumnData[],
  itemId: string,
): RudiKanbanColumnData | undefined {
  return columns.find((col) => col.items.some((item) => item.id === itemId))
}

function KanbanBoardRoot({
  columns,
  onCardMove,
  renderCard,
  getCardLabel,
  className,
}: RudiKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const labelOf = useCallback(
    (id: string) => {
      const item = columns.flatMap((col) => col.items).find((i) => i.id === id)
      return item && getCardLabel ? getCardLabel(item) : id
    },
    [columns, getCardLabel],
  )

  // Where a card would land, in words: "Active, position 2 of 3".
  const describeOver = useCallback(
    (overId: string) => {
      const column = columns.find((col) => col.id === overId)
      if (column) return `${column.title}, position ${column.items.length + 1}`
      const owner = findColumnOfItem(columns, overId)
      if (!owner) return undefined
      const index = owner.items.findIndex((item) => item.id === overId)
      return `${owner.title}, position ${index + 1} of ${owner.items.length}`
    },
    [columns],
  )

  // Screen-reader announcements go through dnd-kit's own live region so they're
  // spoken once, with card labels and column titles instead of raw ids.
  const announcements = useMemo<Announcements>(
    () => ({
      onDragStart: ({ active }) => {
        const col = findColumnOfItem(columns, String(active.id))
        return `Picked up ${labelOf(String(active.id))}${col ? ` from ${col.title}` : ''}.`
      },
      onDragOver: ({ active, over }) => {
        const where = over ? describeOver(String(over.id)) : undefined
        return where ? `${labelOf(String(active.id))} is over ${where}.` : `${labelOf(String(active.id))} is no longer over a column.`
      },
      onDragEnd: ({ active, over }) => {
        const where = over ? describeOver(String(over.id)) : undefined
        return where ? `Dropped ${labelOf(String(active.id))} in ${where}.` : `Dropped ${labelOf(String(active.id))}. It was not moved.`
      },
      onDragCancel: ({ active }) => `Cancelled. ${labelOf(String(active.id))} was not moved.`,
    }),
    [columns, labelOf, describeOver],
  )

  const activeItem = activeId
    ? columns.flatMap((col) => col.items).find((item) => item.id === activeId)
    : null

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id)
      setActiveId(id)
    },
    [],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over) return

      const activeIdStr = String(active.id)
      const overIdStr = String(over.id)

      const fromColumn = findColumnOfItem(columns, activeIdStr)
      if (!fromColumn) return

      const fromIndex = fromColumn.items.findIndex(
        (item) => item.id === activeIdStr,
      )

      // Determine destination column and index
      const toColumnDirect = columns.find((col) => col.id === overIdStr)
      const toColumnViaItem = findColumnOfItem(columns, overIdStr)
      const toColumn = toColumnDirect || toColumnViaItem

      if (!toColumn) return

      let toIndex: number
      if (toColumnDirect) {
        // Dropped on the column itself — append to end
        toIndex = toColumn.items.length
      } else {
        // Dropped on a specific card
        toIndex = toColumn.items.findIndex((item) => item.id === overIdStr)
      }

      // Only fire if something actually changed
      if (fromColumn.id === toColumn.id && fromIndex === toIndex) return

      onCardMove({
        cardId: activeIdStr,
        fromColumnId: fromColumn.id,
        toColumnId: toColumn.id,
        fromIndex,
        toIndex,
      })
    },
    [columns, onCardMove],
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className={cn('rudi-kanban', className)}>
        {columns.map((column) => (
          <RudiKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            items={column.items}
            renderCard={renderCard}
          />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="rudi-kanban__card rudi-kanban__card--overlay">
            {renderCard(activeItem)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export const RudiKanbanBoard = Object.assign(KanbanBoardRoot, {
  Column: RudiKanbanColumn,
})
