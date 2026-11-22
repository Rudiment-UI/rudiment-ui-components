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
    dot: false,
    children: 'Badge',
    className: '',
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
  args: {
    variant: 'default',
    children: 'Default',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const DotIndicator: Story = {
  args: {
    variant: 'success',
    dot: true,
  },
}

export const AllVariants: Story = {
  render: ({}) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiBadge variant="default">Default</RudiBadge>
      <RudiBadge variant="success">Success</RudiBadge>
      <RudiBadge variant="warning">Warning</RudiBadge>
      <RudiBadge variant="error">Error</RudiBadge>
      <RudiBadge variant="info">Info</RudiBadge>
    </div>
  ),
}
