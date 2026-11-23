import {
  RudiAlert,
  RudiBadge,
  RudiBox,
  RudiButton,
  RudiCard,
  RudiCenter,
  RudiCluster,
  RudiDescriptionList,
  RudiGrid,
  RudiPageHeader,
  RudiSectionHeader,
  RudiSidebar,
  RudiSparkline,
  RudiStack,
  RudiStatCard,
  RudiText,
} from '../../index'

const demographics = [
  { id: 'mrn', term: 'MRN', description: '00482913' },
  { id: 'dob', term: 'Date of birth', description: '14 Mar 1958 (68 y)' },
  { id: 'sex', term: 'Sex', description: 'Female' },
  { id: 'pcp', term: 'Primary care', description: 'Dr. R. Iyer' },
  { id: 'allergies', term: 'Allergies', description: 'Penicillin (rash), latex' },
  { id: 'coverage', term: 'Coverage', description: 'Medicare Part B' },
]

const vitals = [
  { label: 'Blood pressure', value: '138/86', delta: '+6 systolic', trend: 'up', history: [128, 131, 130, 134, 132, 136, 138] },
  { label: 'Heart rate', value: '72 bpm', delta: 'Stable', trend: 'neutral', history: [74, 71, 73, 72, 70, 73, 72] },
  { label: 'HbA1c', value: '7.1%', delta: '−0.3', trend: 'down', history: [7.8, 7.6, 7.5, 7.4, 7.3, 7.2, 7.1] },
] as const

const medications = [
  { name: 'Metformin 1000 mg', sig: 'Twice daily with meals', status: 'Active' },
  { name: 'Lisinopril 20 mg', sig: 'Once daily', status: 'Active' },
  { name: 'Atorvastatin 40 mg', sig: 'Once daily at bedtime', status: 'Review' },
] as const

// No spacing CSS: this page uses the library's default steps. `section`
// grows at the md breakpoint and the page gutters widen at md and lg, while
// `group` and `content` stay the same at every width.
export function PatientSummary() {
  return (
    <RudiBox as="main" padding="gutter">
      <RudiCenter maxWidth="80rem" gutters={0}>
        <RudiStack space="section">
          <RudiPageHeader
            title="Margaret Ellison"
            subtitle="Follow-up visit · 23 Nov 2026"
            meta={
              <RudiCluster space="inline">
                <RudiBadge variant="info">Type 2 diabetes</RudiBadge>
                <RudiBadge variant="warning">Hypertension</RudiBadge>
              </RudiCluster>
            }
            actions={<RudiButton iconBefore="mdi:note-edit-outline">Start note</RudiButton>}
          />

          <RudiSidebar sideWidth="20rem" space="group" noStretch>
            <RudiCard variant="outlined">
              <RudiCard.Body>
                <RudiStack space="content">
                  <RudiText as="h2" weight="semibold" noMargin>
                    Patient details
                  </RudiText>
                  <RudiDescriptionList items={demographics} dividers />
                </RudiStack>
              </RudiCard.Body>
            </RudiCard>

            <RudiStack space="group">
              <RudiAlert variant="warning" title="Lab result needs review">
                Potassium 5.4 mmol/L on 21 Nov, above the reference range.
              </RudiAlert>

              <RudiStack as="section" space="content" aria-labelledby="vitals-title">
                <RudiSectionHeader
                  title={<span id="vitals-title">Vitals and labs</span>}
                  description="Last 7 readings"
                />
                <RudiGrid as="ul" minCellWidth="14rem" space="group">
                  {vitals.map((v) => (
                    <li key={v.label}>
                      <RudiStatCard label={v.label} value={v.value} delta={v.delta} trend={v.trend}>
                        <RudiSparkline label={`${v.label}, last 7 readings`} data={[...v.history]} />
                      </RudiStatCard>
                    </li>
                  ))}
                </RudiGrid>
              </RudiStack>

              <RudiStack as="section" space="content" aria-labelledby="meds-title">
                <RudiSectionHeader title={<span id="meds-title">Medications</span>} />
                <RudiStack as="ul" space="content">
                  {medications.map((m) => (
                    <li key={m.name}>
                      <RudiCluster space="inline" justify="space-between">
                        <div>
                          <RudiText weight="semibold" noMargin>
                            {m.name}
                          </RudiText>
                          <RudiText variant="body-sm" tone="subtle" noMargin>
                            {m.sig}
                          </RudiText>
                        </div>
                        <RudiBadge variant={m.status === 'Active' ? 'success' : 'warning'}>
                          {m.status}
                        </RudiBadge>
                      </RudiCluster>
                    </li>
                  ))}
                </RudiStack>
              </RudiStack>
            </RudiStack>
          </RudiSidebar>
        </RudiStack>
      </RudiCenter>
    </RudiBox>
  )
}
