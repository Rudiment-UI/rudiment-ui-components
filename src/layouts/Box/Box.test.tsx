import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RudiBox } from './Box'

describe('Box', () => {
  it('applies padding, border and invert', () => {
    const { container } = render(<RudiBox padding="2rem" bordered invert />)
    expect(container.firstChild).toHaveClass('rudi-box', 'rudi-box--bordered', 'rudi-box--invert')
    expect(container.firstChild).toHaveStyle({ '--box-padding': '2rem' })
  })

  it('sticks, with an optional top offset', () => {
    const { container, rerender } = render(<RudiBox sticky />)
    expect(container.firstChild).toHaveClass('rudi-box--sticky')
    rerender(<RudiBox sticky="1rem" />)
    expect(container.firstChild).toHaveStyle({ '--box-sticky-top': '1rem' })
  })

  it('is not sticky by default', () => {
    const { container } = render(<RudiBox />)
    expect(container.firstChild).not.toHaveClass('rudi-box--sticky')
  })
})
