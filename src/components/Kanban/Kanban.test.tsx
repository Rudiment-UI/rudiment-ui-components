import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiKanbanBoard } from './KanbanBoard'
import { RudiKanbanCard } from './KanbanCard'
import { KanbanOverlayContext } from './KanbanOverlayContext'

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

describe('KanbanBoard drag overlay', () => {
  it('renders one exposed, un-nested card while a keyboard drag is active', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={(item) => (
          <RudiKanbanCard key={item.id} id={item.id} label={String(item.title)}>
            {String(item.title)}
          </RudiKanbanCard>
        )}
      />,
    )
    const handle = screen.getByRole('button', { name: 'Move Design homepage' })
    handle.focus()
    await user.keyboard(' ')

    const overlay = container.ownerDocument.querySelector('.rudi-kanban__card--overlay')
    expect(overlay).not.toBeNull()
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    // Only the original handle is exposed to assistive tech.
    expect(screen.getAllByRole('button', { name: 'Move Design homepage' })).toHaveLength(1)
    expect(
      container.ownerDocument.querySelector('.rudi-kanban__card .rudi-kanban__card'),
    ).toBeNull()
    expect(overlay!.querySelector('button')).toHaveAttribute('tabindex', '-1')
  })

  it('renders a static, hidden card inside the overlay context without dnd hooks', async () => {
    const { container } = render(
      <KanbanOverlayContext.Provider value>
        <RudiKanbanCard id="x" label="X">
          Body
        </RudiKanbanCard>
      </KanbanOverlayContext.Provider>,
    )
    const card = container.querySelector('.rudi-kanban__card')!
    expect(card).toHaveClass('rudi-kanban__card--overlay')
    expect(card).toHaveAttribute('aria-hidden', 'true')
    expect(card.querySelector('button')).not.toHaveAttribute('aria-roledescription')
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('KanbanBoard drag feedback', () => {
  const startKeyboardDrag = async () => {
    const user = userEvent.setup()
    const result = render(
      <RudiKanbanBoard
        columns={sampleColumns}
        onCardMove={vi.fn()}
        renderCard={(item) => (
          <RudiKanbanCard key={item.id} id={item.id} label={String(item.title)}>
            {String(item.title)}
          </RudiKanbanCard>
        )}
      />,
    )
    screen.getByRole('button', { name: 'Move Design homepage' }).focus()
    await user.keyboard(' ')
    return { user, ...result }
  }

  it('portals the drag overlay to <body>, outside any transformed ancestor', async () => {
    const { container } = await startKeyboardDrag()
    const overlay = document.querySelector('.rudi-kanban__card--overlay')!
    expect(container.contains(overlay)).toBe(false)
    expect(overlay.closest('.rudi-kanban')).toBeNull()
  })

  it('marks the dragged card as the drop slot and highlights its column', async () => {
    const { user } = await startKeyboardDrag()
    const slot = document.querySelector('.rudi-kanban__card--dragging')!
    expect(slot).not.toBeNull()
    expect(slot.closest('.rudi-kanban__column')).toHaveClass('rudi-kanban__column--over')
    expect(screen.getByRole('region', { name: 'In Progress' })).not.toHaveClass('rudi-kanban__column--over')
    await user.keyboard('{Escape}')
    expect(document.querySelector('.rudi-kanban__card--dragging')).toBeNull()
    expect(document.querySelector('.rudi-kanban__column--over')).toBeNull()
  })
})
