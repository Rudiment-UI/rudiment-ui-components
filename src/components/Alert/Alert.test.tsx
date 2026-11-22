import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiAlert } from './Alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<RudiAlert variant="info">Something happened.</RudiAlert>)
    expect(screen.getByText('Something happened.')).toBeInTheDocument()
  })

  it('applies the base class', () => {
    const { container } = render(<RudiAlert variant="info">Message</RudiAlert>)
    expect(container.firstChild).toHaveClass('rudi-alert')
  })

  it('applies the variant class', () => {
    const { container } = render(<RudiAlert variant="success">All good.</RudiAlert>)
    expect(container.firstChild).toHaveClass('rudi-alert--success')
  })

  it('applies each supported variant class', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const
    for (const variant of variants) {
      const { container } = render(<RudiAlert variant={variant}>Msg</RudiAlert>)
      expect(container.firstChild).toHaveClass(`rudi-alert--${variant}`)
    }
  })

  it('renders the title when provided', () => {
    render(<RudiAlert variant="warning" title="Watch out">Details here.</RudiAlert>)
    expect(screen.getByText('Watch out')).toBeInTheDocument()
  })

  it('applies the title class', () => {
    render(<RudiAlert variant="warning" title="Watch out">Details here.</RudiAlert>)
    expect(screen.getByText('Watch out')).toHaveClass('rudi-alert__title')
  })

  it('does not render the title element when title is omitted', () => {
    const { container } = render(<RudiAlert variant="info">Message</RudiAlert>)
    expect(
      container.querySelector('.rudi-alert__title'),
    ).not.toBeInTheDocument()
  })

  it('has role="alert" by default', () => {
    render(<RudiAlert variant="error">Error!</RudiAlert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('has role="status" when isPolite is true', () => {
    render(<RudiAlert variant="info" isPolite>Info.</RudiAlert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(
      <RudiAlert variant="info" className="my-alert">
        Msg
      </RudiAlert>,
    )
    expect(container.firstChild).toHaveClass('rudi-alert')
    expect(container.firstChild).toHaveClass('my-alert')
  })

  it('renders an icon when the icon prop is provided', () => {
    const { container } = render(
      <RudiAlert variant="info" icon="mdi:information">
        Message
      </RudiAlert>,
    )
    expect(
      container.querySelector('.rudi-alert__icon'),
    ).toBeInTheDocument()
  })

  it('applies the has-icon modifier class when icon is provided', () => {
    const { container } = render(
      <RudiAlert variant="info" icon="mdi:information">
        Message
      </RudiAlert>,
    )
    expect(container.firstChild).toHaveClass('rudi-alert--has-icon')
  })

  it('does not render the icon element when icon is omitted', () => {
    const { container } = render(<RudiAlert variant="info">Message</RudiAlert>)
    expect(
      container.querySelector('.rudi-alert__icon'),
    ).not.toBeInTheDocument()
  })

  it('does not apply the has-icon modifier when icon is omitted', () => {
    const { container } = render(<RudiAlert variant="info">Message</RudiAlert>)
    expect(container.firstChild).not.toHaveClass('rudi-alert--has-icon')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiAlert variant="info">Something happened.</RudiAlert>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations with a title', async () => {
    const { container } = render(
      <RudiAlert variant="warning" title="Watch out">
        Details here.
      </RudiAlert>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations with an icon', async () => {
    const { container } = render(
      <RudiAlert variant="info" icon="mdi:information" title="Info">
        Details here.
      </RudiAlert>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('does not render a dismiss button by default', () => {
    const { container } = render(<RudiAlert variant="info">Message</RudiAlert>)
    expect(
      container.querySelector('.rudi-alert__dismiss'),
    ).not.toBeInTheDocument()
  })

  it('renders a dismiss button when dismissible is true', () => {
    const { container } = render(
      <RudiAlert variant="info" dismissible>
        Message
      </RudiAlert>,
    )
    expect(
      container.querySelector('.rudi-alert__dismiss'),
    ).toBeInTheDocument()
  })

  it('applies the dismissible modifier class', () => {
    const { container } = render(
      <RudiAlert variant="info" dismissible>
        Message
      </RudiAlert>,
    )
    expect(container.firstChild).toHaveClass('rudi-alert--dismissible')
  })

  it('removes the alert from the DOM when dismiss is clicked', async () => {
    const user = userEvent.setup()
    render(
      <RudiAlert variant="info" dismissible>
        Message
      </RudiAlert>,
    )
    await user.click(screen.getByRole('button', { name: /dismiss alert/i }))
    expect(screen.queryByText('Message')).not.toBeInTheDocument()
  })

  it('calls onDismiss when dismiss is clicked', async () => {
    const user = userEvent.setup()
    const handleDismiss = vi.fn()
    render(
      <RudiAlert variant="info" dismissible onDismiss={handleDismiss}>
        Message
      </RudiAlert>,
    )
    await user.click(screen.getByRole('button', { name: /dismiss alert/i }))
    expect(handleDismiss).toHaveBeenCalledOnce()
  })

  it('dismiss button has accessible label', () => {
    render(
      <RudiAlert variant="info" dismissible>
        Message
      </RudiAlert>,
    )
    expect(
      screen.getByRole('button', { name: /dismiss alert/i }),
    ).toBeInTheDocument()
  })

  it('has no accessibility violations when dismissible', async () => {
    const { container } = render(
      <RudiAlert variant="warning" title="Heads up" dismissible>
        Details here.
      </RudiAlert>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders an action at the inline-end, after the text', () => {
    const { container } = render(
      <RudiAlert
        variant="warning"
        title="Out of range"
        action={<button type="button">Review</button>}
      >
        Temperature exceeded the limit.
      </RudiAlert>,
    )
    const action = container.querySelector('.rudi-alert__action')!
    expect(action).toContainElement(screen.getByRole('button', { name: 'Review' }))
    const body = container.querySelector('.rudi-alert__body')!
    expect(body.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders no action wrapper when action is absent', () => {
    const { container } = render(<RudiAlert variant="info">Message</RudiAlert>)
    expect(container.querySelector('.rudi-alert__main')).toBeNull()
    expect(container.querySelector('.rudi-alert__action')).toBeNull()
  })

  it('has no accessibility violations with an action', async () => {
    const { container } = render(
      <RudiAlert
        variant="error"
        icon="mdi:alert-circle"
        dismissible
        action={<button type="button">Retry</button>}
      >
        Failed.
      </RudiAlert>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it.each(['click', '{Enter}', ' '])('dismisses via %j and calls onDismiss', async (how) => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <RudiAlert variant="info" dismissible onDismiss={onDismiss}>
        Message
      </RudiAlert>,
    )
    const btn = screen.getByRole('button', { name: 'Dismiss alert' })
    if (how === 'click') await user.click(btn)
    else {
      btn.focus()
      await user.keyboard(how)
    }
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Message')).not.toBeInTheDocument()
  })

  it('nests no interactive element inside another', () => {
    const { container } = render(
      <RudiAlert variant="info" dismissible action={<button type="button">Undo</button>}>
        Message
      </RudiAlert>,
    )
    expect(container.querySelector('button [role=button], button button')).toBeNull()
  })
})
