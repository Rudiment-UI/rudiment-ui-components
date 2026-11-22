import { useRef, useState } from 'react'
import { useButton } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './alert.css'

/** Props for `RudiAlert`. */
export interface RudiAlertProps {
  /** Sets the semantic color and meaning of the alert. */
  variant: 'info' | 'success' | 'warning' | 'error'
  /** Bold heading shown above the content. */
  title?: string
  /** Iconify icon name shown at the inline-start, e.g. `"mdi:alert"`. Decorative and hidden from assistive technology. */
  icon?: string
  /**
   * Uses `role="status"` (polite announcement) instead of `role="alert"` (assertive).
   * @default false
   */
  isPolite?: boolean
  /**
   * Shows a close button labelled "Dismiss alert". The alert hides itself when it is pressed.
   * @default false
   */
  dismissible?: boolean
  /** Called after the user dismisses the alert. */
  onDismiss?: () => void
  /** Content at the inline-end of the alert, e.g. a button. Wraps below the text when space is tight. */
  action?: React.ReactNode
  /** Message body. */
  children: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Inline message banner for status, feedback, or warnings that sit within the page content. Use `RudiTag` or `RudiBadge` for short labels, and a dialog for messages that must interrupt the user.
 * Renders `role="alert"` by default, which announces assertively; set `isPolite` for non-urgent updates. Dismissal is internal: once dismissed the alert unmounts and stays hidden until the component remounts.
 * @example
 * ```tsx
 * <RudiAlert variant="warning" title="Storage almost full" dismissible>
 *   You have used 92% of your quota.
 * </RudiAlert>
 * ```
 */
export function RudiAlert({
  variant,
  title,
  icon,
  isPolite = false,
  dismissible = false,
  onDismiss,
  action,
  children,
  className,
}: RudiAlertProps) {
  const [dismissed, setDismissed] = useState(false)
  const dismissRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: dismissProps } = useButton(
    {
      'aria-label': 'Dismiss alert',
      onPress: () => {
        setDismissed(true)
        onDismiss?.()
      },
    },
    dismissRef,
  )

  if (dismissed) return null

  const body = (
    <div className="rudi-alert__body">
      {title && <p className="rudi-alert__title">{title}</p>}
      <div className="rudi-alert__content">{children}</div>
    </div>
  )

  return (
    <div
      role={isPolite ? 'status' : 'alert'}
      className={cn(
        'rudi-alert',
        `rudi-alert--${variant}`,
        icon && 'rudi-alert--has-icon',
        dismissible && 'rudi-alert--dismissible',
        className,
      )}
    >
      {icon && (
        <RudiIcon icon={icon} size="md" className="rudi-alert__icon" aria-hidden="true" />
      )}
      {action != null ? (
        <div className="rudi-alert__main">
          {body}
          <div className="rudi-alert__action">{action}</div>
        </div>
      ) : (
        body
      )}
      {dismissible && (
        <button ref={dismissRef} {...dismissProps} className="rudi-alert__dismiss">
          <RudiIcon icon="mdi:close" size="sm" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
