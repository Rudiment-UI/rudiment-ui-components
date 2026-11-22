import type { Meta, StoryObj } from '@storybook/react'
import { RudiAlert } from './Alert'
import { RudiButton } from '@/components/Button/Button'

const meta = {
  title: 'Components/Alert',
  component: RudiAlert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A prominent message banner for communicating status, warnings, errors, or confirmations. Uses ARIA live regions so screen readers announce updates automatically.',
      },
    },
  },
  args: {
    variant: 'info',
    isPolite: false,
    children: 'This is an alert message.',
    className: '',
    dismissible: false,
    icon: '',
  },
  argTypes: {
    title: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    icon: {
      control: 'text',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    isPolite: {
      control: 'boolean',
      table: { category: 'State' },
    },
    dismissible: {
      control: 'boolean',
      table: { category: 'State' },
    },
    action: {
      control: false,
      table: { category: 'Content' },
    },
    onDismiss: {
      action: 'dismissed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Did you know?',
    children: 'This is an informational alert with some helpful context.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Changes saved',
    children: 'Your profile has been updated successfully.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Proceed with caution',
    children: 'This action may have unintended side effects.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Something went wrong',
    children: 'We could not process your request. Please try again.',
  },
}

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    children: 'A simple alert without a title.',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'info',
    icon: 'mdi:information',
    title: 'Did you know?',
    children: 'This alert includes an icon for extra visual emphasis.',
  },
}

export const Polite: Story = {
  args: {
    variant: 'success',
    title: 'Auto-saved',
    isPolite: true,
    children: 'Your draft was saved automatically.',
  },
}

export const Dismissible: Story = {
  args: {
    variant: 'info',
    icon: 'mdi:information',
    title: 'Did you know?',
    dismissible: true,
    children: 'This alert can be dismissed by clicking the close button.',
  },
}

export const AllVariants: Story = {
  render: ({}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RudiAlert variant="info" icon="mdi:information" title="Info">
        This is an info alert.
      </RudiAlert>
      <RudiAlert variant="success" icon="mdi:check-circle" title="Success">
        This is a success alert.
      </RudiAlert>
      <RudiAlert variant="warning" icon="mdi:alert" title="Warning">
        This is a warning alert.
      </RudiAlert>
      <RudiAlert variant="error" icon="mdi:alert-circle" title="Error">
        This is an error alert.
      </RudiAlert>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RudiAlert
        variant="warning"
        icon="mdi:alert"
        title="Temperature out of range"
        action={<RudiButton size="sm" variant="secondary">Review</RudiButton>}
      >
        Shipment REF-1042 exceeded its limit for 12 minutes.
      </RudiAlert>
      <div style={{ inlineSize: '16rem' }}>
        <RudiAlert
          variant="info"
          dismissible
          action={<RudiButton size="sm" variant="secondary">Review</RudiButton>}
        >
          A narrow alert wraps the action below the text.
        </RudiAlert>
      </div>
    </div>
  ),
}
