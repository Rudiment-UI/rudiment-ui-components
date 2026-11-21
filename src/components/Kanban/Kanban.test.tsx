import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiKanbanBoard } from './KanbanBoard'
import { RudiKanbanCard } from './KanbanCard'

const sampleColumns = [
  {
    id: 'todo',
    title: 'To Do',
    items: [
      { id: 'card-1', title: 'Design homepage' },
      { id: 'card-2', title: 'Fix login bug' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [{ id: 'card-3', title: 'Build API' }],
  },
  {
    id: 'done',
    title: 'Done',
    items: [],
  },
]

const renderCard = (item: { id: string; [key: string]: unknown }) => (
  <RudiKanbanCard key={item.id} id={item.id}>
    <span>{String(item.title)}</span>
  </RudiKanbanCard>
)

describe('KanbanBoard', () => {
  it('renders all columns', () => {
    render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
      />,
    )
    expect(screen.getByRole('region', { name: 'To Do' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'In Progress' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Done' })).toBeInTheDocument()
  })

  it('renders all cards', () => {
    render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
      />,
    )
    expect(screen.getByText('Design homepage')).toBeInTheDocument()
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByText('Build API')).toBeInTheDocument()
  })

  it('displays column item counts', () => {
    render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
      />,
    )
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders drag handles with accessible labels', () => {
    render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
      />,
    )
    const handles = screen.getAllByRole('button', { name: /^Move card-/ })
    expect(handles).toHaveLength(3)
  })

  it('applies rudi-kanban class', () => {
    const { container } = render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
      />,
    )
    expect(container.querySelector('.rudi-kanban')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
        className="my-board"
      />,
    )
    const board = container.querySelector('.rudi-kanban')
    expect(board).toHaveClass('my-board')
  })

  it('has live regions for announcements', () => {
    render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
      />,
    )
    const statusRegions = screen.getAllByRole('status')
    expect(statusRegions.length).toBeGreaterThanOrEqual(1)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={renderCard}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('names handles and announcements with the card label', async () => {
    const user = userEvent.setup()
    render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        getCardLabel={(item) => String(item.title)}
        renderCard={(item) => (
          <RudiKanbanCard key={item.id} id={item.id} label={String(item.title)}>
            <span>{String(item.title)}</span>
          </RudiKanbanCard>
        )}
      />,
    )
    const handle = screen.getByRole('button', { name: 'Move Design homepage' })
    handle.focus()
    await user.keyboard(' ')
    // dnd-kit reports the starting position straight after pick-up, replacing the pick-up message.
    expect(await screen.findByText('Design homepage is over To Do, position 1 of 2.')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(await screen.findByText('Cancelled. Design homepage was not moved.')).toBeInTheDocument()
  })
})
