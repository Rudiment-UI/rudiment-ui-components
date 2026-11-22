import type { Meta, StoryObj } from '@storybook/react'
import { RudiSelect, type RudiSelectProps } from './Select'
import { RudiOption } from './Option'

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
          'A dropdown menu for choosing one option from a list. Supports placeholder text, helper text, validation errors, and required and disabled states.',
      },
    },
  },
  args: {
    label: 'Favourite colour',
    items: colors,
    placeholder: 'Choose a colour',
    isRequired: false,
    isDisabled: false,
    description: '',
    errorMessage: '',
    selectedKey: undefined,
    className: '',
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

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    label: 'Role',
    items: roles,
    placeholder: 'Select a role',
    description: 'This determines what the user can access.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Role',
    items: roles,
    placeholder: 'Select a role',
    errorMessage: 'Please select a role before continuing.',
  },
}

export const Required: Story = {
  args: {
    isRequired: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Region',
    items: [{ id: 'us', label: 'United States' }],
    defaultSelectedKey: 'us',
    isDisabled: true,
  },
}
