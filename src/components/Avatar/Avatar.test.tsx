import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiAvatar } from './Avatar'

describe('Avatar', () => {
  it('renders initials from name', () => {
    render(<RudiAvatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders single initial from single name', () => {
    render(<RudiAvatar name="Alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders image when src provided', () => {
    const { container } = render(<RudiAvatar src="https://example.com/avatar.png" alt="User" />)
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png')
  })

  it('falls back to initials when image fails', () => {
    render(<RudiAvatar src="https://example.com/broken.png" name="John Doe" />)
    const img = screen.getByRole('img', { name: 'John Doe' }).querySelector('img')
    expect(img).toBeInTheDocument()

    fireEvent.error(img!)

    expect(screen.getByText('JD')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'John Doe' }).querySelector('img')).not.toBeInTheDocument()
  })

  it('has role="img" with aria-label from name', () => {
    render(<RudiAvatar name="John Doe" />)
    expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
  })

  it('has role="img" with aria-label from alt when alt is provided', () => {
    render(<RudiAvatar name="John Doe" alt="JD avatar" />)
    expect(screen.getByRole('img', { name: 'JD avatar' })).toBeInTheDocument()
  })

  it('applies size class for sm', () => {
    const { container } = render(<RudiAvatar name="A" size="sm" />)
    expect(container.firstChild).toHaveClass('rudi-avatar--sm')
  })

  it('applies size class for md', () => {
    const { container } = render(<RudiAvatar name="A" size="md" />)
    expect(container.firstChild).toHaveClass('rudi-avatar--md')
  })

  it('applies size class for lg', () => {
    const { container } = render(<RudiAvatar name="A" size="lg" />)
    expect(container.firstChild).toHaveClass('rudi-avatar--lg')
  })

  it('renders status Badge dot when status provided', () => {
    const { container } = render(<RudiAvatar name="John Doe" status="success" />)
    const statusEl = container.querySelector('.rudi-avatar__status')
    expect(statusEl).toBeInTheDocument()
  })

  it('does not render status element when status not provided', () => {
    const { container } = render(<RudiAvatar name="John Doe" />)
    const statusEl = container.querySelector('.rudi-avatar__status')
    expect(statusEl).not.toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<RudiAvatar name="A" className="my-avatar" />)
    expect(container.firstChild).toHaveClass('rudi-avatar')
    expect(container.firstChild).toHaveClass('my-avatar')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<RudiAvatar name="John Doe" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('is decorative with neither alt nor name', async () => {
    const { container } = render(<RudiAvatar />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root).not.toHaveAttribute('role')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('includes statusLabel in the accessible name', async () => {
    const { container } = render(
      <RudiAvatar name="Ada Lovelace" status="warning" statusLabel="Busy" />,
    )
    expect(screen.getByRole('img', { name: 'Ada Lovelace, Busy' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('keeps the plain name when status has no statusLabel', () => {
    render(<RudiAvatar name="Ada Lovelace" status="warning" />)
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument()
  })

  describe('icon', () => {
    it('renders the icon instead of initials', () => {
      const { container } = render(<RudiAvatar name="Shipments" icon="lucide:truck" />)
      expect(container.querySelector('.rudi-avatar__icon')).toBeInTheDocument()
      expect(screen.queryByText('S')).not.toBeInTheDocument()
    })

    it('keeps the accessible name from name and alt, with the icon hidden', async () => {
      const { container, rerender } = render(<RudiAvatar name="Shipments" icon="lucide:truck" />)
      expect(screen.getByRole('img', { name: 'Shipments' })).toBeInTheDocument()
      expect(container.querySelector('.rudi-avatar__icon')).toHaveAttribute('aria-hidden', 'true')
      expect(await axe(container)).toHaveNoViolations()
      rerender(<RudiAvatar name="Shipments" alt="All shipments" icon="lucide:truck" />)
      expect(screen.getByRole('img', { name: 'All shipments' })).toBeInTheDocument()
    })

    it('shows the image over the icon when src loads', () => {
      const { container } = render(
        <RudiAvatar src="https://example.com/a.png" name="Shipments" icon="lucide:truck" />,
      )
      expect(container.querySelector('img')).toBeInTheDocument()
      expect(container.querySelector('.rudi-avatar__icon')).not.toBeInTheDocument()
    })
  })

  describe('tint', () => {
    it('leaves the default look alone without tint', () => {
      const { container } = render(<RudiAvatar name="Ada Lovelace" />)
      const root = container.firstChild as HTMLElement
      expect(root).not.toHaveClass('rudi-avatar--tinted')
      expect(root.style.getPropertyValue('--avatar-tint')).toBe('')
    })

    it('sets the custom property and modifier class for an explicit tint', async () => {
      const { container } = render(
        <RudiAvatar name="Ada Lovelace" tint="var(--entity-contact)" />,
      )
      const root = container.firstChild as HTMLElement
      expect(root).toHaveClass('rudi-avatar--tinted')
      expect(root.style.getPropertyValue('--avatar-tint')).toBe('var(--entity-contact)')
      expect(await axe(container)).toHaveNoViolations()
    })

    it("picks a deterministic series color for 'auto'", async () => {
      const tintOf = (name: string) => {
        const { container, unmount } = render(<RudiAvatar name={name} tint="auto" />)
        const value = (container.firstChild as HTMLElement).style.getPropertyValue('--avatar-tint')
        unmount()
        return value
      }
      const first = tintOf('Ada Lovelace')
      expect(first).toMatch(/^var\(--rudi-component-avatar-auto-tint-[1-8]\)$/)
      expect(tintOf('Ada Lovelace')).toBe(first)

      const names = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Shipments', 'Contacts', 'Devices']
      expect(new Set(names.map(tintOf)).size).toBeGreaterThan(1)

      const { container } = render(<RudiAvatar name="Grace Hopper" icon="lucide:user" tint="auto" />)
      expect(container.firstChild).toHaveClass('rudi-avatar--tinted')
      expect(await axe(container)).toHaveNoViolations()
    })

    it("does not tint 'auto' without a name", () => {
      const { container } = render(<RudiAvatar tint="auto" />)
      expect(container.firstChild).not.toHaveClass('rudi-avatar--tinted')
    })
  })
})
