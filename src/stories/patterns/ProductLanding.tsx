import {
  RudiBadge,
  RudiBox,
  RudiButton,
  RudiCard,
  RudiCenter,
  RudiCluster,
  RudiGrid,
  RudiHeading,
  RudiIcon,
  RudiSectionHeader,
  RudiStack,
  RudiSwitcher,
  RudiText,
} from '../../index'
import './ProductLanding.css'

const features = [
  { icon: 'mdi:chart-timeline-variant', title: 'Campaign timelines', text: 'Plan every send, post, and launch on one calendar your whole team can edit.' },
  { icon: 'mdi:account-group-outline', title: 'Audience segments', text: 'Build segments from CRM fields and site behavior, then reuse them in any channel.' },
  { icon: 'mdi:flask-outline', title: 'A/B testing', text: 'Test subject lines and landing pages, and stop a test once a variant wins.' },
  { icon: 'mdi:file-chart-outline', title: 'Attribution reports', text: 'See which campaigns led to pipeline, with first-touch and multi-touch models.' },
]

const plans = [
  { name: 'Starter', price: '$29', note: 'per seat / month', items: ['3 active campaigns', 'Email and social', 'Basic reports'] },
  { name: 'Growth', price: '$79', note: 'per seat / month', items: ['Unlimited campaigns', 'A/B testing', 'Attribution reports'], featured: true },
  { name: 'Enterprise', price: 'Custom', note: 'annual contract', items: ['SSO and audit log', 'Dedicated support', 'Custom data retention'] },
]

// Every gap below names a spacing step. ProductLanding.css sets how large each
// step is on phones, tablets, and desktops, so this file has no breakpoints.
export function ProductLanding() {
  return (
    <RudiBox as="main" padding="gutter" className="landing-site">
      <RudiCenter maxWidth="72rem" gutters={0}>
        <RudiStack space="section">
          <RudiStack as="header" space="content">
            <RudiText variant="overline" tone="subtle" noMargin>
              Campaign planning
            </RudiText>
            <RudiHeading level={1} size={1} noMargin>
              Plan, launch, and measure every campaign in one place
            </RudiHeading>
            <RudiText noMargin>
              Acme Campaigns gives marketing teams a shared calendar, reusable audiences, and reports that
              connect campaigns to revenue.
            </RudiText>
            <RudiCluster space="inline">
              <RudiButton>Start free trial</RudiButton>
              <RudiButton variant="secondary">Book a demo</RudiButton>
            </RudiCluster>
          </RudiStack>

          <RudiStack as="section" space="group" aria-labelledby="features-title">
            <RudiSectionHeader
              title={<span id="features-title">Features</span>}
              description="Everything a campaign needs, from brief to report."
            />
            <RudiGrid as="ul" minCellWidth="15rem" space="group">
              {features.map((f) => (
                <li key={f.title}>
                  <RudiStack space="inline">
                    <RudiIcon icon={f.icon} size="lg" />
                    <RudiHeading level={3} size={5} noMargin>
                      {f.title}
                    </RudiHeading>
                    <RudiText variant="body-sm" tone="subtle" noMargin>
                      {f.text}
                    </RudiText>
                  </RudiStack>
                </li>
              ))}
            </RudiGrid>
          </RudiStack>

          <RudiStack as="section" space="group" aria-labelledby="pricing-title">
            <RudiSectionHeader title={<span id="pricing-title">Pricing</span>} />
            <RudiSwitcher threshold="44rem" space="group">
              {plans.map((p) => (
                <RudiCard key={p.name} variant={p.featured ? 'elevated' : 'outlined'} padding="lg">
                  <RudiCard.Body>
                    <RudiStack space="content">
                      <RudiCluster space="inline">
                        <RudiHeading level={3} size={5} noMargin>
                          {p.name}
                        </RudiHeading>
                        {p.featured && <RudiBadge variant="info">Most popular</RudiBadge>}
                      </RudiCluster>
                      <div>
                        <RudiHeading level={4} size={2} noMargin>
                          {p.price}
                        </RudiHeading>
                        <RudiText variant="caption" tone="subtle" noMargin>
                          {p.note}
                        </RudiText>
                      </div>
                      <RudiStack as="ul" space="inline">
                        {p.items.map((item) => (
                          <li key={item}>
                            <RudiText variant="body-sm" noMargin>
                              {item}
                            </RudiText>
                          </li>
                        ))}
                      </RudiStack>
                    </RudiStack>
                  </RudiCard.Body>
                </RudiCard>
              ))}
            </RudiSwitcher>
          </RudiStack>

          <RudiBox as="section" invert padding="group" aria-labelledby="cta-title">
            <RudiStack space="content">
              <RudiHeading level={2} size={3} id="cta-title" tone="inverted" noMargin>
                Try Acme Campaigns with your team
              </RudiHeading>
              <RudiText tone="inverted" noMargin>
                Free for 14 days. No credit card required.
              </RudiText>
              <RudiCluster space="inline">
                <RudiButton variant="secondary">Start free trial</RudiButton>
              </RudiCluster>
            </RudiStack>
          </RudiBox>
        </RudiStack>
      </RudiCenter>
    </RudiBox>
  )
}
