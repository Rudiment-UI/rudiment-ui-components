import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiTag } from './Tag'

describe('Tag', () => {
  it('renders children', () => {
    render(<RudiTag>Label</RudiTag>)
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('applies the base class', () => {
    const { container } = render(<RudiTag>Label</RudiTag>)
    expect(container.firstChild).toHaveClass('rudi-tag')
  })

  it('applies each supported variant class', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const
    for (const variant of variants) {
      const { container } = render(<RudiTag variant={variant}>Msg</RudiTag>)
      expect(container.firstChild).toHaveClass(`rudi-tag--${variant}`)
    }
  })

  it('renders close button when dismissible is true', () => {
    render(<RudiTag dismissible>Removable</RudiTag>)
    expect(screen.getByRole('button', { name: 'Remove Removable' })).toBeInTheDocument()
  })

  it('close button fires onDismiss on click', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<RudiTag dismissible onDismiss={onDismiss}>Item</RudiTag>)
    await user.click(screen.getByRole('button', { name: 'Remove Item' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('applies the dismissible modifier class', () => {
    const { container } = render(<RudiTag dismissible>Removable</RudiTag>)
    expect(container.firstChild).toHaveClass('rudi-tag--dismissible')
  })

  it('removes the tag from the DOM when dismiss is clicked', async () => {
    const user = userEvent.setup()
    render(<RudiTag dismissible>Removable</RudiTag>)
    await user.click(screen.getByRole('button', { name: 'Remove Removable' }))
    expect(screen.queryByText('Removable')).not.toBeInTheDocument()
  })

  it('does not render close button when dismissible is false', () => {
    const { container } = render(<RudiTag>Static</RudiTag>)
    expect(container.querySelector('.rudi-tag__close')).not.toBeInTheDocument()
  })

  it('renders as a button element when onPress is provided', () => {
    render(<RudiTag onPress={() => {}}>Clickable</RudiTag>)
    expect(screen.getByRole('button', { name: 'Clickable' })).toBeInTheDocument()
  })

  it('disables interaction when isDisabled is true', () => {
    render(<RudiTag onPress={() => {}} isDisabled>Disabled</RudiTag>)
    const button = screen.getByRole('button', { name: 'Disabled' })
    expect(button).toBeDisabled()
  })

  it('merges a custom className', () => {
    const { container } = render(
      <RudiTag className="my-tag">Label</RudiTag>,
    )
    expect(container.firstChild).toHaveClass('rudi-tag')
    expect(container.firstChild).toHaveClass('my-tag')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<RudiTag>Label</RudiTag>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations with close button', async () => {
    const { container } = render(<RudiTag dismissible>Removable</RudiTag>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('nests no interactive element inside another with onPress and dismissible', async () => {
    const { container } = render(
      <RudiTag onPress={() => {}} dismissible>Both</RudiTag>,
    )
    const buttons = container.querySelectorAll('button')
    expect(buttons).toHaveLength(2)
    expect(container.querySelector('button [role=button], button button')).toBeNull()
    expect(container.querySelector('[role=button]')).toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('presses the main control and dismiss control independently', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()
    const onDismiss = vi.fn()
    render(
      <RudiTag onPress={onPress} dismissible onDismiss={onDismiss}>Both</RudiTag>,
    )
    await user.click(screen.getByRole('button', { name: 'Both' }))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onDismiss).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Remove Both' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it.each(['{Enter}', ' '])('dismisses with keyboard key %j', async (key) => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<RudiTag onPress={() => {}} dismissible onDismiss={onDismiss}>Item</RudiTag>)
    screen.getByRole('button', { name: 'Remove Item' }).focus()
    await user.keyboard(key)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it.each(['{Enter}', ' '])('presses the main control with keyboard key %j', async (key) => {
    const user = userEvent.setup()
    const onPress = vi.fn()
    render(<RudiTag onPress={onPress} dismissible>Item</RudiTag>)
    screen.getByRole('button', { name: 'Item' }).focus()
    await user.keyboard(key)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('disables the dismiss button and does not fire onDismiss when isDisabled', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<RudiTag dismissible isDisabled onDismiss={onDismiss}>Item</RudiTag>)
    const close = screen.getByRole('button', { name: 'Remove Item' })
    expect(close).toBeDisabled()
    await user.click(close)
    close.focus()
    await user.keyboard('{Enter}')
    expect(onDismiss).not.toHaveBeenCalled()
    expect(screen.getByText('Item')).toBeInTheDocument()
  })

  it('disables both controls when isDisabled with onPress and dismissible', () => {
    render(<RudiTag onPress={() => {}} dismissible isDisabled>Item</RudiTag>)
    expect(screen.getByRole('button', { name: 'Item' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove Item' })).toBeDisabled()
  })
})
