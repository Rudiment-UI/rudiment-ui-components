import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { RudiIcon } from '../Icon/Icon'
import { RudiHeading } from '../../typography/Heading/Heading'
import { RudiText } from '../../typography/Text/Text'
import './empty-state.css'

export interface RudiEmptyStateProps {
  /** Iconify icon name shown above the title. Decorative. */
  icon?: string
  /** Short statement of what is empty, e.g. "No shipments yet". */
  title: string
  /** Supporting text explaining why, or what to do next. */
  description?: ReactNode
  /** Call to action, e.g. a `RudiButton`. */
  action?: ReactNode
  /** Semantic heading level for the title. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** `sm` for table cells and cards, `md` for page sections. Defaults to `md`. */
  size?: 'sm' | 'md'
  className?: string
}

export const RudiEmptyState = forwardRef<HTMLDivElement, RudiEmptyStateProps>(
  function RudiEmptyState(
    { icon, title, description, action, headingLevel = 3, size = 'md', className },
    ref,
  ) {
    return (
      <div ref={ref} className={cn('rudi-empty-state', `rudi-empty-state--${size}`, className)}>
        {icon && <RudiIcon icon={icon} className="rudi-empty-state__icon" />}
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
