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
  render: (args) => (
    <RudiSidebar {...args}>
      <SidebarPane label="Sidebar" />
      <ContentPane label="Main content" />
    </RudiSidebar>
  ),
}

export const RightSide: Story = {
  args: { side: 'right' },
  render: (args) => (
    <RudiSidebar {...args}>
      <ContentPane label="Main content" />
      <SidebarPane label="Sidebar" />
    </RudiSidebar>
  ),
}

export const NarrowSidebar: Story = {
  args: { sideWidth: '12rem' },
  render: (args) => (
    <RudiSidebar {...args}>
      <SidebarPane label="Narrow sidebar" />
      <ContentPane label="Main content" />
    </RudiSidebar>
  ),
}

export const WideSidebar: Story = {
  args: { sideWidth: '30rem' },
  render: (args) => (
    <RudiSidebar {...args}>
      <SidebarPane label="Wide sidebar" />
      <ContentPane label="Main content" />
    </RudiSidebar>
  ),
}

export const NoStretch: Story = {
  args: { noStretch: true },
  render: (args) => (
    <RudiSidebar {...args}>
      <SidebarPane label="Sidebar (not stretched)" />
      <ContentPane label="Taller main content area that demonstrates the sidebar will not stretch to match height." />
    </RudiSidebar>
  ),
}

export const TightGap: Story = {
  args: { space: 'inline' },
  render: (args) => (
    <RudiSidebar {...args}>
      <SidebarPane label="Sidebar" />
      <ContentPane label="Main content" />
    </RudiSidebar>
  ),
}

export const WideGap: Story = {
  args: { space: 'section' },
  render: (args) => (
    <RudiSidebar {...args}>
      <SidebarPane label="Sidebar" />
      <ContentPane label="Main content" />
    </RudiSidebar>
  ),
}
