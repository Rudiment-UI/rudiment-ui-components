import type { Meta, StoryObj } from '@storybook/react'
import { RudiStatCard } from './StatCard'
import { RudiGrid } from '../../layouts/Grid/Grid'

const meta = {
  title: 'Components/Data/StatCard',
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
  parameters: {
    docs: {
      description: {
        story:
          'Show one metric with a descriptive `label` and a prominent `value`. A number without a label ("12,450") has no meaning on its own. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Trends: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `trend` to match `delta`. It controls the color, the icon and the screen reader text ("Increased +12.5%"). The default, `neutral`, reads as "No change". Use `trendLabel` to reword or translate that text.',
      },
    },
  },
  render: (args) => (
    <RudiGrid minCellWidth="12rem" space="content">
      <RudiStatCard
        {...args}
        label="Revenue"
        value="$12,450"
        delta="+12.5%"
        trend="up"
      />
      <RudiStatCard
        {...args}
        label="Bounce rate"
        value="42.3%"
        delta="-3.2%"
        trend="down"
      />
      <RudiStatCard
        {...args}
        label="Active users"
        value="1,024"
        delta="0%"
        trend="neutral"
      />
    </RudiGrid>
  ),
}

export const ValueOnly: Story = {
  name: 'Value only',
  parameters: {
    docs: {
      description: {
        story:
          'Leave out `delta` when there is nothing to compare against. `value` accepts a number as well as a formatted string.',
      },
    },
  },
  render: (args) => (
    <RudiGrid minCellWidth="12rem" space="content">
      <RudiStatCard
        label="Total orders"
        value="3,842"
        className={args.className}
      />
      <RudiStatCard
        label="Items in stock"
        value={1234}
        className={args.className}
      />
    </RudiGrid>
  ),
}

export const WithContext: Story = {
  name: 'With context',
  parameters: {
    docs: {
      description: {
        story:
          'Pass children to add context under the value, such as the comparison period. Use StatCard for numbers and KPIs, not paragraphs.',
      },
    },
  },
  args: {
    label: 'Conversion rate',
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
