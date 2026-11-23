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
      table: { category: 'Appearance' },
    },
    striped: {
      control: 'boolean',
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
      table: { category: 'Layout' },
    },
    maxHeight: {
      control: 'text',
      table: { category: 'Layout' },
    },
    className: {
      control: false,
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
      control: false,
      description: 'Called with the next sort descriptor when a sortable column header is pressed.',
      table: { category: 'Events' },
    },
    onSelectionChange: {
      control: false,
      description: 'Called with the next selection when rows are (de)selected.',
      table: { category: 'Events' },
    },
    onRowAction: {
      control: false,
      description: 'Called with the row id when a row is clicked or Enter is pressed on it.',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<RudiTableProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Give every table an `aria-label` (or `aria-labelledby`) and mark one column `isRowHeader` so screen readers announce each row by name. Set `align="end"` on numeric columns so digits line up. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
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

export const Sorting: Story = {
  render: function SortingStory(args) {
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
        onSortChange={setSort}
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
          'Use sorting when readers compare rows by a column. Sorting is controlled: `allowsSorting` only adds the indicator and `aria-sort`, so reorder `items` in `onSortChange` yourself.',
      },
    },
  },
}

export const Selecting: Story = {
  name: 'Selection',
  parameters: {
    docs: {
      description: {
        story:
          'Use `selectionMode` when readers act on several rows at once, such as printing labels. The table adds a checkbox column and reports the chosen ids through `onSelectionChange`.',
      },
    },
  },
  args: { selectionMode: 'multiple' },
  render: function SelectionStory(args) {
    const [selected, setSelected] = useState<Selection>(new Set(['SH-1044']))
    const count = selected === 'all' ? shipments.length : selected.size
    return (
      <RudiStack space={3}>
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
          onSelectionChange={setSelected}
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

export const RowNavigation: Story = {
  name: 'Row navigation',
  render: function RowNavigationStory(args) {
    // Stand-in for a router: in an app, pass your router's navigate.
    const [path, setPath] = useState('/shipments')
    return (
      <RudiRouterProvider navigate={setPath}>
        <RudiStack space={3}>
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
          'Use row `href` to navigate on click or Enter through `RudiRouterProvider`, and table-level `onRowAction` to open a dialog or run a callback in place. Either replaces a button in every row.',
      },
    },
  },
}

export const EmptyState: Story = {
  name: 'Empty state',
  parameters: {
    docs: {
      description: {
        story:
          'Use `renderEmptyState` on the body to say what is missing and what to do next when there are no rows. The column headers stay in place.',
      },
    },
  },
  render: (args) => (
    <RudiTable {...args}>
      <ShipmentColumns />
      <RudiTableBody
        items={[] as Shipment[]}
        renderEmptyState={() => (
          <RudiStack space="inline">
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

export const WideTables: Story = {
  name: 'Wide tables',
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
          'Use this when a table has more columns or rows than fit. It scrolls inside its own container instead of overflowing the page, and `maxHeight` with `stickyHeader` keeps the header visible. Columns and rows here come from `columns` and `items`.',
      },
    },
  },
}

export const Density: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `compact` for dense data views and `striped` to help the eye follow long rows. Regular density suits short tables that readers scan once.',
      },
    },
  },
  render: (args) => (
    <RudiStack space="section">
      {(['regular', 'compact'] as const).map((density) => (
        <RudiTable
          key={density}
          {...args}
          aria-label={`Shipments, ${density} density`}
          density={density}
          striped={density === 'compact'}
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
      ))}
    </RudiStack>
  ),
}
