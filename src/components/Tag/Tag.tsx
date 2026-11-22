import { useRef, useState } from 'react'
import { useButton } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './tag.css'

/** Props for `RudiTag`. */
export interface RudiTagProps {
  /**
   * Semantic color of the tag.
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  /**
   * Shows a remove control that hides the tag when pressed.
   * @default false
   */
  dismissible?: boolean
  /** Called after the user removes the tag. Not called when `isDisabled` is set. */
  onDismiss?: () => void
  /** Makes the tag's content a button; called when it is pressed. Without it the tag is static text. The remove control stays a separate sibling button. */
  onPress?: () => void
  /**
   * Disables the tag's press behavior and its remove control, and marks it `aria-disabled`.
   * @default false
   */
  isDisabled?: boolean
  /** Tag content, usually a short string. */
  children: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Compact label for a keyword, filter, or selection. Becomes a button when `onPress` is set (the tag stays a non-interactive wrapper around two sibling buttons), and shows a remove control when `dismissible`. Use `RudiBadge` for status that is never interactive.
 * Dismissal is internal: the tag unmounts after the remove control is pressed. The remove button is labelled "Remove {children}" when `children` is a string, otherwise "Remove".
 * @example
 * ```tsx
 * <RudiTag variant="info" dismissible onDismiss={() => removeFilter('open')}>
 *   Open
 * </RudiTag>
 * ```
 */
export function RudiTag({
  variant = 'default',
  dismissible = false,
  onDismiss,
  onPress,
  isDisabled = false,
  children,
  className,
}: RudiTagProps) {
  const [dismissed, setDismissed] = useState(false)
  const tagRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const { buttonProps: tagButtonProps } = useButton(
    { onPress, isDisabled },
    tagRef,
  )

  const { buttonProps: closeButtonProps } = useButton(
    {
      isDisabled,
      'aria-label':
        typeof children === 'string' ? `Remove ${children}` : 'Remove',
      onPress: () => {
        setDismissed(true)
        onDismiss?.()
      },
    },
    closeRef,
  )

  if (dismissed) {
    return null
  }

  return (
    <span
      className={cn(
        'rudi-tag',
        `rudi-tag--${variant}`,
        onPress && 'rudi-tag--interactive',
        dismissible && 'rudi-tag--dismissible',
        className,
      )}
      {...(isDisabled ? { 'aria-disabled': 'true' } : {})}
    >
      {onPress ? (
        <button ref={tagRef} {...tagButtonProps} className="rudi-tag__main">
          {children}
        </button>
      ) : (
        children
      )}
      {dismissible && (
        <button ref={closeRef} {...closeButtonProps} className="rudi-tag__close">
          <RudiIcon icon="mdi:close" size="sm" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}
