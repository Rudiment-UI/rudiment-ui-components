import { forwardRef } from 'react'
import { addCollection, Icon as IconifyIcon, type IconifyJSON } from '@iconify/react'
import { cn } from '@/utils/cn'
import { bundledIcons } from './bundledIcons'
import './icon.css'

/**
 * Registers Iconify icon data so `RudiIcon` renders those icons on the first render, in
 * server-rendered HTML, and with no request to the Iconify API. Pass the file written by the
 * `rudiment-ui-icons` CLI. Call it once, at module scope in a file that runs on both the server
 * and the client, before anything renders. The icons the library's own components use are
 * already registered.
 * @example
 * ```tsx
 * import { registerRudiIcons } from 'rudiment-ui'
 * import icons from './rudiment-icons.json'
 *
 * registerRudiIcons(icons)
 * ```
 */
export function registerRudiIcons(icons: RudiIconData): void {
  const collections = isCollection(icons) ? [icons] : Array.isArray(icons) ? icons : Object.values(icons)
  for (const collection of collections) addCollection(collection)
}

/**
 * Iconify icon data accepted by `registerRudiIcons`: one icon set, a list of sets, or an object
 * of sets keyed by prefix (the format the `rudiment-ui-icons` CLI writes).
 */
export type RudiIconData = IconifyJSON | IconifyJSON[] | Record<string, IconifyJSON>

function isCollection(icons: RudiIconData): icons is IconifyJSON {
  return typeof (icons as IconifyJSON).prefix === 'string' && typeof (icons as IconifyJSON).icons === 'object'
}

registerRudiIcons(bundledIcons)

/** Props for `RudiIcon`. */
export interface RudiIconProps {
  /** Iconify icon name in `prefix:name` form, e.g. `"mdi:close"` or `"lucide:check"`. */
  icon: string
  /**
   * Preset size, or a number for an exact width and height in px.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | number
  /** CSS color applied to the icon. Defaults to the inherited text color (`currentColor`). */
  color?: string
  /** Accessible name. When set the icon is exposed as `role="img"`; when omitted it is hidden from assistive technology. */
  label?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Renders an Iconify icon by name (for example `"mdi:close"`). Icons are always passed as name strings, never imported components.
 * Icons registered with `registerRudiIcons` render immediately, including in server HTML. Any other icon is downloaded from the Iconify API when it first renders.
 * Decorative by default (`aria-hidden`). Pass `label` to expose it as an image with an accessible name. Forwards its ref to the wrapping `span`.
 * @example
 * ```tsx
 * <RudiIcon icon="mdi:check-circle" size="lg" label="Verified" />
 * ```
 */
export const RudiIcon = forwardRef<HTMLSpanElement, RudiIconProps>(
  function RudiIcon({ icon, size = 'md', color, label, className }, ref) {
    const sizeClass = typeof size === 'string' ? `rudi-icon--${size}` : undefined
    const inlineStyle =
      typeof size === 'number'
        ? { width: size, height: size, ...(color ? { color } : {}) }
        : color
          ? { color }
          : undefined

    return (
      <span
        ref={ref}
        className={cn('rudi-icon', sizeClass, className)}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        style={inlineStyle}
      >
        <IconifyIcon icon={icon} ssr />
      </span>
    )
  },
)
