import type { Meta, StoryObj } from '@storybook/react'
import { RudiNumberField } from './NumberField'

const meta = {
  title: 'Components/NumberField',
  component: RudiNumberField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A locale-aware numeric input with optional − / + steppers. `onChange` receives a number, or `null` when cleared. Use `formatOptions` for currency, percent, or units; arrow keys step by `step` and values clamp to `minValue` / `maxValue`.',
      },
    },
  },
  args: {
    label: 'Distance (miles)',
    description: '',
    errorMessage: '',
    isRequired: false,
    isDisabled: false,
    isReadOnly: false,
    hideStepper: false,
    className: '',
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
    name: {
      control: 'text',
      table: { category: 'Content' },
    },
    formatOptions: {
      control: 'object',
      table: { category: 'Appearance' },
    },
    hideStepper: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    value: {
      control: 'number',
      table: { category: 'State' },
    },
    defaultValue: {
      control: 'number',
      table: { category: 'State' },
    },
    minValue: {
      control: 'number',
      table: { category: 'State' },
    },
    maxValue: {
      control: 'number',
      table: { category: 'State' },
    },
    step: {
      control: 'number',
      table: { category: 'State' },
    },
    isRequired: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isReadOnly: {
      control: 'boolean',
      table: { category: 'State' },
    },
    onChange: {
      action: 'changed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiNumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 120,
    description: 'Round-trip courier distance.',
  },
}

export const Currency: Story = {
  args: {
    label: 'Shipping cost',
    defaultValue: 249.99,
    minValue: 0,
    formatOptions: { style: 'currency', currency: 'USD' },
  },
}

export const Percent: Story = {
  args: {
    label: 'Discount',
    defaultValue: 0.15,
    minValue: 0,
    maxValue: 1,
    step: 0.05,
    formatOptions: { style: 'percent' },
    description: 'Applied to the order subtotal.',
  },
}

export const MinMaxStep: Story = {
  name: 'Min/max/step',
  args: {
    label: 'Dry-shipper count',
    defaultValue: 4,
    minValue: 2,
    maxValue: 12,
    step: 2,
    description: 'Even numbers from 2 to 12.',
  },
}

export const ErrorState: Story = {
  name: 'Error',
  args: {
    label: 'Distance (miles)',
    defaultValue: 900,
    errorMessage: 'Courier range is 500 miles or less.',
    isRequired: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Distance (miles)',
    defaultValue: 42,
    isDisabled: true,
  },
}
