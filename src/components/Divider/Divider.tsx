import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import './divider.css'

/** Props for `RudiDivider`. */
export interface RudiDividerProps {
  /**
   * Direction of the rule.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Margin around the rule, on the block axis when horizontal and the inline axis when vertical.
   * @default 'md'
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  /** Centered label rendered between two rules. Horizontal only; ignored when vertical. */
  label?: ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Thin rule that separates sections of content. Renders a native `hr` for a plain horizontal rule, and a `role="separator"` element when vertical or labelled.
 * A `label` only applies to horizontal dividers; it is ignored when `orientation="vertical"`.
 * @example
 * ```tsx
 * <RudiDivider label="or" />
 * ```
 */
export function RudiDivider({
  orientation = 'horizontal',
  spacing = 'md',
  label,
  className,
}: RudiDividerProps) {
  const classes = cn(
    'rudi-divider',
    `rudi-divider--${orientation}`,
    `rudi-divider--spacing-${spacing}`,
    label && orientation === 'horizontal' && 'rudi-divider--labeled',
    className,
  )

  if (label && orientation === 'horizontal') {
    return (
      <div className={classes} role="separator" aria-orientation="horizontal">
        <span className="rudi-divider__line" aria-hidden="true" />
        <span className="rudi-divider__label">{label}</span>
        <span className="rudi-divider__line" aria-hidden="true" />
      </div>
    )
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={classes}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  return <hr className={classes} />
}
