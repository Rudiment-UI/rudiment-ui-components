import type { Meta, StoryObj } from '@storybook/react'
import { RudiSubmenuTrigger } from './SubmenuTrigger'
import { RudiMenuTrigger, type RudiMenuTriggerProps } from './MenuTrigger'
import { RudiMenu } from './Menu'
import { RudiMenuItem } from './MenuItem'
import { RudiMenuSection } from './MenuSection'
import { RudiMenuSeparator } from './MenuSeparator'
import { RudiButton } from '@/components/Button/Button'
import { RudiIcon } from '@/components/Icon/Icon'
import { RudiCluster } from '@/layouts/Cluster/Cluster'

const meta: Meta<RudiMenuTriggerProps> = {
  title: 'Components/Navigation/Menu',
  component: RudiMenuTrigger,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A menu of contextual actions that opens from a button. Use it for actions on an item or page, and `RudiNavItem` for navigation between pages.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A menu of four actions that opens from a button. The API reference below lists the props of `RudiMenuTrigger`; set the props of `RudiMenu` and `RudiMenuItem` in the markup.',
      },
    },
  },
  render: () => (
    <RudiMenuTrigger>
      <RudiButton variant="secondary">Actions</RudiButton>
      <RudiMenu onAction={(key) => console.log(key)}>
        <RudiMenuItem id="edit">Edit</RudiMenuItem>
        <RudiMenuItem id="duplicate">Duplicate</RudiMenuItem>
        <RudiMenuItem id="rename">Rename</RudiMenuItem>
        <RudiMenuItem id="delete">Delete</RudiMenuItem>
      </RudiMenu>
    </RudiMenuTrigger>
  ),
}

export const ItemContent: Story = {
  name: 'Item content',
  parameters: {
    docs: {
      description: {
        story:
          'Add an `icon` to help people scan the list, a `shortcut` to teach a key binding, or a `description` for items that need a second line. When an item contains icons or custom content, set `textValue` so screen readers announce a meaningful label.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiMenuTrigger>
        <RudiButton variant="secondary">Icons</RudiButton>
        <RudiMenu onAction={(key) => console.log(key)}>
          <RudiMenuItem id="open" icon="lucide:folder-open" label="Open" />
          <RudiMenuItem id="rename" icon="lucide:pencil" label="Rename" />
          <RudiMenuItem id="duplicate" icon="lucide:copy" label="Duplicate" />
        </RudiMenu>
      </RudiMenuTrigger>
      <RudiMenuTrigger>
        <RudiButton variant="secondary">Shortcuts</RudiButton>
        <RudiMenu onAction={(key) => console.log(key)}>
          <RudiMenuItem id="cut" label="Cut" shortcut="⌘X" />
          <RudiMenuItem id="copy" label="Copy" shortcut="⌘C" />
          <RudiMenuItem id="paste" label="Paste" shortcut="⌘V" />
        </RudiMenu>
      </RudiMenuTrigger>
      <RudiMenuTrigger>
        <RudiButton variant="secondary">Descriptions</RudiButton>
        <RudiMenu onAction={(key) => console.log(key)}>
          <RudiMenuItem
            id="profile"
            icon="lucide:user"
            label="Profile"
            description="View and edit your profile"
          />
          <RudiMenuItem
            id="billing"
            icon="lucide:credit-card"
            label="Billing"
            description="Manage payment methods"
          />
        </RudiMenu>
      </RudiMenuTrigger>
    </RudiCluster>
  ),
}

export const Sections: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Group related items with `RudiMenuSection` and a `title` when the menu has more than five or six actions. Add a `RudiMenuSeparator` between sections to mark the break.',
      },
    },
  },
  render: () => (
    <RudiMenuTrigger>
      <RudiButton variant="secondary">File</RudiButton>
      <RudiMenu onAction={(key) => console.log(key)}>
        <RudiMenuSection title="File">
          <RudiMenuItem
            id="new"
            icon="lucide:file-plus"
            label="New file"
            shortcut="⌘N"
          />
          <RudiMenuItem
            id="open"
            icon="lucide:folder-open"
            label="Open"
            shortcut="⌘O"
          />
          <RudiMenuItem
            id="save"
            icon="lucide:save"
            label="Save"
            shortcut="⌘S"
          />
        </RudiMenuSection>
        <RudiMenuSeparator />
        <RudiMenuSection title="Edit">
          <RudiMenuItem
            id="undo"
            icon="lucide:undo"
            label="Undo"
            shortcut="⌘Z"
          />
          <RudiMenuItem
            id="redo"
            icon="lucide:redo"
            label="Redo"
            shortcut="⇧⌘Z"
          />
        </RudiMenuSection>
      </RudiMenu>
    </RudiMenuTrigger>
  ),
}

