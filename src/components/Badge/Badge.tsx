import { VisuallyHidden } from 'react-aria'
import { cn } from '@/utils/cn'
import './badge.css'

/** Props for `RudiBadge`. */
export interface RudiBadgeProps {
  /**
   * Semantic color of the badge.
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  /**
   * Controls the badge's size.
   * @default 'md'
   */
  size?: 'sm' | 'md'
  /**
   * Renders a bare colored dot. `children` are kept as screen-reader-only text; with no children the dot is decorative.
   * @default false
   */
  dot?: boolean
  /** Badge content, such as a status word or count. With `dot` set it is visually hidden but still announced. */
  children?: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Small non-interactive label for status or counts. Use `RudiTag` when the label can be pressed or dismissed, and `RudiDot` for a bare indicator.
 * With `dot` set the badge renders as a dot and `children` become screen-reader-only text.
 * @example
 * ```tsx
 * <RudiBadge variant="success">Active</RudiBadge>
 * ```
 */
export function RudiBadge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}: RudiBadgeProps) {
  return (
    <span
      aria-hidden={dot && children == null ? true : undefined}
      className={cn(
        'rudi-badge',
        `rudi-badge--${variant}`,
        `rudi-badge--${size}`,
        dot && 'rudi-badge--dot',
        className,
      )}
    >
      {dot ? children != null && <VisuallyHidden>{children}</VisuallyHidden> : children}
    </span>
  )
}
