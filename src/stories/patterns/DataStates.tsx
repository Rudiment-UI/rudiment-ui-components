import {
  RudiAlert,
  RudiBadge,
  RudiButton,
  RudiCard,
  RudiCluster,
  RudiEmptyState,
  RudiSectionHeader,
  RudiStack,
  RudiText,
} from '../../index'

export type RemoteStatus = 'loading' | 'empty' | 'error' | 'ready'

export interface DataStatesProps {
  /** Where the request is. In an app this comes from your data-fetching hook. */
  status: RemoteStatus
  /** Retries the request after an error. */
  onRetry?: () => void
  /** Starts the create flow from the empty state. */
  onCreate?: () => void
}

const alerts = [
  { id: 'SHP-1043', text: 'Seattle shipment is 4 hours behind schedule', tone: 'warning' },
  { id: 'SHP-1048', text: 'Miami probe read -148 °C, above the -150 °C limit', tone: 'error' },
  { id: 'SHP-1054', text: 'Pittsburgh pickup was rescheduled to tomorrow', tone: 'info' },
] as const

function Body({ status, onRetry, onCreate }: DataStatesProps) {
  switch (status) {
    case 'loading':
      return (
        <RudiText tone="subtle" noMargin role="status">
          Loading alerts…
        </RudiText>
      )
    case 'error':
      return (
        <RudiAlert
          variant="error"
          title="Alerts couldn't load"
          action={
            <RudiButton size="sm" variant="secondary" onPress={onRetry}>
              Try again
            </RudiButton>
          }
        >
          The server didn't respond. Your shipments are unaffected.
        </RudiAlert>
      )
    case 'empty':
      return (
        <RudiEmptyState
          size="sm"
          headingLevel={3}
          icon="lucide:bell-off"
          title="No open alerts"
          description="You'll see delays and temperature excursions here as soon as they happen."
          action={
            <RudiButton size="sm" variant="secondary" onPress={onCreate}>
              Set up alert rules
            </RudiButton>
          }
        />
      )
    case 'ready':
      return (
        <RudiStack as="ul" space="var(--rudi-spacing-3)">
          {alerts.map((a) => (
            <li key={a.id}>
              <RudiCluster space="var(--rudi-spacing-2)">
                <RudiBadge size="sm" variant={a.tone}>
                  {a.id}
                </RudiBadge>
                <RudiText as="span" noMargin>
                  {a.text}
                </RudiText>
              </RudiCluster>
            </li>
          ))}
        </RudiStack>
      )
  }
}

/**
 * One panel in each of its four states. Every state keeps the panel's heading
 * and frame, so the layout doesn't jump, and every state other than loaded
 * tells the user what happened and what they can do next. A wrapper sets
 * `aria-busy` while loading, because `RudiCard` doesn't take ARIA attributes.
 */
export function DataStates(props: DataStatesProps) {
  return (
    <div aria-busy={props.status === 'loading'}>
      <RudiCard variant="outlined">
        <RudiCard.Header>
          <RudiSectionHeader title="Open alerts" headingLevel={2} />
        </RudiCard.Header>
        <RudiCard.Body>
          <Body {...props} />
        </RudiCard.Body>
      </RudiCard>
    </div>
  )
}
