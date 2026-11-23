import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rudiToast } from '../../index'
import { ConfirmDialog } from './ConfirmDialog'
import { DataStates } from './DataStates'
import { FilterableTable } from './FilterableTable'
import { PatientSummary } from './PatientSummary'
import { PortfolioDashboard } from './PortfolioDashboard'
import { ProductLanding } from './ProductLanding'
import { SettingsPage } from './SettingsPage'
import { ValidatedForm } from './ValidatedForm'

afterEach(() => {
  vi.useRealTimers()
  rudiToast.clear()
})

describe('ValidatedForm recipe', () => {
  it('lists every problem in a focused summary and marks the fields', async () => {
    render(<ValidatedForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByText('4 problems to fix')).toBeInTheDocument()
    expect(document.activeElement).toHaveClass('rudi-form__summary')
    expect(screen.getByLabelText(/Full name/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('explains how to fix a malformed email', async () => {
    render(<ValidatedForm />)
    await userEvent.type(screen.getByLabelText(/Work email/), 'ada')
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getAllByText('Enter an email address like name@clinic.org')).toHaveLength(2)
  })

  it('has no axe violations with errors showing', async () => {
    const { container } = render(<ValidatedForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('FilterableTable recipe', () => {
  const bodyRows = () => screen.getAllByRole('row').slice(1)

  it('pages the rows and announces the count', () => {
    render(<FilterableTable />)
    expect(bodyRows()).toHaveLength(6)
    expect(screen.getByRole('status')).toHaveTextContent('18 shipments')
  })

  it('filters, returns to page 1 and updates the count', async () => {
    render(<FilterableTable />)
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }))
    await userEvent.type(screen.getByLabelText('Search shipments'), 'cryoport')
    expect(screen.getByRole('status')).toHaveTextContent('7 of 18 shipments')
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toHaveAttribute('aria-current', 'page')
    expect(within(bodyRows()[0]).getByRole('rowheader')).toHaveTextContent('SHP-1040')
  })

  it('offers a way out of an empty result', async () => {
    render(<FilterableTable />)
    await userEvent.type(screen.getByLabelText('Search shipments'), 'zzz')
    expect(screen.getByText('No shipments match')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByRole('status')).toHaveTextContent('18 shipments')
  })

  it('has no axe violations', async () => {
    const { container } = render(<FilterableTable />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('DataStates recipe', () => {
  it('keeps the heading in every state', () => {
    for (const status of ['loading', 'empty', 'error', 'ready'] as const) {
      const { unmount } = render(<DataStates status={status} />)
      expect(screen.getByRole('heading', { name: 'Open alerts' })).toBeInTheDocument()
      unmount()
    }
  })

  it('marks loading as busy and announces it', () => {
    const { container } = render(<DataStates status="loading" />)
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Loading alerts…')
  })

  it('retries from the error state', async () => {
    const onRetry = vi.fn()
    render(<DataStates status="error" onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it.each(['loading', 'empty', 'error', 'ready'] as const)('has no axe violations when %s', async (status) => {
    const { container } = render(<DataStates status={status} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('ConfirmDialog recipe', () => {
  it('returns focus to the trigger on cancel', async () => {
    render(<ConfirmDialog />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete SHP-1044' }))
    const dialog = screen.getByRole('dialog', { name: 'Delete shipment SHP-1044?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await act(() => new Promise(requestAnimationFrame))
    expect(screen.getByRole('button', { name: 'Delete SHP-1044' })).toHaveFocus()
  })

  it('deletes the row and moves focus to the list heading', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ConfirmDialog />)
    await user.click(screen.getByRole('button', { name: 'Delete SHP-1044' }))
    const confirm = within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete shipment' })
    await user.click(confirm)
    expect(confirm).toHaveAttribute('aria-busy', 'true')
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete SHP-1044' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Scheduled shipments' })).toHaveFocus()
  })
})

describe('SettingsPage recipe', () => {
  it('switches sections with the tabs', async () => {
    render(<SettingsPage />)
    await userEvent.click(screen.getByRole('tab', { name: 'Notifications' }))
    expect(screen.getByRole('switch', { name: 'Temperature alerts' })).toBeChecked()
  })

  it('has no axe violations', async () => {
    const { container } = render(<SettingsPage />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// The responsive spacing recipes: layout props name spacing steps, which resolve
// to --rudi-space-* custom properties the recipe's stylesheet (or the library)
// sets per breakpoint.
describe('PortfolioDashboard recipe', () => {
  it('spaces its layouts with named steps under the recipe scope', () => {
    const { container } = render(<PortfolioDashboard />)
    const main = screen.getByRole('main')
    expect(main).toHaveClass('portfolio-app')
    expect(main.style.getPropertyValue('--box-padding')).toBe('var(--rudi-space-gutter)')
    const stats = container.querySelector('.rudi-grid') as HTMLElement
    expect(stats).toHaveClass('rudi-grid--fill-row')
    expect(stats.style.getPropertyValue('--grid-space')).toBe('var(--rudi-space-group)')
    expect(screen.getByRole('grid', { name: 'Top positions' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<PortfolioDashboard />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('ProductLanding recipe', () => {
  it('renders the page sections under the recipe scope', () => {
    render(<ProductLanding />)
    expect(screen.getByRole('main')).toHaveClass('landing-site')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Pricing' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<ProductLanding />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('PatientSummary recipe', () => {
  it('uses the default steps with no recipe scope', () => {
    render(<PatientSummary />)
    const main = screen.getByRole('main')
    expect(main.className).toBe('rudi-box')
    expect(screen.getByRole('region', { name: 'Medications' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<PatientSummary />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
