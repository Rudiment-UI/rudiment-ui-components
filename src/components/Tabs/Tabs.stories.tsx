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
  title: 'Components/Navigation/Tabs',
  component: RudiTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tabs switch between related views in place. Compose `RudiTabs` (selection and orientation) with `RudiTabList` (`aria-label`, variant), `RudiTab` (label, optional icon, badge or `href`) and `RudiTabPanel` (matching `id`). Arrow keys move between tabs, Home and End jump to the ends, and disabled tabs are skipped. Horizontal lists scroll instead of wrapping on narrow screens.',
      },
    },
  },
  args: {
    defaultSelectedKey: 'pending',
    children: [
      <RudiTabList key="list" aria-label="Shipment status">
        <RudiTab id="pending">Pending</RudiTab>
        <RudiTab id="active">Active</RudiTab>
        <RudiTab id="complete">Complete</RudiTab>
      </RudiTabList>,
      <RudiTabPanel key="pending" id="pending">
        <RudiText noMargin>Shipments awaiting pickup.</RudiText>
      </RudiTabPanel>,
      <RudiTabPanel key="active" id="active">
        <RudiText noMargin>Shipments in transit.</RudiText>
      </RudiTabPanel>,
      <RudiTabPanel key="complete" id="complete">
        <RudiText noMargin>Delivered shipments.</RudiText>
      </RudiTabPanel>,
    ],
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
      description: 'Whether arrow-key focus also selects the tab (`automatic`) or requires Enter or Space (`manual`).',
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A horizontal list of three tabs with the first selected. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `underline` list is the default and suits page sections. Use `pill` for compact switches inside a card or toolbar, where an underline would compete with nearby borders. Pick one variant per page.',
      },
    },
  },
  render: () => (
    <RudiStack space="section">
      <RudiTabs defaultSelectedKey="pending">
        <RudiTabList aria-label="Shipment status, underline" variant="underline">
          <RudiTab id="pending">Pending</RudiTab>
          <RudiTab id="active">Active</RudiTab>
          <RudiTab id="complete">Complete</RudiTab>
        </RudiTabList>
        <RudiTabPanel id="pending">
          <RudiText noMargin>Shipments awaiting pickup.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="active">
          <RudiText noMargin>Shipments in transit.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="complete">
          <RudiText noMargin>Delivered shipments.</RudiText>
        </RudiTabPanel>
      </RudiTabs>
      <RudiTabs defaultSelectedKey="pending">
        <RudiTabList aria-label="Shipment status, pill" variant="pill">
          <RudiTab id="pending">Pending</RudiTab>
          <RudiTab id="active">Active</RudiTab>
          <RudiTab id="complete">Complete</RudiTab>
        </RudiTabList>
        <RudiTabPanel id="pending">
          <RudiText noMargin>Shipments awaiting pickup.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="active">
          <RudiText noMargin>Shipments in transit.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="complete">
          <RudiText noMargin>Delivered shipments.</RudiText>
        </RudiTabPanel>
      </RudiTabs>
    </RudiStack>
  ),
}

export const Orientation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal tabs suit a few short labels above their content. Set `orientation="vertical"` on `RudiTabs` (not the list) for a settings-style layout with many sections, where the list sits beside the panels and Up and Down arrows move between tabs.',
      },
    },
  },
  render: () => (
    <RudiStack space="section">
      <RudiTabs defaultSelectedKey="pending">
        <RudiTabList aria-label="Shipment status">
          <RudiTab id="pending">Pending</RudiTab>
          <RudiTab id="active">Active</RudiTab>
        </RudiTabList>
        <RudiTabPanel id="pending">
          <RudiText noMargin>Shipments awaiting pickup.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="active">
          <RudiText noMargin>Shipments in transit.</RudiText>
        </RudiTabPanel>
      </RudiTabs>
      <RudiTabs orientation="vertical" defaultSelectedKey="general">
        <RudiTabList aria-label="Settings sections">
          <RudiTab id="general">General</RudiTab>
          <RudiTab id="notifications">Notifications</RudiTab>
          <RudiTab id="members">Members</RudiTab>
        </RudiTabList>
        <RudiTabPanel id="general">
          <RudiText noMargin>General settings.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="notifications">
          <RudiText noMargin>Notification preferences.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="members">
          <RudiText noMargin>Team members.</RudiText>
        </RudiTabPanel>
      </RudiTabs>
    </RudiStack>
  ),
}

export const WithBadges: Story = {
  name: 'With badges',
  parameters: {
    docs: {
      description: {
        story:
          'Pass a `RudiBadge` to `badge` to show a count on a tab. Put counts in `badge` rather than in the label so they are read as part of the tab name ("Pending 7").',
      },
    },
  },
  render: () => (
    <RudiTabs defaultSelectedKey="pending">
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
      <RudiTabPanel id="pending">
        <RudiText noMargin>Shipments awaiting pickup.</RudiText>
      </RudiTabPanel>
      <RudiTabPanel id="active">
        <RudiText noMargin>Shipments in transit.</RudiText>
      </RudiTabPanel>
      <RudiTabPanel id="complete">
        <RudiText noMargin>Delivered shipments.</RudiText>
      </RudiTabPanel>
    </RudiTabs>
  ),
}

