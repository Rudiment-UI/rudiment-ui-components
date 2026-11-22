import React from 'react'
import { mergeProps, useLink } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './link.css'

/** Props for `RudiLink`. Also accepts any native anchor attribute, which is spread onto the `a` element. */
export interface RudiLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destination URL. */
  href: string
  /**
   * `default` inherits weight and uses the brand color; `subtle` is muted until hover; `standalone` is a self-contained link (e.g. "Learn more") in a heavier weight, laid out inline-flex so an icon child sits beside the text.
   * @default 'default'
   */
  variant?: 'default' | 'subtle' | 'standalone'
  /**
   * When the underline is drawn.
   * @default 'hover'
   */
  underline?: 'always' | 'hover' | 'none'
  /**
   * Opens in a new tab with safe `rel` and appends an external-link icon.
   * @default false
   */
  external?: boolean
  /** Link text or content. */
  children: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Styled anchor for navigation. Use `RudiButton` for actions that do not navigate.
 * Same-tab clicks route client-side when a `RudiRouterProvider` is mounted, and behave as a plain link otherwise. With `external`, the link opens in a new tab with `rel="noreferrer noopener"` and shows an arrow icon. Forwards its ref to the `a`.
 * @example
 * ```tsx
 * <RudiLink href="https://example.com/docs" external>
 *   Read the docs
 * </RudiLink>
 * ```
 */
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
