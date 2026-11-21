import { Children, forwardRef, isValidElement, useRef } from 'react'
import {
  useDialog,
  useModalOverlay,
  OverlayContainer,
  usePreventScroll,
  FocusScope,
} from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import type { OverlayTriggerState } from 'react-stately'
import { cn } from '@/utils/cn'
import { RudiIconButton } from '@/components/IconButton/IconButton'
import { RudiIcon } from '@/components/Icon/Icon'
import './dialog.css'

export interface RudiDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  isDismissable?: boolean
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export interface RudiDialogFooterProps {
  /** Action buttons, primary action last. */
  children: React.ReactNode
  className?: string
}

/** Action row pinned to the bottom of the dialog (it stays visible while the body scrolls). */
function DialogFooter({ children, className }: RudiDialogFooterProps) {
  return <div className={cn('rudi-dialog__footer', className)}>{children}</div>
}

const DialogRoot = forwardRef<HTMLDivElement, RudiDialogProps>(function RudiDialog(
  props: RudiDialogProps,
  ref,
) {
  // The panel (and its React Aria hooks) mounts only while open. useDialog
  // resolves the title id once, on mount; mounting it while closed meant the
  // title never existed at that moment and the dialog shipped with no
  // accessible name.
  if (!props.isOpen) return null
  return <RudiDialogPanel {...props} forwardedRef={ref} />
})

function RudiDialogPanel({
  onClose,
  title,
  isDismissable = true,
  size = 'md',
  children,
  className,
  forwardedRef,
}: RudiDialogProps & { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const underlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useObjectRef(forwardedRef)

  usePreventScroll()

  // Create a state object compatible with useModalOverlay
  const state: OverlayTriggerState = {
    isOpen: true,
    close: onClose,
    open: () => {},
    toggle: () => {},
    setOpen: () => {},
  }

  // dialogRef must point to the modal element (not the underlay) so that
  // useModalOverlay can correctly detect clicks outside the dialog panel.
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable },
    state,
    dialogRef,
  )

  const { dialogProps, titleProps } = useDialog({}, dialogRef)

  // RudiDialog.Footer children render after the scrolling body.
  const parts = Children.toArray(children)
  const footer = parts.filter((child) => isValidElement(child) && child.type === DialogFooter)
  const body = parts.filter((child) => !(isValidElement(child) && child.type === DialogFooter))

  return (
    <OverlayContainer>
      <div
        {...underlayProps}
        ref={underlayRef}
        className="rudi-dialog__overlay"
      >
        {/* FocusScope provides tab trapping and restores focus on close */}
        <FocusScope contain restoreFocus autoFocus>
          <div
            {...modalProps}
            {...dialogProps}
            ref={dialogRef}
            className={cn(
              'rudi-dialog',
              `rudi-dialog--${size}`,
              className,
            )}
          >
            <div className="rudi-dialog__header">
              <h2 {...titleProps} className="rudi-dialog__title">
                {title}
              </h2>
              {isDismissable && (
                <RudiIconButton aria-label="Close" variant="ghost" size="sm" onPress={onClose}>
                  <RudiIcon icon="lucide:x" />
                </RudiIconButton>
              )}
            </div>
            <div className="rudi-dialog__body">{body}</div>
            {footer}
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  )
}

export const RudiDialog = Object.assign(DialogRoot, { Footer: DialogFooter })
