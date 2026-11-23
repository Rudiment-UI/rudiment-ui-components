import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiNumberField } from './NumberField'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/NumberField',
  component: RudiNumberField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A numeric field with locale-aware parsing and optional − / + steppers. Use it instead of `RudiInput type="number"`. `onChange` receives a number, or `null` when the field is cleared.',
      },
    },
  },
  args: {
    label: 'Distance (miles)',
    defaultValue: 120,
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
  parameters: {
    docs: {
      description: {
        story:
          'A number field with steppers. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Formatting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `formatOptions` for currency, percent and units instead of putting `$` or `%` in the label. Percent values are fractions, so `0.15` shows 15%.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiNumberField
        label="Shipping cost"
        defaultValue={249.99}
        minValue={0}
        formatOptions={{ style: 'currency', currency: 'USD' }}
      />
      <RudiNumberField
        label="Discount"
        defaultValue={0.15}
        minValue={0}
        maxValue={1}
        step={0.05}
        formatOptions={{ style: 'percent' }}
        description="Applied to the order subtotal."
      />
    </RudiStack>
  ),
}

export const RangeAndStep: Story = {
  name: 'Range and step',
  parameters: {
    docs: {
      description: {
        story:
          'Set `minValue`, `maxValue` and `step` so the steppers and arrow keys stay in range. Typed values clamp to the range and snap to the step.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Setting `errorMessage` marks the field invalid and replaces the description. Say what range or format is expected, and leave it unset while the value is valid.',
      },
    },
  },
  args: {
    label: 'Distance (miles)',
    defaultValue: 900,
    errorMessage: 'Courier range is 500 miles or less.',
    isRequired: true,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `isDisabled` for a value that can't be changed right now. Use `isReadOnly` when people still need to focus and copy it.",
      },
    },
  },
  args: {
    label: 'Distance (miles)',
    defaultValue: 42,
    isDisabled: true,
  },
}

function QuantityField() {
  const [quantity, setQuantity] = useState<number | null>(1)
  return (
    <RudiNumberField
      label="Quantity"
      minValue={1}
      value={quantity}
      onChange={setQuantity}
      description={quantity === null ? 'Enter a quantity.' : `Quantity: ${quantity}`}
    />
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `value` and `onChange` to keep the number in your own state. `onChange` receives a number, or `null` when the field is cleared.',
      },
      source: {
        code: `function QuantityField() {
  const [quantity, setQuantity] = useState<number | null>(1)
  return (
    <RudiNumberField
      label="Quantity"
      minValue={1}
      value={quantity}
      onChange={setQuantity}
    />
  )
}`,
      },
    },
  },
  render: () => <QuantityField />,
}
