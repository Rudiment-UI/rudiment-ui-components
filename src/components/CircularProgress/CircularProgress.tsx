import { useProgressBar } from 'react-aria'
import { cn } from '@/utils/cn'
import './circular-progress.css'

/** Props for `RudiCircularProgress`. */
export interface RudiCircularProgressProps {
  /** Current progress, between `minValue` and `maxValue`. Values outside that range are clamped, and the ring shows 0% when the range is empty. */
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
  /** Accessible name of the progress indicator. */
  label: string
  /**
   * Shows the rounded percentage in the center. Ignored when `children` is provided.
   * @default false
   */
  showValueLabel?: boolean
  /**
   * Semantic color of the ring.
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'error'
  /**
   * Diameter of the ring.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /** Custom content for the center of the ring; replaces the percentage text. */
  children?: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

const VIEWBOX_SIZE = 100
const CENTER = VIEWBOX_SIZE / 2

/**
 * Ring showing determinate progress, with optional content in the center. Use `RudiProgressBar` for a linear form.
 * `label` is required; it is the accessible name and is also rendered as visible text below the ring.
 * @example
 * ```tsx
 * <RudiCircularProgress label="Profile complete" value={65} showValueLabel />
 * ```
 */
export function RudiCircularProgress({
  value,
  minValue = 0,
  maxValue = 100,
  label,
  showValueLabel = false,
  variant = 'default',
  size = 'md',
  children,
  className,
}: RudiCircularProgressProps) {
  const range = maxValue - minValue
  const clampedValue = range <= 0 ? minValue : Math.min(maxValue, Math.max(minValue, value))
  const { progressBarProps, labelProps } = useProgressBar({
    label,
    value: clampedValue,
    valueLabel: range === 0 ? '0%' : undefined,
    minValue,
    maxValue,
  })

  const rawPercentage = range === 0 ? 0 : ((clampedValue - minValue) / range) * 100
  const percentage = Math.min(100, Math.max(0, rawPercentage))
  const strokeWidth = 8
  const radius = (VIEWBOX_SIZE - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percentage / 100)

  return (
    <div
      {...progressBarProps}
      className={cn(
        'rudi-circular-progress',
        `rudi-circular-progress--${size}`,
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="rudi-circular-progress__svg"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={radius}
          className="rudi-circular-progress__track"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={radius}
          className={cn(
            'rudi-circular-progress__fill',
            `rudi-circular-progress__fill--${variant}`,
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="rudi-circular-progress__center">
        {children ?? (showValueLabel && (
          <span className="rudi-circular-progress__value">
            {Math.round(percentage)}%
          </span>
        ))}
      </div>
      <span {...labelProps} className="rudi-circular-progress__label">
        {label}
      </span>
    </div>
  )
}
