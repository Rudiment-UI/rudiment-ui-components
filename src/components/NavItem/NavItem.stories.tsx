import type { Meta, StoryObj } from '@storybook/react'
import { RudiNavItem } from './NavItem'
import { RudiBadge } from '@/components/Badge/Badge'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/NavItem',
  component: RudiNavItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An item for a sidebar or navigation list, with an optional icon and badge. It renders as a link when it has an `href` and as a button otherwise. For in-page actions, use `RudiButton`.',
      },
    },
  },
  args: {
    label: 'Dashboard',
    icon: 'lucide:home',
  },
  argTypes: {
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    icon: {
      control: 'text',
      table: { category: 'Content' },
    },
    badge: {
      control: false,
      table: { category: 'Content' },
    },
    isActive: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    onPress: {
      action: 'pressed',
      table: { category: 'Events' },
    },
    href: {
      control: 'text',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiNavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A navigation item with an icon and a label. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const ActivePage: Story = {
  name: 'Active page',
  parameters: {
    docs: {
      description: {
        story:
          'Set `isActive` on the item for the page people are on. It applies the active style and sets `aria-current="page"`.',
      },
    },
  },
  args: { isActive: true },
}

export const WithBadge: Story = {
  name: 'With badge',
  parameters: {
    docs: {
      description: {
        story:
          'Pass a `badge` to show a count or status after the label, such as unread messages.',
      },
    },
  },
  args: {
    label: 'Notifications',
    icon: 'lucide:bell',
    badge: <RudiBadge size="sm">5</RudiBadge>,
  },
}

export const WithoutIcon: Story = {
  name: 'Without icon',
  parameters: {
    docs: {
      description: {
        story:
          'The icon is optional. Leave it out for nested or secondary items, but stay consistent within one list.',
      },
    },
  },
  args: { icon: undefined },
}

export const LinksAndButtons: Story = {
  name: 'Links and buttons',
  parameters: {
    docs: {
      description: {
        story:
          'Use `href` for real page navigation so the browser handles it and people can open it in a new tab. Use `onPress` for client-side navigation where you control the routing. Pass one or the other for the same action, not both.',
      },
    },
  },
  render: () => (
    <RudiStack space="inline">
      <RudiNavItem label="Settings" icon="lucide:settings" href="#" />
      <RudiNavItem
        label="Log out"
        icon="lucide:log-out"
        onPress={() => alert('Logged out')}
      />
    </RudiStack>
  ),
}

export const DisabledItem: Story = {
  name: 'Disabled item',
  parameters: {
    docs: {
      description: {
        story:
          'Set `isDisabled` for a destination that exists but is not available to the current user. Prefer hiding it when people have no way to gain access.',
      },
    },
  },
  args: { isDisabled: true },
}

export const Sidebar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Stack items in a `nav` element and label it for screen readers. Mark one item active, and use badges and disabled items sparingly.',
      },
    },
  },
  render: () => (
    <RudiStack as="nav" aria-label="Main" space="inline">
      <RudiNavItem label="Dashboard" icon="lucide:home" isActive />
      <RudiNavItem label="Projects" icon="lucide:folder" />
      <RudiNavItem
        label="Messages"
        icon="lucide:mail"
        badge={<RudiBadge size="sm">3</RudiBadge>}
      />
      <RudiNavItem label="Settings" icon="lucide:settings" />
      <RudiNavItem label="Help" icon="lucide:help-circle" isDisabled />
    </RudiStack>
  ),
}
