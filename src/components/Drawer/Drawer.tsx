import { Children, forwardRef, isValidElement } from 'react'
import {
  useDialog,
  useModalOverlay,
  OverlayContainer,
  usePreventScroll,
  FocusScope,
} from 'react-aria'
import { useExitAnimation, useObjectRef } from '@react-aria/utils'
import type { OverlayTriggerState } from 'react-stately'
import { cn } from '@/utils/cn'
import { RudiIconButton } from '@/components/IconButton/IconButton'
import { RudiIcon } from '@/components/Icon/Icon'
import './drawer.css'

/** Props for `RudiDrawer`. */
export interface RudiDrawerProps {
  /** Controls visibility. The drawer is controlled only; it slides out and unmounts when this becomes `false`. */
  isOpen: boolean
  /** Called when the user dismisses the drawer (close button, Escape, or a click on the backdrop). Set `isOpen` to `false` here. */
  onClose: () => void
  /** Heading text. Rendered as the `h2` that gives the drawer its accessible name. */
  title: string
  /**
   * Edge the drawer slides in from. Logical, so `'end'` is the right edge in left-to-right
   * layouts and the left edge in right-to-left ones.
   * @default 'end'
   */
  placement?: 'start' | 'end'
  /**
   * Panel width. The panel never grows wider than the viewport.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Allows closing with the header close button, Escape and a backdrop click. When `false`, none
   * of those close it and the close button is hidden, so provide an action in a `RudiDrawer.Footer`.
   * @default true
   */
  isDismissable?: boolean
  /** Drawer body. A `RudiDrawer.Footer` child is pulled out and pinned below the scrolling body. */
  children: React.ReactNode
  /**
   * Accessible label of the header close button.
   * @default 'Close'
   */
  closeLabel?: string
  /** Class merged onto the drawer panel. */
  className?: string
}

/** Props for `RudiDrawer.Footer`. */
export interface RudiDrawerFooterProps {
  /** Action buttons, primary action last. */
  children: React.ReactNode
  /** Class merged onto the footer element. */
  className?: string
}

/** Action row pinned to the bottom of the drawer (it stays visible while the body scrolls). */
function DrawerFooter({ children, className }: RudiDrawerFooterProps) {
  return <div className={cn('rudi-drawer__footer', className)}>{children}</div>
}

const DrawerRoot = forwardRef<HTMLDivElement, RudiDrawerProps>(function RudiDrawer(props, ref) {
  const panelRef = useObjectRef(ref)
  // Keeps the panel mounted after isOpen turns false until its slide-out
  // animation finishes. With no running animation (reduced motion, jsdom) it
  // unmounts on the next render.
  const isExiting = useExitAnimation(panelRef, props.isOpen)
  // The panel mounts only while shown: useDialog resolves the title id on
  // mount, so mounting it closed would leave the drawer without a name.
  if (!props.isOpen && !isExiting) return null
  return <RudiDrawerPanel {...props} panelRef={panelRef} isExiting={isExiting} />
})

function RudiDrawerPanel({
  onClose,
  title,
  placement = 'end',
  size = 'md',
  isDismissable = true,
  closeLabel = 'Close',
  children,
  className,
  panelRef,
  isExiting,
}: RudiDrawerProps & {
  panelRef: React.RefObject<HTMLDivElement | null>
  isExiting: boolean
}) {
  usePreventScroll()

  const state: OverlayTriggerState = {
    isOpen: true,
    close: onClose,
    open: () => {},
    toggle: () => {},
    setOpen: () => {},
  }

  // panelRef points at the panel (not the backdrop) so useModalOverlay treats
  // a click on the backdrop as an outside click.
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: isDismissable && !isExiting, isKeyboardDismissDisabled: !isDismissable || isExiting },
    state,
    panelRef,
  )
  const { dialogProps, titleProps } = useDialog({}, panelRef)

  const parts = Children.toArray(children)
  const footer = parts.filter((child) => isValidElement(child) && child.type === DrawerFooter)
  const body = parts.filter((child) => !(isValidElement(child) && child.type === DrawerFooter))

  return (
    <OverlayContainer>
      <div
        {...underlayProps}
        className={cn('rudi-drawer__overlay', `rudi-drawer__overlay--${placement}`)}
        data-exiting={isExiting || undefined}
      >
        {/* Traps Tab inside the panel and returns focus to the trigger on unmount. */}
        <FocusScope contain restoreFocus autoFocus>
          <div
            {...modalProps}
            {...dialogProps}
            ref={panelRef}
            className={cn(
              'rudi-drawer',
              `rudi-drawer--${placement}`,
              `rudi-drawer--${size}`,
              className,
            )}
            data-exiting={isExiting || undefined}
          >
            <div className="rudi-drawer__header">
              <h2 {...titleProps} className="rudi-drawer__title">
                {title}
              </h2>
              {isDismissable && (
                <RudiIconButton aria-label={closeLabel} variant="ghost" size="sm" onPress={onClose}>
                  <RudiIcon icon="lucide:x" />
                </RudiIconButton>
              )}
            </div>
            <div className="rudi-drawer__body">{body}</div>
            {footer}
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  )
}

/**
 * Modal panel that slides in from the start or end edge of the viewport, full height, with a
 * title, scrolling body and optional pinned footer. Use it for detail views, filters and edit
 * forms that need more room than a `RudiDialog` but should keep the page in view. It traps focus,
 * restores focus on close, locks page scroll, and slides out before unmounting (no motion under
 * `prefers-reduced-motion`). It is controlled: you own `isOpen` and must clear it in `onClose`.
 * `title` is required and is the accessible name. Put action buttons in `RudiDrawer.Footer`,
 * primary action last. The forwarded ref points at the drawer panel element.
 *
 * @example
 * <RudiDrawer isOpen={open} onClose={() => setOpen(false)} title="Edit shipment">
 *   <RudiInput label="Reference" />
 *   <RudiDrawer.Footer>
 *     <RudiButton variant="secondary" onPress={() => setOpen(false)}>Cancel</RudiButton>
 *     <RudiButton onPress={handleSave}>Save</RudiButton>
 *   </RudiDrawer.Footer>
 * </RudiDrawer>
 */
export const RudiDrawer = Object.assign(DrawerRoot, {
  /** Action row pinned to the bottom of the drawer; primary action last. */
  Footer: DrawerFooter,
})
