import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiImage } from './Image'

const SRC =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="4" height="3"%3E%3C/svg%3E'

describe('Image', () => {
  it('renders an img with src and alt', () => {
    render(<RudiImage src={SRC} alt="A product" />)
    const img = screen.getByRole('img', { name: 'A product' })
    expect(img).toHaveAttribute('src', SRC)
    expect(img).toHaveClass('rudi-image__img', 'rudi-image__img--cover')
  })

  it('applies the fit modifier', () => {
    render(<RudiImage src={SRC} alt="x" fit="contain" />)
    expect(screen.getByRole('img')).toHaveClass('rudi-image__img--contain')
  })

  it('applies each radius class', () => {
    const radii = ['none', 'sm', 'md', 'lg', 'full'] as const
    for (const radius of radii) {
      const { container } = render(
        <RudiImage src={SRC} alt="x" radius={radius} />,
      )
      expect(container.firstChild).toHaveClass(`rudi-image--radius-${radius}`)
    }
  })

  it('sets aspect ratio on the frame', () => {
    const { container } = render(
      <RudiImage src={SRC} alt="x" aspectRatio="1 / 1" />,
    )
    expect((container.firstChild as HTMLElement).style.aspectRatio).toBe('1 / 1')
  })

  it('renders an overlay when provided', () => {
    render(
      <RudiImage src={SRC} alt="x" overlay={<span>Sale</span>} />,
    )
    expect(screen.getByText('Sale')).toBeInTheDocument()
  })

  it('defaults to lazy loading', () => {
    render(<RudiImage src={SRC} alt="x" />)
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy')
  })

  it('merges a custom className', () => {
    const { container } = render(
      <RudiImage src={SRC} alt="x" className="my-image" />,
    )
    expect(container.firstChild).toHaveClass('rudi-image', 'my-image')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiImage src={SRC} alt="A meaningful photo" aspectRatio="4 / 3" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('load failure', () => {
    it('renders a labelled placeholder and calls onError', async () => {
      const onError = vi.fn()
      const { container } = render(
        <RudiImage src={SRC} alt="Broken" aspectRatio="4 / 3" radius="lg" onError={onError} />,
      )
      fireEvent.error(container.querySelector('img')!)
      expect(onError).toHaveBeenCalledTimes(1)
      expect(container.querySelector('img')).not.toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Broken' })).toBeInTheDocument()
      expect(container.firstChild).toHaveClass('rudi-image--radius-lg')
      expect((container.firstChild as HTMLElement).style.aspectRatio).toBe('4 / 3')
      expect(await axe(container)).toHaveNoViolations()
    })

    it('is aria-hidden when alt is empty', async () => {
      const { container } = render(<RudiImage src={SRC} alt="" />)
      fireEvent.error(container.querySelector('img')!)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(container.querySelector('.rudi-image__fallback')).toHaveAttribute('aria-hidden', 'true')
      expect(await axe(container)).toHaveNoViolations()
    })

    it('renders a custom fallback', () => {
      const { container } = render(
        <RudiImage src={SRC} alt="x" fallback={<span>Nope</span>} />,
      )
      fireEvent.error(container.querySelector('img')!)
      expect(screen.getByText('Nope')).toBeInTheDocument()
    })

    it('resets when src changes', () => {
      const { container, rerender } = render(<RudiImage src={SRC} alt="x" />)
      fireEvent.error(container.querySelector('img')!)
      expect(container.querySelector('img')).not.toBeInTheDocument()
      rerender(<RudiImage src="/other.jpg" alt="x" />)
      expect(container.querySelector('img')).toBeInTheDocument()
    })
  })
})
