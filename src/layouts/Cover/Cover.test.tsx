import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiCover } from './Cover'

describe('Cover', () => {
  it('renders the root with tunable properties', () => {
    const { container } = render(<RudiCover minHeight="50vh" space="2rem" />)
    expect(container.firstChild).toHaveClass('rudi-cover')
    expect(container.firstChild).toHaveStyle({ '--cover-min-height': '50vh', '--cover-space': '2rem' })
  })

  it('marks the centered part without consumers using internal classes', () => {
    render(
      <RudiCover>
        <header>Top</header>
        <RudiCover.Centered as="section" className="extra">
          Middle
        </RudiCover.Centered>
      </RudiCover>,
    )
    const middle = screen.getByText('Middle')
    expect(middle.tagName).toBe('SECTION')
    expect(middle).toHaveClass('rudi-cover__centered', 'extra')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiCover as="main">
        <RudiCover.Centered>Content</RudiCover.Centered>
      </RudiCover>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
