import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RudiRouterProvider } from './RouterProvider'
import { RudiLink } from '../Link/Link'
import { RudiNavItem } from '../NavItem/NavItem'
import { RudiBreadcrumb } from '../Breadcrumb/Breadcrumb'

function Links() {
  return (
    <>
      <RudiLink href="/contacts">Contacts</RudiLink>
      <RudiNavItem label="Shipments" href="/shipments" />
      <RudiBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Detail' }]} />
      <RudiLink href="https://example.com" external>
        Docs
      </RudiLink>
    </>
  )
}

describe('RouterProvider', () => {
  it('routes RudiLink, RudiNavItem and RudiBreadcrumb clicks client-side', async () => {
    const navigate = vi.fn()
    render(
      <RudiRouterProvider navigate={navigate}>
        <Links />
      </RudiRouterProvider>,
    )
    await userEvent.click(screen.getByRole('link', { name: 'Contacts' }))
    await userEvent.click(screen.getByRole('link', { name: 'Shipments' }))
    await userEvent.click(screen.getByRole('link', { name: 'Home' }))
    expect(navigate.mock.calls.map((c) => c[0])).toEqual(['/contacts', '/shipments', '/'])
  })

  it('leaves external links to the browser', async () => {
    const navigate = vi.fn()
    render(
      <RudiRouterProvider navigate={navigate}>
        <Links />
      </RudiRouterProvider>,
    )
    const docs = screen.getByRole('link', { name: 'Docs' })
    docs.addEventListener('click', (e) => e.preventDefault()) // keep jsdom from navigating
    await userEvent.click(docs)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('keeps links as plain hrefs without a provider', () => {
    render(<Links />)
    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute('href', '/contacts')
  })
})
