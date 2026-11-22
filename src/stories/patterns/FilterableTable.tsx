import { useMemo, useState } from 'react'
import {
  RudiBadge,
  RudiButton,
  RudiCluster,
  RudiEmptyState,
  RudiInput,
  RudiOption,
  RudiPagination,
  RudiSelect,
  RudiStack,
  RudiTable,
  RudiTableBody,
  RudiTableCell,
  RudiTableColumn,
  RudiTableHeader,
  RudiTableRow,
  RudiText,
} from '../../index'

type Status = 'pending' | 'in-transit' | 'delivered' | 'delayed'

interface Shipment {
  id: string
  destination: string
  carrier: string
  status: Status
  weightKg: number
}

const statusLabel: Record<Status, string> = {
  pending: 'Pending',
  'in-transit': 'In transit',
  delivered: 'Delivered',
  delayed: 'Delayed',
}

const statusVariant = {
  pending: 'default',
  'in-transit': 'info',
  delivered: 'success',
  delayed: 'warning',
} as const

const statusFilters = [
  { id: 'all', name: 'All statuses' },
  ...Object.entries(statusLabel).map(([id, name]) => ({ id, name })),
]

// Sample data. In an app this comes from your API.
const shipments: Shipment[] = (
  [
    ['Boston', 'Cryoport', 'delivered', 18],
    ['Denver', 'FedEx Custom Critical', 'in-transit', 22],
    ['Austin', 'Cryoport', 'pending', 15],
    ['Seattle', 'World Courier', 'delayed', 19],
    ['Chicago', 'FedEx Custom Critical', 'delivered', 21],
    ['Atlanta', 'World Courier', 'in-transit', 17],
    ['Phoenix', 'Cryoport', 'delivered', 16],
    ['Portland', 'World Courier', 'pending', 20],
    ['Miami', 'FedEx Custom Critical', 'delayed', 23],
    ['Nashville', 'Cryoport', 'in-transit', 18],
    ['San Diego', 'World Courier', 'delivered', 14],
    ['Minneapolis', 'FedEx Custom Critical', 'pending', 19],
    ['Raleigh', 'Cryoport', 'delivered', 17],
    ['Salt Lake City', 'World Courier', 'in-transit', 21],
    ['Pittsburgh', 'Cryoport', 'delayed', 16],
    ['Columbus', 'FedEx Custom Critical', 'delivered', 22],
    ['Omaha', 'World Courier', 'pending', 18],
    ['Tampa', 'Cryoport', 'in-transit', 20],
  ] as const
).map(([destination, carrier, status, weightKg], i) => ({
  id: `SHP-${1040 + i}`,
  destination,
  carrier,
  status,
  weightKg,
}))

const PAGE_SIZE = 6

/**
 * Filterable table with pagination. Filters narrow the rows, the page resets
 * to 1 whenever a filter changes, and a polite live region announces the
 * result count so screen-reader users know the table changed. An empty
 * result shows an empty state with a way out.
 */
export function FilterableTable() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shipments.filter(
      (s) =>
        (status === 'all' || s.status === status) &&
        (!q || [s.id, s.destination, s.carrier].some((v) => v.toLowerCase().includes(q))),
    )
  }, [query, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () => {
    setQuery('')
    setStatus('all')
    setPage(1)
  }

  return (
    <RudiStack>
      <RudiCluster align="flex-end">
        <RudiInput
          label="Search shipments"
          type="search"
          placeholder="ID, city or carrier"
          value={query}
          onChange={(value) => {
            setQuery(value)
            setPage(1)
          }}
        />
        <RudiSelect
          label="Status"
          items={statusFilters}
          selectedKey={status}
          onSelectionChange={(key) => {
            setStatus(String(key ?? 'all'))
            setPage(1)
          }}
        >
          {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
        </RudiSelect>
      </RudiCluster>

      <RudiText variant="body-sm" tone="subtle" noMargin role="status">
        {filtered.length === shipments.length
          ? `${shipments.length} shipments`
          : `${filtered.length} of ${shipments.length} shipments`}
      </RudiText>

      <RudiTable aria-label="Shipments" density="compact">
        <RudiTableHeader>
          <RudiTableColumn isRowHeader>Shipment</RudiTableColumn>
          <RudiTableColumn>Destination</RudiTableColumn>
          <RudiTableColumn>Carrier</RudiTableColumn>
          <RudiTableColumn>Status</RudiTableColumn>
          <RudiTableColumn align="end">Weight</RudiTableColumn>
        </RudiTableHeader>
        <RudiTableBody
          items={rows}
          renderEmptyState={() => (
            <RudiEmptyState
              size="sm"
              icon="lucide:search-x"
              title="No shipments match"
              description="Try a different search or status."
              action={
                <RudiButton variant="secondary" size="sm" onPress={clearFilters}>
                  Clear filters
                </RudiButton>
              }
            />
          )}
        >
          {(s) => (
            <RudiTableRow id={s.id}>
              <RudiTableCell>{s.id}</RudiTableCell>
              <RudiTableCell>{s.destination}</RudiTableCell>
              <RudiTableCell>{s.carrier}</RudiTableCell>
              <RudiTableCell>
                <RudiBadge size="sm" variant={statusVariant[s.status]}>
                  {statusLabel[s.status]}
                </RudiBadge>
              </RudiTableCell>
              <RudiTableCell>{s.weightKg} kg</RudiTableCell>
            </RudiTableRow>
          )}
        </RudiTableBody>
      </RudiTable>

      <RudiPagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        label="Shipments pages"
      />
    </RudiStack>
  )
}
