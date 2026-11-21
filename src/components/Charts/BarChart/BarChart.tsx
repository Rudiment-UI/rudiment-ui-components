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

export interface RudiBarChartProps {
  /**
   * Row data. Values may be `null` to represent gaps in a series. Strongly-typed
   * data objects are accepted directly — no cast required.
   */
  data: Array<Record<string, string | number | null>>
  dataKeys: string[]
  indexKey: string
  layout?: 'vertical' | 'horizontal'
  stacked?: boolean
  showLegend?: boolean
  showGrid?: boolean
  height?: number
  label: string
  className?: string
}

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
