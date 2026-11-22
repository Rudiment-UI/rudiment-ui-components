import type { ReactNode } from 'react'
import { Tab as AriaTab, type TabProps as AriaTabProps } from 'react-aria-components'
import { cn } from '@/utils/cn'
import { RudiIcon } from '../Icon/Icon'

/** Props for `RudiTab`. Inherits `isDisabled` and `href` from React Aria's `Tab`. */
export interface RudiTabProps
  extends Omit<AriaTabProps, 'className' | 'style' | 'children' | 'id'> {
  /** Unique key; matches the `id` of the corresponding `RudiTabPanel`. */
  id: string
  /** Tab label. */
  children: ReactNode
  /** Iconify icon name rendered before the label. */
  icon?: string
  /** Trailing content after the label, e.g. a count `RudiBadge`. Part of the accessible name. */
  badge?: ReactNode
  /** Class merged onto the tab element. */
  className?: string
}

/**
 * A single tab in a `RudiTabList`. Its `id` must match the `id` of the `RudiTabPanel` it controls.
 *
 * @example
 * <RudiTab id="pending" icon="mdi:clock-outline" badge={7}>Pending</RudiTab>
 */
export function RudiTab({ id, icon, badge, className, children, ...props }: RudiTabProps) {
  return (
    <AriaTab {...props} id={id} className={cn('rudi-tab', className)}>
      {icon && <RudiIcon icon={icon} className="rudi-tab__icon" />}
      <span className="rudi-tab__label">{children}</span>
      {badge != null && badge !== false && (
        <>
          {/* Whitespace keeps the accessible name readable ("Pending 7", not "Pending7");
              it collapses visually inside the flex container. */}
          {' '}
          <span className="rudi-tab__badge">{badge}</span>
        </>
      )}
    </AriaTab>
  )
}
