import React, { useRef } from 'react'
import { useLink } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './breadcrumb.css'

/** One entry in a `RudiBreadcrumb` trail. */
export interface RudiBreadcrumbItem {
  /** Text shown for the crumb. */
  label: string
  /** Link target. Without it the crumb renders as plain text. */
  href?: string
}

/** Props for `RudiBreadcrumb`. */
export interface RudiBreadcrumbProps {
  /** Trail entries in order, from root to current page. */
  items: RudiBreadcrumbItem[]
  /**
   * Iconify name for the separator between items.
   * @default 'lucide:chevron-right'
   */
  separator?: string
  /**
   * Accessible label for the nav landmark.
   * @default 'Breadcrumb'
   */
  label?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/** A crumb link; routes client-side through RudiRouterProvider when one is mounted. */
function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { linkProps } = useLink({ href }, ref)
  return (
    <a {...linkProps} ref={ref} href={href} className="rudi-breadcrumb__link">
      {children}
    </a>
  )
}

/**
 * Navigation trail showing where the current page sits in a hierarchy. Items are ordered root first; the last item is always rendered as the current page (`aria-current="page"`) and is not a link, even if it has an `href`.
 * Links route client-side when a `RudiRouterProvider` is mounted.
 * @example
 * ```tsx
 * <RudiBreadcrumb
 *   items={[{ label: 'Home', href: '/' }, { label: 'Orders', href: '/orders' }, { label: 'Order 1042' }]}
 * />
 * ```
 */
export function RudiBreadcrumb({
  items,
  separator = 'lucide:chevron-right',
  label = 'Breadcrumb',
  className,
}: RudiBreadcrumbProps) {
  return (
    <nav aria-label={label} className={cn('rudi-breadcrumb', className)}>
      <ol className="rudi-breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="rudi-breadcrumb__item">
              {isLast || !item.href ? (
                <span
                  className="rudi-breadcrumb__current"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
              {!isLast && (
                <RudiIcon
                  icon={separator}
                  size="sm"
                  className="rudi-breadcrumb__separator"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
