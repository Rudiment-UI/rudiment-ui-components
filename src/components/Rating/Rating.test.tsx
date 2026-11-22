import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiRating } from './Rating'

describe('Rating', () => {
  it('renders as an image with an accessible label by default', () => {
    render(<RudiRating value={4.5} />)
    expect(
      screen.getByRole('img', { name: 'Rated 4.5 out of 5' }),
    ).toBeInTheDocument()
  })

  it('marks full, half, and empty stars from the value', () => {
    const { container } = render(<RudiRating value={3.5} max={5} />)
    expect(container.querySelectorAll('.rudi-rating__star--full')).toHaveLength(3)
    expect(container.querySelectorAll('.rudi-rating__star--half')).toHaveLength(1)
    expect(container.querySelectorAll('.rudi-rating__star--empty')).toHaveLength(1)
  })

  it('shows the numeric value and review count', () => {
    render(<RudiRating value={4.8} showValue count={128} />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
    expect(screen.getByText(/\(128\)/)).toBeInTheDocument()
  })

  it('renders a radiogroup and reports changes when interactive', async () => {
    const onChange = vi.fn()
    render(<RudiRating value={0} onChange={onChange} />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(5)
    await userEvent.click(radios[3])
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('is a single tab stop with arrow, Home and End key navigation', async () => {
    const onChange = vi.fn()
    function Harness() {
      const [v, setV] = useState(2)
      return (
        <RudiRating
          value={v}
          onChange={(n) => {
            onChange(n)
            setV(n)
          }}
        />
      )
    }
    render(
      <>
        <button>before</button>
        <Harness />
        <button>after</button>
      </>,
    )
    const user = userEvent.setup()
    await user.tab()
    await user.tab()
    const radios = screen.getAllByRole('radio')
    expect(radios[1]).toHaveFocus()
    expect(radios[1]).toBeChecked()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith(3)
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenLastCalledWith(2)
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith(5)
    fireEvent.keyDown(document.activeElement!, { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith(1)
    await user.tab()
    expect(screen.getByText('after')).toHaveFocus()
  })

  it('focuses the first star when none is selected', async () => {
    render(<RudiRating value={0} onChange={() => {}} />)
    await userEvent.tab()
    expect(screen.getAllByRole('radio')[0]).toHaveFocus()
  })

  it('has no accessibility violations when interactive', async () => {
    const { container } = render(<RudiRating value={3} onChange={() => {}} label="Rate" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('applies the size class', () => {
    const { container } = render(<RudiRating value={3} size="lg" />)
    expect(container.firstChild).toHaveClass('rudi-rating--lg')
  })

  it('merges a custom className', () => {
    const { container } = render(<RudiRating value={3} className="my-rating" />)
    expect(container.firstChild).toHaveClass('rudi-rating', 'my-rating')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<RudiRating value={4.5} count={20} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
