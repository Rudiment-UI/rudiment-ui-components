import type { Meta, StoryObj } from '@storybook/react'
import { RudiStack } from './Stack'

const meta = {
  title: 'Layouts/Stack',
  component: RudiStack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Arranges children in a vertical stack with consistent spacing between each item. Supports recursive spacing into nested elements and split positioning.',
      },
    },
  },
  args: {
    recursive: false,
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    recursive: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    space: {
      control: 'text',
      table: { category: 'Layout' },
    },
    splitAfter: {
      control: 'number',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiStack>

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
    <RudiStack {...args}>
      <Placeholder label="First child" />
      <Placeholder label="Second child" />
      <Placeholder label="Third child" />
    </RudiStack>
  ),
}

export const Dense: Story = {
  args: { space: '0.5rem' },
  render: (args) => (
    <RudiStack {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiStack>
  ),
}

export const Loose: Story = {
  args: { space: '3rem' },
  render: (args) => (
    <RudiStack {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiStack>
  ),
}

export const SplitAfterSecond: Story = {
  args: { splitAfter: 2 },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <RudiStack {...args} style={{ height: '100%' }}>
      <Placeholder label="Top item 1" />
      <Placeholder label="Top item 2" />
      <Placeholder label="Pushed to bottom" />
    </RudiStack>
  ),
}

export const AsUnorderedList: Story = {
  render: () => (
    <RudiStack as="ul" space="0.75rem" role="list">
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </RudiStack>
  ),
}

export const Nested: Story = {
  render: () => (
    <RudiStack space="3rem">
      <RudiStack space="1rem">
        <Placeholder label="Group 1, item 1" />
        <Placeholder label="Group 1, item 2" />
        <Placeholder label="Group 1, item 3" />
      </RudiStack>
      <RudiStack space="1rem">
        <Placeholder label="Group 2, item 1" />
        <Placeholder label="Group 2, item 2" />
      </RudiStack>
    </RudiStack>
  ),
}
