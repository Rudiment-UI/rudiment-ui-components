import type { Meta, StoryObj } from '@storybook/react'
import { useMemo, useState } from 'react'
import type { Selection, SortDescriptor } from 'react-aria-components'
import { RudiTable, type RudiTableProps } from './Table'
import { RudiTableHeader } from './TableHeader'
import { RudiTableColumn } from './TableColumn'
import { RudiTableBody } from './TableBody'
import { RudiTableRow } from './TableRow'
import { RudiTableCell } from './TableCell'
import { RudiBadge, type RudiBadgeProps } from '../Badge/Badge'
import { RudiButton } from '../Button/Button'
import { RudiRouterProvider } from '../RouterProvider/RouterProvider'
import { RudiStack } from '@/layouts/Stack/Stack'
import { RudiCluster } from '@/layouts/Cluster/Cluster'
import { RudiText } from '@/typography/Text/Text'

type Status = 'Pending' | 'In transit' | 'Delivered' | 'Delayed'

interface Shipment {
  id: string
  destination: string
  carrier: string
  status: Status
  weight: number
  shipped: string
}

const shipments: Shipment[] = [
  { id: 'SH-1042', destination: 'Boston, MA', carrier: 'FedEx', status: 'In transit', weight: 12.4, shipped: '2026-11-02' },
  { id: 'SH-1043', destination: 'Austin, TX', carrier: 'UPS', status: 'Delivered', weight: 3.1, shipped: '2026-10-29' },
  { id: 'SH-1044', destination: 'Chicago, IL', carrier: 'DHL', status: 'Delayed', weight: 28.0, shipped: '2026-11-05' },
  { id: 'SH-1045', destination: 'Denver, CO', carrier: 'FedEx', status: 'Pending', weight: 7.75, shipped: '2026-11-08' },
  { id: 'SH-1046', destination: 'Seattle, WA', carrier: 'UPS', status: 'In transit', weight: 15.2, shipped: '2026-11-06' },
]

const statusVariant: Record<Status, RudiBadgeProps['variant']> = {
  Pending: 'default',
  'In transit': 'info',
  Delivered: 'success',
  Delayed: 'warning',
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <RudiBadge variant={statusVariant[status]} size="sm">
      {status}
    </RudiBadge>
  )
}

function ShipmentColumns({ sortable = false }: { sortable?: boolean }) {
  return (
    <RudiTableHeader>
      <RudiTableColumn id="id" isRowHeader allowsSorting={sortable}>
        Shipment
      </RudiTableColumn>
      <RudiTableColumn id="destination" allowsSorting={sortable} minWidth="10rem">
        Destination
      </RudiTableColumn>
      <RudiTableColumn id="carrier" allowsSorting={sortable}>
        Carrier
      </RudiTableColumn>
      <RudiTableColumn id="status">Status</RudiTableColumn>
      <RudiTableColumn id="weight" align="end" allowsSorting={sortable}>
        Weight (kg)
      </RudiTableColumn>
    </RudiTableHeader>
  )
}

function ShipmentCells({ shipment }: { shipment: Shipment }) {
  return (
    <>
      <RudiTableCell>{shipment.id}</RudiTableCell>
      <RudiTableCell>{shipment.destination}</RudiTableCell>
      <RudiTableCell>{shipment.carrier}</RudiTableCell>
      <RudiTableCell textValue={shipment.status}>
        <StatusBadge status={shipment.status} />
      </RudiTableCell>
      <RudiTableCell>{shipment.weight.toFixed(2)}</RudiTableCell>
    </>
  )
}

