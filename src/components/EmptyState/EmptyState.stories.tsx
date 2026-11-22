import type { Meta, StoryObj } from '@storybook/react'
import { RudiEmptyState } from './EmptyState'
import { RudiButton } from '../Button/Button'
import { RudiCluster } from '../../layouts/Cluster/Cluster'

const meta = {
  title: 'Components/EmptyState',
  component: RudiEmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A centered placeholder for a list, table or section with nothing to show. Pairs an optional icon with a heading, a short explanation and an optional call to action. Use `size="sm"` inside table cells and cards.',
      },
    },
  },
  args: {
    icon: 'lucide:package-open',
    title: 'No shipments yet',
    description: 'Shipments you create will appear here.',
    headingLevel: 3,
    size: 'md',
    className: '',
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

export const Default: Story = {}

export const WithAction: Story = {
  name: 'With action',
  args: {
    action: (
      <RudiButton variant="primary" iconBefore="lucide:plus">
        Create shipment
      </RudiButton>
    ),
  },
}

export const WithMultipleActions: Story = {
  name: 'With multiple actions',
  args: {
    icon: 'lucide:search-x',
    title: 'No results',
    description: 'No shipments match your filters.',
    action: (
      <RudiCluster space="0.5rem" justify="center">
        <RudiButton variant="secondary">Clear filters</RudiButton>
        <RudiButton variant="primary">Create shipment</RudiButton>
      </RudiCluster>
    ),
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    icon: 'lucide:inbox',
    title: 'No pending shipments',
    description: 'Shipments awaiting pickup will appear here.',
  },
}

export const TitleOnly: Story = {
  name: 'Title only',
  args: { icon: undefined, description: undefined, title: 'Nothing here' },
}
