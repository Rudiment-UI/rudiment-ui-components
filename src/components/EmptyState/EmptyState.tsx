import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { RudiIcon } from '../Icon/Icon'
import { RudiHeading } from '../../typography/Heading/Heading'
import { RudiText } from '../../typography/Text/Text'
import './empty-state.css'

/** Props for `RudiEmptyState`. */
export interface RudiEmptyStateProps {
  /** Iconify icon name shown above the title. Decorative. Ignored when `illustration` is set. */
  icon?: string
  /** Image URL for a spot illustration shown above the title in place of `icon`. Decorative (`alt=""`); its width follows `size` and its height is automatic. */
  illustration?: string
  /** Short statement of what is empty, e.g. "No shipments yet". */
  title: string
  /** Supporting text explaining why, or what to do next. */
  description?: ReactNode
  /** Call to action, e.g. a `RudiButton`. */
  action?: ReactNode
  /**
   * Semantic heading level for the title.
   * @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * `sm` for table cells and cards, `md` for page sections.
   * @default 'md'
   */
  size?: 'sm' | 'md'
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Placeholder for a view, table, or card with no content, explaining why and offering a next step, with an optional `icon` or spot `illustration` above the title. Forwards its ref to the root `div`.
 * The title renders as a heading, so set `headingLevel` to fit the surrounding outline.
 * @example
 * ```tsx
 * <RudiEmptyState
 *   icon="lucide:inbox"
 *   title="No shipments yet"
 *   description="Shipments appear here once an order is placed."
 *   action={<RudiButton onPress={create}>New order</RudiButton>}
 * />
 * ```
 */
export const RudiEmptyState = forwardRef<HTMLDivElement, RudiEmptyStateProps>(
  function RudiEmptyState(
    { icon, illustration, title, description, action, headingLevel = 3, size = 'md', className },
    ref,
  ) {
    return (
      <div ref={ref} className={cn('rudi-empty-state', `rudi-empty-state--${size}`, className)}>
        {illustration ? (
          <img src={illustration} alt="" className="rudi-empty-state__illustration" />
        ) : (
          icon && <RudiIcon icon={icon} className="rudi-empty-state__icon" />
        )}
        <RudiHeading
          level={headingLevel}
          size={size === 'sm' ? 6 : 5}
          align="center"
          noMargin
          className="rudi-empty-state__title"
        >
          {title}
        </RudiHeading>
        {description != null && (
          <RudiText
            as={typeof description === 'string' ? 'p' : 'div'}
            variant={size === 'sm' ? 'body-sm' : 'body'}
            tone="subtle"
            align="center"
            noMargin
            className="rudi-empty-state__description"
          >
            {description}
          </RudiText>
        )}
        {action != null && <div className="rudi-empty-state__action">{action}</div>}
      </div>
    )
  },
)
