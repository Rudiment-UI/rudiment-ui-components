import React from 'react'
import { useObjectRef } from '@react-aria/utils'
import type { AriaButtonProps } from 'react-aria'
import { cn } from '@/utils/cn'
import { useLoadingButton } from '@/hooks/useLoadingButton'
import './icon-button.css'

/** Props for `RudiIconButton`. Also accepts React Aria's `AriaButtonProps` (`onPress`, `isDisabled`, `type`, ...). */
export interface RudiIconButtonProps extends AriaButtonProps {
  /** Accessible name. Required because the button has no visible text. */
  'aria-label': string
  /**
   * Visual emphasis: `primary` for the main action, `destructive` for irreversible actions, `ghost` for low-emphasis ones.
   * @default 'secondary'
   */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  /**
   * Button height and icon size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Sets `aria-busy` and disables the button so it cannot be pressed again. Unlike `RudiButton`, it shows no spinner.
   * @default false
   */
  isLoading?: boolean
  /** Extra class names, merged with the component's own classes. */
  className?: string
  /** The icon element, e.g. `<RudiIcon icon="mdi:close" />`. Must be a single element. */
  children: React.ReactElement
}

/**
 * A button that shows only an icon. Requires `aria-label` since there is no visible text; use `RudiButton` with `iconBefore` when a text label fits. Handle activation with `onPress`, not `onClick`.
 *
 * @example
 * <RudiIconButton aria-label="Close" onPress={close}>
 *   <RudiIcon icon="mdi:close" />
 * </RudiIconButton>
 */
export const RudiIconButton = React.forwardRef<HTMLButtonElement, RudiIconButtonProps>(
  function RudiIconButton(
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
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
          'rudi-icon-button',
          `rudi-icon-button--${variant}`,
          `rudi-icon-button--${size}`,
          className,
        )}
      >
        {children}
      </button>
    )
  },
)
