import type { Meta, StoryObj } from '@storybook/react'
import { RudiAvatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: RudiAvatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A user representation component with image support, initials fallback, and optional status indicator.',
      },
    },
  },
  args: {
    name: 'John Doe',
    size: 'md',
    src: '',
    alt: '',
    status: undefined,
    className: '',
  },
  argTypes: {
    src: {
      control: 'text',
      table: { category: 'Content' },
    },
    alt: {
      control: 'text',
      table: { category: 'Content' },
    },
    name: {
      control: 'text',
      table: { category: 'Content' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    status: {
      control: 'select',
      options: [undefined, 'success', 'warning', 'error', 'info'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = {
  args: {
    name: 'John Doe',
  },
}

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/100',
    alt: 'User avatar',
    name: 'John Doe',
  },
}

export const SmallSize: Story = {
  args: {
    size: 'sm',
    name: 'John Doe',
  },
}

export const MediumSize: Story = {
  args: {
    size: 'md',
    name: 'John Doe',
  },
}

export const LargeSize: Story = {
  args: {
    size: 'lg',
    name: 'John Doe',
  },
}

export const WithStatus: Story = {
  args: {
    name: 'John Doe',
    status: 'success',
  },
}

export const SingleName: Story = {
  args: {
    name: 'Alice',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiAvatar name="John Doe" size="sm" />
      <RudiAvatar name="John Doe" size="md" />
      <RudiAvatar name="John Doe" size="lg" />
    </div>
  ),
}

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiAvatar name="John Doe" status="success" />
      <RudiAvatar name="John Doe" status="warning" />
      <RudiAvatar name="John Doe" status="error" />
      <RudiAvatar name="John Doe" status="info" />
    </div>
  ),
}
