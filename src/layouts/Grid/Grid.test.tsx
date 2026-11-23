import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiGrid } from './Grid'

describe('Grid', () => {
  it('renders its items with the base class', () => {
    const { container } = render(
      <RudiGrid>
        <div>One</div>
        <div>Two</div>
      </RudiGrid>,
    )
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('rudi-grid')
    expect(container.firstChild).not.toHaveClass('rudi-grid--fill-row')
  })

  it('adds the fill-row modifier when fillRow is set', () => {
    const { container } = render(<RudiGrid fillRow>x</RudiGrid>)
    expect(container.firstChild).toHaveClass('rudi-grid', 'rudi-grid--fill-row')
  })

  it('sets the cell width and gap custom properties', () => {
    const { container } = render(
      <RudiGrid minCellWidth="12rem" space="group">
        x
      </RudiGrid>,
    )
    const el = container.firstChild as HTMLElement
    expect(el.style.getPropertyValue('--grid-min-cell')).toBe('12rem')
    expect(el.style.getPropertyValue('--grid-space')).toBe('var(--rudi-space-group)')
  })

  it('renders as a list and merges className', () => {
    render(
      <RudiGrid as="ul" className="extra" aria-label="Cards">
        <li>One</li>
      </RudiGrid>,
    )
    const list = screen.getByRole('list', { name: 'Cards' })
    expect(list).toHaveClass('rudi-grid', 'extra')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <RudiGrid as="ul" fillRow aria-label="Cards">
        <li>One</li>
        <li>Two</li>
      </RudiGrid>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
