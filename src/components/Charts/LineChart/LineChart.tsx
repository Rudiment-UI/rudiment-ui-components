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

export interface RudiLineChartProps {
  /**
   * Row data. Values may be `null` to represent gaps in a series (e.g. a
   * burndown line that stops partway through the sprint). Strongly-typed data
   * objects are accepted directly — no cast required.
   */
  data: Array<Record<string, string | number | null>>
  dataKeys: string[]
  indexKey: string
  curved?: boolean
  showDots?: boolean
  showGrid?: boolean
  showLegend?: boolean
  height?: number
  label: string
  /** Horizontal guide lines, e.g. a temperature set-point or a target. */
  referenceLines?: RudiChartReferenceLine[]
  /** Y-axis range; use `'auto'` for either end. Keeps reference lines in view. */
  yDomain?: [number | 'auto', number | 'auto']
  /** Unit suffix for y-axis ticks and tooltip values, e.g. `°C`. */
  unit?: string
  className?: string
}

export interface RudiChartReferenceLine {
  y: number
  label: string
  tone?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

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
