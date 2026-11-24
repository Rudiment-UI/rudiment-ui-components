import type { Meta, StoryObj } from '@storybook/react'
import { RudiDonutChart } from './DonutChart'

const sampleData = [
  { name: 'Desktop', value: 4200 },
  { name: 'Mobile', value: 3100 },
  { name: 'Tablet', value: 800 },
  { name: 'Other', value: 300 },
]

const meta = {
  title: 'Components/Charts/DonutChart',
  component: RudiDonutChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A token-aware donut chart wrapper around Recharts. Displays part-to-whole relationships with configurable inner radius and automatic dark mode theming via design tokens.',
      },
    },
  },
  args: {
    data: sampleData,
    label: 'Traffic by device',
    innerRadius: 60,
    showLabels: false,
    showLegend: true,
    height: 300,
  },
  argTypes: {
    innerRadius: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      table: { category: 'Appearance' },
    },
    showLabels: {
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
} satisfies Meta<typeof RudiDonutChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Show how a whole divides into a few parts, such as traffic by device. This chart is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
}

export const WithLabels: Story = {
  name: 'With labels',
  parameters: {
    docs: {
      description: {
        story:
          'Set `showLabels` to print values on the segments when readers need numbers and not only proportions.',
      },
    },
  },
  args: {
    showLabels: true,
    label: 'Traffic by device with labels',
  },
}

export const RingThickness: Story = {
  name: 'Ring thickness',
  parameters: {
    docs: {
      description: {
        story:
          'Compare `innerRadius` values: a thicker ring (lower value) makes segments easier to see, a thinner one (higher value) looks lighter and leaves room for a center figure.',
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
      }}
    >
      <RudiDonutChart {...args} innerRadius={30} label="Traffic, thick ring" />
      <RudiDonutChart {...args} innerRadius={80} label="Traffic, thin ring" />
    </div>
  ),
}

export const ManySegments: Story = {
  name: 'Many segments',
  parameters: {
    docs: {
      description: {
        story:
          'A donut supports up to 8 segments before colors repeat. With this many, consider grouping the smallest into "Other" or using a bar chart so values can be compared.',
      },
    },
  },
  args: {
    data: [
      { name: 'Chrome', value: 6200 },
      { name: 'Safari', value: 2800 },
      { name: 'Firefox', value: 1200 },
      { name: 'Edge', value: 900 },
      { name: 'Opera', value: 400 },
      { name: 'Brave', value: 300 },
      { name: 'Arc', value: 200 },
      { name: 'Other', value: 100 },
    ],
    label: 'Browser market share',
  },
}
