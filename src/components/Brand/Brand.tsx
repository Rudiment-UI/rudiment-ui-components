import React, { useRef } from 'react'
import { useLink } from 'react-aria'
import { cn } from '@/utils/cn'
import './brand.css'

export interface RudiBrandProps {
  /** Product or company name. Always the accessible name; visible unless `hideName`. */
  name: string
  /** Logo mark (an icon, `<svg>` or `<img>`). Decorative: hidden from assistive tech. */
  mark?: React.ReactNode
  /** Hide the visible name when the mark already includes the wordmark. */
  hideName?: boolean
  /** Makes the lockup a link (usually home). Routes client-side under `RudiRouterProvider`. */
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function BrandContent({ name, mark, hideName }: Pick<RudiBrandProps, 'name' | 'mark' | 'hideName'>) {
  return (
    <>
      {mark != null && (
        <span className="rudi-brand__mark" aria-hidden="true">
          {mark}
        </span>
      )}
      <span className={cn('rudi-brand__name', hideName && 'rudi-brand__name--hidden')}>{name}</span>
    </>
  )
}

function BrandLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { linkProps } = useLink({ href }, ref)
  return (
    <a {...linkProps} ref={ref} href={href} className={className}>
      {children}
    </a>
  )
}

/** Logo lockup: a mark plus the product name, optionally linking home. */
export function RudiBrand({ name, mark, hideName = false, href, size = 'md', className }: RudiBrandProps) {
  const classes = cn('rudi-brand', `rudi-brand--${size}`, href && 'rudi-brand--link', className)
  const content = <BrandContent name={name} mark={mark} hideName={hideName} />
  return href ? (
    <BrandLink href={href} className={classes}>
      {content}
    </BrandLink>
  ) : (
    <span className={classes}>{content}</span>
  )
}
