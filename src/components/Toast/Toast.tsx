import { useContext } from 'react'
import type { CSSProperties } from 'react'
import {
  UNSTABLE_ToastRegion as ToastRegion,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastStateContext as ToastStateContext,
  Text,
  type QueuedToast,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import { RudiIconButton } from '@/components/IconButton/IconButton'
import { toastQueue, type RudiToastContent, type RudiToastVariant } from './toastQueue'
import './toast.css'

/** Props for `RudiToastRegion`. */
export interface RudiToastRegionProps {
  /**
   * Where the toasts stack: the top or bottom inline-end corner of the viewport, or bottom center.
   * @default 'bottom-end'
   */
  placement?: 'top-end' | 'bottom-end' | 'bottom-center'
  /** Accessible name for the notifications landmark. Defaults to a localized "Notifications" label. */
  'aria-label'?: string
  /**
   * Accessible label of every toast's close button.
   * @default 'Close'
   */
  closeLabel?: string
  /** Class merged onto the region element. */
  className?: string
}

const VARIANT_ICON: Record<RudiToastVariant, string> = {
  info: 'lucide:info',
  success: 'lucide:circle-check',
  warning: 'lucide:triangle-alert',
  error: 'lucide:circle-alert',
}

function RudiToast({
  toast,
  closeLabel,
}: {
  toast: QueuedToast<RudiToastContent>
  closeLabel: string
}) {
  const state = useContext(ToastStateContext)
  const { title, description, variant } = toast.content

  return (
    <Toast
      toast={toast}
      className={cn('rudi-toast', `rudi-toast--${variant}`)}
      // Unique name per toast lets the View Transitions API animate each one.
      style={{ viewTransitionName: toast.key } as CSSProperties}
    >
      <RudiIcon icon={VARIANT_ICON[variant]} size="md" className="rudi-toast__icon" />
      <ToastContent className="rudi-toast__content">
        <Text slot="title" className="rudi-toast__title">
          {title}
        </Text>
        {description && (
          <Text slot="description" className="rudi-toast__description">
            {description}
          </Text>
        )}
      </ToastContent>
      <RudiIconButton
        aria-label={closeLabel}
        variant="ghost"
        size="sm"
        className="rudi-toast__close"
        onPress={() => state?.close(toast.key)}
      >
        <RudiIcon icon="lucide:x" size="sm" />
      </RudiIconButton>
    </Toast>
  )
}

/**
 * Renders toasts queued with `rudiToast`. Mount exactly one, near the app
 * root. It portals into `document.body` and renders nothing while the queue
 * is empty. The region is an ARIA landmark (F6 moves focus into it) and each
 * toast is announced to screen readers when it appears. Queue toasts with `rudiToast`, not
 * through props.
 *
 * @example
 * <RudiToastRegion placement="bottom-end" />
 */
export function RudiToastRegion({
  placement = 'bottom-end',
  'aria-label': ariaLabel,
  closeLabel = 'Close',
  className,
}: RudiToastRegionProps) {
  return (
    <ToastRegion
      queue={toastQueue}
      aria-label={ariaLabel}
      className={cn('rudi-toast-region', `rudi-toast-region--${placement}`, className)}
    >
      {({ toast }) => <RudiToast toast={toast} closeLabel={closeLabel} />}
    </ToastRegion>
  )
}
