import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import './cover.css'

export interface RudiCoverProps extends React.HTMLAttributes<HTMLElement> {
  /** Minimum block size of the cover; any CSS length. Falls back to the `--rudi-layout-cover-min-height` token (100vh). */
  minHeight?: string
  /** Minimum vertical space between the cover's children; any CSS length. Falls back to the `--rudi-layout-cover-space` token (1.5rem). */
  space?: string
  /**
   * Element or component to render as the root.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Optional header and footer elements, plus one `RudiCover.Centered` child. */
  children?: React.ReactNode
}

/** Props for `RudiCover.Centered`. Other DOM props are spread onto the element. */
export interface RudiCoverCenteredProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element or component to render as the root.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** The principal content to center vertically. */
  children?: React.ReactNode
}

/** The child that sits in the vertical middle of the cover. Use at most one per cover. */
const CoverCentered = forwardRef<HTMLElement, RudiCoverCenteredProps>(function RudiCoverCentered(
  { as: Element = 'div', className, children, ...props },
  ref,
) {
  return (
    <Element ref={ref} className={cn('rudi-cover__centered', className)} {...props}>
      {children}
    </Element>
  )
})

const CoverRoot = forwardRef<HTMLElement, RudiCoverProps>(function RudiCover(
  {
    minHeight,
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
  if (minHeight) customProperties['--cover-min-height'] = minHeight
  if (space) customProperties['--cover-space'] = space

  return (
    <Element
      ref={ref}
      className={cn('rudi-cover', className)}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})

/**
 * Full-height column that pins an optional first and last child to the top and bottom and centers `RudiCover.Centered` in between. Use it for hero sections and login pages; use `RudiCenter` for horizontal centering only.
 * Polymorphic through `as`; unrecognised DOM props (`id`, `aria-*`, `data-*`, handlers) are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiCover minHeight="100vh">
 *   <RudiTopBar />
 *   <RudiCover.Centered>
 *     <RudiHeading level={1}>Sign in</RudiHeading>
 *   </RudiCover.Centered>
 * </RudiCover>
 */
export const RudiCover = Object.assign(CoverRoot, {
  /** The child centered vertically between the cover's other children. Use at most one per cover. */
  Centered: CoverCentered,
})
