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
    title: 'Did you know?',
    children: 'Alerts sit inline with the page content and are announced to screen readers.',
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A single info alert with a title. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Match the variant to the severity of the message: `success` for confirmations, `warning` for risks, `error` for problems the user must fix. Don\'t use `error` for informational messages, it causes unnecessary alarm. Add an `icon` so the meaning does not rely on color alone.',
      },
    },
  },
  render: () => (
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

export const WithoutTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Leave out `title` when the message is a single short sentence and a heading would repeat it.',
      },
    },
  },
  args: {
    title: undefined,
    children: 'A simple alert without a title.',
  },
}

export const Dismissible: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `dismissible` for messages the user can safely clear, such as tips. Dismissal is internal: the alert stays hidden until it remounts. Press the close button to try it.',
      },
    },
  },
  args: {
    icon: 'mdi:information',
    dismissible: true,
    children: 'This alert can be dismissed by clicking the close button.',
  },
}

export const Polite: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `isPolite` for non-urgent updates such as an auto-save, so screen readers announce them without interrupting. The default `role="alert"` announces assertively. Don\'t overuse alerts: when everything is highlighted, nothing stands out.',
      },
    },
  },
  args: {
    variant: 'success',
    title: 'Auto-saved',
    isPolite: true,
    children: 'Your draft was saved automatically.',
  },
}

export const WithAction: Story = {
  name: 'With action',
  parameters: {
    docs: {
      description: {
        story:
          'Use `action` for the one follow-up the message calls for, such as a button. It sits at the inline-end and wraps below the text when space is tight, as in the narrow example.',
      },
    },
  },
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
