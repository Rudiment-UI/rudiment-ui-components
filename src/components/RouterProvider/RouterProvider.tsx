import { RouterProvider } from 'react-aria'

/**
 * Connects Rudi links (`RudiLink`, `RudiNavItem`, `RudiBreadcrumb`) to your router for client-side
 * navigation. Pass your router's `navigate` function, and optionally `useHref` for base paths.
 *
 * ```tsx
 * const navigate = useNavigate()
 * <RudiRouterProvider navigate={navigate} useHref={useHref}>…</RudiRouterProvider>
 * ```
 *
 * Without it, links work as ordinary full-page links.
 */
export const RudiRouterProvider = RouterProvider

/** Props for `RudiRouterProvider`: `navigate`, optional `useHref`, and `children`. */
export type RudiRouterProviderProps = React.ComponentProps<typeof RouterProvider>
