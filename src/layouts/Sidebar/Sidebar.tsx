import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { resolveSpace, type RudiSpace } from '@/utils/space'
import './sidebar.css'

export interface RudiSidebarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Which edge the sidebar sits on. The sidebar is the first child when `"left"` and the last child when `"right"`.
   *
   * @default 'left'
   */
  side?: 'left' | 'right'
  /** Preferred width of the sidebar; any CSS length. Falls back to the `--rudi-layout-sidebar-width` token (20rem). */
  sideWidth?: string
  /** Minimum width of the content child, as a CSS length or percentage, before the two panels wrap into a column. Falls back to the `--rudi-layout-sidebar-content-min` token (50%). */
  contentMin?: string
  /** Gap between the two panels, including after they wrap: a step of the spacing scale (`"inline"`, `"content"`, `"group"`, `"section"`, `"gutter"`, or a fixed step: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`) or any CSS length. Falls back to the `--rudi-layout-sidebar-space` token (`group`). */
  space?: RudiSpace
  /**
   * Keeps each panel at its own content height instead of stretching to match the taller one.
   *
   * @default false
   */
  noStretch?: boolean
  /**
   * Element or component to render as the root.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Exactly two children: the sidebar and the main content, in DOM order matching `side`. */
  children?: React.ReactNode
}

/**
 * Two-panel layout where one panel has a set width and the other fills the rest, wrapping to a column when the content would drop below `contentMin`. Choose it for navigation or filters beside content. Use `RudiSwitcher` for panels of equal weight, and `RudiAppShell` for the application frame.
 * Polymorphic through `as`; unrecognised DOM props (`id`, `aria-*`, `data-*`, handlers) are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiSidebar sideWidth="16rem">
 *   <aside>Filters</aside>
 *   <main>Results</main>
 * </RudiSidebar>
 */
export const RudiSidebar = forwardRef<HTMLElement, RudiSidebarProps>(function RudiSidebar(
  {
    side = 'left',
    sideWidth,
    contentMin,
    space,
    noStretch = false,
    as: Element = 'div',
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const customProperties: Record<string, string> = {}
  if (sideWidth) customProperties['--sidebar-width'] = sideWidth
  if (contentMin) customProperties['--sidebar-content-min'] = contentMin
  const spaceValue = resolveSpace(space)
  if (spaceValue) customProperties['--sidebar-space'] = spaceValue

  return (
    <Element
      ref={ref}
      className={cn(
        'rudi-sidebar',
        side === 'right' && 'rudi-sidebar--right',
        noStretch && 'rudi-sidebar--no-stretch',
        className,
      )}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})
