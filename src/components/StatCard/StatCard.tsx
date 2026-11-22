import { VisuallyHidden } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import { RudiCard } from '@/components/Card/Card'
import './stat-card.css'

/** Props for `RudiStatCard`. */
export interface RudiStatCardProps {
  /** Name of the metric, shown above the value. */
  label: string
  /** The headline figure. */
  value: string | number
  /** Change text such as `"+4.2%"`, colored by `trend`. */
  delta?: string
  /**
   * Direction of the change; sets the delta color and shows a trend icon next to it.
   * @default 'neutral'
   */
  trend?: 'up' | 'down' | 'neutral'
  /**
   * Screen-reader text for the trend, read before `delta`. Defaults to "Increased", "Decreased" or "No change" by `trend`.
   */
  trendLabel?: string
  /** Extra content below the value, such as a `RudiSparkline`. */
  children?: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

const TREND_ICON = {
  up: 'lucide:trending-up',
  down: 'lucide:trending-down',
  neutral: 'lucide:minus',
} as const

const TREND_LABEL = {
  up: 'Increased',
  down: 'Decreased',
  neutral: 'No change',
} as const

/**
 * Outlined card showing one headline metric with an optional change indicator. Built on `RudiCard`.
 * The trend is shown by color and an icon, and announced to screen readers (see `trendLabel`).
 * @example
 * ```tsx
 * <RudiStatCard label="Revenue" value="$48,200" delta="+4.2%" trend="up" />
 * ```
 */
export function RudiStatCard({
  label,
  value,
  delta,
  trend = 'neutral',
  trendLabel,
  children,
  className,
}: RudiStatCardProps) {
  return (
    <RudiCard
      variant="outlined"
      padding="md"
      className={cn('rudi-stat-card', className)}
    >
      <RudiCard.Body>
        <span className="rudi-stat-card__label">{label}</span>
        <span className="rudi-stat-card__value">{value}</span>
        {delta && (
          <span
            className={cn(
              'rudi-stat-card__delta',
              `rudi-stat-card__delta--${trend}`,
            )}
          >
            {trend && (
              <RudiIcon icon={TREND_ICON[trend]} size="sm" className="rudi-stat-card__trend-icon" />
            )}
            <VisuallyHidden>{trendLabel ?? TREND_LABEL[trend]} </VisuallyHidden>
            {delta}
          </span>
        )}
        {children && (
          <div className="rudi-stat-card__extra">{children}</div>
        )}
      </RudiCard.Body>
    </RudiCard>
  )
}
