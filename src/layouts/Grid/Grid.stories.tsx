import type { Meta, StoryObj } from '@storybook/react'
import { RudiGrid } from './Grid'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Grid',
  component: RudiGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A responsive grid that automatically adjusts its column count based on available width and a minimum cell size. No breakpoints needed.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    minCellWidth: {
      control: 'text',
      table: { category: 'Layout' },
    },
    space: spaceArgType,
    fillRow: {
      control: 'boolean',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiGrid>

export default meta
type Story = StoryObj<typeof meta>

function Placeholder({ label }: { label: string }) {
  return (
    <div className="border border-border-default rounded-md p-4 bg-surface-raised">
      {label}
    </div>
  )
}

export const Default: Story = {
  args: { minCellWidth: '15rem', space: 'content', as: 'div' },
  render: (args) => (
    <RudiGrid {...args}>
      <Placeholder label="Item 1" />
      <Placeholder label="Item 2" />
      <Placeholder label="Item 3" />
      <Placeholder label="Item 4" />
      <Placeholder label="Item 5" />
      <Placeholder label="Item 6" />
    </RudiGrid>
  ),
}

export const NarrowCells: Story = {
  args: { minCellWidth: '8rem' },
  render: (args) => (
    <RudiGrid {...args}>
      <Placeholder label="Item 1" />
      <Placeholder label="Item 2" />
      <Placeholder label="Item 3" />
      <Placeholder label="Item 4" />
      <Placeholder label="Item 5" />
      <Placeholder label="Item 6" />
    </RudiGrid>
  ),
}

export const WideCells: Story = {
  args: { minCellWidth: '24rem' },
  render: (args) => (
    <RudiGrid {...args}>
      <Placeholder label="Item 1" />
      <Placeholder label="Item 2" />
      <Placeholder label="Item 3" />
      <Placeholder label="Item 4" />
    </RudiGrid>
  ),
}

export const TightGap: Story = {
  args: { space: 'inline' },
  render: (args) => (
    <RudiGrid {...args}>
      <Placeholder label="Item 1" />
      <Placeholder label="Item 2" />
      <Placeholder label="Item 3" />
      <Placeholder label="Item 4" />
      <Placeholder label="Item 5" />
      <Placeholder label="Item 6" />
    </RudiGrid>
  ),
}

export const LooseGap: Story = {
  args: { space: 'section' },
  render: (args) => (
    <RudiGrid {...args}>
      <Placeholder label="Item 1" />
      <Placeholder label="Item 2" />
      <Placeholder label="Item 3" />
      <Placeholder label="Item 4" />
      <Placeholder label="Item 5" />
      <Placeholder label="Item 6" />
    </RudiGrid>
  ),
}

/** Four items in a container wide enough for more columns. Toggle `fillRow` to compare: off keeps the empty columns at the end of the row, on widens the four items to fill it. */
export const FillRow: Story = {
  args: { minCellWidth: '10rem', space: 'content', fillRow: true },
  render: (args) => (
    <RudiGrid {...args}>
      <Placeholder label="Revenue" />
      <Placeholder label="Orders" />
      <Placeholder label="Refunds" />
      <Placeholder label="Customers" />
    </RudiGrid>
  ),
}
