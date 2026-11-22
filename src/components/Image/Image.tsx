import { useState } from 'react'
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './image.css'

/** Props for `RudiImage`. */
export interface RudiImageProps {
  /** Image URL. */
  src: string
  /** Text alternative for the image. Use an empty string when the image is decorative. */
  alt: string
  /** CSS aspect ratio for the frame, e.g. `'16 / 9'`, `'1 / 1'`, `'4 / 3'`. Without it the frame sizes to the image. */
  aspectRatio?: CSSProperties['aspectRatio']
  /**
   * How the image fills the frame: `cover` crops to fill, `contain` shows the whole image.
   * @default 'cover'
   */
  fit?: 'cover' | 'contain'
  /**
   * Corner radius of the frame.
   * @default 'md'
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /**
   * Native loading strategy for the `img`.
   * @default 'lazy'
   */
  loading?: 'lazy' | 'eager'
  /** Content shown in place of the image when it fails to load. Defaults to a muted placeholder with an `image-off` icon that keeps the frame's `aspectRatio` and `radius`. */
  fallback?: ReactNode
  /** Called when the image fails to load. */
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void
  /** Content layered over the image (badges, wishlist button, gradient scrim, duotone wash). Rendered in a positioned layer above the picture. */
  overlay?: ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Image in a framed, rounded container with an optional aspect ratio and overlay layer. Use it instead of a bare `img` when the image needs a fixed shape or content layered on top.
 * `alt` is required; pass an empty string for a purely decorative image. When the image fails to load, `fallback` (or a neutral placeholder) is shown in its place.
 * @example
 * ```tsx
 * <RudiImage src="/shoe.jpg" alt="Red running shoe" aspectRatio="4 / 3" overlay={<RudiBadge>New</RudiBadge>} />
 * ```
 */
export function RudiImage({
  src,
  alt,
  aspectRatio,
  fit = 'cover',
  radius = 'md',
  loading = 'lazy',
  fallback,
  onError,
  overlay,
  className,
}: RudiImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = failedSrc === src

  return (
    <div
      className={cn('rudi-image', `rudi-image--radius-${radius}`, className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {failed ? (
        <div
          className="rudi-image__fallback"
          {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
        >
          {fallback ?? <RudiIcon icon="lucide:image-off" size="lg" />}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn('rudi-image__img', `rudi-image__img--${fit}`)}
          onError={(event) => {
            setFailedSrc(src)
            onError?.(event)
          }}
        />
      )}
      {overlay != null && <div className="rudi-image__overlay">{overlay}</div>}
    </div>
  )
}
