import {
  RudiAlert,
  RudiBadge,
  RudiButton,
  RudiCard,
  RudiCluster,
  RudiGrid,
  RudiInput,
  RudiOption,
  RudiSelect,
  RudiStack,
  RudiSwitch,
  RudiTag,
  RudiText,
} from '../../src'
import { THEMES, themeAttr } from './themes'
import './docs-blocks.css'

const ROLES = [
  { id: 'viewer', name: 'Viewer' },
  { id: 'editor', name: 'Editor' },
  { id: 'admin', name: 'Admin' },
]

// `auto` resolves to Default Light or Dark, both already shown.
const SHOWN = THEMES.filter((t) => t.value !== 'auto')

/**
 * The same small form rendered once per built-in theme, side by side. Each
 * cell sets its own `data-theme`, so the root must stay on the default theme
 * for the Default Light cell to be light.
 */
export function ThemeMatrix() {
  return (
    <RudiGrid minCellWidth="19rem" space="var(--rudi-spacing-4)">
      {SHOWN.map((theme) => (
        <section
          key={theme.value}
          aria-label={theme.title}
          data-theme={themeAttr(theme.value)}
          className="sb-matrix__cell"
        >
          <RudiStack space="var(--rudi-spacing-3)">
            <RudiCluster justify="space-between">
              <RudiText variant="overline" noMargin>
                {theme.title}
              </RudiText>
              <code className="sb-matrix__attr">
                {theme.value === 'light'
                  ? 'no data-theme'
                  : `data-theme="${theme.value}"`}
              </code>
            </RudiCluster>
            <RudiCard variant="outlined">
              <RudiCard.Header>
                <RudiCluster justify="space-between">
                  <RudiText weight="semibold" noMargin>
                    Invite a teammate
                  </RudiText>
                  <RudiBadge variant="success">3 seats left</RudiBadge>
                </RudiCluster>
              </RudiCard.Header>
              <RudiCard.Body>
                <RudiStack space="var(--rudi-spacing-3)">
                  <RudiInput
                    label="Email"
                    type="email"
                    placeholder="name@company.com"
                  />
                  <RudiSelect
                    label="Role"
                    items={ROLES}
                    defaultSelectedKey="editor"
                  >
                    {(r) => <RudiOption key={r.id}>{r.name}</RudiOption>}
                  </RudiSelect>
                  <RudiSwitch defaultSelected>Send a welcome email</RudiSwitch>
                  <RudiCluster space="var(--rudi-spacing-2)">
                    <RudiTag variant="info">Design</RudiTag>
                    <RudiTag>Research</RudiTag>
                  </RudiCluster>
                  <RudiAlert variant="info" isPolite>
                    Invites expire after 7 days.
                  </RudiAlert>
                </RudiStack>
              </RudiCard.Body>
              <RudiCard.Footer>
                <RudiCluster justify="flex-end" space="var(--rudi-spacing-2)">
                  <RudiButton variant="secondary">Cancel</RudiButton>
                  <RudiButton>Send invite</RudiButton>
                </RudiCluster>
              </RudiCard.Footer>
            </RudiCard>
          </RudiStack>
        </section>
      ))}
    </RudiGrid>
  )
}
