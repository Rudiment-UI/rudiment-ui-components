import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiForm } from './Form'
import { RudiInput } from '../Input/Input'

function Booking({ onValid = () => {} }: { onValid?: (data: FormData) => void }) {
  const [errors, setErrors] = useState<string[]>([])
  return (
    <RudiForm
      aria-label="Booking"
      errors={errors}
      onSubmit={(data) => {
        const problems = data.get('reference') ? [] : ['Reference is required.']
        setErrors(problems)
        if (!problems.length) onValid(data)
      }}
    >
      <RudiInput label="Reference" name="reference" />
      <button type="submit">Book</button>
    </RudiForm>
  )
}

describe('Form', () => {
  it('submits FormData without reloading', async () => {
    const onValid = vi.fn()
    render(<Booking onValid={onValid} />)
    await userEvent.type(screen.getByLabelText('Reference'), 'REF-1')
    await userEvent.click(screen.getByRole('button', { name: 'Book' }))
    expect(onValid.mock.calls[0][0].get('reference')).toBe('REF-1')
  })

  it('shows and focuses an error summary', async () => {
    render(<Booking />)
    await userEvent.click(screen.getByRole('button', { name: 'Book' }))
    expect(screen.getByText('1 problem to fix')).toBeInTheDocument()
    expect(screen.getByText('Reference is required.')).toBeInTheDocument()
    expect(screen.getByText('1 problem to fix').closest('.rudi-form__summary')).toHaveFocus()
  })

  it('removes the summary once fixed', async () => {
    render(<Booking />)
    await userEvent.click(screen.getByRole('button', { name: 'Book' }))
    await userEvent.type(screen.getByLabelText('Reference'), 'REF-1')
    await userEvent.click(screen.getByRole('button', { name: 'Book' }))
    expect(screen.queryByText('1 problem to fix')).not.toBeInTheDocument()
  })

  it('pluralizes and accepts a custom title', () => {
    const { rerender } = render(
      <RudiForm errors={['A', 'B']}>
        <span />
      </RudiForm>,
    )
    expect(screen.getByText('2 problems to fix')).toBeInTheDocument()
    rerender(
      <RudiForm errors={['A']} errorTitle={() => 'Fix this first'}>
        <span />
      </RudiForm>,
    )
    expect(screen.getByText('Fix this first')).toBeInTheDocument()
  })

  it('has no accessibility violations with errors shown', async () => {
    const { container } = render(
      <RudiForm aria-label="Booking" errors={['Reference is required.']}>
        <RudiInput label="Reference" errorMessage="Reference is required." />
      </RudiForm>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('does not steal focus when errors change while editing', async () => {
    function Live() {
      const [value, setValue] = useState('')
      const [submitted, setSubmitted] = useState(false)
      const errors = submitted && !value ? ['Reference is required.'] : submitted && value.length < 3 ? ['Too short.'] : []
      return (
        <RudiForm aria-label="Live" errors={errors} onSubmit={() => setSubmitted(true)}>
          <RudiInput label="Reference" value={value} onChange={setValue} />
          <button type="submit">Book</button>
        </RudiForm>
      )
    }
    render(<Live />)
    await userEvent.click(screen.getByRole('button', { name: 'Book' }))
    expect(screen.getByText('1 problem to fix').closest('.rudi-form__summary')).toHaveFocus()
    await userEvent.click(screen.getByLabelText('Reference'))
    await userEvent.keyboard('a')
    expect(screen.getByText('Too short.')).toBeInTheDocument()
    expect(screen.getByLabelText('Reference')).toHaveFocus()
  })
})
