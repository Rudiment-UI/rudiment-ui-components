import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { RudiDrawer } from './Drawer'

function Harness({ initialOpen = false, ...props }: { initialOpen?: boolean; isDismissable?: boolean }) {
  const [isOpen, setOpen] = useState(initialOpen)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <RudiDrawer isOpen={isOpen} onClose={() => setOpen(false)} title="Edit shipment" {...props}>
        <button>Inside</button>
        <RudiDrawer.Footer>
          <button onClick={() => setOpen(false)}>Done</button>
        </RudiDrawer.Footer>
      </RudiDrawer>
    </>
  )
}

describe('Drawer', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <RudiDrawer isOpen={false} onClose={() => {}} title="Edit">
        Content
      </RudiDrawer>,
    )
    expect(container.firstChild).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a dialog named by its title', () => {
    render(
      <RudiDrawer isOpen onClose={() => {}} title="Edit shipment">
        Content
      </RudiDrawer>,
    )
    expect(screen.getByRole('dialog', { name: 'Edit shipment' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Edit shipment' })).toHaveClass(
      'rudi-drawer__title',
    )
  })

  it('is named by its title when opened after mount', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Edit shipment' })).toBeInTheDocument()
  })

  it('defaults to the end placement and md size', () => {
    render(
      <RudiDrawer isOpen onClose={() => {}} title="Edit">
        Content
      </RudiDrawer>,
    )
    const drawer = screen.getByRole('dialog')
    expect(drawer).toHaveClass('rudi-drawer', 'rudi-drawer--end', 'rudi-drawer--md')
    expect(document.querySelector('.rudi-drawer__overlay')).toHaveClass(
      'rudi-drawer__overlay--end',
    )
  })

  it('applies placement, size and a merged className', () => {
    render(
      <RudiDrawer isOpen onClose={() => {}} title="Filters" placement="start" size="lg" className="mine">
        Content
      </RudiDrawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass(
      'rudi-drawer',
      'rudi-drawer--start',
      'rudi-drawer--lg',
      'mine',
    )
    expect(document.querySelector('.rudi-drawer__overlay')).toHaveClass(
      'rudi-drawer__overlay--start',
    )
  })

  it('pins RudiDrawer.Footer outside the scrolling body', () => {
    render(<Harness initialOpen />)
    const footer = screen.getByRole('button', { name: 'Done' }).parentElement!
    expect(footer).toHaveClass('rudi-drawer__footer')
    expect(screen.getByRole('button', { name: 'Inside' }).closest('.rudi-drawer__body')).not.toContainElement(footer)
  })

  it('moves focus into the drawer and returns it to the trigger on close', async () => {
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await vi.waitFor(() => expect(trigger).toHaveFocus())
  })

  it('traps Tab inside the drawer', async () => {
    render(<Harness initialOpen />)
    const drawer = screen.getByRole('dialog')
    for (let i = 0; i < 5; i++) {
      await userEvent.tab()
      expect(drawer).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it('closes with the close button', async () => {
    render(<Harness initialOpen />)
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on a backdrop click', async () => {
    render(<Harness initialOpen />)
    await userEvent.click(document.querySelector('.rudi-drawer__overlay')!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not close on a click inside the panel', async () => {
    render(<Harness initialOpen />)
    await userEvent.click(screen.getByRole('button', { name: 'Inside' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('uses closeLabel for the close button', () => {
    render(
      <RudiDrawer isOpen onClose={() => {}} title="Edit" closeLabel="Schließen">
        Content
      </RudiDrawer>,
    )
    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument()
  })

  it('ignores Escape, the backdrop, and hides the close button when not dismissable', async () => {
    const onClose = vi.fn()
    render(
      <RudiDrawer isOpen onClose={onClose} title="Saving" isDismissable={false}>
        <button>Inside</button>
      </RudiDrawer>,
    )
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await userEvent.click(document.querySelector('.rudi-drawer__overlay')!)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('stays mounted with data-exiting until its exit animation finishes', async () => {
    let finish!: () => void
    const finished = new Promise<void>((resolve) => (finish = resolve))
    // jsdom has no Web Animations API; fake a running animation on the exiting panel.
    const proto = HTMLElement.prototype as unknown as { getAnimations?: (this: HTMLElement) => unknown[] }
    const original = proto.getAnimations
    proto.getAnimations = function () {
      return this.dataset.exiting !== undefined ? [{ finished }] : []
    }
    try {
      render(<Harness initialOpen />)
      await userEvent.click(screen.getByRole('button', { name: 'Done' }))
      const drawer = screen.getByRole('dialog')
      expect(drawer).toHaveAttribute('data-exiting')
      // A second dismissal while it slides out does nothing.
      await userEvent.keyboard('{Escape}')
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      finish()
      await finished
      await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    } finally {
      if (original) proto.getAnimations = original
      else delete proto.getAnimations
    }
  })

  it('forwards its ref to the panel', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <RudiDrawer ref={ref} isOpen onClose={() => {}} title="Edit">
        Content
      </RudiDrawer>,
    )
    expect(ref.current).toBe(screen.getByRole('dialog'))
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Harness initialOpen />)
    expect(await axe(container.ownerDocument.body)).toHaveNoViolations()
  })
})
