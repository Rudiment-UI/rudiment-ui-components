import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RouterProvider } from 'react-aria'
import type { Selection, SortDescriptor } from 'react-aria-components'
import { RudiTable, type RudiTableProps } from './Table'
import { RudiTableHeader } from './TableHeader'
import { RudiTableColumn } from './TableColumn'
import { RudiTableBody } from './TableBody'
import { RudiTableRow } from './TableRow'
import { RudiTableCell } from './TableCell'

const shipments = [
  { id: 'SH-1', destination: 'Boston', weight: 12 },
  { id: 'SH-2', destination: 'Austin', weight: 4 },
  { id: 'SH-3', destination: 'Chicago', weight: 30 },
]

function Shipments({
  hrefs = false,
  ...props
}: Partial<RudiTableProps> & { hrefs?: boolean }) {
  return (
    <RudiTable aria-label="Shipments" {...(props as RudiTableProps)}>
      <RudiTableHeader>
        <RudiTableColumn id="id" isRowHeader allowsSorting>
          Shipment
        </RudiTableColumn>
        <RudiTableColumn id="destination" allowsSorting>
          Destination
        </RudiTableColumn>
        <RudiTableColumn id="weight" align="end">
          Weight
        </RudiTableColumn>
      </RudiTableHeader>
      <RudiTableBody>
        {shipments.map((s) => (
          <RudiTableRow key={s.id} id={s.id} href={hrefs ? `/shipments/${s.id}` : undefined}>
            <RudiTableCell>{s.id}</RudiTableCell>
            <RudiTableCell>{s.destination}</RudiTableCell>
            <RudiTableCell>{`${s.weight} kg`}</RudiTableCell>
          </RudiTableRow>
        ))}
      </RudiTableBody>
    </RudiTable>
  )
}

