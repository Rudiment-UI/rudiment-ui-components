// src/layouts/Box/Box.tsx
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { resolveSpace, type RudiSpace } from '@/utils/space'
import './box.css'

export interface RudiBoxProps extends React.HTMLAttributes<HTMLElement> {
  /** Padding on all four sides: a step of the spacing scale (`"inline"`, `"content"`, `"group"`, `"section"`, `"gutter"`, or a fixed step: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`) or any CSS length. Falls back to the `--rudi-layout-box-padding` token (`content`). */
  padding?: RudiSpace
  /**
   * Draws a 1px border with the themed border color and radius.
   *
   * @default false
   */
  bordered?: boolean
  /**
   * Swaps to the inverted surface and text colors (dark panel on a light theme, and the reverse).
   *
   * @default false
   */
  invert?: boolean
  /**
   * Stick to the top of the scroll container while scrolling. A string sets the top offset (e.g. `"1rem"`).
   *
   * @default false
   */
  sticky?: boolean | string
  /**
   * Element or component to render as the root.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Content placed inside the padded container. */
  children?: React.ReactNode
}

/**
 * Padded container with an optional border or inverted surface. Use it for cards, panels, and callouts; use `RudiStack` or `RudiCluster` to space the things inside it, and `RudiCenter` when you need a max-width rather than padding.
 * Polymorphic through `as`; unrecognised DOM props (`id`, `aria-*`, `data-*`, handlers) are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiBox padding="group" bordered>
 *   <RudiText>Panel content</RudiText>
 * </RudiBox>
 */
export const RudiBox = forwardRef<HTMLElement, RudiBoxProps>(function RudiBox(
  {
    padding,
    bordered = false,
    invert = false,
    sticky = false,
    as: Element = 'div',
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const customProperties: Record<string, string> = {}
  const paddingValue = resolveSpace(padding)
  if (paddingValue) customProperties['--box-padding'] = paddingValue
  if (typeof sticky === 'string') customProperties['--box-sticky-top'] = sticky

  return (
    <Element
      ref={ref}
      className={cn(
        'rudi-box',
        bordered && 'rudi-box--bordered',
        invert && 'rudi-box--invert',
        sticky && 'rudi-box--sticky',
        className,
      )}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})
