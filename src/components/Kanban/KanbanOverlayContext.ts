import { createContext } from 'react'

/**
 * True inside the board's `DragOverlay`. `RudiKanbanCard` reads it to render a static visual
 * clone there, because dnd-kit components in a drag overlay must not call `useSortable`.
 * Internal: not exported from the package.
 */
export const KanbanOverlayContext = createContext(false)
