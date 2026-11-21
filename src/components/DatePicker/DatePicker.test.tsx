import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiDatePicker } from './DatePicker'
import { RudiDateRangePicker } from './DateRangePicker'

const isWeekend = (iso: string) => {
  const day = new Date(`${iso}T00:00:00`).getDay()
  return day === 0 || day === 6
}

const segment = (name: RegExp) => screen.getAllByRole('spinbutton', { name })[0]

describe('RudiDatePicker', () => {
  it('renders a labelled group with date segments and a calendar trigger', () => {
    render(<RudiDatePicker label="Pickup date" />)
    expect(screen.getByRole('group', { name: 'Pickup date' })).toBeInTheDocument()
    expect(segment(/month/i)).toBeInTheDocument()
    expect(segment(/day/i)).toBeInTheDocument()
    expect(segment(/year/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument()
  })

  it('emits YYYY-MM-DD when segments are typed (day granularity)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RudiDatePicker label="Pickup date" onChange={onChange} />)
    await user.click(segment(/month/i))
    await user.keyboard('03152026')
    expect(onChange).toHaveBeenLastCalledWith('2026-03-15')
  })

  it('emits YYYY-MM-DDTHH:mm when segments are typed (minute granularity)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RudiDatePicker
        label="Pickup window"
        granularity="minute"
        hourCycle={24}
        onChange={onChange}
      />,
    )
    expect(segment(/hour/i)).toBeInTheDocument()
    expect(segment(/minute/i)).toBeInTheDocument()
    await user.click(segment(/month/i))
    await user.keyboard('031520261430')
    expect(onChange).toHaveBeenLastCalledWith('2026-03-15T14:30')
  })

  it('renders a controlled value in the segments', () => {
    render(
      <RudiDatePicker label="Pickup" granularity="minute" hourCycle={24} value="2026-03-15T09:05" />,
    )
    expect(segment(/month/i)).toHaveTextContent('03')
    expect(segment(/day/i)).toHaveTextContent('15')
    expect(segment(/hour/i)).toHaveTextContent('09')
    expect(segment(/minute/i)).toHaveTextContent('05')
  })

  it('picks a date from the calendar popover and emits YYYY-MM-DD', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RudiDatePicker label="Pickup date" defaultValue="2026-03-10" onChange={onChange} />,
    )
    await user.click(screen.getByRole('button', { name: /calendar/i }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading')).toHaveTextContent('March 2026')
    await user.click(within(dialog).getByRole('button', { name: /March 18, 2026/ }))
    expect(onChange).toHaveBeenLastCalledWith('2026-03-18')
  })

  it('navigates months with the previous / next buttons', async () => {
    const user = userEvent.setup()
    render(<RudiDatePicker label="Pickup date" defaultValue="2026-03-10" />)
    await user.click(screen.getByRole('button', { name: /calendar/i }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getAllByRole('button', { name: 'Next' })[0])
    expect(within(dialog).getByRole('heading')).toHaveTextContent('April 2026')
    await user.click(within(dialog).getAllByRole('button', { name: 'Previous' })[0])
    expect(within(dialog).getByRole('heading')).toHaveTextContent('March 2026')
  })

  it('disables isDateUnavailable dates in the calendar grid', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RudiDatePicker
        label="Pickup date"
        defaultValue="2026-03-10"
        isDateUnavailable={isWeekend}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /calendar/i }))
    const dialog = await screen.findByRole('dialog')
    // March 14, 2026 is a Saturday.
    const saturday = within(dialog).getByRole('button', { name: /March 14, 2026/ })
    expect(saturday).toHaveAttribute('aria-disabled', 'true')
    expect(saturday).toHaveAttribute('data-unavailable', 'true')
    await user.click(saturday)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('marks the field invalid when an unavailable date is typed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RudiDatePicker label="Pickup date" isDateUnavailable={isWeekend} onChange={onChange} />,
    )
    await user.click(segment(/month/i))
    await user.keyboard('03142026')
    expect(onChange).toHaveBeenLastCalledWith('2026-03-14')
    expect(segment(/month/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables dates outside minValue / maxValue', async () => {
    const user = userEvent.setup()
    render(
      <RudiDatePicker
        label="Pickup date"
        defaultValue="2026-03-10"
        minValue="2026-03-05"
        maxValue="2026-03-20"
      />,
    )
    await user.click(screen.getByRole('button', { name: /calendar/i }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: /March 4, 2026/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(within(dialog).getByRole('button', { name: /March 21, 2026/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(
      within(dialog).getByRole('button', { name: /March 12, 2026/ }),
    ).not.toHaveAttribute('aria-disabled')
  })

  it('marks a typed value outside min/max invalid', async () => {
    const user = userEvent.setup()
    render(<RudiDatePicker label="Pickup date" minValue="2026-03-05" />)
    await user.click(segment(/month/i))
    await user.keyboard('03012026')
    expect(segment(/month/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the error message, hides the description, and sets invalid', () => {
    render(
      <RudiDatePicker
        label="Pickup date"
        description="Weekdays only"
        errorMessage="Pick a weekday"
      />,
    )
    expect(screen.getByText('Pick a weekday')).toBeInTheDocument()
    expect(screen.queryByText('Weekdays only')).not.toBeInTheDocument()
    expect(segment(/month/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the description when valid', () => {
    render(<RudiDatePicker label="Pickup date" description="Weekdays only" />)
    expect(screen.getByText('Weekdays only')).toBeInTheDocument()
  })

  it('shows a required indicator and disables interaction when disabled', () => {
    render(<RudiDatePicker label="Pickup date" isRequired isDisabled />)
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calendar/i })).toBeDisabled()
    expect(segment(/month/i)).toHaveAttribute('aria-disabled', 'true')
  })

  it('renders an empty field for a malformed controlled string', () => {
    render(<RudiDatePicker label="Pickup date" value="not-a-date" />)
    expect(segment(/month/i)).toHaveTextContent('mm')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiDatePicker label="Pickup date" description="Weekdays only" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations with the calendar open', async () => {
    const user = userEvent.setup()
    render(<RudiDatePicker label="Pickup date" defaultValue="2026-03-10" />)
    await user.click(screen.getByRole('button', { name: /calendar/i }))
    await screen.findByRole('dialog')
    expect(await axe(document.body)).toHaveNoViolations()
  })

  it('has no accessibility violations in error state', async () => {
    const { container } = render(
      <RudiDatePicker label="Pickup date" errorMessage="Required" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('RudiDateRangePicker', () => {
  it('renders start and end segments', () => {
    render(<RudiDateRangePicker label="Pickup between" />)
    expect(screen.getByRole('group', { name: 'Pickup between' })).toBeInTheDocument()
    expect(screen.getAllByRole('spinbutton', { name: /month/i })).toHaveLength(2)
  })

  it('emits { start, end } when both dates are typed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RudiDateRangePicker label="Pickup between" onChange={onChange} />)
    await user.click(screen.getAllByRole('spinbutton', { name: /month/i })[0])
    await user.keyboard('03022026')
    await user.keyboard('03062026')
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-03-02', end: '2026-03-06' })
  })

  it('emits { start, end } when picking a range in the calendar', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RudiDateRangePicker
        label="Pickup between"
        defaultValue={{ start: '2026-03-02', end: '2026-03-03' }}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /calendar/i }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: /March 9, 2026/ }))
    await user.click(within(dialog).getByRole('button', { name: /March 13, 2026/ }))
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-03-09', end: '2026-03-13' })
  })

  it('disables unavailable and out-of-range dates', async () => {
    const user = userEvent.setup()
    render(
      <RudiDateRangePicker
        label="Pickup between"
        defaultValue={{ start: '2026-03-09', end: '2026-03-10' }}
        maxValue="2026-03-25"
        isDateUnavailable={isWeekend}
      />,
    )
    await user.click(screen.getByRole('button', { name: /calendar/i }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: /March 14, 2026/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(within(dialog).getByRole('button', { name: /March 26, 2026/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('shows an error message', () => {
    render(<RudiDateRangePicker label="Pickup between" errorMessage="Pick a range" />)
    expect(screen.getByText('Pick a range')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiDateRangePicker
        label="Pickup between"
        defaultValue={{ start: '2026-03-02', end: '2026-03-06' }}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
