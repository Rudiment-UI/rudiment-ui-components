import type { Meta, StoryObj } from '@storybook/react'
import { RudiCluster } from './Cluster'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Cluster',
  component: RudiCluster,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A horizontal wrapping layout for inline elements like tags, buttons, or badges. Items flow naturally and wrap to the next line when space runs out.',
      },
    },
  },
  args: {
    as: 'div',
    space: 'inline',
    justify: 'flex-start',
    align: 'flex-start',
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    space: spaceArgType,
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
      ],
      table: { category: 'Layout' },
    },
    align: {
      control: 'select',
      options: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiCluster>

export default meta
type Story = StoryObj<typeof meta>

function Tag({ label }: { label: string }) {
  return (
    <div className="border border-border-default rounded-md px-3 py-1 bg-surface-raised">
      {label}
    </div>
  )
}

export const Default: Story = {
  render: (args) => (
    <RudiCluster {...args}>
      <Tag label="Design" />
      <Tag label="Development" />
      <Tag label="Accessibility" />
      <Tag label="Typography" />
      <Tag label="Layout" />
    </RudiCluster>
  ),
}

export const Dense: Story = {
  args: { space: 1 },
  render: (args) => (
    <RudiCluster {...args}>
      <Tag label="Design" />
      <Tag label="Development" />
      <Tag label="Accessibility" />
      <Tag label="Typography" />
      <Tag label="Layout" />
    </RudiCluster>
  ),
}

export const Loose: Story = {
  args: { space: 8 },
  render: (args) => (
    <RudiCluster {...args}>
      <Tag label="Design" />
      <Tag label="Development" />
      <Tag label="Accessibility" />
      <Tag label="Typography" />
      <Tag label="Layout" />
    </RudiCluster>
  ),
}

export const Centered: Story = {
  args: { justify: 'center' },
  render: (args) => (
    <RudiCluster {...args}>
      <Tag label="Design" />
      <Tag label="Development" />
      <Tag label="Accessibility" />
      <Tag label="Typography" />
      <Tag label="Layout" />
    </RudiCluster>
  ),
}

export const SpaceBetween: Story = {
  args: { justify: 'space-between' },
  render: (args) => (
    <RudiCluster {...args}>
      <Tag label="Design" />
      <Tag label="Development" />
      <Tag label="Accessibility" />
    </RudiCluster>
  ),
}

export const AsUnorderedList: Story = {
  render: () => (
    <RudiCluster as="ul" space={3} role="list">
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
      <li>Fourth item</li>
    </RudiCluster>
  ),
}
