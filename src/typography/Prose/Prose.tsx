import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import './prose.css'

export interface RudiProseProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Type scale for the whole block: `sm`, `base`, or `lg`.
   *
   * @default 'base'
   */
  size?: 'sm' | 'base' | 'lg'
  /**
   * Element or component to render as the root.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Long-form content, such as paragraphs, headings, lists, and quotes, as plain elements. */
  children: React.ReactNode
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

/**
 * Wrapper that styles plain HTML children (paragraphs, headings, lists, links) with consistent typography and vertical rhythm. Use it for articles, documentation, and CMS output; use `RudiText` and `RudiHeading` when you compose individual pieces. Polymorphic through `as`; DOM props are spread onto the root.
 *
 * @example
 * <RudiProse size="lg">
 *   <h2>Title</h2>
 *   <p>Body copy.</p>
 * </RudiProse>
 */
export const RudiProse = forwardRef<HTMLElement, RudiProseProps>(function RudiProse(
  { size = 'base', as: Element = 'div', className, children, ...props },
  ref,
) {
  return (
    <Element
      ref={ref}
      className={cn(
        'rudi-prose',
        size !== 'base' && `rudi-prose--${size}`,
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  )
})
