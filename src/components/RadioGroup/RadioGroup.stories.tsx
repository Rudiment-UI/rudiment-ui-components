import type { Meta, StoryObj } from '@storybook/react'
import { RudiRadioGroup } from './RadioGroup'
import { RudiRadio } from './Radio'

const meta = {
  title: 'Components/RadioGroup',
  component: RudiRadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A group of radio buttons for selecting exactly one option from a set. Supports vertical and horizontal layouts, helper text, and validation errors.',
      },
    },
  },
  args: {
    orientation: 'vertical',
    isDisabled: false,
    label: 'Options',
    description: '',
    errorMessage: '',
    value: '',
    defaultValue: '',
    className: '',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The visible label displayed above the radio group',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the radio group',
      table: { category: 'Content' },
    },
    errorMessage: {
      control: 'text',
      description: 'Validation error message displayed below the radio group',
      table: { category: 'Content' },
    },
    children: {
      control: false,
      description: 'The Radio components rendered inside the group',
      table: { category: 'Content' },
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description:
        'Whether the radio options are stacked vertically or laid out horizontally',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      description:
        'Additional CSS class names to apply to the radio group wrapper',
      table: { category: 'Appearance' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the entire group is disabled and non-interactive',
      table: { category: 'State' },
    },
    value: {
      control: 'text',
      description: 'The currently selected radio value (controlled)',
      table: { category: 'State' },
    },
    defaultValue: {
      control: 'text',
      description: 'The initially selected radio value (uncontrolled)',
      table: { category: 'State' },
    },
    onChange: {
      action: 'changed',
      description: 'Called when the selected radio option changes',
      table: { category: 'Events' },
    },
  },
} as Meta<typeof RudiRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <RudiRadioGroup {...args} label="Shipping speed">
      <RudiRadio value="standard">Standard (5–7 days)</RudiRadio>
      <RudiRadio value="express">Express (2–3 days)</RudiRadio>
      <RudiRadio value="overnight">Overnight (next day)</RudiRadio>
    </RudiRadioGroup>
  ),
}

export const WithDescription: Story = {
  render: ({}) => (
    <RudiRadioGroup
      label="Plan"
      description="You can change your plan at any time."
    >
      <RudiRadio value="starter">Starter — free forever</RudiRadio>
      <RudiRadio value="pro">Pro — $12/month</RudiRadio>
      <RudiRadio value="enterprise">Enterprise — contact us</RudiRadio>
    </RudiRadioGroup>
  ),
}

export const Horizontal: Story = {
  render: ({}) => (
    <RudiRadioGroup label="Size" orientation="horizontal">
      <RudiRadio value="xs">XS</RudiRadio>
      <RudiRadio value="s">S</RudiRadio>
      <RudiRadio value="m">M</RudiRadio>
      <RudiRadio value="l">L</RudiRadio>
      <RudiRadio value="xl">XL</RudiRadio>
    </RudiRadioGroup>
  ),
}

export const WithError: Story = {
  render: ({}) => (
    <RudiRadioGroup
      label="Shipping speed"
      errorMessage="Please select a shipping option."
    >
      <RudiRadio value="standard">Standard (5–7 days)</RudiRadio>
      <RudiRadio value="express">Express (2–3 days)</RudiRadio>
      <RudiRadio value="overnight">Overnight (next day)</RudiRadio>
    </RudiRadioGroup>
  ),
}

export const Disabled: Story = {
  render: ({}) => (
    <RudiRadioGroup label="Region" isDisabled>
      <RudiRadio value="us">United States</RudiRadio>
      <RudiRadio value="eu">Europe</RudiRadio>
      <RudiRadio value="ap">Asia Pacific</RudiRadio>
    </RudiRadioGroup>
  ),
}
