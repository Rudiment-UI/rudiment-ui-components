import type { Meta, StoryObj } from '@storybook/react'
import { RudiCover } from './Cover'

const meta = {
  title: 'Layouts/Cover',
  component: RudiCover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A vertical layout that fills a minimum height and vertically centers its principal child element. Ideal for hero sections and full-page layouts.',
      },
    },
  },
  args: {
    minHeight: '25rem',
    space: '2rem',
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
    minHeight: {
      control: 'text',
      table: { category: 'Layout' },
    },
    space: {
      control: 'text',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiCover>

export default meta
type Story = StoryObj<typeof meta>

function Placeholder({
  label,
  centered,
}: {
  label: string
  centered?: boolean
}) {
  const Element = centered ? RudiCover.Centered : 'div'
  return (
    <Element
      className={
        centered
          ? 'border border-border-default rounded-md p-8 bg-surface-raised text-center'
          : 'border border-border-default rounded-md p-4 bg-surface-raised'
      }
    >
      {label}
    </Element>
  )
}

export const Default: Story = {
  render: (args) => (
    <RudiCover {...args}>
      <Placeholder label="Header" />
      <Placeholder label="Centered content" centered />
      <Placeholder label="Footer" />
    </RudiCover>
  ),
}

export const CenteredOnly: Story = {
  render: (args) => (
    <RudiCover {...args}>
      <Placeholder label="Centered content" centered />
    </RudiCover>
  ),
}

export const HeaderAndCentered: Story = {
  render: (args) => (
    <RudiCover {...args}>
      <Placeholder label="Header" />
      <Placeholder label="Centered content" centered />
    </RudiCover>
  ),
}

export const FullViewport: Story = {
  render: (args) => (
    <RudiCover {...args}>
      <Placeholder label="Header" />
      <Placeholder label="Centered content" centered />
      <Placeholder label="Footer" />
    </RudiCover>
  ),
}

export const CustomSpace: Story = {
  args: { minHeight: '400px', space: '3rem' },
  render: (args) => (
    <RudiCover {...args}>
      <Placeholder label="Header" />
      <Placeholder label="Centered content" centered />
      <Placeholder label="Footer" />
    </RudiCover>
  ),
}

export const AsSection: Story = {
  args: { minHeight: '400px' },
  render: (args) => (
    <RudiCover {...args} as="section">
      <header className="border border-border-default rounded-md p-4 bg-surface-raised">
        Header
      </header>
      <main className="rudi-cover__centered border border-border-default rounded-md p-8 bg-surface-raised text-center">
        Main content
      </main>
      <footer className="border border-border-default rounded-md p-4 bg-surface-raised">
        Footer
      </footer>
    </RudiCover>
  ),
}
