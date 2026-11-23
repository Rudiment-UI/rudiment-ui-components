import { Children, forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { resolveSpace, type RudiSpace } from '@/utils/space'
import './switcher.css'

export interface RudiSwitcherProps extends React.HTMLAttributes<HTMLElement> {
  /** Container width below which the children stack into a single column and above which they share one row; any CSS length. Falls back to the `--rudi-layout-switcher-threshold` token (30rem). */
  threshold?: string
  /** Gap between children, in both row and column layouts: a step of the spacing scale (`"inline"`, `"content"`, `"group"`, `"section"`, `"gutter"`, or a fixed step: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`) or any CSS length. Falls back to the `--rudi-layout-switcher-space` token (`group`). */
  space?: RudiSpace
  /** Maximum number of children that can share a row. When there are more children than `limit`, they all stack in a single column, each at full width, at any container width. Unset by default, so only `threshold` decides. */
  limit?: number
  /**
   * Element or component to render as the root.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Items that sit in a row or stack together. */
  children?: React.ReactNode
}

/**
 * Row of children that switches to a single column, all at once, when the container is narrower than `threshold`. Choose it for form field groups and pricing cards. Use `RudiCluster` when items should wrap one by one, and `RudiGrid` for many equal cells in several rows.
 * Polymorphic through `as`; unrecognised DOM props (`id`, `aria-*`, `data-*`, handlers) are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiSwitcher threshold="40rem">
 *   <RudiInput label="First name" />
 *   <RudiInput label="Last name" />
 * </RudiSwitcher>
 */
export const RudiSwitcher = forwardRef<HTMLElement, RudiSwitcherProps>(
  function RudiSwitcher(
    {
      threshold,
      space,
      limit,
      as: Element = 'div',
      className,
      style,
      children,
      ...props
    },
    ref,
  ) {
    const customProperties: Record<string, string> = {}
    if (threshold) customProperties['--switcher-threshold'] = threshold
    const spaceValue = resolveSpace(space)
    if (spaceValue) customProperties['--switcher-space'] = spaceValue

    return (
      <Element
        ref={ref}
        className={cn(
          'rudi-switcher',
          limit != null && Children.toArray(children).length > limit && 'rudi-switcher--stacked',
          className,
        )}
        style={{ ...customProperties, ...style } as React.CSSProperties}
        {...props}
      >
        {children}
      </Element>
    )
  },
)