const meta = {
  title: 'Components/Table',
  component: RudiTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An accessible data table built on React Aria Components. Compose `RudiTableHeader` / `RudiTableColumn` / `RudiTableBody` / `RudiTableRow` / `RudiTableCell` with static children or `columns` / `items` render functions. Supports controlled sorting, row links (`href`) and actions (`onRowAction`), checkbox selection, an empty state, horizontal scrolling, a sticky header, and compact density. Keyboard users move between rows and cells with the arrow keys.',
      },
    },
  },
  args: {
    'aria-label': 'Shipments',
    density: 'regular',
    striped: false,
    stickyHeader: false,
  },
  argTypes: {
    density: {
      control: 'inline-radio',
      options: ['regular', 'compact'],
      description: 'Row height and cell padding.',
      table: { category: 'Appearance' },
    },
    striped: {
      control: 'boolean',
      description: 'Alternate row backgrounds (zebra striping).',
      table: { category: 'Appearance' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the table. Required unless `aria-labelledby` is set.',
      table: { category: 'Content' },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of a visible heading that names the table.',
      table: { category: 'Content' },
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Pins the header row while the body scrolls inside the table. Pair with `maxHeight`.',
      table: { category: 'Layout' },
    },
    maxHeight: {
      control: 'text',
      description: 'Max height of the scroll container (CSS length or px number).',
      table: { category: 'Layout' },
    },
    className: {
      control: false,
      description: 'Class merged onto the outer scroll container.',
      table: { category: 'Layout' },
    },
    selectionMode: {
      control: 'inline-radio',
      options: ['none', 'single', 'multiple'],
      description: 'Adds a checkbox column and enables row selection.',
      table: { category: 'State' },
    },
    selectedKeys: {
      control: false,
      description: 'Controlled set of selected row ids (or `"all"`).',
      table: { category: 'State' },
    },
    sortDescriptor: {
      control: false,
      description: 'Controlled `{ column, direction }` for the sorted column.',
      table: { category: 'State' },
    },
    onSortChange: {
      action: 'sortChange',
      description: 'Called with the next sort descriptor when a sortable column header is pressed.',
      table: { category: 'Events' },
    },
    onSelectionChange: {
      action: 'selectionChange',
      description: 'Called with the next selection when rows are (de)selected.',
      table: { category: 'Events' },
    },
    onRowAction: {
      action: 'rowAction',
      description: 'Called with the row id when a row is clicked or Enter is pressed on it.',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<RudiTableProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <RudiTable {...args}>
      <ShipmentColumns />
      <RudiTableBody>
        {shipments.map((s) => (
          <RudiTableRow key={s.id} id={s.id}>
            <ShipmentCells shipment={s} />
          </RudiTableRow>
        ))}
      </RudiTableBody>
    </RudiTable>
  ),
}

export const Sortable: Story = {
  render: function SortableStory(args) {
    const [sort, setSort] = useState<SortDescriptor>({ column: 'id', direction: 'ascending' })
    const sorted = useMemo(() => {
      const key = sort.column as keyof Shipment
      return [...shipments].sort((a, b) => {
        const cmp = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
        return sort.direction === 'descending' ? -cmp : cmp
      })
    }, [sort])
    return (
      <RudiTable
        {...args}
        sortDescriptor={sort}
        onSortChange={(d) => {
          setSort(d)
          args.onSortChange?.(d)
        }}
      >
        <ShipmentColumns sortable />
        <RudiTableBody items={sorted}>
          {(s) => (
            <RudiTableRow id={s.id}>
              <ShipmentCells shipment={s} />
            </RudiTableRow>
          )}
        </RudiTableBody>
      </RudiTable>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sorting is controlled: the table reports the next `sortDescriptor` and you sort the data. Columns with `allowsSorting` show an indicator and expose `aria-sort`.',
      },
    },
  },
}

export const Selectable: Story = {
  args: { selectionMode: 'multiple' },
  render: function SelectableStory(args) {
    const [selected, setSelected] = useState<Selection>(new Set(['SH-1044']))
    const count = selected === 'all' ? shipments.length : selected.size
    return (
      <RudiStack space="0.75rem">
        <RudiCluster justify="space-between" align="center">
          <RudiText variant="body-sm" tone="subtle" noMargin>
            {count} selected
          </RudiText>
          <RudiButton variant="secondary" size="sm" isDisabled={count === 0}>
            Print labels
          </RudiButton>
        </RudiCluster>
        <RudiTable
          {...args}
          selectedKeys={selected}
          onSelectionChange={(keys) => {
            setSelected(keys)
            args.onSelectionChange?.(keys)
          }}
        >
          <ShipmentColumns />
          <RudiTableBody items={shipments}>
            {(s) => (
              <RudiTableRow id={s.id}>
                <ShipmentCells shipment={s} />
              </RudiTableRow>
            )}
          </RudiTableBody>
        </RudiTable>
      </RudiStack>
    )
  },
}

