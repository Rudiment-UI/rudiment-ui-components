import type { Meta, StoryObj } from '@storybook/react'
import { RudiButton } from './Button'

const meta = {
  title: 'Components/Button',
  component: RudiButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A clickable button for triggering actions. Supports four visual styles, three sizes, and loading and disabled states.',
      },
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    isLoading: false,
    isDisabled: false,
    children: 'Button',
    iconBefore: '',
    iconAfter: '',
    className: '',
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    iconBefore: {
      control: 'text',
      table: { category: 'Content' },
    },
    iconAfter: {
      control: 'text',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    isLoading: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled and non-interactive',
      table: { category: 'State' },
    },
    onPress: {
      action: 'pressed',
      description: 'Called when the button is pressed',
      table: { category: 'Events' },
    },
    onPressStart: {
      action: 'pressStarted',
      description: 'Called when a press interaction starts',
      table: { category: 'Events' },
    },
    onPressEnd: {
      action: 'pressEnded',
      description: 'Called when a press interaction ends',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Save changes',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete account',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Learn more',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Saving…',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: 'Unavailable',
  },
}

export const WithIconBefore: Story = {
  args: {
    iconBefore: 'mdi:plus',
    children: 'Add item',
  },
}

export const WithIconAfter: Story = {
  args: {
    iconAfter: 'mdi:arrow-right',
    children: 'Next',
  },
}

export const WithBothIcons: Story = {
  args: {
    iconBefore: 'mdi:download',
    iconAfter: 'mdi:arrow-down',
    children: 'Download',
  },
}

export const AllVariants: Story = {
  render: ({}) => (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <RudiButton variant="primary">Primary</RudiButton>
      <RudiButton variant="secondary">Secondary</RudiButton>
      <RudiButton variant="destructive">Destructive</RudiButton>
      <RudiButton variant="ghost">Ghost</RudiButton>
    </div>
  ),
}

export const AllSizes: Story = {
  render: ({}) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <RudiButton size="sm">Small</RudiButton>
      <RudiButton size="md">Medium</RudiButton>
      <RudiButton size="lg">Large</RudiButton>
    </div>
  ),
}
