import type { Meta, StoryObj } from '@storybook/react'
import { RudiBreadcrumb } from './Breadcrumb'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Breadcrumb',
  component: RudiBreadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A navigation trail. The last item is the current page; earlier items with an `href` are links.',
      },
    },
  },
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Shoes', href: '/shoes' },
      { label: 'Running', href: '/shoes/running' },
      { label: 'Trail Blazer 2' },
    ],
  },
  argTypes: {
    separator: { control: 'text', table: { category: 'Appearance' } },
    label: { control: 'text', table: { category: 'Content' } },
  },
} satisfies Meta<typeof RudiBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A four-level trail. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const CurrentPage: Story = {
  name: 'Current page',
  parameters: {
    docs: {
      description: {
        story:
          'Order `items` from the root to the current page, mirroring the real page hierarchy. Give earlier items an `href` so people can jump back up the tree. The last item renders as plain text with `aria-current="page"`, even if it has an `href`.',
      },
    },
  },
  args: {
    items: [
      { label: 'Dashboard', href: '/' },
      { label: 'Settings' },
    ],
  },
}

export const Separators: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass any Iconify name to `separator`. The chevron suits most layouts. A slash reads as a file path and suits technical or documentation sites. Give each trail its own `label` when a page has more than one.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiBreadcrumb
        label="Chevron breadcrumb"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shoes', href: '/shoes' },
          { label: 'Trail Blazer 2' },
        ]}
      />
      <RudiBreadcrumb
        label="Slash breadcrumb"
        separator="lucide:slash"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shoes', href: '/shoes' },
          { label: 'Trail Blazer 2' },
        ]}
      />
    </RudiStack>
  ),
}

export const DeepHierarchy: Story = {
  name: 'Deep hierarchy',
  parameters: {
    docs: {
      description: {
        story:
          "A long trail wraps to several lines on narrow screens. Keep the trail short: if the hierarchy is deep, pass only the levels people need to navigate back to, rather than every ancestor. For steps in a linear flow such as checkout or onboarding, use a stepper instead.",
      },
    },
  },
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Shoes', href: '/shoes' },
      { label: 'Running', href: '/shoes/running' },
      { label: 'Trail', href: '/shoes/running/trail' },
      { label: 'Trail Blazer 2' },
    ],
  },
}
