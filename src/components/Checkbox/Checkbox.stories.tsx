import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiCheckbox } from './Checkbox'
import { RudiCheckboxGroup } from './CheckboxGroup'
import { RudiStack } from '@/layouts/Stack/Stack'

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
    children: 'Accept terms and conditions',
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
  parameters: {
    docs: {
      description: {
        story:
          'An unchecked checkbox with a label. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

function AgreeToTerms() {
  const [agreed, setAgreed] = useState(false)
  return (
    <RudiStack space="content">
      <RudiCheckbox isSelected={agreed} onChange={setAgreed}>
        I agree to the terms
      </RudiCheckbox>
      <p>{agreed ? 'Terms accepted.' : 'Terms not accepted yet.'}</p>
    </RudiStack>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `isSelected` and `onChange` when other UI depends on the value, such as enabling a submit button. `onChange` receives a boolean, not an event. Use `defaultSelected` when nothing else needs to read the state.',
      },
      source: {
        code: `function AgreeToTerms() {
  const [agreed, setAgreed] = useState(false)

  return (
    <RudiCheckbox isSelected={agreed} onChange={setAgreed}>
      I agree to the terms
    </RudiCheckbox>
  )
}`,
      },
    },
  },
  render: () => <AgreeToTerms />,
}

function SelectAll() {
  const [selected, setSelected] = useState<string[]>(['email'])
  const options = ['email', 'sms', 'push']
  const allSelected = selected.length === options.length
  return (
    <RudiStack space="content">
      <RudiCheckbox
        isSelected={allSelected}
        isIndeterminate={selected.length > 0 && !allSelected}
        onChange={(isSelected) => setSelected(isSelected ? options : [])}
      >
        All notifications
      </RudiCheckbox>
      <RudiCheckboxGroup
        label="Notification channels"
        value={selected}
        onChange={setSelected}
      >
        <RudiCheckbox value="email">Email</RudiCheckbox>
        <RudiCheckbox value="sms">SMS</RudiCheckbox>
        <RudiCheckbox value="push">Push</RudiCheckbox>
      </RudiCheckboxGroup>
    </RudiStack>
  )
}

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `isIndeterminate` on a "select all" checkbox when only some of its children are checked. It shows a dash and is announced as "mixed", but it does not change `isSelected`, so you set both. Check some of the options to try it.',
      },
      source: {
        code: `function SelectAll() {
  const [selected, setSelected] = useState(['email'])
  const options = ['email', 'sms', 'push']
  const allSelected = selected.length === options.length

  return (
    <>
      <RudiCheckbox
        isSelected={allSelected}
        isIndeterminate={selected.length > 0 && !allSelected}
        onChange={(isSelected) => setSelected(isSelected ? options : [])}
      >
        All notifications
      </RudiCheckbox>
      <RudiCheckboxGroup
        label="Notification channels"
        value={selected}
        onChange={setSelected}
      >
        <RudiCheckbox value="email">Email</RudiCheckbox>
        <RudiCheckbox value="sms">SMS</RudiCheckbox>
        <RudiCheckbox value="push">Push</RudiCheckbox>
      </RudiCheckboxGroup>
    </>
  )
}`,
      },
    },
  },
  render: () => <SelectAll />,
}

export const Groups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Wrap related options in `RudiCheckboxGroup`, which gives them a shared label and a string array value. Each checkbox needs a `value`, and the group needs a `label`. Use `description` for help text.',
      },
    },
  },
  render: () => (
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

export const Validation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `errorMessage` on a group or on a standalone checkbox to mark it invalid and show the message beneath it. Use it for a required choice, such as at least one interest or an unaccepted agreement, and say what to do to fix it.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiCheckboxGroup
        label="Interests"
        errorMessage="Select at least one interest."
      >
        <RudiCheckbox value="design">Design</RudiCheckbox>
        <RudiCheckbox value="engineering">Engineering</RudiCheckbox>
        <RudiCheckbox value="product">Product</RudiCheckbox>
      </RudiCheckboxGroup>
      <RudiCheckbox errorMessage="Accept the terms to continue.">
        I accept the terms
      </RudiCheckbox>
    </RudiStack>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Disable a single checkbox with `isDisabled`, or a whole group by disabling the group. A disabled checkbox keeps its checked state, so use it to show a value people can see but not change. Say why it is unavailable in nearby text.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiStack space="content">
        <RudiCheckbox isDisabled>Unavailable option</RudiCheckbox>
        <RudiCheckbox isDisabled defaultSelected>
          Required option (selected)
        </RudiCheckbox>
      </RudiStack>
      <RudiCheckboxGroup label="Plan features" isDisabled>
        <RudiCheckbox value="storage">Extended storage</RudiCheckbox>
        <RudiCheckbox value="analytics">Advanced analytics</RudiCheckbox>
        <RudiCheckbox value="api">API access</RudiCheckbox>
      </RudiCheckboxGroup>
    </RudiStack>
  ),
}

export const CheckboxOrSwitch: Story = {
  name: 'Checkbox or Switch',
  parameters: {
    docs: {
      description: {
        story:
          'Use a checkbox for a choice that takes effect when the form is submitted, such as agreeing to terms. For a setting that applies the moment it changes, use [`RudiSwitch`](?path=/docs/components-switch--docs).',
      },
    },
  },
  render: () => (
    <RudiCheckbox name="newsletter" value="yes">
      Send me the newsletter
    </RudiCheckbox>
  ),
}
