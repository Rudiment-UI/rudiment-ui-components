import {
  RudiBadge,
  RudiBox,
  RudiButton,
  RudiCard,
  RudiCenter,
  RudiCluster,
  RudiPageHeader,
  RudiSectionHeader,
  RudiSidebar,
  RudiSparkline,
  RudiStack,
  RudiStatCard,
  RudiSwitcher,
  RudiTable,
  RudiTableBody,
  RudiTableCell,
  RudiTableColumn,
  RudiTableHeader,
  RudiTableRow,
  RudiText,
} from '../../index'
import './PortfolioDashboard.css'

const stats = [
  { label: 'Net asset value', value: '$4.82M', delta: '+1.3%', trend: 'up', history: [4.61, 4.66, 4.7, 4.68, 4.75, 4.79, 4.82] },
  { label: 'Day P&L', value: '+$61,240', delta: '+1.3%', trend: 'up', history: [12, 18, 9, 22, 31, 44, 61] },
  { label: 'Cash', value: '$312,900', delta: '−4.0%', trend: 'down', history: [340, 338, 331, 326, 320, 315, 313] },
  { label: 'Open orders', value: 14, delta: '0', trend: 'neutral', history: [14, 15, 13, 14, 16, 14, 14] },
] as const

const positions = [
  { id: 'MSFT', name: 'Microsoft', qty: 1200, price: '$431.20', change: 0.8, weight: '10.7%' },
  { id: 'NVDA', name: 'NVIDIA', qty: 2600, price: '$148.95', change: 2.4, weight: '8.0%' },
  { id: 'JPM', name: 'JPMorgan Chase', qty: 1500, price: '$242.10', change: -0.6, weight: '7.5%' },
  { id: 'UNH', name: 'UnitedHealth', qty: 520, price: '$598.40', change: -1.2, weight: '6.5%' },
  { id: 'XOM', name: 'Exxon Mobil', qty: 2400, price: '$120.35', change: 0.3, weight: '6.0%' },
  { id: 'TLT', name: 'iShares 20+ Yr Treasury', qty: 3100, price: '$92.80', change: 0.1, weight: '6.0%' },
]

const alerts = [
  { id: 'a1', text: 'NVDA crossed its 5% position limit', tone: 'warning' },
  { id: 'a2', text: 'Quarterly rebalance due in 3 days', tone: 'info' },
  { id: 'a3', text: 'Wire of $250,000 settled', tone: 'success' },
] as const

// Layout props name a spacing step ("group", "section"). What each step measures
// at each breakpoint is set once, in PortfolioDashboard.css.
export function PortfolioDashboard() {
  return (
    <RudiBox as="main" padding="gutter" className="portfolio-app">
      <RudiCenter maxWidth="90rem" gutters={0}>
        <RudiStack space="section">
          <RudiPageHeader
            title="Growth portfolio"
            subtitle="Prices delayed 15 minutes · 23 Nov 2026, 15:45 ET"
            actions={
              <RudiCluster space="inline">
                <RudiButton variant="secondary" iconBefore="mdi:download">
                  Export
                </RudiButton>
                <RudiButton iconBefore="mdi:swap-horizontal">New order</RudiButton>
              </RudiCluster>
            }
          />

          <RudiSwitcher as="ul" threshold="40rem" space="group" aria-label="Key figures">
            {stats.map((s) => (
              <li key={s.label}>
                <RudiStatCard label={s.label} value={s.value} delta={s.delta} trend={s.trend}>
                  <RudiSparkline
                    label={`${s.label}, last 7 sessions`}
                    data={[...s.history]}
                    tone={s.trend === 'down' ? 'error' : 'brand'}
                  />
                </RudiStatCard>
              </li>
            ))}
          </RudiSwitcher>

          <RudiSidebar side="right" sideWidth="18rem" contentMin="60%" space="group" noStretch>
            <RudiStack as="section" space="content" aria-labelledby="positions-title">
              <RudiSectionHeader
                title={<span id="positions-title">Top positions</span>}
                description="By market value"
              />
              <RudiTable aria-labelledby="positions-title" density="compact" striped>
                <RudiTableHeader>
                  <RudiTableColumn isRowHeader>Symbol</RudiTableColumn>
                  <RudiTableColumn>Name</RudiTableColumn>
                  <RudiTableColumn align="end">Quantity</RudiTableColumn>
                  <RudiTableColumn align="end">Price</RudiTableColumn>
                  <RudiTableColumn align="end">Day</RudiTableColumn>
                  <RudiTableColumn align="end">Weight</RudiTableColumn>
                </RudiTableHeader>
                <RudiTableBody items={positions}>
                  {(p) => (
                    <RudiTableRow id={p.id}>
                      <RudiTableCell>{p.id}</RudiTableCell>
                      <RudiTableCell>{p.name}</RudiTableCell>
                      <RudiTableCell>{p.qty.toLocaleString('en-US')}</RudiTableCell>
                      <RudiTableCell>{p.price}</RudiTableCell>
                      <RudiTableCell>
                        <RudiBadge size="sm" variant={p.change < 0 ? 'error' : 'success'}>
                          {p.change > 0 ? '+' : ''}
                          {p.change}%
                        </RudiBadge>
                      </RudiTableCell>
                      <RudiTableCell>{p.weight}</RudiTableCell>
                    </RudiTableRow>
                  )}
                </RudiTableBody>
              </RudiTable>
            </RudiStack>

            <RudiCard variant="outlined" padding="sm">
              <RudiCard.Header>
                <RudiText as="h2" weight="semibold" noMargin>
                  Alerts
                </RudiText>
              </RudiCard.Header>
              <RudiCard.Body>
                <RudiStack as="ul" space="content">
                  {alerts.map((a) => (
                    <li key={a.id}>
                      <RudiCluster space="inline" align="baseline">
                        <RudiBadge dot variant={a.tone}>
                          {a.tone}
                        </RudiBadge>
                        <RudiText variant="body-sm" as="span" noMargin>
                          {a.text}
                        </RudiText>
                      </RudiCluster>
                    </li>
                  ))}
                </RudiStack>
              </RudiCard.Body>
            </RudiCard>
          </RudiSidebar>
        </RudiStack>
      </RudiCenter>
    </RudiBox>
  )
}
