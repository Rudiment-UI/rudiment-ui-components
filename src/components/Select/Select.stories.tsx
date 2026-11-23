import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { Key } from 'react-aria'
import { RudiSelect, type RudiSelectProps } from './Select'
import { RudiOption } from './Option'
import { RudiStack } from '@/layouts/Stack/Stack'
import { RudiText } from '@/typography/Text/Text'

interface SelectItem {
  id: string
  label: string
}

const colors: SelectItem[] = [
  { id: 'red', label: 'Red' },
  { id: 'green', label: 'Green' },
  { id: 'blue', label: 'Blue' },
  { id: 'yellow', label: 'Yellow' },
  { id: 'purple', label: 'Purple' },
]

const roles: SelectItem[] = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'editor', label: 'Editor' },
  { id: 'admin', label: 'Admin' },
]

type SelectStoryArgs = Omit<RudiSelectProps<SelectItem>, 'children'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const meta: Meta<SelectStoryArgs> = {
  title: 'Components/Select',
  component: RudiSelect as any,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '20rem' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <RudiSelect {...(args as RudiSelectProps<SelectItem>)}>
      {(item) => <RudiOption key={item.id}>{item.label}</RudiOption>}
    </RudiSelect>
  ),
  parameters: {
    docs: {
      description: {
        component:
          'A dropdown for choosing one option from a list. Pass `items` and a render function that returns a `RudiOption` for each. For a short list that people should compare at a glance, use [`RudiRadioGroup`](?path=/docs/components-radiogroup--docs). For a long list people need to search, use [`RudiComboBox`](?path=/docs/components-combobox--docs).',
      },
    },
  },
  args: {
    label: 'Favourite colour',
    items: colors,
    placeholder: 'Choose a colour',
  },
  argTypes: {
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    items: {
      control: false,
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
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    selectedKey: {
      control: false,
      table: { category: 'State' },
    },
    defaultSelectedKey: {
      control: false,
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
    onSelectionChange: {
      action: 'selectionChanged',
      table: { category: 'Events' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A select with a placeholder and no selection. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const DescriptionAndErrors: Story = {
  name: 'Description and errors',
  parameters: {
    docs: {
      description: {
        story:
          'Use `description` for help text that explains what the choice affects. Set `errorMessage` to mark the field invalid and replace the help text with the problem, and say how to fix it. Set `isRequired` when the form needs a value.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiSelect
        label="Role"
        items={roles}
        placeholder="Select a role"
        description="This determines what the user can access."
      >
        {(item) => <RudiOption key={item.id}>{item.label}</RudiOption>}
      </RudiSelect>
      <RudiSelect
        label="Permission level"
        items={roles}
        placeholder="Select a role"
        isRequired
        errorMessage="Please select a role before continuing."
      >
        {(item) => <RudiOption key={item.id}>{item.label}</RudiOption>}
      </RudiSelect>
    </RudiStack>
  ),
}

export const Required: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mark the field `isRequired` when the form cannot be submitted without a choice. Set `name` when the select is inside a native form so the selected key is submitted with it.',
      },
    },
  },
  args: {
    isRequired: true,
    name: 'colour',
  },
}

function ColourSelect() {
  const [selectedKey, setSelectedKey] = useState<Key | null>('green')
  return (
    <RudiStack>
      <RudiSelect
        label="Favourite colour"
        items={colors}
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
      >
        {(item) => <RudiOption key={item.id}>{item.label}</RudiOption>}
      </RudiSelect>
      <RudiText>Selected key: {selectedKey ?? 'none'}</RudiText>
    </RudiStack>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `selectedKey` and `onSelectionChange` when other parts of the page depend on the choice. Use `defaultSelectedKey` instead when you only need an initial value.',
      },
      source: {
        code: `function ColourSelect() {
  const [selectedKey, setSelectedKey] = useState<Key | null>('green')

  return (
    <RudiSelect
      label="Favourite colour"
      items={colors}
      selectedKey={selectedKey}
      onSelectionChange={setSelectedKey}
    >
      {(item) => <RudiOption key={item.id}>{item.label}</RudiOption>}
    </RudiSelect>
  )
}`,
      },
    },
  },
  render: () => <ColourSelect />,
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A disabled select keeps its value visible but cannot be focused or changed. Where you can, leave the field enabled and explain why a choice is unavailable instead.',
      },
    },
  },
  args: {
    label: 'Region',
    items: [{ id: 'us', label: 'United States' }],
    defaultSelectedKey: 'us',
    isDisabled: true,
  },
}
