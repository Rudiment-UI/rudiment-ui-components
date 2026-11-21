import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiRadioGroup } from './RadioGroup'
import { RudiRadio } from './Radio'

function Shipping(props: {
  onChange?: (value: string) => void
  defaultValue?: string
  isDisabled?: boolean
}) {
  return (
    <RudiRadioGroup
      label="Shipping"
      onChange={props.onChange}
      defaultValue={props.defaultValue}
      isDisabled={props.isDisabled}
    >
      <RudiRadio value="standard">Standard</RudiRadio>
      <RudiRadio value="express">Express</RudiRadio>
      <RudiRadio value="overnight" isDisabled>
        Overnight
      </RudiRadio>
    </RudiRadioGroup>
  )
}

describe('Radio', () => {
  it('renders a labelled radio for each option', () => {
    render(<Shipping />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'Express' })).toBeInTheDocument()
  })

  it('applies the radio classes', () => {
    render(<Shipping />)
    const label = screen.getByText('Standard').closest('label')
    expect(label).toHaveClass('rudi-radio')
    expect(label?.querySelector('.rudi-radio__control')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    render(
      <RudiRadioGroup label="Shipping">
        <RudiRadio value="a" className="extra">
          A
        </RudiRadio>
      </RudiRadioGroup>,
    )
    const label = screen.getByText('A').closest('label')
    expect(label).toHaveClass('rudi-radio')
    expect(label).toHaveClass('extra')
  })

  it('reflects defaultValue as the checked option', () => {
    render(<Shipping defaultValue="express" />)
    expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked()
    expect(
      screen.getByText('Express').closest('label')?.querySelector('.rudi-radio__control'),
    ).toHaveClass('rudi-radio__control--selected')
  })

  it('selects an option on click and reports the value', async () => {
    const onChange = vi.fn()
    render(<Shipping onChange={onChange} />)
    await userEvent.click(screen.getByText('Express'))
    expect(onChange).toHaveBeenCalledWith('express')
    expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked()
  })

  it('moves selection with arrow keys', async () => {
    const onChange = vi.fn()
    render(<Shipping onChange={onChange} defaultValue="standard" />)
    await userEvent.tab()
    expect(screen.getByRole('radio', { name: 'Standard' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenLastCalledWith('express')
  })

  it('does not select a disabled option', async () => {
    const onChange = vi.fn()
    render(<Shipping onChange={onChange} />)
    const overnight = screen.getByRole('radio', { name: 'Overnight' })
    expect(overnight).toBeDisabled()
    expect(overnight.closest('label')).toHaveClass('rudi-radio--disabled')
    await userEvent.click(screen.getByText('Overnight'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables every option when the group is disabled', () => {
    render(<Shipping isDisabled />)
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled()
    }
  })

  it('throws a helpful error outside a RudiRadioGroup', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<RudiRadio value="a">A</RudiRadio>)).toThrow(
      'RudiRadio must be rendered inside a RudiRadioGroup.',
    )
    spy.mockRestore()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Shipping defaultValue="standard" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
