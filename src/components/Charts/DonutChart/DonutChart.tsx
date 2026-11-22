import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useChartTheme } from '@/hooks/useChartTheme'
import { cn } from '@/utils/cn'
import '../charts.css'

/** One slice of a `RudiDonutChart`. */
export interface RudiDonutChartDatum {
  /** Slice name, used in the legend, tooltip, and slice labels. */
  name: string
  /** Size of the slice, relative to the sum of all values. */
  value: number
}

/** Props for `RudiDonutChart`. */
export interface RudiDonutChartProps {
  /** Slices to draw, in order. */
  data: RudiDonutChartDatum[]
  /**
   * Radius of the center hole in px. The ring is 30px thick.
   * @default 60
   */
  innerRadius?: number
  /**
   * Shows each slice's name beside it.
   * @default false
   */
  showLabels?: boolean
  /**
   * Shows the legend.
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
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/**
 * Donut chart showing parts of a whole, built on Recharts and the library chart theme. Slice colors come from the chart theme in order.
 * `label` is required; the chart is exposed as a single `role="img"` with that name, so summarize the data in it.
 * @example
 * ```tsx
 * <RudiDonutChart label="Tickets by status" data={[{ name: 'Open', value: 14 }, { name: 'Closed', value: 52 }]} />
 * ```
 */
export function RudiDonutChart({
  data,
  innerRadius = 60,
  showLabels = false,
  showLegend = true,
  height = 300,
  label,
  className,
}: RudiDonutChartProps) {
  const theme = useChartTheme()

  return (
    <div
      className={cn('rudi-chart', className)}
      role="img"
      aria-label={label}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={innerRadius + 30}
            paddingAngle={2}
            label={showLabels ? ({ name }) => name : false}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={theme.colors[i % theme.colors.length]}
              />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