describe('Table', () => {
  it('renders a labelled grid with headers, rows and cells', () => {
    render(<Shipments />)
    const grid = screen.getByRole('grid', { name: 'Shipments' })
    expect(within(grid).getAllByRole('columnheader')).toHaveLength(3)
    expect(within(grid).getAllByRole('row')).toHaveLength(4)
    expect(screen.getByRole('rowheader', { name: 'SH-1' })).toBeInTheDocument()
  })

  it('wraps the grid in a scroll container with density and option classes', () => {
    const { container } = render(<Shipments density="compact" striped stickyHeader maxHeight={200} />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass(
      'rudi-table',
      'rudi-table--compact',
      'rudi-table--striped',
      'rudi-table--sticky-header',
    )
    expect(root.style.getPropertyValue('--table-max-height')).toBe('200px')
    expect(root.querySelector('table')).toHaveClass('rudi-table__grid')
  })

  it('defaults to regular density without zebra striping', () => {
    const { container } = render(<Shipments />)
    expect(container.firstChild).toHaveClass('rudi-table--regular')
    expect(container.firstChild).not.toHaveClass('rudi-table--striped')
  })

  it('applies column alignment to the header and inherited by cells', () => {
    render(<Shipments />)
    expect(screen.getByRole('columnheader', { name: 'Weight' })).toHaveAttribute('data-align', 'end')
    expect(screen.getByText('12 kg')).toHaveAttribute('data-align', 'end')
    expect(screen.getByText('Boston')).toHaveAttribute('data-align', 'start')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Shipments />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations with selection', async () => {
    const { container } = render(<Shipments selectionMode="multiple" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('moves focus between rows with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<Shipments onRowAction={vi.fn()} />)
    await user.tab()
    // First tab lands on the first row
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows[0]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(rows[1]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(rows[2]).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(rows[1]).toHaveFocus()
  })

  it('calls onSortChange and reflects aria-sort', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    function Sortable() {
      const [sort, setSort] = useState<SortDescriptor>({ column: 'id', direction: 'ascending' })
      return (
        <Shipments
          sortDescriptor={sort}
          onSortChange={(d) => {
            onSortChange(d)
            setSort(d)
          }}
        />
      )
    }
    render(<Sortable />)
    const idHeader = screen.getByRole('columnheader', { name: 'Shipment' })
    const destHeader = screen.getByRole('columnheader', { name: 'Destination' })
    expect(idHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(destHeader).toHaveAttribute('aria-sort', 'none')
    expect(screen.getByRole('columnheader', { name: 'Weight' })).not.toHaveAttribute('aria-sort')

    await user.click(idHeader)
    expect(onSortChange).toHaveBeenLastCalledWith({ column: 'id', direction: 'descending' })
    expect(idHeader).toHaveAttribute('aria-sort', 'descending')

    await user.click(destHeader)
    expect(onSortChange).toHaveBeenLastCalledWith({ column: 'destination', direction: 'ascending' })
    expect(destHeader).toHaveAttribute('aria-sort', 'ascending')
  })

  it('renders a sort indicator only on sortable columns', () => {
    render(<Shipments sortDescriptor={{ column: 'id', direction: 'ascending' }} />)
    const icons = document.querySelectorAll('.rudi-table__sort-icon')
    expect(icons).toHaveLength(2)
    expect(
      screen.getByRole('columnheader', { name: 'Shipment' }).querySelector('.rudi-table__sort-icon'),
    ).toHaveClass('rudi-table__sort-icon--active')
  })

  it('fires onRowAction on click and on Enter', async () => {
    const user = userEvent.setup()
    const onRowAction = vi.fn()
    render(<Shipments onRowAction={onRowAction} />)
    await user.click(screen.getByText('Austin'))
    expect(onRowAction).toHaveBeenLastCalledWith('SH-2')

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onRowAction).toHaveBeenLastCalledWith('SH-3')
    expect(onRowAction).toHaveBeenCalledTimes(2)
  })

  it('navigates href rows through RouterProvider', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <RouterProvider navigate={navigate}>
        <Shipments hrefs />
      </RouterProvider>,
    )
    await user.click(screen.getByText('Chicago'))
    expect(navigate).toHaveBeenCalledWith('/shipments/SH-3', undefined)

    await user.keyboard('{ArrowUp}{Enter}')
    expect(navigate).toHaveBeenLastCalledWith('/shipments/SH-2', undefined)
  })

  it('toggles selection with checkboxes', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    function Selectable() {
      const [selected, setSelected] = useState<Selection>(new Set())
      return (
        <Shipments
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={(keys) => {
            onSelectionChange(keys)
            setSelected(keys)
          }}
        />
      )
    }
    render(<Selectable />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(4) // select-all + 3 rows

    await user.click(checkboxes[1])
    expect([...(onSelectionChange.mock.lastCall![0] as Set<string>)]).toEqual(['SH-1'])
    expect(screen.getAllByRole('row')[1]).toHaveAttribute('aria-selected', 'true')
    expect(document.querySelector('.rudi-table__checkbox-control--indeterminate')).toBeInTheDocument()

    await user.click(checkboxes[0])
    expect(onSelectionChange.mock.lastCall![0]).toBe('all')

    await user.click(checkboxes[1])
    expect(screen.getAllByRole('row')[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('renders the empty state when there are no rows', () => {
    render(
      <RudiTable aria-label="Shipments">
        <RudiTableHeader>
          <RudiTableColumn isRowHeader>Shipment</RudiTableColumn>
        </RudiTableHeader>
        <RudiTableBody renderEmptyState={() => <p>No shipments yet</p>}>{[]}</RudiTableBody>
      </RudiTable>,
    )
    expect(screen.getByText('No shipments yet')).toBeInTheDocument()
  })

  it('supports dynamic columns and rows', () => {
    const columns = [
      { id: 'id', name: 'Shipment', isRowHeader: true },
      { id: 'destination', name: 'Destination' },
      { id: 'weight', name: 'Weight', align: 'end' as const },
    ]
    render(
      <RudiTable aria-label="Shipments">
        <RudiTableHeader columns={columns}>
          {(c) => (
            <RudiTableColumn isRowHeader={c.isRowHeader} align={c.align}>
              {c.name}
            </RudiTableColumn>
          )}
        </RudiTableHeader>
        <RudiTableBody items={shipments}>
          {(item) => (
            <RudiTableRow columns={columns}>
              {(c) => <RudiTableCell>{String(item[c.id as keyof typeof item])}</RudiTableCell>}
            </RudiTableRow>
          )}
        </RudiTableBody>
      </RudiTable>,
    )
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Shipment',
      'Destination',
      'Weight',
    ])
    expect(screen.getAllByRole('row')).toHaveLength(4)
    expect(screen.getByRole('rowheader', { name: 'SH-3' })).toBeInTheDocument()
    expect(screen.getByText('30')).toHaveAttribute('data-align', 'end')
  })

  it('applies column width and minWidth as styles', () => {
    render(
      <RudiTable aria-label="Widths">
        <RudiTableHeader>
          <RudiTableColumn isRowHeader width={120} minWidth="8rem">
            Name
          </RudiTableColumn>
        </RudiTableHeader>
        <RudiTableBody>
          <RudiTableRow id="a">
            <RudiTableCell>A</RudiTableCell>
          </RudiTableRow>
        </RudiTableBody>
      </RudiTable>,
    )
    const header = screen.getByRole('columnheader', { name: 'Name' })
    expect(header.style.width).toBe('120px')
    expect(header.style.minWidth).toBe('8rem')
  })
})
