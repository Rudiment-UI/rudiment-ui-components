import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { Key } from 'react-aria'
import { RudiComboBox, type RudiComboBoxProps } from './ComboBox'
import { RudiOption } from '@/components/Select/Option'
import { RudiCenter } from '@/layouts/Center/Center'
import { RudiStack } from '@/layouts/Stack/Stack'
import { RudiText } from '@/typography/Text/Text'

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
  title: 'Components/Forms/ComboBox',
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
          'A searchable select: type to filter a list of options, then pick one with the mouse or the arrow keys and Enter. Options are `RudiOption` elements, as in [`RudiSelect`](?path=/docs/components-forms-select--docs). Filtering is a case-insensitive "contains" match on each option\'s text. Use it instead of `RudiSelect` once a list is long enough that scrolling it is tedious, roughly ten options or more.',
      },
    },
  },
  args: {
    label: 'Pickup clinic',
    items: clinics,
    placeholder: 'Search clinics',
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Type to filter the list, then press Enter or click to choose. Change the props in the API reference below to try every option on this example.',
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
          'Use `description` for help text under the field. Set `errorMessage` to mark the field invalid and replace the help text with the problem, and `isRequired` when the form needs a value.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiComboBox
        label="Pickup clinic"
        items={clinics}
        placeholder="Search clinics"
        description="Where the patient will collect their cryo shipment."
      >
        {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
      </RudiComboBox>
      <RudiComboBox
        label="Delivery clinic"
        items={clinics}
        placeholder="Search clinics"
        isRequired
        errorMessage="Choose a delivery clinic before continuing."
      >
        {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
      </RudiComboBox>
    </RudiStack>
  ),
}

export const CustomValue: Story = {
  name: 'Custom value',
  parameters: {
    docs: {
      description: {
        story:
          'Set `allowsCustomValue` only when free text is a valid answer, such as a clinic that is not in the list yet. Otherwise the field only accepts one of the options.',
      },
    },
  },
  args: {
    label: 'Referring clinic',
    placeholder: 'Search or type a new clinic',
    allowsCustomValue: true,
    description: 'Type a clinic that is not in the list to keep it as free text.',
  },
}

export const EmptyResults: Story = {
  name: 'Empty results',
  parameters: {
    docs: {
      description: {
        story:
          'When nothing matches, the list shows `emptyMessage`. Write it for the situation ("No clinics match your search") instead of keeping the generic default. Focus the field to see it here.',
      },
    },
  },
  args: {
    defaultInputValue: 'Zzz',
    menuTrigger: 'focus',
    emptyMessage: 'No clinics match your search',
  },
}

export const OptionsWithRichContent: Story = {
  name: 'Options with rich content',
  parameters: {
    docs: {
      description: {
        story:
          'Pass `textValue` on `RudiOption` when its content is not plain text, so filtering and screen readers still have a string to work with.',
      },
    },
  },
  render: () => (
    <RudiComboBox label="Pickup clinic" items={clinics} placeholder="Search clinics">
      {(item) => (
        <RudiOption key={item.id} textValue={item.name}>
          <strong>{item.name}</strong> ({item.id.toUpperCase()})
        </RudiOption>
      )}
    </RudiComboBox>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A disabled combo box keeps its value visible but cannot be focused or changed.',
      },
    },
  },
  args: {
    defaultSelectedKey: 'bos',
    isDisabled: true,
  },
}

function ClinicPicker() {
  const [selectedKey, setSelectedKey] = useState<Key | null>('sea')
  return (
    <RudiStack>
      <RudiComboBox
        label="Pickup clinic"
        items={clinics}
        placeholder="Search clinics"
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
      >
        {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
      </RudiComboBox>
      <RudiText>Selected key: {selectedKey ?? 'none'}</RudiText>
    </RudiStack>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `selectedKey` and `onSelectionChange` when other parts of the page depend on the choice. Use `defaultSelectedKey` for an initial value only.',
      },
      source: {
        code: `function ClinicPicker() {
  const [selectedKey, setSelectedKey] = useState<Key | null>('sea')

  return (
    <RudiComboBox
      label="Pickup clinic"
      items={clinics}
      placeholder="Search clinics"
      selectedKey={selectedKey}
      onSelectionChange={setSelectedKey}
    >
      {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
    </RudiComboBox>
  )
}`,
      },
    },
  },
  render: () => <ClinicPicker />,
}
