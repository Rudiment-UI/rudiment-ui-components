import type { Meta, StoryObj } from '@storybook/react'
import { RudiCenter } from './Center'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Center',
  component: RudiCenter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Horizontally centers content with a configurable maximum width. Add gutters for edge padding or use intrinsic mode to let children size to their own content.',
      },
    },
  },
  args: {
    intrinsic: false,
    maxWidth: '60rem',
    gutters: 'gutter',
    as: 'div',
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    intrinsic: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    maxWidth: {
      control: 'text',
      table: { category: 'Layout' },
    },
    gutters: spaceArgType,
  },
} satisfies Meta<typeof RudiCenter>

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
  render: (args) => (
    <RudiCenter {...args}>
      <Placeholder label="Centered content" />
    </RudiCenter>
  ),
}

export const NarrowMaxWidth: Story = {
  args: { maxWidth: '30rem' },
  render: (args) => (
    <RudiCenter {...args}>
      <Placeholder label="Narrow centered content" />
    </RudiCenter>
  ),
}

export const WideMaxWidth: Story = {
  args: { maxWidth: '90rem' },
  render: (args) => (
    <RudiCenter {...args}>
      <Placeholder label="Wide centered content" />
    </RudiCenter>
  ),
}

export const WithGutters: Story = {
  args: { gutters: 12 },
  render: (args) => (
    <RudiCenter {...args}>
      <Placeholder label="Content with large gutters" />
    </RudiCenter>
  ),
}

export const Intrinsic: Story = {
  args: { intrinsic: true },
  render: (args) => (
    <RudiCenter {...args}>
      <Placeholder label="Short label" />
      <Placeholder label="A slightly longer label" />
      <Placeholder label="Short" />
    </RudiCenter>
  ),
}

export const AsSection: Story = {
  render: () => (
    <RudiCenter as="section" maxWidth="40rem">
      <Placeholder label="Inside a section element" />
    </RudiCenter>
  ),
}
