import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { RudiToastRegion } from './Toast'
import { rudiToast } from './toastQueue'

afterEach(() => {
  act(() => rudiToast.clear())
  vi.useRealTimers()
})

describe('RudiToastRegion', () => {
  it('renders nothing while the queue is empty', () => {
    render(<RudiToastRegion />)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('renders a labelled landmark region when a toast is shown', () => {
    render(<RudiToastRegion />)
    act(() => {
      rudiToast.info('Courier assigned')
    })
    const region = screen.getByRole('region')
    expect(region).toHaveAccessibleName()
    expect(region).toHaveClass('rudi-toast-region', 'rudi-toast-region--bottom-end')
  })

  it('accepts a custom region label and placement', () => {
    render(<RudiToastRegion aria-label="Alerts" placement="top-end" />)
    act(() => {
      rudiToast.info('Courier assigned')
    })
    const region = screen.getByRole('region', { name: 'Alerts' })
    expect(region).toHaveClass('rudi-toast-region--top-end')
  })

  it('shows title, description, and variant class', () => {
    render(<RudiToastRegion />)
    act(() => {
      rudiToast.success('Shipment booked', { description: 'Pickup Tuesday' })
    })
    const toast = screen.getByRole('alertdialog', { name: 'Shipment booked' })
    expect(toast).toHaveClass('rudi-toast', 'rudi-toast--success')
    expect(toast).toHaveAccessibleDescription('Pickup Tuesday')
    expect(screen.getByRole('alert')).toHaveTextContent('Shipment booked')
  })

  it('returns a key from every method', () => {
    render(<RudiToastRegion />)
    let keys: string[] = []
    act(() => {
      keys = [
        rudiToast.success('a'),
        rudiToast.info('b'),
        rudiToast.warning('c'),
        rudiToast.error('d'),
        rudiToast.add({ title: 'e', variant: 'info' }),
      ]
    })
    expect(new Set(keys).size).toBe(5)
    keys.forEach((k) => expect(typeof k).toBe('string'))
  })

  it('auto-dismisses a success toast after 5000ms', () => {
    vi.useFakeTimers()
    render(<RudiToastRegion />)
    act(() => {
      rudiToast.success('Saved')
    })
    expect(screen.getByText('Saved')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(4900)
    })
    expect(screen.getByText('Saved')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('honours a custom timeout passed to add()', () => {
    vi.useFakeTimers()
    render(<RudiToastRegion />)
    act(() => {
      rudiToast.add({ title: 'Quick', variant: 'info', timeout: 1000 })
    })
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(screen.queryByText('Quick')).not.toBeInTheDocument()
  })

  it('keeps an error toast until it is closed', () => {
    vi.useFakeTimers()
    render(<RudiToastRegion />)
    act(() => {
      rudiToast.error('Upload failed')
    })
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getByText('Upload failed')).toBeInTheDocument()
  })

  it('closes a toast from its Close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<RudiToastRegion />)
    act(() => {
      rudiToast.error('Upload failed', { onClose })
    })
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Upload failed')).not.toBeInTheDocument()
    expect(onClose).toHaveBeenCalled()
  })

  it('closes a toast programmatically by key', () => {
    render(<RudiToastRegion />)
    let key = ''
    act(() => {
      key = rudiToast.error('Upload failed')
    })
    act(() => rudiToast.close(key))
    expect(screen.queryByText('Upload failed')).not.toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    render(<RudiToastRegion />)
    act(() => {
      rudiToast.warning('Dry shipper due', { description: 'Return within 48 hours' })
      rudiToast.error('Upload failed')
    })
    expect(await axe(document.body)).toHaveNoViolations()
  })

  it('applies closeLabel to every toast close button', async () => {
    const { baseElement } = render(<RudiToastRegion closeLabel="Fermer" />)
    act(() => {
      rudiToast.info('One')
      rudiToast.error('Two')
    })
    expect(screen.getAllByRole('button', { name: 'Fermer' })).toHaveLength(2)
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(await axe(baseElement)).toHaveNoViolations()
  })
})
