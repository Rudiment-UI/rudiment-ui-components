import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiRadioGroup } from './RadioGroup'
import { RudiRadio } from './Radio'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Forms/RadioGroup',
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
    label: 'Shipping speed',
    children: [
      <RudiRadio key="standard" value="standard">
        Standard (5–7 days)
      </RudiRadio>,
      <RudiRadio key="express" value="express">
        Express (2–3 days)
      </RudiRadio>,
      <RudiRadio key="overnight" value="overnight">
        Overnight (next day)
      </RudiRadio>,
    ],
  },
  argTypes: {
    label: {
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
    children: {
      control: false,
      table: { category: 'Content' },
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
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
} satisfies Meta<typeof RudiRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A vertical group with nothing selected. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Orientation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Groups stack vertically by default, which suits longer labels. Set `orientation="horizontal"` only for two or three short options such as sizes; long labels read better in a column.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiRadioGroup label="Plan">
        <RudiRadio value="starter">Starter</RudiRadio>
        <RudiRadio value="pro">Pro</RudiRadio>
        <RudiRadio value="enterprise">Enterprise</RudiRadio>
      </RudiRadioGroup>
      <RudiRadioGroup label="Size" orientation="horizontal">
        <RudiRadio value="s">S</RudiRadio>
        <RudiRadio value="m">M</RudiRadio>
        <RudiRadio value="l">L</RudiRadio>
      </RudiRadioGroup>
    </RudiStack>
  ),
}

export const WithDescription: Story = {
  name: 'With description',
  parameters: {
    docs: {
      description: {
        story:
          'Add `description` for help text that applies to the whole group, such as whether the choice can be changed later. It is hidden while an error is shown.',
      },
    },
  },
  render: () => (
    <RudiRadioGroup
      label="Plan"
      description="You can change your plan at any time."
    >
      <RudiRadio value="starter">Starter: free forever</RudiRadio>
      <RudiRadio value="pro">Pro: $12/month</RudiRadio>
      <RudiRadio value="enterprise">Enterprise: contact us</RudiRadio>
    </RudiRadioGroup>
  ),
}

function ShippingChoice() {
  const [speed, setSpeed] = useState('standard')
  return (
    <RudiStack space="content">
      <RudiRadioGroup label="Shipping speed" value={speed} onChange={setSpeed}>
        <RudiRadio value="standard">Standard (5–7 days)</RudiRadio>
        <RudiRadio value="express">Express (2–3 days)</RudiRadio>
        <RudiRadio value="overnight">Overnight (next day)</RudiRadio>
      </RudiRadioGroup>
      <p>Selected: {speed}</p>
    </RudiStack>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `value` and `onChange` when other UI depends on the choice, such as a price summary. `onChange` receives the selected option\'s `value` string, not an event. Use `defaultValue` when nothing else needs it.',
      },
      source: {
        code: `function ShippingChoice() {
  const [speed, setSpeed] = useState('standard')

  return (
    <RudiRadioGroup label="Shipping speed" value={speed} onChange={setSpeed}>
      <RudiRadio value="standard">Standard (5–7 days)</RudiRadio>
      <RudiRadio value="express">Express (2–3 days)</RudiRadio>
      <RudiRadio value="overnight">Overnight (next day)</RudiRadio>
    </RudiRadioGroup>
  )
}`,
      },
    },
  },
  render: () => <ShippingChoice />,
}

export const Validation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `errorMessage` to mark the group invalid and show the message beneath it. Use it when a required choice is missing, and write the message as a fix ("Choose a shipping speed").',
      },
    },
  },
  render: () => (
    <RudiRadioGroup
      label="Shipping speed"
      errorMessage="Choose a shipping speed."
    >
      <RudiRadio value="standard">Standard (5–7 days)</RudiRadio>
      <RudiRadio value="express">Express (2–3 days)</RudiRadio>
      <RudiRadio value="overnight">Overnight (next day)</RudiRadio>
    </RudiRadioGroup>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `isDisabled` on the group to disable every option at once, for example while a choice is locked. Say why it is unavailable in nearby text.',
      },
    },
  },
  render: () => (
    <RudiRadioGroup label="Region" isDisabled defaultValue="eu">
      <RudiRadio value="us">United States</RudiRadio>
      <RudiRadio value="eu">Europe</RudiRadio>
      <RudiRadio value="ap">Asia Pacific</RudiRadio>
    </RudiRadioGroup>
  ),
}
