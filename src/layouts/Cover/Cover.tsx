import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import './cover.css'

export interface RudiCoverProps extends React.HTMLAttributes<HTMLElement> {
  minHeight?: string
  space?: string
  as?: React.ElementType
  children?: React.ReactNode
}

export interface RudiCoverCenteredProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  children?: React.ReactNode
}

/** The child that sits in the vertical middle of the cover. Use at most one per cover. */
const CoverCentered = forwardRef<HTMLElement, RudiCoverCenteredProps>(function RudiCoverCentered(
  { as: Element = 'div', className, children, ...props },
  ref,
) {
  return (
    <Element ref={ref} className={cn('rudi-cover__centered', className)} {...props}>
      {children}
    </Element>
  )
})

const CoverRoot = forwardRef<HTMLElement, RudiCoverProps>(function RudiCover(
  {
    minHeight,
    space,
    as: Element = 'div',
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const customProperties: Record<string, string> = {}
  if (minHeight) customProperties['--cover-min-height'] = minHeight
  if (space) customProperties['--cover-space'] = space

  return (
    <Element
      ref={ref}
      className={cn('rudi-cover', className)}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </Element>
  )
})

export const RudiCover = Object.assign(CoverRoot, { Centered: CoverCentered })
