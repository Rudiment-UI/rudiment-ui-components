import React, { createContext, forwardRef, useContext, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { RudiIconButton } from '@/components/IconButton/IconButton'
import { RudiIcon } from '@/components/Icon/Icon'
import './app-shell.css'

interface AppShellContextValue {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  sidebarId: string
  menuButtonRef: React.RefObject<HTMLSpanElement | null>
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

function useAppShell() {
  const ctx = useContext(AppShellContext)
  if (!ctx) {
    throw new Error(
      'RudiAppShell subcomponents must be rendered inside <RudiAppShell>.',
    )
  }
  return ctx
}

export interface RudiAppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled open state of the responsive sidebar drawer, which is only visible below the 900px breakpoint. Pair with `onSidebarOpenChange`. */
  isSidebarOpen?: boolean
  /** Called when the drawer requests an open-state change. */
  onSidebarOpenChange?: (open: boolean) => void
  /**
   * Initial open state when uncontrolled.
   *
   * @default false
   */
  defaultSidebarOpen?: boolean
  /** `RudiAppShell.Sidebar` and `RudiAppShell.Content`, plus any other layout children. */
  children: React.ReactNode
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

export interface RudiAppShellSidebarProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Overrides the sidebar width; any CSS length. Falls back to the `--rudi-component-app-shell-sidebar-width` token. */
  width?: string
  /**
   * Accessible name of the `aside` landmark; give it a specific name when the page has other complementary landmarks.
   *
   * @default 'Sidebar'
   */
  'aria-label'?: string
  /** Navigation and other sidebar content, such as `RudiNavItem` entries. */
  children: React.ReactNode
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

export interface RudiAppShellContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The top bar and `RudiAppShell.Main`. */
  children: React.ReactNode
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

export interface RudiAppShellMainProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Max width of the centered content column; any CSS length. Falls back to the `--rudi-component-app-shell-main-max-width` token. */
  maxWidth?: string
  /** Padding around the content column; any CSS length. Falls back to the `--rudi-component-app-shell-main-padding` token. */
  padding?: string
  /** Page content; it is wrapped in an inner column limited by `maxWidth`. */
  children: React.ReactNode
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

/** Props for `RudiAppShell.MenuButton`. The button takes no other DOM props. */
export interface RudiAppShellMenuButtonProps {
  /**
   * Accessible name of the button.
   *
   * @default 'Open navigation'
   */
  'aria-label'?: string
  /**
   * Iconify icon name for the hamburger.
   *
   * @default 'lucide:menu'
   */
  icon?: string
  /** Extra class names for the wrapper element, merged with the built-in classes. */
  className?: string
}

const AppShellRoot = forwardRef<HTMLDivElement, RudiAppShellProps>(
  function RudiAppShell(
    {
      isSidebarOpen,
      onSidebarOpenChange,
      defaultSidebarOpen = false,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultSidebarOpen)
    const isControlled = isSidebarOpen !== undefined
    const open = isControlled ? isSidebarOpen : uncontrolledOpen

    const sidebarId = useId()
    const menuButtonRef = useRef<HTMLSpanElement>(null)

    const setSidebarOpen = (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onSidebarOpenChange?.(next)
    }

    // Escape closes the drawer and returns focus to the menu button.
    useEffect(() => {
      if (!open) return
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return
        if (!isControlled) setUncontrolledOpen(false)
        onSidebarOpenChange?.(false)
        menuButtonRef.current?.querySelector('button')?.focus()
      }
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }, [open, isControlled, onSidebarOpenChange])

    return (
      <AppShellContext.Provider
        value={{
          isSidebarOpen: open,
          setSidebarOpen,
          toggleSidebar: () => setSidebarOpen(!open),
          sidebarId,
          menuButtonRef,
        }}
      >
        <div
          ref={ref}
          className={cn(
            'rudi-app-shell',
            open && 'rudi-app-shell--sidebar-open',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AppShellContext.Provider>
    )
  },
)

function AppShellSidebar({
  width,
  className,
  style,
  children,
  'aria-label': ariaLabel = 'Sidebar',
  ...props
}: RudiAppShellSidebarProps) {
  const { isSidebarOpen, setSidebarOpen, sidebarId } = useAppShell()
  const customProperties: Record<string, string> = {}
  if (width) customProperties['--sidebar-width'] = width

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className="rudi-app-shell__backdrop"
        onClick={() => setSidebarOpen(false)}
        tabIndex={isSidebarOpen ? 0 : -1}
      />
      <aside
        id={sidebarId}
        className={cn('rudi-app-shell__sidebar', className)}
        aria-label={ariaLabel}
        style={{ ...customProperties, ...style } as React.CSSProperties}
        {...props}
      >
        {children}
      </aside>
    </>
  )
}

function AppShellContent({
  className,
  children,
  ...props
}: RudiAppShellContentProps) {
  return (
    <div className={cn('rudi-app-shell__content', className)} {...props}>
      {children}
    </div>
  )
}

function AppShellMain({
  maxWidth,
  padding,
  className,
  style,
  children,
  ...props
}: RudiAppShellMainProps) {
  const customProperties: Record<string, string> = {}
  if (maxWidth) customProperties['--app-shell-main-max-width'] = maxWidth
  if (padding) customProperties['--app-shell-main-padding'] = padding

  return (
    <main
      className={cn('rudi-app-shell__main', className)}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      <div className="rudi-app-shell__main-inner">{children}</div>
    </main>
  )
}

function AppShellMenuButton({
  'aria-label': ariaLabel = 'Open navigation',
  icon = 'lucide:menu',
  className,
}: RudiAppShellMenuButtonProps) {
  const { toggleSidebar, isSidebarOpen, sidebarId, menuButtonRef } = useAppShell()
  return (
    <span ref={menuButtonRef} className={cn('rudi-app-shell__menu', className)}>
      <RudiIconButton
        aria-label={ariaLabel}
        aria-expanded={isSidebarOpen}
        aria-controls={sidebarId}
        variant="ghost"
        onPress={toggleSidebar}
      >
        <RudiIcon icon={icon} />
      </RudiIconButton>
    </span>
  )
}

/**
 * Application frame with a sidebar and a content area; below 900px the sidebar becomes a drawer that Escape and the backdrop close. Compose it from `RudiAppShell.Sidebar` and `RudiAppShell.Content` (put `RudiTopBar` and `RudiAppShell.Main` inside Content). Use `RudiSidebar` for a simple two-panel layout inside a page instead. The parts throw if rendered outside it. Open state is uncontrolled unless `isSidebarOpen` is set. Other DOM props go on the root `div`.
 *
 * @example
 * <RudiAppShell>
 *   <RudiAppShell.Sidebar aria-label="Main">
 *     <RudiNavItem label="Home" icon="mdi:home" href="/" />
 *   </RudiAppShell.Sidebar>
 *   <RudiAppShell.Content>
 *     <RudiTopBar start={<RudiAppShell.MenuButton />} />
 *     <RudiAppShell.Main>Page</RudiAppShell.Main>
 *   </RudiAppShell.Content>
 * </RudiAppShell>
 */
export const RudiAppShell = Object.assign(AppShellRoot, {
  /** Navigation drawer (an `aside`) shown inline on wide screens and as a slide-over below 900px; renders its own backdrop. */
  Sidebar: AppShellSidebar,
  /** Column beside the sidebar that holds the top bar and the main area. */
  Content: AppShellContent,
  /** The page's `main` landmark; centers its children in a padded column with a max width. */
  Main: AppShellMain,
  /** Hamburger button that toggles the sidebar drawer; place it in the top bar's `start` slot. Escape returns focus to it. */
  MenuButton: AppShellMenuButton,
})
