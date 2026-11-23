import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { resolveSpace, type RudiSpace } from '@/utils/space'
import './center.css'

export interface RudiCenterProps extends React.HTMLAttributes<HTMLElement> {
  /** Maximum content width; any CSS length, such as `"45rem"`. Falls back to the `--rudi-layout-center-max-width` token (60rem). */
  maxWidth?: string
  /** Minimum inline padding on each side, so content never touches the viewport edge: a step of the spacing scale (`"inline"`, `"content"`, `"group"`, `"section"`, `"gutter"`, or a fixed step: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`) or any CSS length. Falls back to the `--rudi-layout-center-gutters` token (`gutter`, which widens at the `md` and `lg` breakpoints). */
  gutters?: RudiSpace
  /**
   * Also centers each child horizontally by its own content width, as a column flex container.
   *
   * @default false
   */
  intrinsic?: boolean
  /**
   * Element or component to render as the root.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Content to center. */
  children?: React.ReactNode
}

/**
 * Horizontally centers its content in a column capped at a maximum width. Use it for article text, hero copy, and page-width wrappers; use `RudiBox` for padding and `RudiCover` for vertical centering. The max width is added to the gutters because the box uses `content-box` sizing.
 * Polymorphic through `as`; unrecognised DOM props (`id`, `aria-*`, `data-*`, handlers) are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiCenter maxWidth="40rem">
 *   <RudiProse>...</RudiProse>
 * </RudiCenter>
 */
export const RudiCenter = forwardRef<HTMLElement, RudiCenterProps>(function RudiCenter(
  {
    maxWidth,
    gutters,
    intrinsic = false,
    as: Element = 'div',
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const customProperties: Record<string, string> = {}
  if (maxWidth) customProperties['--center-max-width'] = maxWidth
  const guttersValue = resolveSpace(gutters)
  if (guttersValue) customProperties['--center-gutters'] = guttersValue

  return (
    <Element
      ref={ref}
      className={cn(
        'rudi-center',
        intrinsic && 'rudi-center--intrinsic',
        className,
      )}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})
