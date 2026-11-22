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

/** Props for `RudiDialog`. */
export interface RudiDialogProps {
  /** Controls visibility. The dialog is controlled only; it renders nothing while `false`. */
  isOpen: boolean
  /** Called when the user dismisses the dialog (close button, Escape, or outside click). Set `isOpen` to `false` here. */
  onClose: () => void
  /** Heading text. Rendered as the `h2` that gives the dialog its accessible name. */
  title: string
  /**
   * Allows closing with the header close button, Escape and outside click. When `false`, none of
   * those close it and the close button is hidden, so provide an action in a `RudiDialog.Footer`.
   * @default true
   */
  isDismissable?: boolean
  /**
   * Panel width.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /** Dialog body. A `RudiDialog.Footer` child is pulled out and pinned below the scrolling body. */
  children: React.ReactNode
  /**
   * Accessible label of the header close button.
   * @default 'Close'
   */
  closeLabel?: string
  /** Class merged onto the dialog panel. */
  className?: string
}

/** Props for `RudiDialog.Footer`. */
export interface RudiDialogFooterProps {
  /** Action buttons, primary action last. */
  children: React.ReactNode
  /** Class merged onto the footer element. */
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
  closeLabel = 'Close',
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
    { isDismissable, isKeyboardDismissDisabled: !isDismissable },
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
                <RudiIconButton aria-label={closeLabel} variant="ghost" size="sm" onPress={onClose}>
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

/**
 * Modal dialog with a title, scrolling body and optional pinned footer. Use it for focused tasks
 * and confirmations that block the page; it traps focus, restores focus on close, and locks page
 * scroll. It is controlled: you own `isOpen` and must clear it in `onClose`. `title` is required
 * and is the accessible name. Put action buttons in `RudiDialog.Footer`, primary action last.
 * The forwarded ref points at the dialog panel element.
 *
 * @example
 * <RudiDialog isOpen={open} onClose={() => setOpen(false)} title="Delete shipment">
 *   <p>This cannot be undone.</p>
 *   <RudiDialog.Footer>
 *     <RudiButton variant="secondary" onPress={() => setOpen(false)}>Cancel</RudiButton>
 *     <RudiButton variant="destructive" onPress={handleDelete}>Delete</RudiButton>
 *   </RudiDialog.Footer>
 * </RudiDialog>
 */
export const RudiDialog = Object.assign(DialogRoot, {
  /** Action row pinned to the bottom of the dialog; primary action last. */
  Footer: DialogFooter,
})
