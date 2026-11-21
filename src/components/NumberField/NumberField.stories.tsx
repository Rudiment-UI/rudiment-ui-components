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
      description: 'The visible label displayed above the field',
      table: { category: 'Content' },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the field is empty',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the field',
      table: { category: 'Content' },
    },
    errorMessage: {
      control: 'text',
      description: 'Validation error displayed below the field; marks it invalid',
      table: { category: 'Content' },
    },
    name: {
      control: 'text',
      description: 'Form field name; submits the raw number',
      table: { category: 'Content' },
    },
    formatOptions: {
      control: 'object',
      description:
        '`Intl.NumberFormatOptions` for display, e.g. `{ style: "currency", currency: "USD" }` or `{ style: "percent" }`',
      table: { category: 'Appearance' },
    },
    hideStepper: {
      control: 'boolean',
      description: 'Hide the − / + buttons; arrow keys still step',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names for the wrapper',
      table: { category: 'Appearance' },
    },
    value: {
      control: 'number',
      description: 'Controlled value, or `null` for empty',
      table: { category: 'State' },
    },
    defaultValue: {
      control: 'number',
      description: 'Initial uncontrolled value',
      table: { category: 'State' },
    },
    minValue: {
      control: 'number',
      description: 'Smallest allowed value; typed values clamp on blur',
      table: { category: 'State' },
    },
    maxValue: {
      control: 'number',
      description: 'Largest allowed value; typed values clamp on blur',
      table: { category: 'State' },
    },
    step: {
      control: 'number',
      description: 'Increment for steppers and arrow keys; values snap to it',
      table: { category: 'State' },
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether a value is required; shows a required indicator',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the field is disabled and non-interactive',
      table: { category: 'State' },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the value is visible but not editable',
      table: { category: 'State' },
    },
    onChange: {
      action: 'changed',
      description: 'Called with the parsed number, or `null` when cleared',
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
