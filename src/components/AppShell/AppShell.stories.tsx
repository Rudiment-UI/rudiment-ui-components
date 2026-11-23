import type { Meta, StoryObj } from '@storybook/react'
import { RudiAppShell } from './AppShell'
import { RudiTopBar } from '@/components/TopBar/TopBar'
import { RudiPageHeader } from '@/components/PageHeader/PageHeader'
import { RudiNavItem } from '@/components/NavItem/NavItem'
import { RudiText } from '@/typography/Text/Text'
import { RudiButton } from '@/components/Button/Button'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/AppShell',
  component: RudiAppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive application frame: a sticky sidebar, a content column, and a centered main region. Below 900px the sidebar collapses into a drawer opened by `RudiAppShell.MenuButton`.',
      },
      // An iframe keeps the 900px breakpoint and sticky parts tied to the
      // preview's own width instead of the docs page.
      story: { inline: false, height: '520px' },
    },
  },
  argTypes: {
    isSidebarOpen: { control: false, table: { category: 'State' } },
    defaultSidebarOpen: { control: false, table: { category: 'State' } },
    onSidebarOpenChange: { table: { category: 'Events' } },
    children: { control: false, table: { category: 'Content' } },
    className: { control: 'text', table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof RudiAppShell>

export default meta
type Story = StoryObj<typeof RudiAppShell>

const NAV = [
  { key: 'home', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { key: 'customers', label: 'Customers', icon: 'lucide:users' },
  { key: 'sales', label: 'Sales', icon: 'lucide:trending-up' },
  { key: 'settings', label: 'Settings', icon: 'lucide:settings' },
]

function DemoShell({ defaultSidebarOpen }: { defaultSidebarOpen?: boolean }) {
  return (
    <RudiAppShell defaultSidebarOpen={defaultSidebarOpen}>
      <RudiAppShell.Sidebar aria-label="Primary navigation">
        <RudiText variant="overline" noMargin>
          Acme Inc
        </RudiText>
        <RudiStack space={1} as="nav" aria-label="Sections">
          {NAV.map((item, i) => (
            <RudiNavItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              isActive={i === 0}
            />
          ))}
        </RudiStack>
      </RudiAppShell.Sidebar>
      <RudiAppShell.Content>
        <RudiTopBar
          start={<RudiAppShell.MenuButton />}
          end={<RudiButton size="sm">New</RudiButton>}
        >
          <RudiText noMargin weight="semibold">
            Dashboard
          </RudiText>
        </RudiTopBar>
        <RudiAppShell.Main>
          <RudiPageHeader
            title="Dashboard"
            subtitle="An overview of your account activity."
            actions={<RudiButton variant="secondary">Export</RudiButton>}
          />
          <RudiText>
            Resize the preview below 900px to see the sidebar collapse into a
            drawer.
          </RudiText>
        </RudiAppShell.Main>
      </RudiAppShell.Content>
    </RudiAppShell>
  )
}

export const Default: Story = {
  render: () => <DemoShell />,
}

/** Below 900px the sidebar is a drawer. This story opens it on a phone-sized viewport. */
export const MobileDrawer: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => <DemoShell defaultSidebarOpen />,
}
