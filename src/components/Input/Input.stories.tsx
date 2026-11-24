import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiInput } from './Input'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Forms/Input',
  component: RudiInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single-line text field for collecting user data. It has a required label, optional help text and an inline error message. Use `RudiTextarea` for multi-line text and `RudiNumberField` for numbers.',
      },
    },
  },
  args: {
    label: 'Full name',
    placeholder: 'Jane Smith',
  },
  argTypes: {
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      table: { category: 'Content' },
    },
    errorMessage: {
      control: 'text',
      table: { category: 'Content' },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'tel', 'search', 'number'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    isRequired: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    value: {
      control: 'text',
      table: { category: 'State' },
    },
    defaultValue: {
      control: 'text',
      table: { category: 'State' },
    },
    onChange: {
      action: 'changed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A text field with a label and a placeholder. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `type` to get the right on-screen keyboard, browser validation and autofill. Use `password` to mask the value. For numbers, use [`RudiNumberField`](?path=/docs/components-forms-numberfield--docs) instead of `type="number"`.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiInput label="Email address" type="email" placeholder="you@example.com" />
      <RudiInput label="Password" type="password" />
      <RudiInput label="Website" type="url" placeholder="https://example.com" />
      <RudiInput label="Phone" type="tel" />
    </RudiStack>
  ),
}

export const DescriptionAndErrors: Story = {
  name: 'Description and errors',
  parameters: {
    docs: {
      description: {
        story:
          'Use `description` for context people need before they type, such as a format or a rule. Setting `errorMessage` marks the field invalid and replaces the description. Say what went wrong and how to fix it, and leave `errorMessage` unset while the value is valid.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiInput
        label="Password"
        type="password"
        description="Must be at least 8 characters."
      />
      <RudiInput
        label="Email address"
        type="email"
        defaultValue="not-an-email"
        errorMessage="Enter an email address such as you@example.com."
      />
    </RudiStack>
  ),
}

export const Required: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `isRequired` to add an asterisk to the label and mark the field required for assistive technology. Always keep a visible label. A placeholder disappears as soon as people start typing, so it can\'t replace one.',
      },
    },
  },
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    isRequired: true,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `isDisabled` for a value that can\'t be changed right now. Disabled fields are skipped by keyboard navigation, so use `isReadOnly` when people still need to focus and copy the value.',
      },
    },
  },
  args: {
    label: 'Account ID',
    defaultValue: 'usr_1234567890',
    isDisabled: true,
  },
}

function EmailField() {
  const [email, setEmail] = useState('')
  return (
    <RudiInput
      label="Email address"
      type="email"
      value={email}
      onChange={setEmail}
      description={`You typed ${email.length} characters.`}
    />
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `value` and `onChange` to keep the text in your own state. `onChange` receives the new string, not an event.',
      },
      source: {
        code: `function EmailField() {
  const [email, setEmail] = useState('')
  return (
    <RudiInput
      label="Email address"
      type="email"
      value={email}
      onChange={setEmail}
    />
  )
}`,
      },
    },
  },
  render: () => <EmailField />,
}
