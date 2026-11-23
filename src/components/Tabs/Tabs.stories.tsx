import { useState } from 'react'
import type { Key } from 'react-aria-components'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiTabs } from './Tabs'
import { RudiTabList } from './TabList'
import { RudiTab } from './Tab'
import { RudiTabPanel } from './TabPanel'
import { RudiBadge } from '../Badge/Badge'
import { RudiRouterProvider } from '../RouterProvider/RouterProvider'
import { RudiStack } from '../../layouts/Stack/Stack'
import { RudiText } from '../../typography/Text/Text'

const meta = {
  title: 'Components/Tabs',
  component: RudiTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tabs switch between related views in place. Compose `RudiTabs` (selection + orientation) with `RudiTabList` (`aria-label`, variant), `RudiTab` (label, optional icon, badge or `href`) and `RudiTabPanel` (matching `id`). Arrow keys move between tabs, Home/End jump to the ends, and disabled tabs are skipped. Horizontal lists scroll instead of wrapping on narrow screens.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
    defaultSelectedKey: 'pending',
    keyboardActivation: 'automatic',
    isDisabled: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { category: 'Layout' },
    },
    children: {
      control: false,
      description: 'A `RudiTabList` followed by one `RudiTabPanel` per tab.',
      table: { category: 'Content' },
    },
    selectedKey: {
      control: 'text',
      description: 'The selected tab id (controlled). Pair with `onSelectionChange`.',
      table: { category: 'State' },
    },
    defaultSelectedKey: {
      control: 'text',
      description: 'The initially selected tab id (uncontrolled).',
      table: { category: 'State' },
    },
    disabledKeys: {
      control: false,
      description: 'Tab ids that cannot be selected. Alternatively set `isDisabled` on a `RudiTab`.',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables every tab.',
      table: { category: 'State' },
    },
    keyboardActivation: {
      control: 'inline-radio',
      options: ['automatic', 'manual'],
      description: 'Whether arrow-key focus also selects the tab (`automatic`) or requires Enter/Space (`manual`).',
      table: { category: 'State' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    onSelectionChange: {
      action: 'selectionChange',
      description: 'Called with the newly selected tab id.',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiTabs>

export default meta
type Story = StoryObj<typeof meta>

function Panels() {
  return (
    <>
      <RudiTabPanel id="pending">
        <RudiText noMargin>Shipments awaiting pickup.</RudiText>
      </RudiTabPanel>
      <RudiTabPanel id="active">
        <RudiText noMargin>Shipments in transit.</RudiText>
      </RudiTabPanel>
      <RudiTabPanel id="complete">
        <RudiText noMargin>Delivered shipments.</RudiText>
      </RudiTabPanel>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <RudiTabs {...args}>
      <RudiTabList aria-label="Shipment status">
        <RudiTab id="pending">Pending</RudiTab>
        <RudiTab id="active">Active</RudiTab>
        <RudiTab id="complete">Complete</RudiTab>
      </RudiTabList>
      <Panels />
    </RudiTabs>
  ),
}

export const WithBadges: Story = {
  name: 'With badges',
  render: (args) => (
    <RudiTabs {...args}>
      <RudiTabList aria-label="Shipment status">
        <RudiTab id="pending" badge={<RudiBadge size="sm" variant="warning">7</RudiBadge>}>
          Pending
        </RudiTab>
        <RudiTab id="active" badge={<RudiBadge size="sm" variant="info">4</RudiBadge>}>
          Active
        </RudiTab>
        <RudiTab id="complete" badge={<RudiBadge size="sm">8</RudiBadge>}>
          Complete
        </RudiTab>
      </RudiTabList>
      <Panels />
    </RudiTabs>
  ),
}

export const WithIcons: Story = {
  name: 'With icons',
  args: { defaultSelectedKey: 'overview' },
  render: (args) => (
    <RudiTabs {...args}>
      <RudiTabList aria-label="Shipment sections">
        <RudiTab id="overview" icon="lucide:layout-dashboard">Overview</RudiTab>
        <RudiTab id="samples" icon="lucide:test-tube">Samples</RudiTab>
        <RudiTab id="tracking" icon="lucide:truck">Tracking</RudiTab>
        <RudiTab id="documents" icon="lucide:file-text">Documents</RudiTab>
      </RudiTabList>
      <RudiTabPanel id="overview"><RudiText noMargin>Shipment summary.</RudiText></RudiTabPanel>
      <RudiTabPanel id="samples"><RudiText noMargin>Samples in this shipment.</RudiText></RudiTabPanel>
      <RudiTabPanel id="tracking"><RudiText noMargin>Carrier tracking events.</RudiText></RudiTabPanel>
      <RudiTabPanel id="documents"><RudiText noMargin>Manifests and chain-of-custody forms.</RudiText></RudiTabPanel>
    </RudiTabs>
  ),
}

export const Pill: Story = {
  render: (args) => (
    <RudiTabs {...args}>
      <RudiTabList aria-label="Shipment status" variant="pill">
        <RudiTab id="pending" badge={<RudiBadge size="sm">7</RudiBadge>}>Pending</RudiTab>
        <RudiTab id="active" badge={<RudiBadge size="sm">4</RudiBadge>}>Active</RudiTab>
        <RudiTab id="complete" badge={<RudiBadge size="sm">8</RudiBadge>}>Complete</RudiTab>
      </RudiTabList>
      <Panels />
    </RudiTabs>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultSelectedKey: 'general' },
  render: (args) => (
    <RudiTabs {...args}>
      <RudiTabList aria-label="Settings">
        <RudiTab id="general" icon="lucide:settings">General</RudiTab>
        <RudiTab id="notifications" icon="lucide:bell">Notifications</RudiTab>
        <RudiTab id="members" icon="lucide:users" badge={<RudiBadge size="sm">12</RudiBadge>}>
          Members
        </RudiTab>
      </RudiTabList>
      <RudiTabPanel id="general"><RudiText noMargin>General settings.</RudiText></RudiTabPanel>
      <RudiTabPanel id="notifications"><RudiText noMargin>Notification preferences.</RudiText></RudiTabPanel>
      <RudiTabPanel id="members"><RudiText noMargin>Team members.</RudiText></RudiTabPanel>
    </RudiTabs>
  ),
}

export const LinkTabs: Story = {
  name: 'Link tabs',
  render: function LinkTabsStory(args) {
    // Stand-in for a router: in an app, pass your router's navigate and derive selectedKey from the URL.
    const [path, setPath] = useState('/shipments/pending')
    return (
      <RudiRouterProvider navigate={setPath}>
        <RudiStack space="content">
          <RudiTabs {...args} selectedKey={path} defaultSelectedKey={undefined}>
            <RudiTabList aria-label="Shipment status">
              <RudiTab id="/shipments/pending" href="/shipments/pending">Pending</RudiTab>
              <RudiTab id="/shipments/active" href="/shipments/active">Active</RudiTab>
              <RudiTab id="/shipments/complete" href="/shipments/complete">Complete</RudiTab>
            </RudiTabList>
          </RudiTabs>
          <RudiText variant="caption" tone="subtle" noMargin>
            Current route: {path}
          </RudiText>
        </RudiStack>
      </RudiRouterProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tabs with `href` render as links and navigate through `RudiRouterProvider`. Derive `selectedKey` from the current route so the selected tab tracks the URL.',
      },
    },
  },
}

export const DisabledTab: Story = {
  name: 'Disabled tab',
  render: (args) => (
    <RudiTabs {...args}>
      <RudiTabList aria-label="Shipment status">
        <RudiTab id="pending">Pending</RudiTab>
        <RudiTab id="active" isDisabled>
          Active
        </RudiTab>
        <RudiTab id="complete">Complete</RudiTab>
      </RudiTabList>
      <Panels />
    </RudiTabs>
  ),
}

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [selected, setSelected] = useState<Key>('active')
    return (
      <RudiStack space="content">
        <RudiTabs
          {...args}
          defaultSelectedKey={undefined}
          selectedKey={selected}
          onSelectionChange={(key) => {
            setSelected(key)
            args.onSelectionChange?.(key)
          }}
        >
          <RudiTabList aria-label="Shipment status">
            <RudiTab id="pending">Pending</RudiTab>
            <RudiTab id="active">Active</RudiTab>
            <RudiTab id="complete">Complete</RudiTab>
          </RudiTabList>
          <Panels />
        </RudiTabs>
        <RudiText variant="caption" tone="subtle" noMargin>
          Selected: {String(selected)}
        </RudiText>
      </RudiStack>
    )
  },
}
