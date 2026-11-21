import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiCheckboxGroup } from './CheckboxGroup'
import { RudiCheckbox } from './Checkbox'

describe('CheckboxGroup', () => {
  it('renders the group label', () => {
    render(
      <RudiCheckboxGroup label="Interests">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(screen.getByText('Interests')).toBeInTheDocument()
  })

  it('applies the group class', () => {
    const { container } = render(
      <RudiCheckboxGroup label="Interests">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(container.firstChild).toHaveClass('rudi-checkbox-group')
  })

  it('applies the label class', () => {
    render(
      <RudiCheckboxGroup label="Interests">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(screen.getByText('Interests')).toHaveClass(
      'rudi-checkbox-group__label',
    )
  })

  it('renders children checkboxes', () => {
    render(
      <RudiCheckboxGroup label="Interests">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
        <RudiCheckbox value="b">Option B</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  })

  it('renders the description when provided and no error', () => {
    render(
      <RudiCheckboxGroup label="Interests" description="Select all that apply.">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(screen.getByText('Select all that apply.')).toBeInTheDocument()
  })

  it('renders the error message when errorMessage is provided', () => {
    render(
      <RudiCheckboxGroup label="Interests" errorMessage="Select at least one.">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(screen.getByText('Select at least one.')).toBeInTheDocument()
  })

  it('does not render the description when errorMessage is present', () => {
    render(
      <RudiCheckboxGroup
        label="Interests"
        description="Select all that apply."
        errorMessage="Select at least one."
      >
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(screen.queryByText('Select all that apply.')).not.toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(
      <RudiCheckboxGroup label="Interests" className="extra">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(container.firstChild).toHaveClass('rudi-checkbox-group')
    expect(container.firstChild).toHaveClass('extra')
  })

  it('has the group role', () => {
    render(
      <RudiCheckboxGroup label="Interests">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiCheckboxGroup label="Interests">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
        <RudiCheckbox value="b">Option B</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations in error state', async () => {
    const { container } = render(
      <RudiCheckboxGroup label="Interests" errorMessage="Select at least one.">
        <RudiCheckbox value="a">Option A</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('drives its checkboxes: value in, onChange out', async () => {
    const onChange = vi.fn()
    function Tissues() {
      const [value, setValue] = useState(['embryos'])
      return (
        <RudiCheckboxGroup
          label="Tissue"
          value={value}
          onChange={(next) => {
            setValue(next)
            onChange(next)
          }}
        >
          <RudiCheckbox value="embryos">Embryos</RudiCheckbox>
          <RudiCheckbox value="eggs">Eggs</RudiCheckbox>
        </RudiCheckboxGroup>
      )
    }
    render(<Tissues />)
    expect(screen.getByRole('checkbox', { name: 'Embryos' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Eggs' })).not.toBeChecked()
    await userEvent.click(screen.getByText('Eggs'))
    expect(onChange).toHaveBeenLastCalledWith(['embryos', 'eggs'])
    expect(screen.getByRole('checkbox', { name: 'Eggs' })).toBeChecked()
  })

  it('marks the group invalid and links its error message', () => {
    render(
      <RudiCheckboxGroup label="Tissue" errorMessage="Choose at least one.">
        <RudiCheckbox value="embryos">Embryos</RudiCheckbox>
      </RudiCheckboxGroup>,
    )
    const group = screen.getByRole('group', { name: 'Tissue' })
    expect(group).toHaveAccessibleDescription('Choose at least one.')
  })
})
