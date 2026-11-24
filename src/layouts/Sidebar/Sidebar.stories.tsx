import type { Meta, StoryObj } from '@storybook/react'
import { RudiSidebar } from './Sidebar'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Sidebar',
  component: RudiSidebar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A two-panel layout with a fixed-width sidebar and a flexible content area. Automatically stacks vertically when the viewport becomes too narrow.',
      },
    },
  },
  args: {
    side: 'left',
    noStretch: false,
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    noStretch: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    side: {
      control: 'radio',
      options: ['left', 'right'],
      table: { category: 'Layout' },
    },
    sideWidth: {
      control: 'text',
      table: { category: 'Layout' },
    },
    contentMin: {
      control: 'text',
      table: { category: 'Layout' },
    },
    space: spaceArgType,
  },
} satisfies Meta<typeof RudiSidebar>

export default meta
type Story = StoryObj<typeof meta>

function SidebarPane({ label }: { label: string }) {
  return (
    <div className="border border-border-default rounded-md p-4 bg-surface-raised">
      {label}
    </div>
  )
}

function ContentPane({ label }: { label: string }) {
  return (
    <div className="border border-border-default rounded-md p-4 bg-surface-raised min-h-32">
      {label}
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Put navigation, filters or a summary beside the main content. The sidebar keeps its preferred width and the content takes the rest. This layout is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
  render: (args) => (
    <RudiSidebar {...args}>
      <SidebarPane label="Sidebar" />
      <ContentPane label="Main content" />
    </RudiSidebar>
  ),
}

export const SidebarOnTheRight: Story = {
  name: 'Sidebar on the right',
  parameters: {
    docs: {
      description: {
        story:
          'Use `side="right"` for details or inspector panels. The sidebar must then be the last child, so the DOM order matches the visual order.',
      },
    },
  },
  args: { side: 'right' },
  render: (args) => (
    <RudiSidebar {...args}>
      <ContentPane label="Main content" />
      <SidebarPane label="Sidebar" />
    </RudiSidebar>
  ),
}

export const SidebarWidth: Story = {
  name: 'Sidebar width',
  parameters: {
    docs: {
      description: {
        story:
          '`sideWidth` is the width the sidebar aims for, and the content takes the rest. Once the content would be narrower than `contentMin`, the two stack and each takes the full width. Pick the width your sidebar content needs.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {['12rem', '30rem'].map((width) => (
        <RudiSidebar key={width} sideWidth={width}>
          <SidebarPane label={`sideWidth="${width}"`} />
          <ContentPane label="Main content" />
        </RudiSidebar>
      ))}
    </div>
  ),
}

export const UnevenHeights: Story = {
  name: 'Uneven heights',
  parameters: {
    docs: {
      description: {
        story:
          'By default both panels stretch to the height of the taller one. Set `noStretch` when the sidebar should keep its own height, for example a sticky filter list beside long content.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <RudiSidebar>
        <SidebarPane label="Stretched (default)" />
        <ContentPane label="Taller main content area, so the sidebar stretches to match it." />
      </RudiSidebar>
      <RudiSidebar noStretch>
        <SidebarPane label="noStretch" />
        <ContentPane label="Taller main content area; the sidebar keeps its own height." />
      </RudiSidebar>
    </div>
  ),
}

export const SpacingBetweenPanels: Story = {
  name: 'Spacing between panels',
  parameters: {
    docs: {
      description: {
        story:
          'Use `inline` or `content` for tightly related panels and `section` when the panels are distinct regions. The same gap is used if the panels wrap into a column.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['inline', 'group', 'section'] as const).map((space) => (
        <RudiSidebar key={space} space={space}>
          <SidebarPane label={`space="${space}"`} />
          <ContentPane label="Main content" />
        </RudiSidebar>
      ))}
    </div>
  ),
}

export const Responsive: Story = {
  parameters: {
    devicePreview: { height: 360 },
    docs: {
      description: {
        story:
          'The panels stack when the content would be narrower than `contentMin` (50% by default), measured against the sidebar\'s own container, so no breakpoint is needed. The gap is the `section` step, which is 2rem on small screens and 3rem from `md` (48rem). Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-responsive-spacing--docs).',
      },
    },
  },
  render: () => (
    <RudiSidebar sideWidth="12rem" space="section">
      <SidebarPane label="Sidebar" />
      <ContentPane label="Main content" />
    </RudiSidebar>
  ),
}
