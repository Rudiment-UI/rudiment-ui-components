import { describe, expect, it } from 'vitest'
import { previewMove, resolveDrop } from './kanbanMoves'

const board = () => [
  { id: 'todo', title: 'To Do', items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] },
  { id: 'doing', title: 'Doing', items: [{ id: 'd' }, { id: 'e' }] },
  { id: 'done', title: 'Done', items: [] },
]
const ids = (cols: ReturnType<typeof board>) => cols.map((c) => c.items.map((i) => i.id).join(''))

// Apply a move the way consumers are told to: remove from source, insert at toIndex.
function apply(cols: ReturnType<typeof board>, move: NonNullable<ReturnType<typeof resolveDrop>>) {
  const next = cols.map((c) => ({ ...c, items: [...c.items] }))
  const [card] = next.find((c) => c.id === move.fromColumnId)!.items.splice(move.fromIndex, 1)
  next.find((c) => c.id === move.toColumnId)!.items.splice(move.toIndex, 0, card)
  return next
}

describe('previewMove', () => {
  it('inserts before the card it is over, or after it when below its midpoint', () => {
    expect(ids(previewMove(board(), 'a', 'e', false))).toEqual(['bc', 'dae', ''])
    expect(ids(previewMove(board(), 'a', 'e', true))).toEqual(['bc', 'dea', ''])
  })

  it('appends when over the column itself, including an empty one', () => {
    expect(ids(previewMove(board(), 'a', 'done', false))).toEqual(['bc', 'de', 'a'])
  })

  it('leaves the board alone for moves inside the same column', () => {
    const cols = board()
    expect(previewMove(cols, 'a', 'c', true)).toBe(cols)
  })
})

describe('resolveDrop', () => {
  it('reports a cross-column move whose toIndex lands the card where it was previewed', () => {
    const cols = board()
    const preview = previewMove(cols, 'a', 'e', false)
    const move = resolveDrop(cols, preview, 'a', 'a')!
    expect(move).toEqual({ cardId: 'a', fromColumnId: 'todo', toColumnId: 'doing', fromIndex: 0, toIndex: 1 })
    expect(ids(apply(cols, move))).toEqual(ids(preview))
  })

  it('moves down within a column to the slot of the card dropped on', () => {
    const cols = board()
    const move = resolveDrop(cols, cols, 'a', 'c')!
    expect(move).toMatchObject({ fromIndex: 0, toIndex: 2, toColumnId: 'todo' })
    expect(ids(apply(cols, move))).toEqual(['bca', 'de', ''])
  })

  it('reorders inside the new column after a cross-column move', () => {
    const cols = board()
    const preview = previewMove(cols, 'a', 'd', false) // doing: a d e
    const move = resolveDrop(cols, preview, 'a', 'e')! // then dropped on e
    expect(ids(apply(cols, move))).toEqual(['bc', 'dea', ''])
  })

  it('returns null when the card ends where it started', () => {
    const cols = board()
    expect(resolveDrop(cols, cols, 'b', 'b')).toBeNull()
  })
})
