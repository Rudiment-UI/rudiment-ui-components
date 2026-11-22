import type { Meta, StoryObj } from '@storybook/react'
import { RudiEmptyState } from './EmptyState'
import { RudiButton } from '../Button/Button'
import { RudiCluster } from '../../layouts/Cluster/Cluster'

const illustrationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><ellipse cx="80" cy="104" rx="56" ry="8" fill="#94a3b8" opacity=".25"/><rect x="40" y="36" width="80" height="60" rx="8" fill="#e2e8f0"/><path d="M40 52h80" stroke="#94a3b8" stroke-width="4"/><rect x="66" y="22" width="28" height="22" rx="4" fill="#60a5fa"/><circle cx="80" cy="72" r="10" fill="#fff" stroke="#94a3b8" stroke-width="4"/></svg>`
const illustration = `data:image/svg+xml,${encodeURIComponent(illustrationSvg)}`

const meta = {
  title: 'Components/EmptyState',
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

export const WithIllustration: Story = {
  name: 'With illustration',
  args: {
    illustration,
    title: 'No devices registered',
    description: 'Register a data logger to start tracking temperatures.',
    action: <RudiButton variant="primary">Register device</RudiButton>,
  },
}

export const SmallWithIllustration: Story = {
  name: 'Small with illustration',
  args: {
    size: 'sm',
    illustration,
    title: 'No devices registered',
    description: 'Devices you register will appear here.',
  },
}
