import { useState, type CSSProperties } from 'react'
import { cn } from '@/utils/cn'
import { RudiBadge } from '@/components/Badge/Badge'
import { RudiIcon } from '@/components/Icon/Icon'
import './avatar.css'

/** Props for `RudiAvatar`. */
export interface RudiAvatarProps {
  /** Image URL. When it is missing or fails to load, initials are shown instead. */
  src?: string
  /** Accessible name of the avatar. Takes precedence over `name` for the label. */
  alt?: string
  /** Full name used for the initials (first and last word, uppercased) and as the fallback accessible name. */
  name?: string
  /**
   * Diameter of the avatar.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /** Shows a small status dot in the corner. Without `statusLabel` the dot carries no text, so convey the status elsewhere for assistive technology. */
  status?: 'success' | 'warning' | 'error' | 'info'
  /** Text for the status, appended to the accessible name ("Ada Lovelace, Busy"). Only used when `status` is set. */
  statusLabel?: string
  /** Iconify icon name shown instead of the initials when there is no loaded image, e.g. for an entity type rather than a person. Decorative: the accessible name still comes from `alt`, then `name`. */
  icon?: string
  /** Accent color: the background becomes a translucent wash of it and the initials or icon take the color, deepened toward the text color so they stay readable. Any CSS color, including `var(...)` for theme-aware custom properties, or `'auto'` to pick one of the 8 categorical dataviz series colors from a stable hash of `name` (no tint without `name`). Unset keeps the neutral look. */
  tint?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

const AUTO_TINT_COUNT = 8

function hashString(value: string): number {
  // FNV-1a, 32-bit. Stable across runs and platforms.
  let hash = 0x811c9dc5
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function resolveTint(tint: string | undefined, name: string | undefined): string | undefined {
  if (!tint) return undefined
  if (tint !== 'auto') return tint
  if (!name) return undefined
  const index = (hashString(name.trim()) % AUTO_TINT_COUNT) + 1
  return `var(--rudi-component-avatar-auto-tint-${index})`
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return (parts[0]?.[0] ?? '').toUpperCase()
}

/**
 * Circular representation of a person or entity: an image when `src` loads, otherwise an `icon` or initials derived from `name`. Falls back to the icon or initials if the image fails to load. Set `tint` for a colored tile.
 * Exposed as `role="img"` labelled by `alt`, then `name`. With neither, the avatar is decorative (`aria-hidden`, no role).
 * @example
 * ```tsx
 * <RudiAvatar name="Ada Lovelace" src="/ada.jpg" size="lg" status="success" />
 * <RudiAvatar name="Shipments" icon="lucide:truck" tint="auto" />
 * ```
 */
export function RudiAvatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  statusLabel,
  icon,
  tint,
  className,
}: RudiAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError
  const initials = name ? getInitials(name) : ''
  const baseLabel = alt || name
  const ariaLabel =
    baseLabel && status && statusLabel ? `${baseLabel}, ${statusLabel}` : baseLabel
  const tintColor = resolveTint(tint, name)
  const style = tintColor ? ({ '--avatar-tint': tintColor } as CSSProperties) : undefined

  return (
    <span
      className={cn(
        'rudi-avatar',
        `rudi-avatar--${size}`,
        tintColor && 'rudi-avatar--tinted',
        className,
      )}
      style={style}
      {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : { 'aria-hidden': true })}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || ''}
          className="rudi-avatar__image"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="rudi-avatar__initials" aria-hidden="true">
          {icon ? <RudiIcon icon={icon} className="rudi-avatar__icon" /> : initials}
        </span>
      )}
      {status && (
        <RudiBadge
          variant={status}
          dot
          className="rudi-avatar__status"
        />
      )}
    </span>
  )
}
