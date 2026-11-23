import { useState } from 'react'
import {
  RudiButton,
  RudiCard,
  RudiCenter,
  RudiCluster,
  RudiDescriptionList,
  RudiForm,
  RudiInput,
  RudiPageHeader,
  RudiStack,
  RudiSwitch,
  RudiTab,
  RudiTabList,
  RudiTabPanel,
  RudiTabs,
  RudiText,
  rudiToast,
} from '../../index'

function ProfileSettings() {
  const [name, setName] = useState('Ada Okafor')
  const [email, setEmail] = useState('ada@clinic.org')
  const [error, setError] = useState<string>()
  const [isSaving, setSaving] = useState(false)

  const save = () => {
    const message = email.includes('@') ? undefined : 'Enter an email address like name@clinic.org'
    setError(message)
    if (message) return
    setSaving(true)
    // Stand-in for a request to your API.
    setTimeout(() => {
      setSaving(false)
      rudiToast.success('Profile saved')
    }, 800)
  }

  return (
    <RudiForm onSubmit={save} errors={error ? [error] : []}>
      <RudiText tone="subtle" noMargin>
        How you appear to other people in your organization.
      </RudiText>
      <RudiInput
        label="Display name"
        name="name"
        autoComplete="name"
        value={name}
        onChange={setName}
      />
      <RudiInput
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        errorMessage={error}
      />
      <RudiCluster>
        <RudiButton type="submit" isLoading={isSaving}>
          Save changes
        </RudiButton>
      </RudiCluster>
    </RudiForm>
  )
}

const notificationOptions = [
  { id: 'delays', label: 'Shipment delays', initial: true },
  { id: 'temperature', label: 'Temperature alerts', initial: true },
  { id: 'deliveries', label: 'Delivery confirmations', initial: false },
  { id: 'digest', label: 'Weekly summary email', initial: false },
]

// Switches take effect immediately, so there is no save button here.
function NotificationSettings() {
  const [enabled, setEnabled] = useState(
    () => new Set(notificationOptions.filter((o) => o.initial).map((o) => o.id)),
  )

  const toggle = (id: string, label: string, on: boolean) => {
    setEnabled((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })
    rudiToast.info(`${label} ${on ? 'on' : 'off'}`)
  }

  return (
    <RudiStack>
      <RudiText tone="subtle" noMargin>
        Changes apply right away.
      </RudiText>
      <RudiStack space={3}>
        {notificationOptions.map((o) => (
          <RudiSwitch
            key={o.id}
            isSelected={enabled.has(o.id)}
            onChange={(on) => toggle(o.id, o.label, on)}
          >
            {o.label}
          </RudiSwitch>
        ))}
      </RudiStack>
    </RudiStack>
  )
}

function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(true)

  return (
    <RudiStack>
      <RudiSwitch isSelected={twoFactor} onChange={setTwoFactor}>
        Require a one-time code at sign-in
      </RudiSwitch>
      <RudiCard variant="outlined">
        <RudiCard.Body>
          <RudiDescriptionList
            layout="inline"
            items={[
              { term: 'Password', description: 'Changed 3 months ago' },
              { term: 'Active sessions', description: '2 (this browser and an iPhone)' },
            ]}
          />
        </RudiCard.Body>
        <RudiCard.Footer>
          <RudiButton
            variant="secondary"
            size="sm"
            onPress={() => rudiToast.success('Signed out of other sessions')}
          >
            Sign out other sessions
          </RudiButton>
        </RudiCard.Footer>
      </RudiCard>
    </RudiStack>
  )
}

/**
 * Settings page split into tabs. Each tab follows the saving model that fits
 * it: the profile is a form with an explicit save, notification switches
 * apply immediately and confirm with a toast. Needs one `RudiToastRegion`
 * mounted near the app root.
 */
export function SettingsPage() {
  return (
    <RudiCenter maxWidth="48rem" gutters="0">
      <RudiStack>
        <RudiPageHeader
          title="Settings"
          subtitle="Manage your profile, notifications and sign-in security."
        />
        <RudiTabs>
          <RudiTabList aria-label="Settings sections">
            <RudiTab id="profile" icon="lucide:user">
              Profile
            </RudiTab>
            <RudiTab id="notifications" icon="lucide:bell">
              Notifications
            </RudiTab>
            <RudiTab id="security" icon="lucide:shield">
              Security
            </RudiTab>
          </RudiTabList>
          <RudiTabPanel id="profile">
            <ProfileSettings />
          </RudiTabPanel>
          <RudiTabPanel id="notifications">
            <NotificationSettings />
          </RudiTabPanel>
          <RudiTabPanel id="security">
            <SecuritySettings />
          </RudiTabPanel>
        </RudiTabs>
      </RudiStack>
    </RudiCenter>
  )
}
