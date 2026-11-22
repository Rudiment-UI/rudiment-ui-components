import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import type {
  RudiTypographyAlign,
  RudiTypographyTone,
  RudiTypographyWeight,
} from '@/typography/Text/Text'
import './heading.css'

export interface RudiHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level; picks the element (`1` renders `h1`, through `6` for `h6`) and the document outline. Keep levels in order. */
  level: 1 | 2 | 3 | 4 | 5 | 6
  /** Visual size on the same 1-6 scale, independent of `level`; matches `level` when omitted. */
  size?: 1 | 2 | 3 | 4 | 5 | 6
  /** Font weight, overriding the size default. */
  weight?: RudiTypographyWeight
  /** Semantic text color. */
  tone?: RudiTypographyTone
  /** Text alignment. */
  align?: RudiTypographyAlign
  /** Removes the element's default block margin. */
  noMargin?: boolean
  /** Heading content. */
  children: React.ReactNode
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

/**
 * Semantic heading (`h1` to `h6`) whose visual size is set separately from its level, so the document outline stays correct while the look follows the design. Use `RudiText` for non-heading text. Not polymorphic: the element is always chosen by `level`. Other DOM props are spread onto the element.
 *
 * @example
 * <RudiHeading level={2} size={4} tone="brand">
 *   Section title
 * </RudiHeading>
 */
export const RudiHeading = forwardRef<HTMLHeadingElement, RudiHeadingProps>(
  function RudiHeading(
    { level, size, weight, tone, align, noMargin, className, children, ...props },
    ref,
  ) {
    const Element = `h${level}` as const
    const visualSize = size ?? level

    return (
      <Element
        ref={ref}
        className={cn(
          `rudi-heading rudi-heading--${visualSize}`,
          weight && `rudi-heading--weight-${weight}`,
          tone && `rudi-heading--tone-${tone}`,
          align && `rudi-heading--align-${align}`,
          noMargin && 'rudi-heading--flush',
          className,
        )}
        {...props}
      >
        {children}
      </Element>
    )
  },
)
