import type { Meta, StoryObj } from '@storybook/react'
import { RudiDescriptionList } from './DescriptionList'
import { RudiStack } from '../../layouts/Stack/Stack'

const items = [
  { term: 'Carrier', description: 'FedEx Priority Overnight' },
  { term: 'Tracking number', description: '7489 2210 0043' },
  { term: 'Origin', description: 'Denver, CO' },
  { term: 'Destination', description: 'Austin, TX' },
  { term: 'Ship date', description: 'Nov 21, 2026' },
  { term: 'Status', description: 'In transit' },
]

const meta = {
  title: 'Components/Data/DescriptionList',
  component: RudiDescriptionList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A semantic description list (`<dl>`) of term and description pairs. Stacked or inline layout, responsive columns, and optional dividers. The inline layout collapses by container width, not viewport width.',
      },
    },
  },
  args: { items, layout: 'stacked', columns: 1, dividers: false },
  argTypes: {
    items: {
      control: 'object',
      table: { category: 'Content' },
    },
    layout: {
      control: 'inline-radio',
      options: ['stacked', 'inline'],
      table: { category: 'Layout' },
    },
    columns: {
      control: { type: 'number', min: 1, max: 4 },
      table: { category: 'Layout' },
    },
    dividers: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiDescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use it for read-only key and value details, such as the attributes of a record or an order summary. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Layouts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `layout="inline"` for short values beside their terms. It falls back to stacked when its container is narrow, so it is safe in sidebars. Add `dividers` to separate long lists.',
      },
    },
  },
  render: (args) => (
    <RudiStack space="section">
      <RudiDescriptionList
        {...args}
        items={items.slice(0, 3)}
        layout="stacked"
      />
      <RudiDescriptionList
        {...args}
        items={items.slice(0, 3)}
        layout="inline"
      />
      <RudiDescriptionList
        {...args}
        items={items.slice(0, 3)}
        layout="inline"
        dividers
      />
    </RudiStack>
  ),
}

export const Columns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `columns` to spread a long list across the width of a wide container. Do not use the list for data with several attributes per row (use Table), and do not put form fields in it (use a Form).',
      },
    },
  },
  args: { columns: 3 },
}
