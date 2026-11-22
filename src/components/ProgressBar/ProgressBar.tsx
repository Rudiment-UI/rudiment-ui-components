import { useProgressBar } from 'react-aria'
import { cn } from '@/utils/cn'
import './progress-bar.css'

/** Semantic color of the progress fill. */
export type RudiProgressBarVariant = 'default' | 'success' | 'warning' | 'error'

/** Switches the fill color once progress reaches a percentage. */
export interface RudiProgressBarThreshold {
  /** Minimum percentage (0–100) at which this variant takes effect. */
  at: number
  /** Fill variant used once `at` is reached. */
  variant: RudiProgressBarVariant
}

/** Props for `RudiProgressBar`. */
export interface RudiProgressBarProps {
  /** Current progress, between `minValue` and `maxValue`. */
  value: number
  /**
   * Value that represents 0%.
   * @default 0
   */
  minValue?: number
  /**
   * Value that represents 100%.
   * @default 100
   */
  maxValue?: number
  /** Accessible name, also displayed above the bar. */
  label: string
  /**
   * Shows the rounded percentage beside the label.
   * @default false
   */
  showValueLabel?: boolean
  /**
   * Fill color when no threshold applies.
   * @default 'default'
   */
  variant?: RudiProgressBarVariant
  /**
   * Percentage-driven fill color. The highest `at` the current percentage meets or exceeds wins; below every threshold the `variant` prop applies.
   * e.g. `[{ at: 80, variant: 'warning' }, { at: 100, variant: 'error' }]`.
   */
  thresholds?: RudiProgressBarThreshold[]
  /**
   * Thickness of the track.
   * @default 'md'
   */
  size?: 'sm' | 'md'
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/** Resolve the active fill variant from the current percentage. */
function resolveVariant(
  percentage: number,
  variant: RudiProgressBarVariant,
  thresholds?: RudiProgressBarThreshold[],
): RudiProgressBarVariant {
  if (!thresholds || thresholds.length === 0) return variant
  const match = [...thresholds]
    .sort((a, b) => b.at - a.at)
    .find((t) => percentage >= t.at)
  return match ? match.variant : variant
}

/**
 * Horizontal bar showing determinate progress. Use `RudiCircularProgress` for a compact circular form.
 * `label` is required and is the accessible name; it is also shown above the bar. The fill is clamped to 0 to 100%.
 * @example
 * ```tsx
 * <RudiProgressBar label="Storage used" value={72} showValueLabel thresholds={[{ at: 90, variant: 'error' }]} />
 * ```
 */
export function RudiProgressBar({
  value,
  minValue = 0,
  maxValue = 100,
  label,
  showValueLabel = false,
  variant = 'default',
  thresholds,
  size = 'md',
  className,
}: RudiProgressBarProps) {
  const { progressBarProps, labelProps } = useProgressBar({
    label,
    value,
    minValue,
    maxValue,
  })

  const range = maxValue - minValue
  const rawPercentage = range === 0 ? 0 : ((value - minValue) / range) * 100
  const percentage = Math.min(100, Math.max(0, rawPercentage))
  const activeVariant = resolveVariant(percentage, variant, thresholds)

  return (
    <div
      {...progressBarProps}
      className={cn('rudi-progress', className)}
    >
      <div className="rudi-progress__label-row">
        <span {...labelProps} className="rudi-progress__label">
          {label}
        </span>
        {showValueLabel && (
          <span className="rudi-progress__value">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div
        className={cn(
          'rudi-progress__track',
          `rudi-progress__track--${size}`,
        )}
      >
        <div
          className={cn(
            'rudi-progress__bar',
            `rudi-progress__bar--${activeVariant}`,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
