import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  RudiKanbanBoard,
  type RudiKanbanColumnData,
  type RudiKanbanCardMoveEvent,
} from './KanbanBoard'
import { RudiKanbanCard } from './KanbanCard'
import { RudiBadge } from '../Badge/Badge'
import { RudiAvatar } from '../Avatar/Avatar'

const initialColumns: RudiKanbanColumnData[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: [
      {
        id: 'card-1',
        title: 'Design homepage mockups',
        priority: 'info',
        assignee: 'Alice Chen',
      },
      {
        id: 'card-2',
        title: 'Fix login validation bug',
        priority: 'error',
        assignee: 'Bob Kim',
      },
      {
        id: 'card-3',
        title: 'Write API documentation',
        priority: 'default',
        assignee: 'Carol Diaz',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      {
        id: 'card-4',
        title: 'Build user dashboard',
        priority: 'warning',
        assignee: 'Dan Lee',
      },
      {
        id: 'card-5',
        title: 'Implement search feature',
        priority: 'info',
        assignee: 'Eva Patel',
      },
    ],
  },
  {
    id: 'review',
    title: 'In Review',
    items: [
      {
        id: 'card-6',
        title: 'Refactor auth middleware',
        priority: 'success',
        assignee: 'Frank Wu',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [
      {
        id: 'card-7',
        title: 'Set up CI/CD pipeline',
        priority: 'success',
        assignee: 'Grace Tan',
      },
    ],
  },
]

function InteractiveBoard() {
  const [columns, setColumns] = useState<RudiKanbanColumnData[]>(initialColumns)

  const handleCardMove = (event: RudiKanbanCardMoveEvent) => {
    setColumns((prev) => {
      const next = prev.map((col) => ({
        ...col,
        items: [...col.items],
      }))

      const fromCol = next.find((col) => col.id === event.fromColumnId)
      const toCol = next.find((col) => col.id === event.toColumnId)
      if (!fromCol || !toCol) return prev

      const [movedCard] = fromCol.items.splice(event.fromIndex, 1)
      toCol.items.splice(event.toIndex, 0, movedCard)

      return next
    })
  }

  return (
    <RudiKanbanBoard
      columns={columns}
      onCardMove={handleCardMove}
      renderCard={(item) => (
        <RudiKanbanCard key={item.id} id={item.id}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              {String(item.title)}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <RudiBadge
                variant={
                  item.priority as
                    | 'default'
                    | 'success'
                    | 'warning'
                    | 'error'
                    | 'info'
                }
                size="sm"
              >
                {String(item.priority)}
              </RudiBadge>
              <RudiAvatar name={String(item.assignee)} size="sm" />
            </div>
          </div>
        </RudiKanbanCard>
      )}
    />
  )
}

const meta = {
  title: 'Components/Data/KanbanBoard',
  component: RudiKanbanBoard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A drag-and-drop Kanban board with columns and cards. Built with @dnd-kit for accessible keyboard and pointer-based reordering. Cards support cross-column moves with live screen reader announcements.',
      },
    },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RudiKanbanBoard>

export default meta
type Story = StoryObj<typeof RudiKanbanBoard>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A four-column board you can reorder by pointer or keyboard (Space to grab, arrow keys to move, Space to drop, Escape to cancel). Apply `onCardMove` exactly as documented: remove the card at `fromIndex`, then insert it at `toIndex`, which matches the dashed drop slot shown during the drag. Pass `getCardLabel` (and `label` on each card) so drag announcements name the card instead of its id.',
      },
    },
  },
  render: ({}) => <InteractiveBoard />,
}

export const EmptyColumns: Story = {
  name: 'Empty columns',
  parameters: {
    docs: {
      description: {
        story:
          'Use this for a new project or a cleared board. Empty columns stay as drop targets, so cards can still be dragged in.',
      },
    },
  },
  render: ({}) => {
    const emptyColumns: RudiKanbanColumnData[] = [
      { id: 'todo', title: 'To Do', items: [] },
      { id: 'in-progress', title: 'In Progress', items: [] },
      { id: 'done', title: 'Done', items: [] },
    ]

    return (
      <RudiKanbanBoard
        columns={emptyColumns}
        onCardMove={() => {}}
        renderCard={(item) => (
          <RudiKanbanCard key={item.id} id={item.id}>
            <span>{String(item.title)}</span>
          </RudiKanbanCard>
        )}
      />
    )
  },
}

export const SimpleCards: Story = {
  name: 'Simple cards',
  parameters: {
    docs: {
      description: {
        story:
          'Cards should be scannable at a glance, so a title is often enough. Avoid dialogs or forms inside a card, and keep to 3-7 columns so the board does not scroll horizontally.',
      },
    },
  },
  render: ({}) => {
    const simpleColumns: RudiKanbanColumnData[] = [
      {
        id: 'backlog',
        title: 'Backlog',
        items: [
          { id: 's1', title: 'Task one' },
          { id: 's2', title: 'Task two' },
          { id: 's3', title: 'Task three' },
        ],
      },
      {
        id: 'active',
        title: 'Active',
        items: [{ id: 's4', title: 'Task four' }],
      },
    ]

    return (
      <RudiKanbanBoard
        columns={simpleColumns}
        onCardMove={() => {}}
        renderCard={(item) => (
          <RudiKanbanCard key={item.id} id={item.id}>
            <span style={{ fontSize: '0.875rem' }}>{String(item.title)}</span>
          </RudiKanbanCard>
        )}
      />
    )
  },
}
