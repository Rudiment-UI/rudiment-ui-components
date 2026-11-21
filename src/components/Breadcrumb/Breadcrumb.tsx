import React, { useRef } from 'react'
import { useLink } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './breadcrumb.css'

export interface RudiBreadcrumbItem {
  label: string
  href?: string
}

export interface RudiBreadcrumbProps {
  items: RudiBreadcrumbItem[]
  /** Iconify name for the separator between items. */
  separator?: string
  /** Accessible label for the nav landmark. */
  label?: string
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
