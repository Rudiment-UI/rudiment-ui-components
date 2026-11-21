import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiForm } from './Form'
import { RudiInput } from '../Input/Input'
import { RudiButton } from '../Button/Button'
import { RudiCluster } from '../../layouts/Cluster/Cluster'

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
