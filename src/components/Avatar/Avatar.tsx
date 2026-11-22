import { useState } from 'react'
import { cn } from '@/utils/cn'
import { RudiBadge } from '@/components/Badge/Badge'
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
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return (parts[0]?.[0] ?? '').toUpperCase()
}

/**
 * Circular representation of a person or entity: an image when `src` loads, otherwise initials derived from `name`. Falls back to initials if the image fails to load.
 * Exposed as `role="img"` labelled by `alt`, then `name`. With neither, the avatar is decorative (`aria-hidden`, no role).
 * @example
 * ```tsx
 * <RudiAvatar name="Ada Lovelace" src="/ada.jpg" size="lg" status="success" />
 * ```
 */
export function RudiAvatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  statusLabel,
  className,
}: RudiAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError
  const initials = name ? getInitials(name) : ''
  const baseLabel = alt || name
  const ariaLabel =
    baseLabel && status && statusLabel ? `${baseLabel}, ${statusLabel}` : baseLabel

  return (
    <span
      className={cn(
        'rudi-avatar',
        `rudi-avatar--${size}`,
        className,
      )}
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
          {initials}
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
