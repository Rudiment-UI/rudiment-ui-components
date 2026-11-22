import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiPagination } from './Pagination'

describe('Pagination', () => {
  it('renders a labeled navigation landmark', () => {
    render(<RudiPagination page={1} pageCount={5} onPageChange={vi.fn()} />)
    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument()
  })

  it('renders nothing for a single page', () => {
    const { container } = render(
      <RudiPagination page={1} pageCount={1} onPageChange={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('marks the current page', () => {
    render(<RudiPagination page={3} pageCount={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('truncates long ranges with ellipses but always shows first and last', () => {
    const { container } = render(
      <RudiPagination page={10} pageCount={20} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 20' })).toBeInTheDocument()
    expect(
      container.querySelectorAll('.rudi-pagination__ellipsis').length,
    ).toBeGreaterThan(0)
  })

  it('disables previous on the first page and calls back on next', async () => {
    const onPageChange = vi.fn()
    render(<RudiPagination page={1} pageCount={5} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('changes page on click', async () => {
    const onPageChange = vi.fn()
    render(<RudiPagination page={1} pageCount={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 4' }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('merges a custom className', () => {
    const { container } = render(
      <RudiPagination
        page={1}
        pageCount={5}
        onPageChange={vi.fn()}
        className="my-pager"
      />,
    )
    expect(container.firstChild).toHaveClass('rudi-pagination', 'my-pager')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiPagination page={3} pageCount={20} onPageChange={vi.fn()} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it.each(['{Enter}', ' '])('activates page, previous and next with keyboard key %j', async (key) => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<RudiPagination page={3} pageCount={5} onPageChange={onPageChange} />)
    for (const [name, expected] of [
      ['Go to page 5', 5],
      ['Go to previous page', 2],
      ['Go to next page', 4],
    ] as const) {
      onPageChange.mockClear()
      screen.getByRole('button', { name }).focus()
      await user.keyboard(key)
      expect(onPageChange).toHaveBeenCalledWith(expected)
    }
  })

  it('does not call back for the current page or a disabled control', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<RudiPagination page={1} pageCount={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Go to page 1' }))
    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('clamps a page above pageCount for rendering and callbacks', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<RudiPagination page={99} pageCount={5} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Go to page 5' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(onPageChange).toHaveBeenCalledWith(4)
    expect(onPageChange).not.toHaveBeenCalledWith(98)
  })

  it('clamps a page below 1 for rendering and callbacks', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<RudiPagination page={-3} pageCount={5} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('nests no interactive element inside another', () => {
    const { container } = render(
      <RudiPagination page={3} pageCount={20} onPageChange={vi.fn()} />,
    )
    expect(container.querySelector('button [role=button], button button')).toBeNull()
  })
})
