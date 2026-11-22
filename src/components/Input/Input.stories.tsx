import type { Meta, StoryObj } from '@storybook/react'
import { RudiInput } from './Input'

const meta = {
  title: 'Components/Input',
  component: RudiInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A labeled text input for collecting user data. Supports multiple input types, helper text, validation errors, and required and disabled states.',
      },
    },
  },
  args: {
    label: 'Label',
    type: 'text',
    isRequired: false,
    isDisabled: false,
    description: '',
    errorMessage: '',
    defaultValue: '',
    className: '',
    value: '',
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
  args: {
    label: 'Full name',
    placeholder: 'Jane Smith',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    placeholder: 'you@example.com',
    description: 'We will never share your email with anyone.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    defaultValue: 'not-an-email',
    errorMessage: 'Please enter a valid email address.',
  },
}

export const Required: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    isRequired: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Account ID',
    defaultValue: 'usr_1234567890',
    isDisabled: true,
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
  },
}
