import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { Key } from 'react-aria'
import { RudiComboBox, type RudiComboBoxProps } from './ComboBox'
import { RudiOption } from '../Select/Option'
import { RudiCenter } from '../../layouts/Center/Center'
import { RudiStack } from '../../layouts/Stack/Stack'
import { RudiText } from '../../typography/Text/Text'

interface Clinic {
  id: string
  name: string
}

const clinics: Clinic[] = [
  { id: 'abq', name: 'Albuquerque Fertility Center' },
  { id: 'bos', name: 'Boston IVF Partners' },
  { id: 'chi', name: 'Chicago Reproductive Health' },
  { id: 'den', name: 'Denver Family Clinic' },
  { id: 'hou', name: 'Houston Women’s Clinic' },
  { id: 'sea', name: 'Seattle Fertility Associates' },
  { id: 'sfo', name: 'San Francisco Reproductive Medicine' },
]

type ComboBoxStoryArgs = Omit<RudiComboBoxProps<Clinic>, 'children'>

const meta: Meta<ComboBoxStoryArgs> = {
  title: 'Components/ComboBox',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: RudiComboBox as any,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <RudiCenter maxWidth="20rem">
        <Story />
      </RudiCenter>
    ),
  ],
  render: (args) => (
    <RudiComboBox {...(args as RudiComboBoxProps<Clinic>)}>
      {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
    </RudiComboBox>
  ),
  parameters: {
    docs: {
      description: {
        component:
          'A searchable select: type to filter a list of options, then pick one with the mouse or the arrow keys and Enter. Options are `RudiOption` elements, exactly as in `RudiSelect`. Filtering is a case-insensitive "contains" match on each option\'s text; for options with rich content, pass `textValue` on `RudiOption` so they can still be filtered.',
      },
    },
  },
  args: {
    label: 'Pickup clinic',
    items: clinics,
    placeholder: 'Search clinics',
    description: '',
    errorMessage: '',
    emptyMessage: 'No matches',
    menuTrigger: 'input',
    allowsCustomValue: false,
    isRequired: false,
    isDisabled: false,
    className: '',
  },
  argTypes: {
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
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
    emptyMessage: {
      control: 'text',
      table: { category: 'Content' },
    },
    name: {
      control: 'text',
      table: { category: 'Content' },
    },
    selectedKey: {
      control: false,
      table: { category: 'State' },
    },
    defaultSelectedKey: {
      control: false,
      table: { category: 'State' },
    },
    inputValue: {
      control: false,
      table: { category: 'State' },
    },
    menuTrigger: {
      control: 'inline-radio',
      options: ['input', 'focus', 'manual'],
      table: { category: 'State' },
    },
    allowsCustomValue: {
      control: 'boolean',
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
    onInputChange: {
      action: 'inputChanged',
      table: { category: 'Events' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  name: 'With description',
  args: {
    description: 'Where the patient will collect their cryo shipment.',
  },
}

export const CustomValue: Story = {
  name: 'Custom value',
  args: {
    label: 'Referring clinic',
    placeholder: 'Search or type a new clinic',
    allowsCustomValue: true,
    description: 'Type a clinic that is not in the list to keep it as free text.',
  },
}

export const EmptyResults: Story = {
  name: 'Empty results',
  args: {
    defaultInputValue: 'Zzz',
    menuTrigger: 'focus',
    emptyMessage: 'No clinics match your search',
    description: 'Focus the field to see the empty message.',
  },
}

export const WithError: Story = {
  name: 'Error',
  args: {
    isRequired: true,
    errorMessage: 'Choose a pickup clinic before continuing.',
  },
}

export const Disabled: Story = {
  args: {
    defaultSelectedKey: 'bos',
    isDisabled: true,
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [selectedKey, setSelectedKey] = useState<Key | null>('sea')
    return (
      <RudiStack>
        <RudiComboBox
          {...(args as RudiComboBoxProps<Clinic>)}
          selectedKey={selectedKey}
          onSelectionChange={setSelectedKey}
        >
          {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
        </RudiComboBox>
        <RudiText>Selected key: {selectedKey ?? 'none'}</RudiText>
      </RudiStack>
    )
  },
}
