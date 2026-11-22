import React from 'react'
import { cn } from '@/utils/cn'
import './description-list.css'

/** One term and description pair in a `RudiDescriptionList`. */
export interface RudiDescriptionListItem {
  /** The label, rendered in a `dt`. */
  term: React.ReactNode
  /** The value, rendered in a `dd`. */
  description: React.ReactNode
  /** Stable key for the row; also set as the DOM `id` of the row wrapper. Falls back to the index for the key. */
  id?: string
}

/** Props for `RudiDescriptionList`. */
export interface RudiDescriptionListProps {
  /** Term and description pairs, in display order. */
  items: RudiDescriptionListItem[]
  /**
   * `stacked` puts the term above its description. `inline` puts them side by side in two columns, and collapses back to stacked when the list's own width is narrow (a container query, not the viewport).
   * @default 'stacked'
   */
  layout?: 'stacked' | 'inline'
  /**
   * Maximum number of columns for the `stacked` layout. Fewer are used when the container is narrow.
   * @default 1
   */
  columns?: number
  /**
   * Draws a hairline under each row.
   * @default false
   */
  dividers?: boolean
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Semantic `dl` for read-only key-value data such as record details. Use a table for data with several attributes per row.
 * @example
 * ```tsx
 * <RudiDescriptionList
 *   layout="inline"
 *   items={[{ term: 'Status', description: 'Shipped' }, { term: 'Carrier', description: 'DHL' }]}
 * />
 * ```
 */
export function RudiDescriptionList({
  items,
  layout = 'stacked',
  columns = 1,
  dividers = false,
  className,
}: RudiDescriptionListProps) {
  const cols = Math.max(1, Math.floor(columns) || 1)
  return (
    <dl
      className={cn(
        'rudi-description-list',
        `rudi-description-list--${layout}`,
        dividers && 'rudi-description-list--dividers',
        className,
      )}
      style={
        layout === 'stacked'
          ? ({ '--description-list-columns': cols } as React.CSSProperties)
          : undefined
      }
    >
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          id={item.id}
          className="rudi-description-list__item"
        >
          <dt className="rudi-description-list__term">{item.term}</dt>
          <dd className="rudi-description-list__description">
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  )
}
