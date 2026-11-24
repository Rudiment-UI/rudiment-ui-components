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
    docs: {
      description: {
        story:
          'The column count follows the width of the grid, not the viewport, so drag the corner of the frame to see columns drop out with no breakpoints. Spacing steps such as `section` are the part that does change by breakpoint; see [Responsive Spacing](?path=/docs/getting-started-responsive-spacing--docs).',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Labeled label="Drag the corner to resize">
        <div className="w-full max-w-full resize-x overflow-auto rounded-md border border-dashed border-border-default p-2">
          <RudiGrid minCellWidth="10rem" space="group">
            {six.map((item) => (
              <Placeholder key={item} label={item} />
            ))}
          </RudiGrid>
        </div>
      </Labeled>
      <Labeled label='space="section" is 2rem below the md breakpoint (48rem) and 3rem from there up'>
        <RudiGrid minCellWidth="10rem" space="section">
          {six.slice(0, 4).map((item) => (
            <Placeholder key={item} label={item} />
          ))}
        </RudiGrid>
      </Labeled>
    </div>
  ),
}
