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
  parameters: {
    docs: {
      description: {
        story:
          'Lay out cards, thumbnails or other similar items in equal-width columns that appear and disappear as the container resizes. This grid is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
  args: { minCellWidth: '15rem', space: 'content' },
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

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm text-text-secondary">{label}</p>
      {children}
    </div>
  )
}

const six = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']

export const CellWidth: Story = {
  name: 'Cell width',
  parameters: {
    docs: {
      description: {
        story:
          'Set `minCellWidth` to the narrowest a cell can get before it stops being useful. The grid fits as many columns of at least that width as the container allows, so small cells give many columns and large cells give few.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {['8rem', '15rem', '24rem'].map((width) => (
        <Labeled key={width} label={`minCellWidth="${width}"`}>
          <RudiGrid minCellWidth={width} space="content">
            {six.map((item) => (
              <Placeholder key={item} label={item} />
            ))}
          </RudiGrid>
        </Labeled>
      ))}
    </div>
  ),
}

export const SpacingBetweenItems: Story = {
  name: 'Spacing between items',
  parameters: {
    docs: {
      description: {
        story:
          'Match `space` to how closely the items relate: `inline` for dense tiles, `group` for cards, `section` when each item is a block in its own right. The gap applies to both rows and columns.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['inline', 'group', 'section'] as const).map((space) => (
        <Labeled key={space} label={`space="${space}"`}>
          <RudiGrid minCellWidth="10rem" space={space}>
            {six.slice(0, 4).map((item) => (
              <Placeholder key={item} label={item} />
            ))}
          </RudiGrid>
        </Labeled>
      ))}
    </div>
  ),
}

export const FixedSetOfItems: Story = {
  name: 'Fixed set of items',
  parameters: {
    docs: {
      description: {
        story:
          'A grid keeps its empty columns by default, so items stay one width as the set grows. Set `fillRow` for a fixed set, such as four stat cards, so the items widen to share the whole row.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Labeled label="Default: empty columns are kept">
        <RudiGrid minCellWidth="10rem" space="content">
          <Placeholder label="Revenue" />
          <Placeholder label="Orders" />
          <Placeholder label="Refunds" />
          <Placeholder label="Customers" />
        </RudiGrid>
      </Labeled>
      <Labeled label="fillRow: items share the row">
        <RudiGrid minCellWidth="10rem" space="content" fillRow>
          <Placeholder label="Revenue" />
          <Placeholder label="Orders" />
          <Placeholder label="Refunds" />
          <Placeholder label="Customers" />
        </RudiGrid>
      </Labeled>
    </div>
  ),
}

export const AsAList: Story = {
  name: 'As a list',
  parameters: {
    docs: {
      description: {
        story:
          'Render the grid as `ul` or `ol` when the items are a list, such as search results. Screen readers announce the item count, and the grid removes the bullets and indent.',
      },
    },
  },
  render: () => (
    <RudiGrid as="ul" minCellWidth="12rem" space="content" aria-label="Recent files">
      {['Budget.xlsx', 'Notes.md', 'Roadmap.pdf', 'Photo.png'].map((file) => (
        <li key={file}>
          <Placeholder label={file} />
        </li>
      ))}
    </RudiGrid>
  ),
}

export const Responsive: Story = {
  parameters: {
    devicePreview: { height: 560 },
    docs: {
      description: {
        story:
          'Columns drop out as the grid narrows, with no breakpoints: the count follows the grid\'s own width, so it works the same inside a sidebar or a card. The gap is the `section` step, which is 2rem on small screens and 3rem from `md` (48rem). Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-theme-responsive-spacing--docs).',
      },
    },
  },
  render: () => (
    <RudiGrid minCellWidth="10rem" space="section">
      {six.map((item) => (
        <Placeholder key={item} label={item} />
      ))}
    </RudiGrid>
  ),
}
