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
      description: 'Additional CSS class names to apply to the combo box wrapper',
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      description: 'The visible label displayed above the field',
      table: { category: 'Content' },
    },
    items: {
      control: false,
      description: 'The list of options, each rendered by the `children` function as a `RudiOption`',
      table: { category: 'Content' },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the input is empty',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the field',
      table: { category: 'Content' },
    },
    errorMessage: {
      control: 'text',
      description: 'Validation error message; also marks the field invalid',
      table: { category: 'Content' },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message shown in the popover when the typed text matches no option',
      table: { category: 'Content' },
    },
    name: {
      control: 'text',
      description: 'Form field name; the input text is submitted under it',
      table: { category: 'Content' },
    },
    selectedKey: {
      control: false,
      description: 'The selected option key (controlled)',
      table: { category: 'State' },
    },
    defaultSelectedKey: {
      control: false,
      description: 'The initially selected option key (uncontrolled)',
      table: { category: 'State' },
    },
    inputValue: {
      control: false,
      description: 'The input text (controlled)',
      table: { category: 'State' },
    },
    menuTrigger: {
      control: 'inline-radio',
      options: ['input', 'focus', 'manual'],
      description: 'What opens the list: typing, focusing the field, or only the arrow keys and chevron button',
      table: { category: 'State' },
    },
    allowsCustomValue: {
      control: 'boolean',
      description: 'Keep typed text that matches no option instead of reverting on blur',
      table: { category: 'State' },
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether a value is required before form submission',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the combo box is disabled and non-interactive',
      table: { category: 'State' },
    },
    onSelectionChange: {
      action: 'selectionChanged',
      description: 'Called with the selected key, or null when cleared',
      table: { category: 'Events' },
    },
    onInputChange: {
      action: 'inputChanged',
      description: 'Called with the input text whenever it changes',
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
