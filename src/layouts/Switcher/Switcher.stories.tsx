import type { Meta, StoryObj } from '@storybook/react'
import { RudiSwitcher } from './Switcher'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Switcher',
  component: RudiSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A responsive layout that displays items in a horizontal row above a width threshold and switches to a vertical stack below it. No media queries needed.',
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
    threshold: {
      control: 'text',
      table: { category: 'Layout' },
    },
    space: spaceArgType,
    limit: {
      control: 'number',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiSwitcher>

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
    <RudiSwitcher {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiSwitcher>
  ),
}

export const NarrowThreshold: Story = {
  args: { threshold: '20rem' },
  render: (args) => (
    <RudiSwitcher {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiSwitcher>
  ),
}

export const WideThreshold: Story = {
  args: { threshold: '60rem' },
  render: (args) => (
    <RudiSwitcher {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiSwitcher>
  ),
}

export const Dense: Story = {
  args: { space: 'inline' },
  render: (args) => (
    <RudiSwitcher {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiSwitcher>
  ),
}

export const Loose: Story = {
  args: { space: 'section' },
  render: (args) => (
    <RudiSwitcher {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiSwitcher>
  ),
}

export const AsSection: Story = {
  render: () => (
    <RudiSwitcher as="section" threshold="30rem">
      <Placeholder label="First" />
      <Placeholder label="Second" />
    </RudiSwitcher>
  ),
}
