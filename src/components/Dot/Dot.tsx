import type { CSSProperties } from 'react'
import { cn } from '@/utils/cn'
import './dot.css'

/** Props for `RudiDot`. */
export interface RudiDotProps {
  /**
   * Semantic color of the dot. Ignored when `color` is set.
   * @default 'default'
   */
  tone?: 'default' | 'success' | 'warning' | 'error' | 'info'
  /** Explicit CSS color or token, e.g. `var(--rudi-color-dataviz-3)`, for domain accents. Overrides `tone`. */
  color?: string
  /**
   * Diameter of the dot.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Renders an animated halo to draw attention, e.g. for a "live" state.
   * @default false
   */
  pulse?: boolean
  /** Accessible label. When set the dot is exposed as `role="status"` with visually hidden text; otherwise it is hidden from assistive technology. */
  label?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Small colored circle for status or category. Use `RudiBadge` when the indicator needs text beside it.
 * Decorative (`aria-hidden`) unless `label` is set, in which case it is exposed as a status with visually hidden text.
 * @example
 * ```tsx
 * <RudiDot tone="success" pulse label="Live" />
 * ```
 */
export function RudiDot({
  tone = 'default',
  color,
  size = 'md',
  pulse = false,
  label,
  className,
}: RudiDotProps) {
  const style = color
    ? ({ '--rudi-dot-color': color } as CSSProperties)
    : undefined

  return (
    <span
      className={cn(
        'rudi-dot',
        !color && `rudi-dot--${tone}`,
        `rudi-dot--${size}`,
        pulse && 'rudi-dot--pulse',
        className,
      )}
      style={style}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <span className="rudi-dot__label">{label}</span>}
    </span>
  )
}