export const WithIcons: Story = {
  name: 'With icons',
  parameters: {
    docs: {
      description: {
        story:
          'Pass an Iconify name to `icon` to help people scan a longer list of sections. The label stays visible and is the accessible name.',
      },
    },
  },
  render: () => (
    <RudiTabs defaultSelectedKey="overview">
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

function ShipmentLinkTabs() {
  // Stand-in for a router: in an app, pass your router's navigate and derive selectedKey from the URL.
  const [path, setPath] = useState('/shipments/pending')
  return (
    <RudiRouterProvider navigate={setPath}>
      <RudiStack space="content">
        <RudiTabs selectedKey={path}>
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
}

export const LinkTabs: Story = {
  name: 'Link tabs',
  parameters: {
    docs: {
      description: {
        story:
          'When each tab is its own URL, give the tab an `href` and take `selectedKey` from the current route so the selected tab tracks the address bar. Tabs with `href` render as links and navigate through `RudiRouterProvider`.',
      },
      source: {
        code: `function ShipmentLinkTabs() {
  const { pathname, navigate } = useYourRouter()

  return (
    <RudiRouterProvider navigate={navigate}>
      <RudiTabs selectedKey={pathname}>
        <RudiTabList aria-label="Shipment status">
          <RudiTab id="/shipments/pending" href="/shipments/pending">Pending</RudiTab>
          <RudiTab id="/shipments/active" href="/shipments/active">Active</RudiTab>
          <RudiTab id="/shipments/complete" href="/shipments/complete">Complete</RudiTab>
        </RudiTabList>
      </RudiTabs>
    </RudiRouterProvider>
  )
}`,
      },
    },
  },
  render: () => <ShipmentLinkTabs />,
}

export const DisabledTabs: Story = {
  name: 'Disabled tabs',
  parameters: {
    docs: {
      description: {
        story:
          'Set `isDisabled` on a `RudiTab` for a section that is not available yet. Keyboard focus skips it. Use `isDisabled` on `RudiTabs` to disable every tab, and say why in nearby text.',
      },
    },
  },
  render: () => (
    <RudiTabs defaultSelectedKey="pending">
      <RudiTabList aria-label="Shipment status">
        <RudiTab id="pending">Pending</RudiTab>
        <RudiTab id="active" isDisabled>
          Active
        </RudiTab>
        <RudiTab id="complete">Complete</RudiTab>
      </RudiTabList>
      <RudiTabPanel id="pending">
        <RudiText noMargin>Shipments awaiting pickup.</RudiText>
      </RudiTabPanel>
      <RudiTabPanel id="active">
        <RudiText noMargin>Shipments in transit.</RudiText>
      </RudiTabPanel>
      <RudiTabPanel id="complete">
        <RudiText noMargin>Delivered shipments.</RudiText>
      </RudiTabPanel>
    </RudiTabs>
  ),
}

function ShipmentTabs() {
  const [selected, setSelected] = useState<Key>('active')
  return (
    <RudiStack space="content">
      <RudiTabs selectedKey={selected} onSelectionChange={setSelected}>
        <RudiTabList aria-label="Shipment status">
          <RudiTab id="pending">Pending</RudiTab>
          <RudiTab id="active">Active</RudiTab>
          <RudiTab id="complete">Complete</RudiTab>
        </RudiTabList>
        <RudiTabPanel id="pending">
          <RudiText noMargin>Shipments awaiting pickup.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="active">
          <RudiText noMargin>Shipments in transit.</RudiText>
        </RudiTabPanel>
        <RudiTabPanel id="complete">
          <RudiText noMargin>Delivered shipments.</RudiText>
        </RudiTabPanel>
      </RudiTabs>
      <RudiText variant="caption" tone="subtle" noMargin>
        Selected: {String(selected)}
      </RudiText>
    </RudiStack>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `selectedKey` and `onSelectionChange` when other UI depends on the selected tab or you need to change it from code. `onSelectionChange` receives the tab `id`, not an event. Use `defaultSelectedKey` when nothing else needs it.',
      },
      source: {
        code: `function ShipmentTabs() {
  const [selected, setSelected] = useState<Key>('active')

  return (
    <RudiTabs selectedKey={selected} onSelectionChange={setSelected}>
      <RudiTabList aria-label="Shipment status">
        <RudiTab id="pending">Pending</RudiTab>
        <RudiTab id="active">Active</RudiTab>
        <RudiTab id="complete">Complete</RudiTab>
      </RudiTabList>
      <RudiTabPanel id="pending">Shipments awaiting pickup.</RudiTabPanel>
      <RudiTabPanel id="active">Shipments in transit.</RudiTabPanel>
      <RudiTabPanel id="complete">Delivered shipments.</RudiTabPanel>
    </RudiTabs>
  )
}`,
      },
    },
  },
  render: () => <ShipmentTabs />,
}