export const ClickableRows: Story = {
  name: 'Clickable rows with href',
  render: function ClickableRowsStory(args) {
    // Stand-in for a router: in an app, pass your router's navigate.
    const [path, setPath] = useState('/shipments')
    return (
      <RudiRouterProvider navigate={setPath}>
        <RudiStack space="0.75rem">
          <RudiTable {...args}>
            <ShipmentColumns />
            <RudiTableBody items={shipments}>
              {(s) => (
                <RudiTableRow id={s.id} href={`/shipments/${s.id}`}>
                  <ShipmentCells shipment={s} />
                </RudiTableRow>
              )}
            </RudiTableBody>
          </RudiTable>
          <RudiText variant="caption" tone="subtle" noMargin>
            Current route: {path}
          </RudiText>
        </RudiStack>
      </RudiRouterProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Rows with `href` navigate on click or Enter through `RudiRouterProvider`. Use the table-level `onRowAction` instead when a row should open a dialog or run a callback.',
      },
    },
  },
}

export const EmptyState: Story = {
  name: 'Empty state',
  render: (args) => (
    <RudiTable {...args}>
      <ShipmentColumns />
      <RudiTableBody
        items={[] as Shipment[]}
        renderEmptyState={() => (
          <RudiStack space="0.5rem">
            <RudiText weight="semibold" noMargin>
              No shipments yet
            </RudiText>
            <RudiText variant="body-sm" tone="subtle" noMargin>
              Shipments you create will appear here.
            </RudiText>
          </RudiStack>
        )}
      >
        {(s) => (
          <RudiTableRow id={s.id}>
            <ShipmentCells shipment={s} />
          </RudiTableRow>
        )}
      </RudiTableBody>
    </RudiTable>
  ),
}

const wideColumns = [
  { id: 'id', name: 'Shipment', isRowHeader: true },
  { id: 'destination', name: 'Destination' },
  { id: 'carrier', name: 'Carrier' },
  { id: 'status', name: 'Status' },
  { id: 'shipped', name: 'Shipped' },
  { id: 'origin', name: 'Origin warehouse' },
  { id: 'tracking', name: 'Tracking number' },
  { id: 'reference', name: 'Customer reference' },
  { id: 'service', name: 'Service level' },
  { id: 'weight', name: 'Weight (kg)', align: 'end' as const },
  { id: 'cost', name: 'Cost (USD)', align: 'end' as const },
]

const wideRows = shipments.map((s, i) => ({
  ...s,
  origin: 'Newark Distribution Center',
  tracking: `1Z999AA1012345678${i}`,
  reference: `PO-2026-00${i + 41}`,
  service: i % 2 ? 'Ground' : 'Priority overnight',
  cost: (s.weight * 4.2).toFixed(2),
}))

export const ManyColumns: Story = {
  name: 'Many columns (scroll)',
  args: { stickyHeader: true, maxHeight: '14rem' },
  render: (args) => (
    <RudiTable {...args}>
      <RudiTableHeader columns={wideColumns}>
        {(c) => (
          <RudiTableColumn isRowHeader={c.isRowHeader} align={c.align}>
            {c.name}
          </RudiTableColumn>
        )}
      </RudiTableHeader>
      <RudiTableBody items={[...wideRows, ...wideRows.map((r) => ({ ...r, id: `${r.id}-B` }))]}>
        {(row) => (
          <RudiTableRow id={row.id} columns={wideColumns}>
            {(c) => (
              <RudiTableCell>
                {c.id === 'weight'
                  ? row.weight.toFixed(2)
                  : String(row[c.id as keyof typeof row])}
              </RudiTableCell>
            )}
          </RudiTableRow>
        )}
      </RudiTableBody>
    </RudiTable>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Wide tables scroll horizontally inside their own container instead of overflowing the page. With `maxHeight` and `stickyHeader` the header stays visible while the body scrolls. Columns and rows here are rendered dynamically from `columns` / `items`.',
      },
    },
  },
}

export const Compact: Story = {
  args: { density: 'compact', striped: true },
  render: (args) => (
    <RudiTable {...args}>
      <ShipmentColumns />
      <RudiTableBody items={shipments}>
        {(s) => (
          <RudiTableRow id={s.id}>
            <ShipmentCells shipment={s} />
          </RudiTableRow>
        )}
      </RudiTableBody>
    </RudiTable>
  ),
}
