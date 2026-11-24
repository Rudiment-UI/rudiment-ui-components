import type { Meta, StoryObj } from '@storybook/react'
import { RudiSparkline } from './Sparkline'

const data = [4.2, 4.6, 5.1, 4.8, 5.9, 6.4, 6.1, 7.2, 6.8, 7.5]

const meta = {
  title: 'Components/Charts/Sparkline',
  component: RudiSparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small inline trend line drawn in SVG, for table rows and stat tiles. It has no axes or tooltip, so give it a descriptive `label`.',
      },
    },
  },
  args: { data, label: 'Temperature over the last 10 readings', tone: 'neutral' },
  argTypes: {
    data: { control: 'object', table: { category: 'Content' } },
    label: { control: 'text', table: { category: 'Content' } },
    width: { control: 'number', table: { category: 'Layout' } },
    height: { control: 'number', table: { category: 'Layout' } },
    threshold: { control: 'number', table: { category: 'Content' } },
    tone: { control: 'select', options: ['neutral', 'brand', 'error', 'success'], table: { category: 'Appearance' } },
    showEndpoint: { control: 'boolean', table: { category: 'Appearance' } },
    className: { control: 'text', table: { category: 'Appearance' } },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '16rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RudiSparkline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A small trend inside a card, table cell or sentence. It has no axes or tooltip, so give it a descriptive `label`. The controls in the API reference below change this example.',
      },
    },
  },
}

export const Threshold: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `threshold` to draw a reference level and `showEndpoint` to highlight the latest reading. Use a sparkline for a glanceable trend, and switch to `RudiLineChart` when readers need axes, tooltips or exact values.',
      },
    },
  },
  args: { threshold: 6, tone: 'error', showEndpoint: true },
}

export const StatusTones: Story = {
  name: 'Status tones',
  parameters: {
    docs: {
      description: {
        story:
          'Pick `tone` to match what the trend means, such as `error` for a rising failure rate. Do not rely on color alone; pair it with a `label` or nearby text.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {(['neutral', 'brand', 'error', 'success'] as const).map((tone) => (
        <RudiSparkline key={tone} data={data} tone={tone} label={`${tone} trend`} showEndpoint />
      ))}
    </div>
  ),
}

export const InATableCell: Story = {
  name: 'In a table cell',
  parameters: {
    docs: {
      description: {
        story:
          'Set a fixed `width` and `height` so every row lines up, for example 96 by 24 pixels in a table column.',
      },
    },
  },
  args: { width: 96, height: 24, showEndpoint: true },
}

export const SparseData: Story = {
  name: 'Sparse data',
  parameters: {
    docs: {
      description: {
        story:
          'A single point draws a lone dot, and no data leaves an empty box that still carries its `label`. Neither shows a trend, so put that state into the label ("No data yet") or show a placeholder instead.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <RudiSparkline data={[5]} label="Single reading" />
      <RudiSparkline data={[]} label="No readings yet" />
    </div>
  ),
}
