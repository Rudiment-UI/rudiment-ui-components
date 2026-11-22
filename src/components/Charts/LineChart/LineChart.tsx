import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useChartTheme } from '@/hooks/useChartTheme'
import { cn } from '@/utils/cn'
import '../charts.css'

/** Props for `RudiLineChart`. */
export interface RudiLineChartProps {
  /** Row data. Values may be `null` to represent gaps in a series (e.g. a burndown line that stops partway through the sprint). Strongly-typed data objects are accepted directly, with no cast required. */
  data: Array<Record<string, string | number | null>>
  /** Keys of `data` rows to plot, one line each. Colors come from the chart theme in order. */
  dataKeys: string[]
  /** Key of `data` rows used for the x axis labels. */
  indexKey: string
  /**
   * Draws smoothed lines instead of straight segments.
   * @default true
   */
  curved?: boolean
  /**
   * Draws a dot at each data point.
   * @default true
   */
  showDots?: boolean
  /**
   * Shows grid lines.
   * @default true
   */
  showGrid?: boolean
  /**
   * Shows the series legend.
   * @default true
   */
  showLegend?: boolean
  /**
   * Chart height in px.
   * @default 300
   */
  height?: number
  /** Accessible name describing the chart. */
  label: string
  /**
   * Horizontal guide lines, e.g. a temperature set-point or a target. The y axis extends to keep them in view.
   * @default []
   */
  referenceLines?: RudiChartReferenceLine[]
  /** Y-axis range; use `'auto'` for either end. Keeps reference lines in view. */
  yDomain?: [number | 'auto', number | 'auto']
  /** Unit suffix for y-axis ticks and tooltip values, e.g. `°C`. */
  unit?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/** A horizontal guide line drawn across a `RudiLineChart`. */
export interface RudiChartReferenceLine {
  /** Value on the y axis where the line is drawn. */
  y: number
  /** Text shown on the line, at its top inline-end. */
  label: string
  /**
   * Semantic color of the line and its label.
   * @default 'default'
   */
  tone?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

/**
 * Line chart with one series per data key, built on Recharts and the library chart theme. Use `RudiBarChart` to compare categories.
 * `label` is required; the chart is exposed as a single `role="img"` with that name, so summarize the data in it. It fills its container's width.
 * @example
 * ```tsx
 * <RudiLineChart
 *   label="Temperature over 24 hours"
 *   data={readings}
 *   indexKey="time"
 *   dataKeys={['temp']}
 *   unit="°C"
 *   referenceLines={[{ y: 8, label: 'Set point', tone: 'warning' }]}
 * />
 * ```
 */
export function RudiLineChart({
  data,
  dataKeys,
  indexKey,
  curved = true,
  showDots = true,
  showGrid = true,
  showLegend = true,
  height = 300,
  label,
  referenceLines = [],
  yDomain,
  unit,
  className,
}: RudiLineChartProps) {
  const theme = useChartTheme()

  return (
    <div
      className={cn('rudi-chart', className)}
      role="img"
      aria-label={label}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.gridColor}
            />
          )}
          <XAxis dataKey={indexKey} tick={{ fill: theme.axisColor }} />
          <YAxis tick={{ fill: theme.axisColor }} domain={yDomain} unit={unit} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              color: theme.tooltipText,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: '0.375rem',
            }}
            formatter={unit ? (value) => `${value}${unit}` : undefined}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ color: theme.legendColor }}
              // Recharts colours each label like its series; keep the swatch coloured
              // and the text readable (series hues can fall well under 4.5:1).
              formatter={(value) => <span style={{ color: theme.legendColor }}>{value}</span>}
            />
          )}
          {referenceLines.map((line) => (
            <ReferenceLine
              key={`${line.y}-${line.label}`}
              y={line.y}
              stroke={theme.tones[line.tone ?? 'default']}
              strokeDasharray="6 4"
              ifOverflow="extendDomain"
              label={{ value: line.label, position: 'insideTopRight', fill: theme.tones[line.tone ?? 'default'] }}
            />
          ))}
          {dataKeys.map((key, i) => (
            <Line
              key={key}
              type={curved ? 'monotone' : 'linear'}
              dataKey={key}
              stroke={theme.colors[i % theme.colors.length]}
              dot={showDots}
              strokeWidth={2}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
