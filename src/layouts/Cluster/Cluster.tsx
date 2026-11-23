import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { resolveSpace, type RudiSpace } from '@/utils/space'
import './cluster.css'

export interface RudiClusterProps extends React.HTMLAttributes<HTMLElement> {
  /** Gap between items, both horizontally and between wrapped rows: a step of the spacing scale (`"inline"`, `"content"`, `"group"`, `"section"`, `"gutter"`, or a fixed step: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`) or any CSS length. Falls back to the `--rudi-layout-cluster-space` token (`content`). */
  space?: RudiSpace
  /** Horizontal distribution of items along each row (`justify-content`). Defaults to `flex-start` in CSS. */
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
  /** Vertical alignment of items within each row (`align-items`). Defaults to `center` in CSS. */
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  /**
   * Element or component to render as the root. Use `"ul"` or `"ol"` for a list; bullets and indent are removed.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Items to lay out in a row. */
  children?: React.ReactNode
}

/**
 * Horizontal row of items that wraps onto new lines when space runs out. Choose it for tags, button groups, and breadcrumbs. Use `RudiStack` for a vertical list, and `RudiSwitcher` when a row should collapse to a single column as a whole instead of wrapping item by item.
 * Polymorphic through `as`; unrecognised DOM props (`id`, `aria-*`, `data-*`, handlers) are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiCluster space="inline" justify="flex-end">
 *   <RudiButton onPress={cancel}>Cancel</RudiButton>
 *   <RudiButton onPress={save}>Save</RudiButton>
 * </RudiCluster>
 */
export const RudiCluster = forwardRef<HTMLElement, RudiClusterProps>(function RudiCluster(
  {
    space,
    justify,
    align,
    as: Element = 'div',
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const customProperties: Record<string, string> = {}
  const spaceValue = resolveSpace(space)
  if (spaceValue) customProperties['--cluster-space'] = spaceValue
  if (justify) customProperties['--cluster-justify'] = justify
  if (align) customProperties['--cluster-align'] = align

  return (
    <Element
      ref={ref}
      className={cn('rudi-cluster', className)}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})