export const Selection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `selectionMode` to `single` for a choice such as a sort order, or `multiple` for options that can combine, such as view settings. Use `defaultSelectedKeys` for the initial selection.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiMenuTrigger>
        <RudiButton variant="secondary">Sort by</RudiButton>
        <RudiMenu selectionMode="single" defaultSelectedKeys={['date']}>
          <RudiMenuItem id="name">Name</RudiMenuItem>
          <RudiMenuItem id="date">Date modified</RudiMenuItem>
          <RudiMenuItem id="size">Size</RudiMenuItem>
        </RudiMenu>
      </RudiMenuTrigger>
      <RudiMenuTrigger>
        <RudiButton variant="secondary">View</RudiButton>
        <RudiMenu selectionMode="multiple" defaultSelectedKeys={['files']}>
          <RudiMenuItem id="files">Show files</RudiMenuItem>
          <RudiMenuItem id="folders">Show folders</RudiMenuItem>
          <RudiMenuItem id="hidden">Show hidden</RudiMenuItem>
        </RudiMenu>
      </RudiMenuTrigger>
    </RudiCluster>
  ),
}

export const Submenus: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wrap an item and a nested `RudiMenu` in `RudiSubmenuTrigger` to group related choices under one item. Nest only one level deep. Deeper menus are hard to navigate, especially on mobile.",
      },
    },
  },
  render: () => (
    <RudiMenuTrigger>
      <RudiButton variant="secondary">Actions</RudiButton>
      <RudiMenu onAction={(key) => console.log(key)}>
        <RudiMenuItem id="open" icon="lucide:folder-open" label="Open" />
        <RudiSubmenuTrigger>
          <RudiMenuItem icon="lucide:share" label="Share" />
          <RudiMenu>
            <RudiMenuItem id="email" icon="lucide:mail" label="Email" />
            <RudiMenuItem id="sms" icon="lucide:smartphone" label="SMS" />
          </RudiMenu>
        </RudiSubmenuTrigger>
      </RudiMenu>
    </RudiMenuTrigger>
  ),
}

export const DisabledItems: Story = {
  name: 'Disabled items',
  parameters: {
    docs: {
      description: {
        story:
          'Set `isDisabled` on an item that is unavailable right now, such as Paste with an empty clipboard. The item stays in the list so the menu keeps its shape.',
      },
    },
  },
  render: () => (
    <RudiMenuTrigger>
      <RudiButton variant="secondary">Options</RudiButton>
      <RudiMenu onAction={(key) => console.log(key)}>
        <RudiMenuItem id="copy" label="Copy" shortcut="⌘C" />
        <RudiMenuItem id="paste" label="Paste" shortcut="⌘V" isDisabled />
        <RudiMenuItem id="cut" label="Cut" shortcut="⌘X" />
      </RudiMenu>
    </RudiMenuTrigger>
  ),
}

export const DestructiveActions: Story = {
  name: 'Destructive actions',
  parameters: {
    docs: {
      description: {
        story:
          'Set `isDestructive` on dangerous actions such as "Delete permanently" so they look different from the safe ones. Put them last in the list.',
      },
    },
  },
  render: () => (
    <RudiMenuTrigger>
      <RudiButton variant="secondary">Manage</RudiButton>
      <RudiMenu onAction={(key) => console.log(key)}>
        <RudiMenuItem id="archive" icon="lucide:archive" label="Archive" />
        <RudiMenuItem id="move" icon="lucide:folder" label="Move to folder" />
        <RudiMenuItem
          id="delete"
          icon="lucide:trash-2"
          label="Delete permanently"
          isDestructive
        />
      </RudiMenu>
    </RudiMenuTrigger>
  ),
}

export const RowActions: Story = {
  name: 'Row actions',
  parameters: {
    docs: {
      description: {
        story:
          'An icon-only trigger suits a table row or card, where space is tight. Give the button an `aria-label` because it has no visible text. This example combines actions, a submenu, a destructive item, and a selection section.',
      },
    },
  },
  render: () => (
    <RudiMenuTrigger>
      <RudiButton variant="ghost" aria-label="Actions">
        <RudiIcon icon="lucide:ellipsis" />
      </RudiButton>
      <RudiMenu>
        <RudiMenuSection>
          <RudiMenuItem
            onAction={() => console.log('open')}
            icon="lucide:folder-open"
            label="Open"
            shortcut="⌘O"
          />
          <RudiMenuItem
            onAction={() => console.log('rename')}
            icon="lucide:pencil"
            label="Rename…"
            shortcut="⌘R"
          />
          <RudiMenuItem
            onAction={() => console.log('duplicate')}
            icon="lucide:copy"
            label="Duplicate"
            shortcut="⌘D"
          />
          <RudiMenuItem
            onAction={() => console.log('delete')}
            icon="lucide:trash-2"
            label="Delete…"
            shortcut="⌘⌫"
            isDestructive
          />
          <RudiSubmenuTrigger>
            <RudiMenuItem icon="lucide:share" label="Share" />
            <RudiMenu>
              <RudiMenuItem id="email" icon="lucide:mail" label="Email" />
              <RudiMenuItem id="sms" icon="lucide:smartphone" label="SMS" />
            </RudiMenu>
          </RudiSubmenuTrigger>
        </RudiMenuSection>
        <RudiMenuSeparator />
        <RudiMenuSection
          selectionMode="multiple"
          defaultSelectedKeys={['files']}
        >
          <RudiMenuItem id="files">Show files</RudiMenuItem>
          <RudiMenuItem id="folders">Show folders</RudiMenuItem>
        </RudiMenuSection>
      </RudiMenu>
    </RudiMenuTrigger>
  ),
}
