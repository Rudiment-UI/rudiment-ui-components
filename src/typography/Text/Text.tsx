import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import './text.css'

/** Font weight options shared by `RudiText` and `RudiHeading`, mapped to the font-weight tokens. */
export type RudiTypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold'
/** Semantic text colors shared by `RudiText` and `RudiHeading`, mapped to semantic color tokens that adapt per theme. */
export type RudiTypographyTone =
  | 'default'
  | 'subtle'
  | 'disabled'
  | 'brand'
  | 'inverted'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
/** Text alignment options shared by `RudiText` and `RudiHeading`; `start` and `end` follow the writing direction. */
export type RudiTypographyAlign = 'start' | 'center' | 'end' | 'justify'

/**
 * Props for `RudiText`. Extends `AllHTMLAttributes` rather than `HTMLAttributes` so element-specific
 * attributes type-check with `as`, such as `href` with `as="a"` and `htmlFor` with `as="label"`.
 */
export interface RudiTextProps extends Omit<React.AllHTMLAttributes<HTMLElement>, 'as'> {
  /**
   * Typographic role: `body` for paragraphs, `body-sm` for supporting text, `caption` for metadata, `overline` for uppercase labels, `code` for monospace values.
   *
   * @default 'body'
   */
  variant?: 'body' | 'body-sm' | 'caption' | 'overline' | 'code'
  /**
   * Element or component to render. Use `"span"` for inline text, or `"label"` and `"strong"` where the semantics call for them.
   *
   * @default 'p'
   */
  as?: React.ElementType
  /** Font weight, overriding the variant default. */
  weight?: RudiTypographyWeight
  /** Semantic text color. */
  tone?: RudiTypographyTone
  /** Text alignment. */
  align?: RudiTypographyAlign
  /** Removes the element's default block margin. */
  noMargin?: boolean
  /** Text content. */
  children: React.ReactNode
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

/**
 * Body-level text in one of five variants (body, body-sm, caption, overline, code). Use `RudiHeading` for headings and `RudiProse` for long-form content with its own rhythm. Polymorphic through `as`, which defaults to a `p`; other DOM props are spread onto the element.
 *
 * @example
 * <RudiText variant="caption" tone="subtle">
 *   Last updated March 2026
 * </RudiText>
 */
export const RudiText = forwardRef<HTMLElement, RudiTextProps>(function RudiText(
  {
    variant = 'body',
    as: Element = 'p',
    weight,
    tone,
    align,
    noMargin,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <Element
      ref={ref}
      className={cn(
        `rudi-text rudi-text--${variant}`,
        weight && `rudi-text--weight-${weight}`,
        tone && `rudi-text--tone-${tone}`,
        align && `rudi-text--align-${align}`,
        noMargin && 'rudi-text--flush',
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  )
})
