import type { Meta, StoryObj } from '@storybook/react'
import { RudiDescriptionList } from './DescriptionList'

const items = [
  { term: 'Carrier', description: 'FedEx Priority Overnight' },
  { term: 'Tracking number', description: '7489 2210 0043' },
  { term: 'Origin', description: 'Denver, CO' },
  { term: 'Destination', description: 'Austin, TX' },
  { term: 'Ship date', description: 'Nov 21, 2026' },
  { term: 'Status', description: 'In transit' },
]

const meta = {
  title: 'Components/DescriptionList',
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

export const Stacked: Story = {}

export const Inline: Story = { args: { layout: 'inline' } }

export const InlineWithDividers: Story = {
  args: { layout: 'inline', dividers: true },
}

export const Columns: Story = { args: { columns: 3 } }
