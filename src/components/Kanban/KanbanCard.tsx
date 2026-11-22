import { useContext } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/utils/cn'
import { KanbanOverlayContext } from './KanbanOverlayContext'

/** Props for `RudiKanbanCard`. */
export interface RudiKanbanCardProps {
  /** Matches the `id` of the card's `RudiKanbanItem`. */
  id: string
  /**
   * Human name for the card (e.g. its title or reference). Names the drag handle
   * ("Move REF-1042") so screen-reader users hear which card they're on. Falls back to `id`.
   */
  label?: string
  /** Card content, shown beside the drag handle. */
  children: React.ReactNode
  /** Class merged onto the card element. */
  className?: string
}

/**
 * A draggable card with a drag handle. Return it from `RudiKanbanBoard`'s `renderCard`, passing
 * the item's `id`. Pass `label` so the handle is announced as "Move <label>".
 *
 * @example
 * <RudiKanbanCard id={item.id} label={String(item.ref)}>{String(item.ref)}</RudiKanbanCard>
 */
export function RudiKanbanCard(props: RudiKanbanCardProps) {
  const isOverlay = useContext(KanbanOverlayContext)
  return isOverlay ? <KanbanCardView {...props} isOverlay /> : <SortableKanbanCard {...props} />
}

interface KanbanCardViewProps extends RudiKanbanCardProps {
  isOverlay?: boolean
  isDragging?: boolean
  style?: React.CSSProperties
  cardRef?: React.Ref<HTMLDivElement>
  /** Sortable attributes and listeners for the handle. Absent in the overlay. */
  handleProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

/** Presentational card markup with no dnd-kit hooks, shared by the sortable and overlay cards. */
function KanbanCardView({
  id,
  label,
  children,
  className,
  isOverlay,
  isDragging,
  style,
  cardRef,
  handleProps,
}: KanbanCardViewProps) {
  return (
    <div
      ref={cardRef}
      style={style}
      // The overlay is a visual clone; hide it from assistive tech.
      aria-hidden={isOverlay || undefined}
      className={cn(
        'rudi-kanban__card',
        isDragging && 'rudi-kanban__card--dragging',
        isOverlay && 'rudi-kanban__card--overlay',
        className,
      )}
    >
      <button
        type="button"
        className="rudi-kanban__card-handle"
        aria-label={`Move ${label ?? id}`}
        tabIndex={isOverlay ? -1 : undefined}
        {...handleProps}
        // After the spread so it wins — `attributes` also carries
        // aria-roledescription and would otherwise overwrite it.
        aria-roledescription={isOverlay ? undefined : 'sortable'}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="3.5" cy="2" r="1.25" />
          <circle cx="8.5" cy="2" r="1.25" />
          <circle cx="3.5" cy="6" r="1.25" />
          <circle cx="8.5" cy="6" r="1.25" />
          <circle cx="3.5" cy="10" r="1.25" />
          <circle cx="8.5" cy="10" r="1.25" />
        </svg>
      </button>
      <div className="rudi-kanban__card-content">{children}</div>
    </div>
  )
}

function SortableKanbanCard(props: RudiKanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
  })

  return (
    <KanbanCardView
      {...props}
      cardRef={setNodeRef}
      isDragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      handleProps={{ ...attributes, ...listeners }}
    />
  )
}
