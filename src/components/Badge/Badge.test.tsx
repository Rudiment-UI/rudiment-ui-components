import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiBadge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<RudiBadge>New</RudiBadge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies the base class', () => {
    const { container } = render(<RudiBadge>Label</RudiBadge>)
    expect(container.firstChild).toHaveClass('rudi-badge')
  })

  it('applies each supported variant class', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const
    for (const variant of variants) {
      const { container } = render(<RudiBadge variant={variant}>Msg</RudiBadge>)
      expect(container.firstChild).toHaveClass(`rudi-badge--${variant}`)
    }
  })

  it('applies the size class', () => {
    const { container } = render(<RudiBadge size="sm">Small</RudiBadge>)
    expect(container.firstChild).toHaveClass('rudi-badge--sm')
  })

  it('renders dot indicator with visually hidden children', () => {
    const { container } = render(<RudiBadge dot>Hidden</RudiBadge>)
    expect(container.firstChild).toHaveClass('rudi-badge--dot')
    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(
      <RudiBadge className="my-badge">Label</RudiBadge>,
    )
    expect(container.firstChild).toHaveClass('rudi-badge')
    expect(container.firstChild).toHaveClass('my-badge')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<RudiBadge>Status</RudiBadge>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('keeps children as screen-reader text when dot is set', async () => {
    const { container } = render(<RudiBadge dot>Online</RudiBadge>)
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(container.firstChild).not.toHaveAttribute('aria-hidden')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('marks a dot without children as decorative', async () => {
    const { container } = render(<RudiBadge dot />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(await axe(container)).toHaveNoViolations()
  })
})
