import type { Meta, StoryObj } from '@storybook/react'
import { RudiStatCard } from './StatCard'

const meta = {
  title: 'Components/StatCard',
  component: RudiStatCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A composite component for displaying key metrics with optional trend indicators.',
      },
    },
  },
  args: {
    label: 'Total Revenue',
    value: '$12,450',
    delta: '+12.5%',
    trend: 'up',
    className: '',
  },
  argTypes: {
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    value: {
      control: 'text',
      table: { category: 'Content' },
    },
    delta: {
      control: 'text',
      table: { category: 'Content' },
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiStatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$12,450',
    delta: '+12.5%',
    trend: 'up',
  },
}

export const TrendDown: Story = {
  args: {
    label: 'Bounce Rate',
    value: '42.3%',
    delta: '-3.2%',
    trend: 'down',
  },
}

export const TrendNeutral: Story = {
  args: {
    label: 'Active Users',
    value: '1,024',
    delta: '0%',
    trend: 'neutral',
  },
}

export const NoDelta: Story = {
  args: {
    label: 'Total Orders',
    value: '3,842',
    delta: undefined,
  },
}

export const NumericValue: Story = {
  args: {
    label: 'Items in Stock',
    value: 1234,
    delta: '+58',
    trend: 'up',
  },
}

export const WithChildren: Story = {
  args: {
    label: 'Conversion Rate',
    value: '5.2%',
    delta: '+0.8%',
    trend: 'up',
    children: (
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--rudi-color-text-secondary, #6b7280)',
        }}
      >
        vs. last 30 days
      </span>
    ),
  },
}

export const AllTrends: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
      }}
    >
      <RudiStatCard label="Revenue" value="$12,450" delta="+12.5%" trend="up" />
      <RudiStatCard label="Bounce Rate" value="42.3%" delta="-3.2%" trend="down" />
      <RudiStatCard label="Active Users" value="1,024" delta="0%" trend="neutral" />
    </div>
  ),
}
