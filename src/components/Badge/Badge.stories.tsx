import type { Meta, StoryObj } from '@storybook/react'
import { RudiBadge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: RudiBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small labeling component for status indicators, counts, and categorization.',
      },
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    children: 'Badge',
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      table: { category: 'Appearance' },
    },
    dot: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A neutral badge. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use a badge for status, counts or categories such as "New", "3" or "Beta". Keep the label to one or two short words, and pair the variant color with that text so the meaning does not rely on color alone.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiBadge variant="default">Default</RudiBadge>
      <RudiBadge variant="success">Success</RudiBadge>
      <RudiBadge variant="warning">Warning</RudiBadge>
      <RudiBadge variant="error">Error</RudiBadge>
      <RudiBadge variant="info">Info</RudiBadge>
    </div>
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `sm` inside dense rows and table cells, and `md` elsewhere.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiBadge size="sm">Small</RudiBadge>
      <RudiBadge size="md">Medium</RudiBadge>
    </div>
  ),
}

export const DotIndicator: Story = {
  name: 'Dot indicator',
  parameters: {
    docs: {
      description: {
        story:
          'Set `dot` for a minimal indicator such as unread notifications. Still pass children ("3 unread"): they are hidden visually but announced to screen readers.',
      },
    },
  },
  args: {
    variant: 'success',
    dot: true,
    children: '3 unread',
  },
}
