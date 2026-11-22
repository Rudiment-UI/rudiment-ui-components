import React from 'react'
import { cn } from '@/utils/cn'
import '../charts.css'

/** Props for `RudiSparkline`. */
export interface RudiSparklineProps {
  /** Values in order, plotted left to right and scaled to fit the height. */
  data: number[]
  /** Accessible name, e.g. "Temperature over the last 24 hours". */
  label: string
  /** Fixed width in px, or any CSS length when a string. Defaults to filling the container. */
  width?: number | string
  /** Fixed height in px, or any CSS length when a string. Defaults to the sparkline height token (2.5rem). */
  height?: number | string
  /** Draws a dashed horizontal reference line; the y domain always includes it. */
  threshold?: number
  /**
   * Semantic color of the line.
   * @default 'neutral'
   */
  tone?: 'neutral' | 'brand' | 'error' | 'success'
  /**
   * Draws a dot on the last point.
   * @default false
   */
  showEndpoint?: boolean
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

// The SVG is drawn in a 100 x 100 box and stretched (preserveAspectRatio="none"). Strokes and dots use
// vector-effect="non-scaling-stroke" so they stay crisp and round at any size.
const BOX = 100
const PAD_Y = 6

/**
 * Tiny axis-less line for showing a trend inside a card, table cell, or sentence. Plain SVG with no Recharts dependency. Use `RudiLineChart` when the reader needs axes or tooltips.
 * `label` is required and is the accessible name. Non-finite values in `data` are dropped. A single point is drawn as a dot.
 * @example
 * ```tsx
 * <RudiSparkline label="Temperature over the last 24 hours" data={[4, 5, 7, 6, 8]} tone="brand" showEndpoint />
 * ```
 */
export function RudiSparkline({
  data,
  label,
  width,
  height,
  threshold,
  tone = 'neutral',
  showEndpoint = false,
  className,
}: RudiSparklineProps) {
  const values = data.filter((v) => Number.isFinite(v))
  const hasThreshold = threshold != null && Number.isFinite(threshold)
  const domain = hasThreshold ? [...values, threshold as number] : values

  let min = domain.length ? Math.min(...domain) : 0
  let max = domain.length ? Math.max(...domain) : 1
  if (min === max) {
    min -= 1
    max += 1
  }

  const y = (v: number) =>
    BOX - PAD_Y - ((v - min) / (max - min)) * (BOX - PAD_Y * 2)
  const x = (i: number) =>
    values.length === 1 ? BOX / 2 : (i / (values.length - 1)) * BOX

  const points = values.map((v, i) => [x(i), y(v)] as const)
  const path = points
    .map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(2)} ${py.toFixed(2)}`)
    .join(' ')
  const last = points[points.length - 1]
  const dot = last && (showEndpoint || points.length === 1)

  const style: React.CSSProperties = {}
  if (width != null) style.width = width
  if (height != null) style.blockSize = height

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${BOX} ${BOX}`}
      preserveAspectRatio="none"
      className={cn(
        'rudi-sparkline',
        `rudi-sparkline--${tone}`,
        width != null && 'rudi-sparkline--fixed-width',
        className,
      )}
      style={style}
    >
      {hasThreshold && (
        <line
          className="rudi-sparkline__threshold"
          x1={0}
          x2={BOX}
          y1={y(threshold as number)}
          y2={y(threshold as number)}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {points.length > 1 && (
        <path
          className="rudi-sparkline__line"
          d={path}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {dot && (
        <path
          className="rudi-sparkline__endpoint"
          d={`M${last[0]} ${last[1]}h0`}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  )
}
