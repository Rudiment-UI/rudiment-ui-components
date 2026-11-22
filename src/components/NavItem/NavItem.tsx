import React, { forwardRef } from 'react'
import { useButton, useLink } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './nav-item.css'

export interface RudiNavItemProps {
  /** Visible text and accessible name of the item. */
  label: string
  /** Iconify icon name shown before the label, such as `"mdi:home"`. */
  icon?: string
  /** Marks the item as the current location and applies the active style; sets `aria-current`. */
  isActive?: boolean
  /** Renders the item as a link to this URL; without it the item is a button. Routes client-side under `RudiRouterProvider`. */
  href?: string
  /** Called when the item is activated by pointer, keyboard, or touch. Use this, not `onClick`. */
  onPress?: () => void
  /** Content shown after the label, such as a count. */
  badge?: React.ReactNode
  /** Prevents interaction and applies the disabled style. */
  isDisabled?: boolean
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

function getClasses(isActive: boolean, className?: string) {
  return cn(
    'rudi-nav-item',
    isActive && 'rudi-nav-item--active',
    className,
  )
}

function renderContent(
  icon?: string,
  label?: string,
  badge?: React.ReactNode,
) {
  return (
    <>
      {icon && <RudiIcon icon={icon} className="rudi-nav-item__icon" />}
      <span className="rudi-nav-item__label">{label}</span>
      {badge && <span className="rudi-nav-item__badge">{badge}</span>}
    </>
  )
}

const NavItemLink = forwardRef<HTMLAnchorElement, RudiNavItemProps>(
  function NavItemLink(
    { label, icon, isActive = false, href, onPress, badge, isDisabled = false, className },
    forwardedRef,
  ) {
    const ref = useObjectRef(forwardedRef)
    const { linkProps } = useLink(
      { href, isDisabled, onPress: onPress as () => void },
      ref,
    )

    return (
      <a
        {...linkProps}
        ref={ref}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={getClasses(isActive, className)}
      >
        {renderContent(icon, label, badge)}
      </a>
    )
  },
)

const NavItemButton = forwardRef<HTMLButtonElement, RudiNavItemProps>(
  function NavItemButton(
    { label, icon, isActive = false, onPress, badge, isDisabled = false, className },
    forwardedRef,
  ) {
    const ref = useObjectRef(forwardedRef)
    const { buttonProps } = useButton(
      { onPress, isDisabled },
      ref,
    )

    return (
      <button
        {...buttonProps}
        ref={ref}
        aria-current={isActive ? 'true' : undefined}
        className={getClasses(isActive, className)}
      >
        {renderContent(icon, label, badge)}
      </button>
    )
  },
)

/**
 * Navigation entry for a sidebar: an `a` when `href` is set, otherwise a `button`. Use it inside `RudiAppShell.Sidebar`; it does not spread DOM props. The ref points to whichever element renders.
 *
 * @example
 * <RudiNavItem label="Projects" icon="mdi:folder" href="/projects" isActive />
 */
export const RudiNavItem = forwardRef<HTMLElement, RudiNavItemProps>(
  function RudiNavItem(props, forwardedRef) {
    if (props.href) {
      return (
        <NavItemLink
          {...props}
          ref={forwardedRef as React.ForwardedRef<HTMLAnchorElement>}
        />
      )
    }
    return (
      <NavItemButton
        {...props}
        ref={forwardedRef as React.ForwardedRef<HTMLButtonElement>}
      />
    )
  },
)
