import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiForm } from './Form'
import { RudiInput } from '../Input/Input'
import { RudiButton } from '../Button/Button'
import { RudiCluster } from '../../layouts/Cluster/Cluster'
import { RudiGrid } from '../../layouts/Grid/Grid'
import { RudiNumberField } from '../NumberField/NumberField'
import { RudiDatePicker } from '../DatePicker/DatePicker'
import { RudiSelect } from '../Select/Select'
import { RudiOption } from '../Select/Option'
import { RudiComboBox } from '../ComboBox/ComboBox'

const meta = {
  title: 'Components/Forms/Form',
  component: RudiForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A form that hands `onSubmit` its FormData without reloading the page, and shows a focused summary of problems when `errors` is non-empty.',
      },
    },
  },
  args: {
    'aria-label': 'Contact',
    children: (
      <>
        <RudiInput label="Email" name="email" type="email" />
        <RudiInput label="Reference" name="reference" />
        <RudiCluster justify="flex-end">
          <RudiButton type="submit">Save</RudiButton>
        </RudiCluster>
      </>
    ),
  },
  argTypes: {
    errors: { control: 'object', table: { category: 'State' } },
    errorTitle: { control: false, table: { category: 'Content' } },
    onSubmit: { action: 'submit', table: { category: 'Events' } },
    children: { control: false, table: { category: 'Content' } },
  },
} satisfies Meta<typeof RudiForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A form with two fields and a submit button. Change the props in the API reference below to try every option on this example, such as adding `errors` to see the summary.',
      },
    },
  },
}

const EMAIL_ERROR = 'Enter your email address'
const REFERENCE_ERROR = 'Enter a reference'

function ContactForm() {
  const [errors, setErrors] = useState<string[]>([])

  function validate(data: FormData) {
    setErrors([
      ...(data.get('email') ? [] : [EMAIL_ERROR]),
      ...(data.get('reference') ? [] : [REFERENCE_ERROR]),
    ])
  }

  return (
    <RudiForm aria-label="Contact" errors={errors} onSubmit={validate}>
      <RudiInput
        label="Email"
        name="email"
        type="email"
        errorMessage={errors.includes(EMAIL_ERROR) ? EMAIL_ERROR : undefined}
      />
      <RudiInput
        label="Reference"
        name="reference"
        errorMessage={errors.includes(REFERENCE_ERROR) ? REFERENCE_ERROR : undefined}
      />
      <RudiCluster justify="flex-end">
        <RudiButton type="submit">Save</RudiButton>
      </RudiCluster>
    </RudiForm>
  )
}

export const Validation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Validate in `onSubmit`, pass the problems as `errors`, and also set `errorMessage` on each field. The summary lists the problems and takes focus after a submit; the fields show where they are. Write each message as a fix ("Enter your email address"), not a code. Keep `errors` as they are while people type and recompute them on the next submit, so the summary does not change under them. Press Save with empty fields to try it.',
      },
      source: {
        code: `function ContactForm() {
  const [errors, setErrors] = useState<string[]>([])

  function validate(data: FormData) {
    setErrors([
      ...(data.get('email') ? [] : ['Enter your email address']),
      ...(data.get('reference') ? [] : ['Enter a reference']),
    ])
  }

  return (
    <RudiForm aria-label="Contact" errors={errors} onSubmit={validate}>
      <RudiInput
        label="Email"
        name="email"
        type="email"
        errorMessage={errors.includes('Enter your email address') ? 'Enter your email address' : undefined}
      />
      <RudiInput
        label="Reference"
        name="reference"
        errorMessage={errors.includes('Enter a reference') ? 'Enter a reference' : undefined}
      />
      <RudiButton type="submit">Save</RudiButton>
    </RudiForm>
  )
}`,
      },
    },
  },
  render: () => <ContactForm />,
}

const services = [
  { id: 'air', name: 'Air' },
  { id: 'ground', name: 'Ground' },
]
const countries = [
  { id: 'us', name: 'United States' },
  { id: 'ca', name: 'Canada' },
]

export const FieldRowAlignment: Story = {
  name: 'Field row alignment',
  parameters: {
    docs: {
      description: {
        story:
          'Every single-line field and a medium button share one height (`--rudi-component-input-height`), so a filter row lines up. A field keeps that height when a neighbour\'s help text makes the grid row taller.',
      },
    },
  },
  render: () => (
    <RudiForm aria-label="Filters" onSubmit={() => {}}>
      <RudiGrid minCellWidth="10rem">
        <RudiInput label="Reference" description="Shown on the shipping label." />
        <RudiNumberField label="Quantity" defaultValue={1} />
        <RudiDatePicker label="Pickup date" />
        <RudiSelect label="Service" placeholder="Any service" items={services}>
          {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
        </RudiSelect>
        <RudiComboBox label="Country" items={countries}>
          {(item) => <RudiOption key={item.id}>{item.name}</RudiOption>}
        </RudiComboBox>
      </RudiGrid>
      <RudiCluster align="flex-end">
        <RudiInput label="Search" placeholder="Reference or clinic" />
        <RudiButton type="submit">Apply</RudiButton>
      </RudiCluster>
    </RudiForm>
  ),
}
