import React from 'react'
import { mergeProps, useLink } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './link.css'

export interface RudiLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /**
   * `default` — inherits weight, brand color; `subtle` — muted until hover;
   * `standalone` — a self-contained link (e.g. "Learn more") with an inline icon slot.
   */
  variant?: 'default' | 'subtle' | 'standalone'
  underline?: 'always' | 'hover' | 'none'
  /** Opens in a new tab with safe `rel` and appends an external-link icon. */
  external?: boolean
  children: React.ReactNode
  className?: string
}

export const RudiLink = React.forwardRef<HTMLAnchorElement, RudiLinkProps>(
  function RudiLink(
    {
      href,
      variant = 'default',
      underline = 'hover',
      external = false,
      children,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const ref = useObjectRef(forwardedRef)
    const externalProps = external
      ? { target: '_blank', rel: 'noreferrer noopener' }
      : {}
    // useLink routes same-tab clicks through RudiRouterProvider when one is
    // mounted (client-side navigation), and is a plain link otherwise.
    const { linkProps } = useLink({ href, ...externalProps }, ref)

    return (
      <a
        {...mergeProps(rest, linkProps)}
        {...externalProps}
        ref={ref}
        href={href}
        className={cn(
          'rudi-link',
          `rudi-link--${variant}`,
          `rudi-link--underline-${underline}`,
          className,
        )}
      >
        {children}
        {external && (
          <RudiIcon
            icon="lucide:arrow-up-right"
            size="sm"
            className="rudi-link__external-icon"
          />
        )}
      </a>
    )
  },
)
