import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiNumberField } from './NumberField'

const increment = () => screen.getByRole('button', { name: /increase/i })
const decrement = () => screen.getByRole('button', { name: /decrease/i })

describe('RudiNumberField', () => {
  it('renders with its label as the accessible name', () => {
    render(<RudiNumberField label="Distance" />)
    expect(screen.getByRole('textbox', { name: 'Distance' })).toBeInTheDocument()
    expect(increment()).toBeInTheDocument()
    expect(decrement()).toBeInTheDocument()
  })

  it('emits a number after typing and committing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RudiNumberField label="Distance" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), '42.5')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(42.5)
  })

  it('steps by `step` with the + / − buttons and clamps to min / max', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RudiNumberField
        label="Quantity"
        defaultValue={4}
        step={2}
        minValue={2}
        maxValue={6}
        onChange={onChange}
      />,
    )
    await user.click(increment())
    expect(onChange).toHaveBeenLastCalledWith(6)
    expect(increment()).toBeDisabled()
    await user.click(decrement())
    await user.click(decrement())
    expect(onChange).toHaveBeenLastCalledWith(2)
    expect(decrement()).toBeDisabled()
  })

  it('steps with the arrow keys', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RudiNumberField label="Miles" defaultValue={10} step={5} onChange={onChange} />)
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith(15)
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('clamps a typed value to maxValue on commit', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RudiNumberField label="Quantity" maxValue={10} onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), '50')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(10)
  })

  it('formats currency with a $ sign', () => {
    render(
      <RudiNumberField
        label="Price"
        defaultValue={1234.5}
        formatOptions={{ style: 'currency', currency: 'USD' }}
      />,
    )
    expect(screen.getByRole('textbox')).toHaveValue('$1,234.50')
  })

  it('formats percent values as fractions', () => {
    render(
      <RudiNumberField label="Discount" defaultValue={0.25} formatOptions={{ style: 'percent' }} />,
    )
    expect(screen.getByRole('textbox')).toHaveValue('25%')
  })

  it('emits null when the field is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RudiNumberField label="Distance" defaultValue={12} onChange={onChange} />)
    await user.clear(screen.getByRole('textbox'))
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('renders a controlled null value as empty', () => {
    render(<RudiNumberField label="Distance" value={null} />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('hides the stepper buttons with hideStepper', () => {
    render(<RudiNumberField label="Distance" hideStepper />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows the error message, hides the description, and sets aria-invalid', () => {
    render(
      <RudiNumberField label="Distance" description="In miles" errorMessage="Too far" />,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Too far')).toBeInTheDocument()
    expect(screen.queryByText('In miles')).not.toBeInTheDocument()
  })

  it('links the description via aria-describedby', () => {
    render(<RudiNumberField label="Distance" description="In miles" />)
    const description = screen.getByText('In miles')
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(description.id),
    )
  })

  it('marks required and shows the indicator', () => {
    render(<RudiNumberField label="Distance" isRequired />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true')
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('disables the input and steppers', () => {
    render(<RudiNumberField label="Distance" isDisabled defaultValue={3} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(increment()).toBeDisabled()
    expect(decrement()).toBeDisabled()
  })

  it('does not change when read-only', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RudiNumberField label="Distance" isReadOnly defaultValue={3} onChange={onChange} />)
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('{ArrowUp}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('forwards ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<RudiNumberField label="Distance" ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('textbox'))
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiNumberField label="Distance" description="In miles" defaultValue={5} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations in error state', async () => {
    const { container } = render(<RudiNumberField label="Distance" errorMessage="Required" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('keeps a hidden label as the accessible name', async () => {
    const { container } = render(<RudiNumberField label="Rate per mile" labelHidden />)
    expect(screen.getByRole('textbox', { name: 'Rate per mile' })).toBeInTheDocument()
    expect(container.querySelector('.rudi-number-field__label')).toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })
})
