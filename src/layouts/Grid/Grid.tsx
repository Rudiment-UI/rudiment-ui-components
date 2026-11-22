import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import './grid.css'

export interface RudiGridProps extends React.HTMLAttributes<HTMLElement> {
  /** Minimum width of each column before the grid fits fewer columns; any CSS length, capped at 100% of the container. Falls back to the `--rudi-layout-grid-min-cell` token (15rem). */
  minCellWidth?: string
  /** Gap between rows and columns; any CSS length. Falls back to the `--rudi-layout-grid-space` token (1.5rem). */
  space?: string
  /**
   * Element or component to render as the root. Use `"ul"` or `"ol"` for a list; bullets and indent are removed.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Items, one per cell. */
  children?: React.ReactNode
}

/**
 * Responsive grid of equal-width columns that adds or drops columns as the container width changes, with no breakpoints. Choose it for card grids, galleries, and dashboards of similar items. Use `RudiSwitcher` for a single row that stacks all at once, and `RudiSidebar` for two panels of different widths.
 * Polymorphic through `as`; unrecognised DOM props (`id`, `aria-*`, `data-*`, handlers) are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiGrid minCellWidth="16rem" space="1rem">
 *   <RudiCard>One</RudiCard>
 *   <RudiCard>Two</RudiCard>
 * </RudiGrid>
 */
export const RudiGrid = forwardRef<HTMLElement, RudiGridProps>(function RudiGrid(
  {
    minCellWidth,
    space,
    as: Element = 'div',
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const customProperties: Record<string, string> = {}
  if (minCellWidth) customProperties['--grid-min-cell'] = minCellWidth
  if (space) customProperties['--grid-space'] = space

  return (
    <Element
      ref={ref}
      className={cn('rudi-grid', className)}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})
