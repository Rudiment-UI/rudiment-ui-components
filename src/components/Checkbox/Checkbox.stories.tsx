import type { Meta, StoryObj } from '@storybook/react'
import { RudiCheckbox } from './Checkbox'
import { RudiCheckboxGroup } from './CheckboxGroup'

const meta = {
  title: 'Components/Checkbox',
  component: RudiCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A checkbox for toggling a boolean value on or off. Supports checked, unchecked, indeterminate, and disabled states. Use CheckboxGroup for related options.',
      },
    },
  },
  args: {
    isDisabled: false,
    isIndeterminate: false,
    defaultSelected: false,
    children: 'Checkbox label',
    isSelected: false,
    className: '',
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
    isIndeterminate: {
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
    onChange: {
      action: 'changed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Accept terms and conditions',
  },
}

export const Checked: Story = {
  args: {
    children: 'Subscribe to newsletter',
    defaultSelected: true,
  },
}

export const Indeterminate: Story = {
  args: {
    children: 'Select all',
    isIndeterminate: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'This option is unavailable',
    isDisabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    children: 'Required option (pre-selected)',
    isDisabled: true,
    defaultSelected: true,
  },
}

export const Group: Story = {
  render: ({}) => (
    <RudiCheckboxGroup
      label="Notification preferences"
      description="Choose what updates you want to receive."
    >
      <RudiCheckbox value="email">Email notifications</RudiCheckbox>
      <RudiCheckbox value="sms">SMS notifications</RudiCheckbox>
      <RudiCheckbox value="push">Push notifications</RudiCheckbox>
    </RudiCheckboxGroup>
  ),
}

export const GroupWithError: Story = {
  render: ({}) => (
    <RudiCheckboxGroup
      label="Interests"
      errorMessage="Please select at least one interest."
    >
      <RudiCheckbox value="design">Design</RudiCheckbox>
      <RudiCheckbox value="engineering">Engineering</RudiCheckbox>
      <RudiCheckbox value="product">Product</RudiCheckbox>
    </RudiCheckboxGroup>
  ),
}

export const GroupDisabled: Story = {
  render: ({}) => (
    <RudiCheckboxGroup label="Plan features" isDisabled>
      <RudiCheckbox value="storage">Extended storage</RudiCheckbox>
      <RudiCheckbox value="analytics">Advanced analytics</RudiCheckbox>
      <RudiCheckbox value="api">API access</RudiCheckbox>
    </RudiCheckboxGroup>
  ),
}
