import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiPageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders the base class and title as a level-1 heading', () => {
    const { container } = render(<RudiPageHeader title="Dashboard" />)
    expect(container.firstChild).toHaveClass('rudi-page-header')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument()
  })

  it('renders an optional subtitle', () => {
    const { container } = render(
      <RudiPageHeader title="Dashboard" subtitle="Your account at a glance" />,
    )
    expect(
      container.querySelector('.rudi-page-header__subtitle'),
    ).toHaveTextContent('Your account at a glance')
  })

  it('omits the subtitle element when not provided', () => {
    const { container } = render(<RudiPageHeader title="Dashboard" />)
    expect(container.querySelector('.rudi-page-header__subtitle')).toBeNull()
  })

  it('renders eyebrow above the title and meta below the subtitle as divs', () => {
    const { container } = render(
      <RudiPageHeader
        title="Shipment"
        subtitle="REF-1042"
        eyebrow={<nav aria-label="Breadcrumb">Shipments</nav>}
        meta={<span>In transit</span>}
      />,
    )
    const eyebrow = container.querySelector('.rudi-page-header__eyebrow')!
    const meta = container.querySelector('.rudi-page-header__meta')!
    expect(eyebrow.tagName).toBe('DIV')
    expect(meta.tagName).toBe('DIV')
    expect(container.querySelector('.rudi-page-header__subtitle')!.tagName).toBe('P')
    const heading = screen.getByRole('heading', { level: 1 })
    expect(eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(meta.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
  })

  it('omits eyebrow and meta elements when not provided', () => {
    const { container } = render(<RudiPageHeader title="Dashboard" />)
    expect(container.querySelector('.rudi-page-header__eyebrow')).toBeNull()
    expect(container.querySelector('.rudi-page-header__meta')).toBeNull()
  })

  it('has no accessibility violations with eyebrow and meta', async () => {
    const { container } = render(
      <RudiPageHeader
        title="Shipment"
        subtitle="REF-1042"
        eyebrow={<nav aria-label="Breadcrumb">Shipments</nav>}
        meta={<span>In transit</span>}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders actions when provided', () => {
    render(
      <RudiPageHeader
        title="Dashboard"
        actions={<button type="button">Export</button>}
      />,
    )
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
  })

  it('respects a custom heading level', () => {
    render(<RudiPageHeader title="Section" headingLevel={2} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Section' }),
    ).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(
      <RudiPageHeader title="Dashboard" className="my-header" />,
    )
    expect(container.firstChild).toHaveClass('rudi-page-header', 'my-header')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiPageHeader
        title="Dashboard"
        subtitle="Your account at a glance"
        actions={<button type="button">Export</button>}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
