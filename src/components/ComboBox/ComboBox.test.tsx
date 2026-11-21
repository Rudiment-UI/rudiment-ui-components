import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import type { Key } from 'react-aria'
import { RudiComboBox, type RudiComboBoxProps } from './ComboBox'
import { RudiOption } from '../Select/Option'

interface Clinic {
  id: string
  name: string
}

const clinics: Clinic[] = [
  { id: 'bos', name: 'Boston IVF' },
  { id: 'chi', name: 'Chicago Fertility' },
  { id: 'sea', name: 'Seattle Fertility' },
]

function renderComboBox(
  props: Partial<Omit<RudiComboBoxProps<Clinic>, 'children'>> = {},
) {
  return render(
    <RudiComboBox label="Pickup clinic" items={clinics} {...props}>
      {(c) => <RudiOption key={c.id}>{c.name}</RudiOption>}
    </RudiComboBox>,
  )
}

describe('RudiComboBox', () => {
  it('renders a labelled combobox input', () => {
    renderComboBox()
    const input = screen.getByRole('combobox', { name: 'Pickup clinic' })
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('rudi-combo-box__input')
  })

  it('merges className onto the wrapper', () => {
    const { container } = renderComboBox({ className: 'custom' })
    expect(container.firstChild).toHaveClass('rudi-combo-box', 'custom')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderComboBox({ description: 'Where to collect' })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations while open', async () => {
    const user = userEvent.setup()
    const { container } = renderComboBox()
    await user.type(screen.getByRole('combobox'), 'f')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('filters options with a case-insensitive contains match', async () => {
    const user = userEvent.setup()
    renderComboBox()
    await user.type(screen.getByRole('combobox'), 'FERT')
    const options = within(screen.getByRole('listbox')).getAllByRole('option')
    expect(options.map((o) => o.textContent)).toEqual([
      'Chicago Fertility',
      'Seattle Fertility',
    ])
  })

  it('filters rich options by textValue', async () => {
    const user = userEvent.setup()
    render(
      <RudiComboBox label="Pickup clinic" items={clinics}>
        {(c) => (
          <RudiOption key={c.id} textValue={c.name}>
            <strong>{c.name}</strong>
          </RudiOption>
        )}
      </RudiComboBox>,
    )
    await user.type(screen.getByRole('combobox'), 'boston')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option')).toHaveTextContent('Boston IVF')
  })

  it('selects with arrow keys and Enter and calls onSelectionChange', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    renderComboBox({ onSelectionChange })
    const input = screen.getByRole('combobox')
    await user.type(input, 'fert')
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    expect(onSelectionChange).toHaveBeenCalledWith('sea')
    expect(input).toHaveValue('Seattle Fertility')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selects an option on click', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    renderComboBox({ onSelectionChange })
    await user.type(screen.getByRole('combobox'), 'chi')
    await user.click(screen.getByRole('option', { name: 'Chicago Fertility' }))
    expect(onSelectionChange).toHaveBeenCalledWith('chi')
  })

  it('opens the full list from the chevron button', async () => {
    const user = userEvent.setup()
    renderComboBox()
    await user.click(screen.getByRole('button'))
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup()
    renderComboBox({ emptyMessage: 'No clinics found' })
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('No clinics found')).toBeInTheDocument()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('defaults the empty message to "No matches"', async () => {
    const user = userEvent.setup()
    renderComboBox()
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })

  it('reports typed text through onInputChange', async () => {
    const user = userEvent.setup()
    const onInputChange = vi.fn()
    renderComboBox({ onInputChange })
    await user.type(screen.getByRole('combobox'), 'se')
    expect(onInputChange).toHaveBeenLastCalledWith('se')
  })

  it('shows the text of a controlled selectedKey', () => {
    renderComboBox({ selectedKey: 'chi' })
    expect(screen.getByRole('combobox')).toHaveValue('Chicago Fertility')
  })

  it('updates when the controlled selectedKey changes', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [key, setKey] = useState<Key | null>('bos')
      return (
        <>
          <RudiComboBox
            label="Pickup clinic"
            items={clinics}
            selectedKey={key}
            onSelectionChange={setKey}
          >
            {(c) => <RudiOption key={c.id}>{c.name}</RudiOption>}
          </RudiComboBox>
          <button type="button" onClick={() => setKey('sea')}>
            Pick Seattle
          </button>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('combobox')).toHaveValue('Boston IVF')
    await user.click(screen.getByRole('button', { name: 'Pick Seattle' }))
    expect(screen.getByRole('combobox')).toHaveValue('Seattle Fertility')
  })

  it('keeps custom text when allowsCustomValue is set', async () => {
    const user = userEvent.setup()
    renderComboBox({ allowsCustomValue: true })
    const input = screen.getByRole('combobox')
    await user.type(input, 'New Clinic')
    await user.tab()
    expect(input).toHaveValue('New Clinic')
  })

  it('opens on focus when menuTrigger is "focus"', async () => {
    const user = userEvent.setup()
    renderComboBox({ menuTrigger: 'focus' })
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('renders description text linked to the input', () => {
    renderComboBox({ description: 'Where to collect' })
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
      'Where to collect',
    )
  })

  it('is disabled and cannot be typed into', async () => {
    const user = userEvent.setup()
    renderComboBox({ isDisabled: true, defaultSelectedKey: 'bos' })
    const input = screen.getByRole('combobox')
    expect(input).toBeDisabled()
    await user.type(input, 'x')
    expect(input).toHaveValue('Boston IVF')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows an error message and marks the input invalid', async () => {
    const { container } = renderComboBox({
      errorMessage: 'Choose a clinic',
      isRequired: true,
    })
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Choose a clinic')
    expect(container.querySelector('.rudi-combo-box__field')).toHaveClass(
      'rudi-combo-box__field--error',
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('passes name to the input for form submission', () => {
    renderComboBox({ name: 'clinic' })
    expect(screen.getByRole('combobox')).toHaveAttribute('name', 'clinic')
  })
})
