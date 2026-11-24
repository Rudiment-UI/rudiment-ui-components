import type { Meta, StoryObj } from '@storybook/react'
import { RudiLineChart } from './LineChart'

const sampleData = [
  { month: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
  { month: 'Feb', revenue: 3000, profit: 1398, expenses: 1602 },
  { month: 'Mar', revenue: 5000, profit: 3200, expenses: 1800 },
  { month: 'Apr', revenue: 2780, profit: 1908, expenses: 872 },
  { month: 'May', revenue: 1890, profit: 800, expenses: 1090 },
  { month: 'Jun', revenue: 2390, profit: 1200, expenses: 1190 },
]

const meta = {
  title: 'Components/Charts/LineChart',
  component: RudiLineChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A token-aware line chart wrapper around Recharts. Supports multiple series, curved and linear interpolation, and automatic dark mode theming via design tokens.',
      },
    },
  },
  args: {
    data: sampleData,
    dataKeys: ['revenue'],
    indexKey: 'month',
    label: 'Revenue over time',
    curved: true,
    showDots: true,
    showGrid: true,
    showLegend: true,
    height: 300,
  },
  argTypes: {
    referenceLines: {
      control: 'object',
      table: { category: 'Content' },
    },
    yDomain: { control: 'object', table: { category: 'Layout' } },
    unit: { control: 'text', table: { category: 'Content' } },
    curved: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    showDots: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    showGrid: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    showLegend: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    height: {
      control: 'number',
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof RudiLineChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Show how one value changes over time. This chart is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
}

export const MultipleSeries: Story = {
  name: 'Multiple series',
  parameters: {
    docs: {
      description: {
        story:
          'List several keys in `dataKeys` to compare related measures on one time axis. Keep the series to 8 or fewer so each keeps a distinct token color.',
      },
    },
  },
  args: {
    dataKeys: ['revenue', 'profit', 'expenses'],
    label: 'Financial overview',
  },
}

export const LineStyles: Story = {
  name: 'Line styles',
  parameters: {
    docs: {
      description: {
        story:
          'Compare the options for how the line is drawn. Use straight segments (`curved={false}`) when readers should not infer values between readings, and drop the dots with `showDots={false}` for dense data. Strip the grid, legend and dots for a bare trend.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <RudiLineChart {...args} curved={false} label="Revenue with straight segments" />
      <RudiLineChart {...args} showDots={false} label="Revenue without dots" />
      <RudiLineChart
        {...args}
        showGrid={false}
        showLegend={false}
        showDots={false}
        label="Revenue, minimal"
      />
    </div>
  ),
}

export const Thresholds: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mark a set-point or target with `referenceLines`, and set `yDomain` so the line stays in view. Without it the axis may scale to the data and push the threshold off the chart. Use `unit` to label values.',
      },
    },
  },
  args: {
    data: [
      { time: '00:00', probe: -191.2 },
      { time: '04:00', probe: -190.6 },
      { time: '08:00', probe: -143.8 },
      { time: '12:00', probe: -189.9 },
      { time: '16:00', probe: -191.0 },
    ],
    dataKeys: ['probe'],
    indexKey: 'time',
    label: 'Probe temperature against the alert set-point',
    unit: '°C',
    yDomain: [-200, -100],
    referenceLines: [{ y: -150, label: 'Set-point', tone: 'error' }],
    showLegend: false,
  },
}
