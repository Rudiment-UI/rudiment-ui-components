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
  title: 'Components/Form',
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
  args: { children: null },
  argTypes: {
    errors: { control: 'object', description: 'Problems to fix; non-empty shows and focuses the summary', table: { category: 'State' } },
    errorTitle: { control: false, description: 'Summary heading for a count', table: { category: 'Content' } },
    onSubmit: { action: 'submit', description: 'Called with FormData on submit', table: { category: 'Events' } },
    children: { control: false, description: 'Fields and actions', table: { category: 'Content' } },
  },
} satisfies Meta<typeof RudiForm>

export default meta
type Story = StoryObj<typeof meta>

export const WithValidation: Story = {
  render: () => {
    const [errors, setErrors] = useState<string[]>([])
    const [values, setValues] = useState({ email: '', reference: '' })
    return (
      <RudiForm
        aria-label="Contact"
        errors={errors}
        onSubmit={() =>
          setErrors([
            ...(values.email ? [] : ['Email is required.']),
            ...(values.reference ? [] : ['Reference is required.']),
          ])
        }
      >
        <RudiInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(email) => setValues((v) => ({ ...v, email }))}
          errorMessage={errors.includes('Email is required.') ? 'Email is required.' : undefined}
        />
        <RudiInput
          label="Reference"
          name="reference"
          value={values.reference}
          onChange={(reference) => setValues((v) => ({ ...v, reference }))}
          errorMessage={errors.includes('Reference is required.') ? 'Reference is required.' : undefined}
        />
        <RudiCluster justify="flex-end">
          <RudiButton type="submit">Save</RudiButton>
        </RudiCluster>
      </RudiForm>
    )
  },
}

/**
 * Every single-line field and a medium button share one height (`--rudi-component-input-height`),
 * and a field keeps that height when a neighbour's help text makes the grid row taller.
 */
const services = [
  { id: 'air', name: 'Air' },
  { id: 'ground', name: 'Ground' },
]
const countries = [
  { id: 'us', name: 'United States' },
  { id: 'ca', name: 'Canada' },
]

export const FieldRowAlignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Text, number, date, select and combo box fields line up with a medium button, including in a grid row where one field has a description.',
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
