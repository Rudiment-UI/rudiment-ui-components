import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useChartTheme } from '@/hooks/useChartTheme'
import { cn } from '@/utils/cn'
import '../charts.css'

/** Props for `RudiBarChart`. */
export interface RudiBarChartProps {
  /** Row data. Values may be `null` to represent gaps in a series. Strongly-typed data objects are accepted directly, with no cast required. */
  data: Array<Record<string, string | number | null>>
  /** Keys of `data` rows to plot, one bar series each. Colors come from the chart theme in order. */
  dataKeys: string[]
  /** Key of `data` rows used for the category axis labels. */
  indexKey: string
  /**
   * `vertical` draws upright columns with categories along the x axis; `horizontal` draws sideways bars with categories along the y axis.
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal'
  /**
   * Stacks the series instead of placing them side by side.
   * @default false
   */
  stacked?: boolean
  /**
   * Shows the series legend.
   * @default true
   */
  showLegend?: boolean
  /**
   * Shows grid lines along the value axis.
   * @default true
   */
  showGrid?: boolean
  /**
   * Chart height in px.
   * @default 300
   */
  height?: number
  /** Accessible name describing the chart. */
  label: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Bar chart with one series per data key, built on Recharts and the library chart theme. Use `RudiLineChart` for trends over time.
 * `label` is required; the chart is exposed as a single `role="img"` with that name, so summarize the data in it. It fills its container's width.
 * @example
 * ```tsx
 * <RudiBarChart
 *   label="Orders per month"
 *   data={[{ month: 'Jan', orders: 12 }, { month: 'Feb', orders: 18 }]}
 *   indexKey="month"
 *   dataKeys={['orders']}
 * />
 * ```
 */
export function RudiBarChart({
  data,
  dataKeys,
  indexKey,
  layout = 'vertical',
  stacked = false,
  showLegend = true,
  showGrid = true,
  height = 300,
  label,
  className,
}: RudiBarChartProps) {
  const theme = useChartTheme()

  const isHorizontal = layout === 'horizontal'
  // Recharts gives the category axis a fixed 60px, which clips names like
  // "Economy International". Size it to the longest label instead (capped).
  const categoryWidth = isHorizontal
    ? Math.min(
        220,
        Math.max(60, ...data.map((row) => String(row[indexKey] ?? '').length * 8 + 24)),
      )
    : undefined

  return (
    <div
      className={cn('rudi-chart', className)}
      role="img"
      aria-label={label}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={isHorizontal ? 'vertical' : 'horizontal'}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.gridColor}
              // Grid lines run across the value axis only.
              vertical={isHorizontal}
              horizontal={!isHorizontal}
            />
          )}
          {isHorizontal ? (
            <>
              <XAxis type="number" tick={{ fill: theme.axisColor }} />
              <YAxis
                dataKey={indexKey}
                type="category"
                width={categoryWidth}
                tick={{ fill: theme.axisColor }}
              />
            </>
          ) : (
            <>
              <XAxis dataKey={indexKey} tick={{ fill: theme.axisColor }} />
              <YAxis tick={{ fill: theme.axisColor }} />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              color: theme.tooltipText,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: '0.375rem',
            }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ color: theme.legendColor }}
              // Recharts colours each label like its series; keep the swatch coloured
              // and the text readable (series hues can fall well under 4.5:1).
              formatter={(value) => <span style={{ color: theme.legendColor }}>{value}</span>}
            />
          )}
          {dataKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={theme.colors[i % theme.colors.length]}
              stackId={stacked ? 'stack' : undefined}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
