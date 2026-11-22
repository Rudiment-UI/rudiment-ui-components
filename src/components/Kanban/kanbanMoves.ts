import type { RudiKanbanCardMoveEvent, RudiKanbanColumnData } from './KanbanBoard'

// Pure move logic for RudiKanbanBoard, kept out of the component so it can be tested
// without a layout engine. Internal: not exported from the package.

export function findColumnOfItem(columns: RudiKanbanColumnData[], itemId: string) {
  return columns.find((col) => col.items.some((item) => item.id === itemId))
}

/** The column `id` belongs to, whether `id` is a column or a card. */
export function findContainer(columns: RudiKanbanColumnData[], id: string) {
  return columns.find((col) => col.id === id) ?? findColumnOfItem(columns, id)
}

/**
 * Moves the active card into the column under the pointer, before the card it's over
 * (after it when `below`), or at the end when it's over the column itself. Returns
 * `columns` unchanged when the card is already in that column: in-column reordering
 * is previewed by the sortable strategy.
 */
export function previewMove(
  columns: RudiKanbanColumnData[],
  activeId: string,
  overId: string,
  below: boolean,
): RudiKanbanColumnData[] {
  const from = findColumnOfItem(columns, activeId)
  const to = findContainer(columns, overId)
  if (!from || !to || from.id === to.id) return columns
  const moving = from.items.find((item) => item.id === activeId)!
  const overIndex = to.items.findIndex((item) => item.id === overId)
  const insertAt = overIndex >= 0 ? overIndex + (below ? 1 : 0) : to.items.length
  return columns.map((col) => {
    if (col.id === from.id) return { ...col, items: col.items.filter((item) => item.id !== activeId) }
    if (col.id === to.id) return { ...col, items: [...col.items.slice(0, insertAt), moving, ...col.items.slice(insertAt)] }
    return col
  })
}

/**
 * The move to report on drop, from the original `columns` and the drag `preview`.
 * `toIndex` is the card's final index, counted with it removed from its source.
 * Returns null when the card ends where it started.
 */
export function resolveDrop(
  columns: RudiKanbanColumnData[],
  preview: RudiKanbanColumnData[],
  activeId: string,
  overId: string,
): RudiKanbanCardMoveEvent | null {
  const fromColumn = findColumnOfItem(columns, activeId)
  const toColumn = findColumnOfItem(preview, activeId)
  if (!fromColumn || !toColumn) return null
  const fromIndex = fromColumn.items.findIndex((item) => item.id === activeId)
  // Within the column the card ended in, a drop on another card takes that card's slot.
  const overIndex = toColumn.items.findIndex((item) => item.id === overId)
  const toIndex = overIndex >= 0 ? overIndex : toColumn.items.findIndex((item) => item.id === activeId)
  if (fromColumn.id === toColumn.id && fromIndex === toIndex) return null
  return { cardId: activeId, fromColumnId: fromColumn.id, toColumnId: toColumn.id, fromIndex, toIndex }
}
