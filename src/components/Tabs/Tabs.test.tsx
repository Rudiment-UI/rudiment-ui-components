import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RouterProvider } from 'react-aria'
import type { Key } from 'react-aria-components'
import { RudiTabs, type RudiTabsProps } from './Tabs'
import { RudiTabList } from './TabList'
import { RudiTab } from './Tab'
import { RudiTabPanel } from './TabPanel'
import { RudiBadge } from '../Badge/Badge'

function StatusTabs({
  variant,
  disableActive,
  ...props
}: Omit<RudiTabsProps, 'children'> & { variant?: 'underline' | 'pill'; disableActive?: boolean }) {
  return (
    <RudiTabs {...props}>
      <RudiTabList aria-label="Shipment status" variant={variant}>
        <RudiTab id="pending" badge={<RudiBadge size="sm">7</RudiBadge>}>
          Pending
        </RudiTab>
        <RudiTab id="active" icon="lucide:truck" isDisabled={disableActive}>
          Active
        </RudiTab>
        <RudiTab id="complete">Complete</RudiTab>
      </RudiTabList>
      <RudiTabPanel id="pending">Pending panel</RudiTabPanel>
      <RudiTabPanel id="active">Active panel</RudiTabPanel>
      <RudiTabPanel id="complete">Complete panel</RudiTabPanel>
    </RudiTabs>
  )
}

describe('Tabs', () => {
  it('renders a labelled tablist with tabs and the first panel selected', () => {
    render(<StatusTabs />)
    expect(screen.getByRole('tablist', { name: 'Shipment status' })).toHaveClass(
      'rudi-tab-list',
      'rudi-tab-list--underline',
    )
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: /Pending/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Pending panel')
  })

  it('applies variant and orientation classes', () => {
    const { container } = render(<StatusTabs variant="pill" orientation="vertical" />)
    expect(container.querySelector('.rudi-tabs')).toHaveClass('rudi-tabs--vertical')
    const list = screen.getByRole('tablist')
    expect(list).toHaveClass('rudi-tab-list--pill')
    expect(list).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('includes the badge in the tab accessible name', () => {
    render(<StatusTabs />)
    expect(screen.getByRole('tab', { name: 'Pending 7' })).toBeInTheDocument()
    // The icon is decorative and does not leak into the name.
    expect(screen.getByRole('tab', { name: 'Active' })).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<StatusTabs />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations when vertical with a pill variant', async () => {
    const { container } = render(<StatusTabs orientation="vertical" variant="pill" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('moves and selects with arrow keys, Home and End', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(<StatusTabs defaultSelectedKey="pending" onSelectionChange={onSelectionChange} />)
    await user.tab()
    expect(screen.getByRole('tab', { name: /Pending/ })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Active panel')
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Complete' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: /Pending/ })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Complete' })).toHaveFocus()
    expect(onSelectionChange.mock.calls.map((c) => c[0])).toEqual([
      'active',
      'complete',
      'pending',
      'complete',
    ])
  })

  it('uses up/down arrows when vertical', async () => {
    const user = userEvent.setup()
    render(<StatusTabs orientation="vertical" />)
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveFocus()
  })

  it('calls onSelectionChange on click and honours defaultSelectedKey', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(<StatusTabs defaultSelectedKey="complete" onSelectionChange={onSelectionChange} />)
    expect(screen.getByRole('tab', { name: 'Complete' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: /Pending/ }))
    expect(onSelectionChange).toHaveBeenCalledWith('pending')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Pending panel')
  })

  it('stays on selectedKey in controlled mode until the parent updates it', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    const { rerender } = render(
      <StatusTabs selectedKey="active" onSelectionChange={onSelectionChange} />,
    )
    await user.click(screen.getByRole('tab', { name: 'Complete' }))
    expect(onSelectionChange).toHaveBeenCalledWith('complete')
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true')
    rerender(<StatusTabs selectedKey="complete" onSelectionChange={onSelectionChange} />)
    expect(screen.getByRole('tab', { name: 'Complete' })).toHaveAttribute('aria-selected', 'true')
  })

  it('works with parent state in controlled mode', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [key, setKey] = useState<Key>('pending')
      return <StatusTabs selectedKey={key} onSelectionChange={setKey} />
    }
    render(<Controlled />)
    await user.click(screen.getByRole('tab', { name: 'Complete' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Complete panel')
  })

  it('skips a disabled tab during keyboard navigation and ignores clicks on it', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <StatusTabs
        disableActive
        defaultSelectedKey="pending"
        onSelectionChange={onSelectionChange}
      />,
    )
    const active = screen.getByRole('tab', { name: 'Active' })
    expect(active).toHaveAttribute('aria-disabled', 'true')
    await user.click(active)
    expect(onSelectionChange).not.toHaveBeenCalled()
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Complete' })).toHaveFocus()
  })

  it('force-mounts inactive panels when shouldForceMount is set', () => {
    render(
      <RudiTabs>
        <RudiTabList aria-label="Sections">
          <RudiTab id="a">A</RudiTab>
          <RudiTab id="b">B</RudiTab>
        </RudiTabList>
        <RudiTabPanel id="a">Panel A</RudiTabPanel>
        <RudiTabPanel id="b" shouldForceMount>
          Panel B
        </RudiTabPanel>
      </RudiTabs>,
    )
    expect(screen.getByText('Panel B')).toBeInTheDocument()
    expect(screen.getByText('Panel B').closest('.rudi-tab-panel')).toHaveAttribute('inert')
  })

  it('renders link tabs that navigate through RouterProvider', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <RouterProvider navigate={navigate}>
        <RudiTabs selectedKey="pending">
          <RudiTabList aria-label="Shipment status">
            <RudiTab id="pending" href="/shipments/pending">
              Pending
            </RudiTab>
            <RudiTab id="active" href="/shipments/active">
              Active
            </RudiTab>
          </RudiTabList>
        </RudiTabs>
      </RouterProvider>,
    )
    const active = screen.getByRole('tab', { name: 'Active' })
    expect(active.tagName).toBe('A')
    expect(active).toHaveAttribute('href', '/shipments/active')
    await user.click(active)
    expect(navigate).toHaveBeenCalledWith('/shipments/active', undefined)
  })

  it('merges custom classNames on every part', () => {
    const { container } = render(
      <RudiTabs className="root-x">
        <RudiTabList aria-label="Sections" className="list-x">
          <RudiTab id="a" className="tab-x">
            A
          </RudiTab>
        </RudiTabList>
        <RudiTabPanel id="a" className="panel-x">
          Panel A
        </RudiTabPanel>
      </RudiTabs>,
    )
    expect(container.querySelector('.rudi-tabs')).toHaveClass('root-x')
    expect(screen.getByRole('tablist')).toHaveClass('rudi-tab-list', 'list-x')
    expect(screen.getByRole('tab')).toHaveClass('rudi-tab', 'tab-x')
    expect(screen.getByRole('tabpanel')).toHaveClass('rudi-tab-panel', 'panel-x')
  })
})
