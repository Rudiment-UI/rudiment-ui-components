import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiSwitch } from './Switch'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Switch',
  component: RudiSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A toggle for an on/off setting that takes effect immediately. For a choice that is applied when a form is submitted, use [`RudiCheckbox`](?path=/docs/components-checkbox--docs).',
      },
    },
  },
  args: {
    children: 'Enable notifications',
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    isSelected: {
      control: 'boolean',
      table: { category: 'State' },
    },
    defaultSelected: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    onChange: {
      action: 'changed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An off switch with a label. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const OnAndOff: Story = {
  name: 'On and off',
  parameters: {
    docs: {
      description: {
        story:
          'Use `defaultSelected` to start a switch on when the setting is already enabled. Word the label as the setting itself ("Dark mode"), so that on and off both make sense.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiSwitch>Dark mode</RudiSwitch>
      <RudiSwitch defaultSelected>Email notifications</RudiSwitch>
    </RudiStack>
  ),
}

function NotificationSetting() {
  const [enabled, setEnabled] = useState(false)
  return (
    <RudiStack space="content">
      <RudiSwitch isSelected={enabled} onChange={setEnabled}>
        Push notifications
      </RudiSwitch>
      <p>{enabled ? 'Notifications are on.' : 'Notifications are off.'}</p>
    </RudiStack>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `isSelected` and `onChange` to apply the setting as soon as it changes, for example by saving it. `onChange` receives a boolean, not an event.',
      },
      source: {
        code: `function NotificationSetting() {
  const [enabled, setEnabled] = useState(false)

  return (
    <RudiSwitch isSelected={enabled} onChange={setEnabled}>
      Push notifications
    </RudiSwitch>
  )
}`,
      },
    },
  },
  render: () => <NotificationSetting />,
}

export const WithoutVisibleLabel: Story = {
  name: 'Without a visible label',
  parameters: {
    docs: {
      description: {
        story:
          'When the surrounding layout already names the setting, such as one switch per table row, leave out the children and set `aria-label` so each switch has a distinct accessible name.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiSwitch aria-label="Notify Ana Lopez" defaultSelected />
      <RudiSwitch aria-label="Notify Ben Carter" />
    </RudiStack>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A disabled switch keeps its on or off position, so use it for a setting people can see but not change, such as one locked by an admin. Say why it is unavailable in nearby text.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiSwitch isDisabled>Feature unavailable</RudiSwitch>
      <RudiSwitch isDisabled defaultSelected>
        Setting managed by your admin
      </RudiSwitch>
    </RudiStack>
  ),
}

export const CheckboxOrSwitch: Story = {
  name: 'Checkbox or Switch',
  parameters: {
    docs: {
      description: {
        story:
          'Use a switch for a setting that takes effect immediately. For a choice that is submitted with a form, such as "I agree to the terms", use [`RudiCheckbox`](?path=/docs/components-checkbox--docs).',
      },
    },
  },
  render: () => <RudiSwitch defaultSelected>Auto-save drafts</RudiSwitch>,
}
