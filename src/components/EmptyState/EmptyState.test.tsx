import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiEmptyState } from './EmptyState'
import { RudiButton } from '../Button/Button'

describe('EmptyState', () => {
  it('renders title, description and icon', () => {
    const { container } = render(
      <RudiEmptyState
        icon="lucide:inbox"
        title="No shipments yet"
        description="Shipments you create will appear here."
      />,
    )
    expect(container.firstChild).toHaveClass('rudi-empty-state', 'rudi-empty-state--md')
    expect(screen.getByText('Shipments you create will appear here.')).toBeInTheDocument()
    expect(container.querySelector('.rudi-empty-state__icon')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders an h3 by default and honours headingLevel', () => {
    const { rerender } = render(<RudiEmptyState title="No results" />)
    expect(screen.getByRole('heading', { level: 3, name: 'No results' })).toBeInTheDocument()
    rerender(<RudiEmptyState title="No results" headingLevel={5} />)
    expect(screen.getByRole('heading', { level: 5, name: 'No results' })).toBeInTheDocument()
  })

  it('omits optional parts when not provided', () => {
    const { container } = render(<RudiEmptyState title="Nothing here" />)
    expect(container.querySelector('.rudi-empty-state__icon')).toBeNull()
    expect(container.querySelector('.rudi-empty-state__description')).toBeNull()
    expect(container.querySelector('.rudi-empty-state__action')).toBeNull()
  })

  it('renders a pressable action', async () => {
    const onPress = vi.fn()
    render(
      <RudiEmptyState
        title="No shipments yet"
        action={<RudiButton onPress={onPress}>Create shipment</RudiButton>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Create shipment' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('renders non-string descriptions in a div', () => {
    render(
      <RudiEmptyState
        title="No results"
        description={<p>Try a different search.</p>}
      />,
    )
    expect(screen.getByText('Try a different search.').parentElement?.tagName).toBe('DIV')
  })

  it('applies the size class and merges className', () => {
    const { container } = render(
      <RudiEmptyState title="Empty" size="sm" className="custom" />,
    )
    expect(container.firstChild).toHaveClass('rudi-empty-state--sm', 'custom')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiEmptyState
        icon="lucide:inbox"
        title="No shipments yet"
        description="Shipments you create will appear here."
        action={<RudiButton>Create shipment</RudiButton>}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('works inside a table body cell', async () => {
    const { container } = render(
      <table>
        <caption>Shipments</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>
              <RudiEmptyState size="sm" icon="lucide:inbox" title="No shipments" headingLevel={4} />
            </td>
          </tr>
        </tbody>
      </table>,
    )
    expect(screen.getByRole('cell')).toContainElement(
      screen.getByRole('heading', { level: 4, name: 'No shipments' }),
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('illustration', () => {
    const src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"/%3E'

    it('renders a decorative image with an empty alt', async () => {
      const { container } = render(<RudiEmptyState illustration={src} title="No devices" />)
      const img = container.querySelector('img.rudi-empty-state__illustration')
      expect(img).toHaveAttribute('src', src)
      expect(img).toHaveAttribute('alt', '')
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(await axe(container)).toHaveNoViolations()
    })

    it('replaces the icon when both are given', () => {
      const { container } = render(
        <RudiEmptyState illustration={src} icon="lucide:inbox" title="No devices" />,
      )
      expect(container.querySelector('.rudi-empty-state__illustration')).toBeInTheDocument()
      expect(container.querySelector('.rudi-empty-state__icon')).not.toBeInTheDocument()
    })

    it('renders above the title', () => {
      const { container } = render(<RudiEmptyState illustration={src} title="No devices" />)
      const root = container.firstChild as HTMLElement
      expect(root.firstElementChild).toHaveClass('rudi-empty-state__illustration')
    })
  })
})
