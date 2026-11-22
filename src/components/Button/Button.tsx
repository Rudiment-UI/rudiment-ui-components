import React from 'react'
import { useObjectRef } from '@react-aria/utils'
import type { AriaButtonProps } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import { useLoadingButton } from '@/hooks/useLoadingButton'
import './button.css'

/** Props for `RudiButton`. Also accepts React Aria's `AriaButtonProps` (`onPress`, `isDisabled`, `type`, `aria-label`, ...). */
export interface RudiButtonProps extends AriaButtonProps {
  /**
   * Visual emphasis: `primary` for the main action, `destructive` for irreversible actions, `ghost` for low-emphasis ones.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  /**
   * Button height and text size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Replaces the icons with a spinner, sets `aria-busy`, and disables the button so it cannot be pressed again.
   * @default false
   */
  isLoading?: boolean
  /**
   * Iconify name shown before the label, e.g. `"mdi:plus"`. Not rendered while `isLoading`.
   */
  iconBefore?: string
  /**
   * Iconify name shown after the label, e.g. `"mdi:arrow-right"`. Not rendered while `isLoading`.
   */
  iconAfter?: string
  /** Extra class names, merged with the component's own classes. */
  className?: string
  /**
   * Button label, rendered in a `span`. It is the accessible name unless `aria-label` is set.
   */
  children: React.ReactNode
}

/**
 * A text button built on React Aria's `useButton`. Use it for actions on the page (save, delete, open a dialog); use a link for navigation. Handle activation with `onPress`, not `onClick`. For an icon-only button use `RudiIconButton`.
 *
 * @example
 * <RudiButton variant="primary" iconBefore="mdi:plus" onPress={addItem}>
 *   Add item
 * </RudiButton>
 */
export const RudiButton = React.forwardRef<HTMLButtonElement, RudiButtonProps>(
  function RudiButton(
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      iconBefore,
      iconAfter,
      className,
      children,
      ...ariaProps
    },
    forwardedRef,
  ) {
    const ref = useObjectRef(forwardedRef)
    const { buttonProps } = useLoadingButton(ariaProps, isLoading, ref)

    return (
      <button
        {...buttonProps}
        ref={ref}
        className={cn(
          'rudi-button',
          `rudi-button--${variant}`,
          `rudi-button--${size}`,
          isLoading && 'rudi-button--loading',
          className,
        )}
      >
        {isLoading ? (
          <>
            <span className="rudi-button__spinner" role="img" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {iconBefore && <RudiIcon icon={iconBefore} size={size} className="rudi-button__icon" />}
            <span>{children}</span>
            {iconAfter && <RudiIcon icon={iconAfter} size={size} className="rudi-button__icon" />}
          </>
        )}
      </button>
    )
  },
)
