import { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
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
  type DragOverEvent,
  MeasuringStrategy,
  type Announcements,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { cn } from '@/utils/cn'
import { RudiKanbanColumn } from './KanbanColumn'
import { KanbanOverlayContext } from './KanbanOverlayContext'
import { findColumnOfItem, previewMove, resolveDrop } from './kanbanMoves'
import './kanban.css'

/** A card's data. Any extra fields are passed through to `renderCard`. */
export interface RudiKanbanItem {
  /** Unique across the whole board, not just its column. Used as the drag id. */
  id: string
  /** Any other data your `renderCard` needs. */
  [key: string]: unknown
}

/** Data for one board column. */
export interface RudiKanbanColumnData {
  /** Unique column id. Reported as `fromColumnId` / `toColumnId` in move events. */
  id: string
  /** Column heading. Also the column region's accessible name and used in drag announcements. */
  title: string
  /** Cards in display order. */
  items: RudiKanbanItem[]
}

/** Describes a completed card drag. Use it to update your own column state. */
export interface RudiKanbanCardMoveEvent {
  /** `id` of the card that moved. */
  cardId: string
  /** `id` of the column the card started in. */
  fromColumnId: string
  /** `id` of the column the card was dropped in. */
  toColumnId: string
  /** Index of the card in its source column before the move. */
  fromIndex: number
  /** The card's index in the destination column after the move, counted with the card removed from its source (so `items.splice(fromIndex, 1)` then `splice(toIndex, 0, card)` applies it). */
  toIndex: number
}

/** Props for `RudiKanbanBoard`. */
export interface RudiKanbanBoardProps {
  /** Columns and their cards. The board is controlled: it never reorders them itself. */
  columns: RudiKanbanColumnData[]
  /** Called once when a drag ends in a new position. Update `columns` here. Not called when the card is dropped where it started. */
  onCardMove: (event: RudiKanbanCardMoveEvent) => void
  /** Renders one card. Return a `RudiKanbanCard` with the item's `id`, which makes it draggable. */
  renderCard: (item: RudiKanbanItem) => React.ReactNode
  /** Names a card in drag announcements ("Picked up REF-1042 from Pending"). Defaults to its id. */
  getCardLabel?: (item: RudiKanbanItem) => string
  /** Class merged onto the board's column container. */
  className?: string
}

function KanbanBoardRoot({
  columns,
  onCardMove,
  renderCard,
  getCardLabel,
  className,
}: RudiKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  // While dragging, the board renders this copy so the card sits in the column and slot
  // where it will land. `columns` itself is never touched; the move is reported on drop.
  const [preview, setPreview] = useState<RudiKanbanColumnData[] | null>(null)
  const view = preview ?? columns

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
    (activeCardId: string) => {
      const owner = findColumnOfItem(view, activeCardId)
      if (!owner) return undefined
      const index = owner.items.findIndex((item) => item.id === activeCardId)
      return `${owner.title}, position ${index + 1} of ${owner.items.length}`
    },
    [view],
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
        const where = over ? describeOver(String(active.id)) : undefined
        return where ? `${labelOf(String(active.id))} is over ${where}.` : `${labelOf(String(active.id))} is no longer over a column.`
      },
      onDragEnd: ({ active, over }) => {
        const where = over ? describeOver(String(active.id)) : undefined
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
      setActiveId(String(event.active.id))
      setPreview(columns)
    },
    [columns],
  )

  // Moving into another column happens live, so the card's placeholder shows the drop
  // slot. Reordering inside a column is previewed by the sortable strategy instead.
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeIdStr = String(active.id)
    const overIdStr = String(over.id)
    const translated = active.rect.current.translated
    const below = translated != null && translated.top > over.rect.top + over.rect.height / 2
    setPreview((current) => (current ? previewMove(current, activeIdStr, overIdStr, below) : current))
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      const finalView = preview ?? columns
      setActiveId(null)
      setPreview(null)
      if (!over) return

      const move = resolveDrop(columns, finalView, String(active.id), String(over.id))
      if (move) onCardMove(move)
    },
    [columns, preview, onCardMove],
  )

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
    setPreview(null)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      // Cards change columns mid-drag, so droppable rects must be re-measured as they move.
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={cn('rudi-kanban', className)}>
        {view.map((column) => (
          <RudiKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            items={column.items}
            renderCard={renderCard}
          />
        ))}
      </div>
      {/* Portalled to <body>: DragOverlay is position: fixed, and any transformed ancestor
          (a Storybook docs block, an animated panel) would otherwise offset it from the cursor. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay>
            {activeItem ? (
              <KanbanOverlayContext.Provider value>
                {renderCard(activeItem)}
              </KanbanOverlayContext.Provider>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  )
}

/**
 * Drag-and-drop board of columns and cards, with pointer and keyboard dragging and screen-reader
 * announcements. Fully controlled: pass `columns`, and apply each `onCardMove` event to your own
 * state. Render each card as a `RudiKanbanCard` inside `renderCard`. Card ids must be unique
 * across all columns. Use `RudiTable` instead for non-draggable tabular data.
 *
 * @example
 * <RudiKanbanBoard
 *   columns={columns}
 *   onCardMove={(e) => setColumns((prev) => moveCard(prev, e))}
 *   renderCard={(item) => <RudiKanbanCard key={item.id} id={item.id}>{String(item.title)}</RudiKanbanCard>}
 * />
 */
export const RudiKanbanBoard = Object.assign(KanbanBoardRoot, {
  /** A single column. The board renders these for you; use directly only when composing a custom layout inside the board's drag context. */
  Column: RudiKanbanColumn,
})
