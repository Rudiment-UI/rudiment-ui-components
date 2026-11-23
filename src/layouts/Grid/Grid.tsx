import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { resolveSpace, type RudiSpace } from '@/utils/space'
import './grid.css'

export interface RudiGridProps extends React.HTMLAttributes<HTMLElement> {
  /** Minimum width of each column before the grid fits fewer columns; any CSS length, capped at 100% of the container. Falls back to the `--rudi-layout-grid-min-cell` token (15rem). */
  minCellWidth?: string
  /** Gap between rows and columns: a step of the spacing scale (`"inline"`, `"content"`, `"group"`, `"section"`, `"gutter"`, or a fixed step: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`) or any CSS length. Falls back to the `--rudi-layout-grid-space` token (`group`). */
  space?: RudiSpace
  /**
   * Widens the items to fill the row when there are fewer of them than the columns that fit. By default the grid keeps those empty columns, so every item has the same width as in a full row; that suits galleries and lists that grow. Set `fillRow` for a fixed set, such as four stat cards across a dashboard, so the row has no empty space at the end. Items on a wrapped last row keep the column width either way.
   *
   * @default false
   */
  fillRow?: boolean
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
 * <RudiGrid minCellWidth="16rem" space="content">
 *   <RudiCard>One</RudiCard>
 *   <RudiCard>Two</RudiCard>
 * </RudiGrid>
 */
export const RudiGrid = forwardRef<HTMLElement, RudiGridProps>(function RudiGrid(
  {
    minCellWidth,
    space,
    fillRow = false,
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
  const spaceValue = resolveSpace(space)
  if (spaceValue) customProperties['--grid-space'] = spaceValue

  return (
    <Element
      ref={ref}
      className={cn('rudi-grid', fillRow && 'rudi-grid--fill-row', className)}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})
