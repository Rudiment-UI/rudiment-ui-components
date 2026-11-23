import { useState, type FormEvent } from 'react'
import {
  RudiButton,
  RudiCheckbox,
  RudiCluster,
  RudiForm,
  RudiHeading,
  RudiInput,
  RudiOption,
  RudiSelect,
  RudiStack,
  RudiText,
  RudiTextarea,
  rudiToast,
} from '../../index'

const teams = [
  { id: 'lab', name: 'Laboratory' },
  { id: 'logistics', name: 'Logistics' },
  { id: 'clinic', name: 'Clinic staff' },
]

type Field = 'name' | 'email' | 'team' | 'terms'
type Errors = Partial<Record<Field, string>>

/** Checks the submitted values. Messages say how to fix the problem, not just what is wrong. */
function validate(data: FormData): Errors {
  const errors: Errors = {}
  const name = String(data.get('name') ?? '').trim()
  const email = String(data.get('email') ?? '').trim()
  if (!name) errors.name = 'Enter your full name'
  if (!email) errors.email = 'Enter your work email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter an email address like name@clinic.org'
  if (!data.get('team')) errors.team = 'Choose the team you work in'
  if (!data.get('terms')) errors.terms = 'Accept the data-handling policy to continue'
  return errors
}

/**
 * Validated form with an error summary. Validation runs on submit: each field
 * shows its own message, and `RudiForm` lists every message in a summary at
 * the top and moves focus there, so keyboard and screen-reader users hear
 * what to fix. Needs one `RudiToastRegion` mounted near the app root.
 */
export function ValidatedForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = (data: FormData, event: FormEvent<HTMLFormElement>) => {
    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const form = event.currentTarget
    setSubmitting(true)
    // Stand-in for a request to your API.
    setTimeout(() => {
      setSubmitting(false)
      form.reset()
      rudiToast.success('Request sent', {
        description: `We'll email ${data.get('email')} when your access is ready.`,
      })
    }, 800)
  }

  return (
    <RudiStack>
      <RudiStack space={1}>
        <RudiHeading level={2} noMargin>
          Request access
        </RudiHeading>
        <RudiText tone="subtle" noMargin>
          Fields marked with an asterisk are required.
        </RudiText>
      </RudiStack>

      <RudiForm onSubmit={handleSubmit} errors={Object.values(errors)}>
        <RudiInput
          label="Full name"
          name="name"
          autoComplete="name"
          isRequired
          errorMessage={errors.name}
        />
        <RudiInput
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          isRequired
          errorMessage={errors.email}
        />
        <RudiSelect label="Team" name="team" items={teams} isRequired errorMessage={errors.team}>
          {(team) => <RudiOption key={team.id}>{team.name}</RudiOption>}
        </RudiSelect>
        <RudiTextarea
          label="What do you need access for?"
          name="reason"
          description="Optional. Helps an admin approve the request faster."
          rows={3}
        />
        <RudiCheckbox name="terms" value="accepted" errorMessage={errors.terms}>
          I've read the data-handling policy
        </RudiCheckbox>
        <RudiCluster>
          <RudiButton type="submit" isLoading={isSubmitting}>
            Send request
          </RudiButton>
        </RudiCluster>
      </RudiForm>
    </RudiStack>
  )
}
