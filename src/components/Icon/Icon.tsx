import { forwardRef } from 'react'
import { Icon as IconifyIcon } from '@iconify/react'
import { cn } from '@/utils/cn'
import './icon.css'

/** Props for `RudiIcon`. */
export interface RudiIconProps {
  /** Iconify icon name in `prefix:name` form, e.g. `"mdi:close"` or `"lucide:check"`. */
  icon: string
  /**
   * Preset size, or a number for an exact width and height in px.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | number
  /** CSS color applied to the icon. Defaults to the inherited text color (`currentColor`). */
  color?: string
  /** Accessible name. When set the icon is exposed as `role="img"`; when omitted it is hidden from assistive technology. */
  label?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Renders an Iconify icon by name (for example `"mdi:close"`). Icons are always passed as name strings, never imported components.
 * Decorative by default (`aria-hidden`). Pass `label` to expose it as an image with an accessible name. Forwards its ref to the wrapping `span`.
 * @example
 * ```tsx
 * <RudiIcon icon="mdi:check-circle" size="lg" label="Verified" />
 * ```
 */
export const RudiIcon = forwardRef<HTMLSpanElement, RudiIconProps>(
  function RudiIcon({ icon, size = 'md', color, label, className }, ref) {
    const sizeClass = typeof size === 'string' ? `rudi-icon--${size}` : undefined
    const inlineStyle =
      typeof size === 'number'
        ? { width: size, height: size, ...(color ? { color } : {}) }
        : color
          ? { color }
          : undefined

    return (
      <span
        ref={ref}
        className={cn('rudi-icon', sizeClass, className)}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        style={inlineStyle}
      >
        <IconifyIcon icon={icon} />
      </span>
    )
  },
)
