import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiBrand } from './Brand'
import { RudiRouterProvider } from '../RouterProvider/RouterProvider'

const Mark = () => <svg viewBox="0 0 10 10" data-testid="mark"><circle cx="5" cy="5" r="5" /></svg>

describe('Brand', () => {
  it('shows the mark and name', () => {
    render(<RudiBrand name="Acme" mark={<Mark />} />)
    expect(screen.getByText('Acme')).toBeVisible()
    expect(screen.getByTestId('mark').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies size and merges className', () => {
    const { container } = render(<RudiBrand name="Acme" size="lg" className="extra" />)
    expect(container.firstChild).toHaveClass('rudi-brand', 'rudi-brand--lg', 'extra')
  })

  it('keeps the name as the accessible name when hidden', () => {
    render(<RudiBrand name="Acme" mark={<Mark />} hideName href="/" />)
    expect(screen.getByRole('link', { name: 'Acme' })).toBeInTheDocument()
    expect(screen.getByText('Acme')).toHaveClass('rudi-brand__name--hidden')
  })

  it('is not a link without href', () => {
    render(<RudiBrand name="Acme" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('navigates client-side under RudiRouterProvider', async () => {
    const navigate = vi.fn()
    render(
      <RudiRouterProvider navigate={navigate}>
        <RudiBrand name="Acme" href="/home" />
      </RudiRouterProvider>,
    )
    await userEvent.click(screen.getByRole('link', { name: 'Acme' }))
    expect(navigate.mock.calls[0][0]).toBe('/home')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<RudiBrand name="Acme" mark={<Mark />} hideName href="/" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
