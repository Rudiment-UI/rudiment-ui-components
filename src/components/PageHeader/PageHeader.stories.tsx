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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A page title with a subtitle. Change the props in the API reference below to try every option on this example.',
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
          'Put the primary page actions in `actions` so they sit opposite the title and wrap beneath it on narrow screens. Keep one primary button and let the rest be secondary.',
      },
    },
  },
  args: {
    actions: (
      <RudiCluster space="inline">
        <RudiButton variant="secondary">Import</RudiButton>
        <RudiButton>New customer</RudiButton>
      </RudiCluster>
    ),
  },
}

export const TitleOnly: Story = {
  name: 'Title only',
  parameters: {
    docs: {
      description: {
        story:
          'Omit the subtitle when the title says everything the reader needs.',
      },
    },
  },
  args: { subtitle: undefined },
}

export const WithEyebrowAndMeta: Story = {
  name: 'With breadcrumbs and status',
  parameters: {
    docs: {
      description: {
        story:
          'Use `eyebrow` for breadcrumbs above the title and `meta` for status badges beside it on detail pages. Use one `RudiPageHeader` per page: it renders the page `h1`, so use `RudiSectionHeader` for regions within it.',
      },
    },
  },
  args: {
    title: 'REF-1042',
    subtitle: 'Denver, CO to Austin, TX',
    eyebrow: (
      <RudiBreadcrumb
        items={[{ label: 'Shipments', href: '#' }, { label: 'REF-1042' }]}
      />
    ),
    meta: (
      <RudiCluster space="inline">
        <RudiBadge variant="info">In transit</RudiBadge>
        <RudiBadge variant="success">Cryo verified</RudiBadge>
      </RudiCluster>
    ),
    actions: <RudiButton>Track</RudiButton>,
  },
}
