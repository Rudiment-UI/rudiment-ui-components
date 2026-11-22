import type { Meta, StoryObj } from '@storybook/react'
import { RudiPageHeader } from './PageHeader'
import { RudiButton } from '@/components/Button/Button'
import { RudiBadge } from '@/components/Badge/Badge'
import { RudiBreadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { RudiCluster } from '@/layouts/Cluster/Cluster'

const meta = {
  title: 'Components/PageHeader',
  component: RudiPageHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A page-level header: a title with an optional subtitle on the left and an actions slot on the right.',
      },
    },
  },
  args: {
    title: 'Customers',
    subtitle: 'Manage your customer accounts and activity.',
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    subtitle: { control: 'text', table: { category: 'Content' } },
    eyebrow: {
      control: false,
      table: { category: 'Content' },
    },
    meta: {
      control: false,
      table: { category: 'Content' },
    },
    headingLevel: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiPageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithActions: Story = {
  args: {
    actions: (
      <RudiCluster space="0.5rem">
        <RudiButton variant="secondary">Import</RudiButton>
        <RudiButton>New customer</RudiButton>
      </RudiCluster>
    ),
  },
}

export const TitleOnly: Story = {
  args: { subtitle: undefined },
}

export const WithEyebrowAndMeta: Story = {
  args: {
    title: 'REF-1042',
    subtitle: 'Denver, CO to Austin, TX',
    eyebrow: (
      <RudiBreadcrumb
        items={[{ label: 'Shipments', href: '#' }, { label: 'REF-1042' }]}
      />
    ),
    meta: (
      <RudiCluster space="0.5rem">
        <RudiBadge variant="info">In transit</RudiBadge>
        <RudiBadge variant="success">Cryo verified</RudiBadge>
      </RudiCluster>
    ),
    actions: <RudiButton>Track</RudiButton>,
  },
}
