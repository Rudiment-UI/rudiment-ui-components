import type { Meta, StoryObj } from '@storybook/react'
import { RudiEmptyState } from './EmptyState'
import { RudiButton } from '../Button/Button'
import { RudiCluster } from '../../layouts/Cluster/Cluster'
import { RudiStack } from '../../layouts/Stack/Stack'

const illustrationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><ellipse cx="80" cy="104" rx="56" ry="8" fill="#94a3b8" opacity=".25"/><rect x="40" y="36" width="80" height="60" rx="8" fill="#e2e8f0"/><path d="M40 52h80" stroke="#94a3b8" stroke-width="4"/><rect x="66" y="22" width="28" height="22" rx="4" fill="#60a5fa"/><circle cx="80" cy="72" r="10" fill="#fff" stroke="#94a3b8" stroke-width="4"/></svg>`
const illustration = `data:image/svg+xml,${encodeURIComponent(illustrationSvg)}`

const meta = {
  title: 'Components/Data/EmptyState',
  component: RudiEmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A centered placeholder for a list, table or section with nothing to show. Pairs an optional icon or spot illustration with a heading, a short explanation and an optional call to action. Use `size="sm"` inside table cells and cards.',
      },
    },
  },
  args: {
    icon: 'lucide:package-open',
    title: 'No shipments yet',
    description: 'Shipments you create will appear here.',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    icon: {
      control: 'text',
      table: { category: 'Content' },
    },
    illustration: {
      control: 'text',
      table: { category: 'Content' },
    },
    title: {
      control: 'text',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      table: { category: 'Content' },
    },
    action: {
      control: false,
      table: { category: 'Content' },
    },
    headingLevel: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof RudiEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Say what is empty and what to do next. Keep `description` to one or two sentences. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const WithActions: Story = {
  name: 'With actions',
  parameters: {
    docs: {
      description: {
        story:
          'Offer at most one primary action, such as creating the first item. When the list is empty because of filters, pair it with a secondary action to clear them.',
      },
    },
  },
  render: (args) => (
    <RudiStack space="section">
      <RudiEmptyState
        {...args}
        action={
          <RudiButton variant="primary" iconBefore="lucide:plus">
            Create shipment
          </RudiButton>
        }
      />
      <RudiEmptyState
        {...args}
        icon="lucide:search-x"
        title="No results"
        description="No shipments match your filters."
        action={
          <RudiCluster space="inline" justify="center">
            <RudiButton variant="secondary">Clear filters</RudiButton>
            <RudiButton variant="primary">Create shipment</RudiButton>
          </RudiCluster>
        }
      />
    </RudiStack>
  ),
}

export const TitleOnly: Story = {
  name: 'Title only',
  parameters: {
    docs: {
      description: {
        story:
          'Drop the icon and description when the context already explains the gap, such as a short list inside a card.',
      },
    },
  },
  args: { icon: undefined, description: undefined, title: 'Nothing here' },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `size="sm"` inside table cells and cards and set `headingLevel` to fit the page outline. Keep `md` for page-level empty states.',
      },
    },
  },
  render: (args) => (
    <RudiStack space="section">
      <RudiEmptyState {...args} size="md" headingLevel={3} />
      <RudiEmptyState
        {...args}
        size="sm"
        headingLevel={4}
        icon="lucide:inbox"
        title="No pending shipments"
        description="Shipments awaiting pickup will appear here."
      />
    </RudiStack>
  ),
}

export const WithIllustration: Story = {
  name: 'With illustration',
  parameters: {
    docs: {
      description: {
        story:
          'Use `illustration` for a spot illustration on page-level empty states. It is decorative, so the title must carry the meaning. It also scales down with `size="sm"`.',
      },
    },
  },
  render: (args) => (
    <RudiStack space="section">
      <RudiEmptyState
        {...args}
        illustration={illustration}
        title="No devices registered"
        description="Register a data logger to start tracking temperatures."
        action={<RudiButton variant="primary">Register device</RudiButton>}
      />
      <RudiEmptyState
        {...args}
        size="sm"
        illustration={illustration}
        title="No devices registered"
        description="Devices you register will appear here."
      />
    </RudiStack>
  ),
}
