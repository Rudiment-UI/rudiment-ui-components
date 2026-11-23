import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiDrawer, type RudiDrawerProps } from './Drawer'
import { RudiButton } from '../Button/Button'
import { RudiInput } from '../Input/Input'
import { RudiTextarea } from '../Textarea/Textarea'
import { RudiDescriptionList } from '../DescriptionList/DescriptionList'
import { RudiStack } from '../../layouts/Stack/Stack'

type DrawerStoryArgs = Omit<RudiDrawerProps, 'isOpen' | 'onClose' | 'children'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const meta: Meta<DrawerStoryArgs> = {
  title: 'Components/Drawer',
  component: RudiDrawer as any,
  tags: ['autodocs', 'new'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal panel that slides in from the start or end edge of the viewport, full height. Use it for detail views, filters and edit forms that need more room than a dialog. Traps keyboard focus, prevents background scrolling, returns focus to the trigger, and slides out before it unmounts.',
      },
    },
  },
  args: {
    title: 'Edit shipment',
    placement: 'end',
    size: 'md',
    isDismissable: true,
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    closeLabel: { control: 'text', table: { category: 'Content' } },
    placement: {
      control: 'inline-radio',
      options: ['start', 'end'],
      table: { category: 'Layout' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    className: { control: 'text', table: { category: 'Appearance' } },
    isDismissable: { control: 'boolean', table: { category: 'State' } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

function EditForm({ onDone }: { onDone: () => void }) {
  return (
    <>
      <RudiStack space="content">
        <RudiInput label="Reference" defaultValue="SHP-20418" />
        <RudiInput label="Carrier" defaultValue="DHL Medical Express" />
        <RudiTextarea label="Handling notes" defaultValue="Keep between 2 and 8 °C." />
      </RudiStack>
      <RudiDrawer.Footer>
        <RudiButton variant="secondary" onPress={onDone}>
          Cancel
        </RudiButton>
        <RudiButton variant="primary" onPress={onDone}>
          Save
        </RudiButton>
      </RudiDrawer.Footer>
    </>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An edit form in a drawer that opens from the `end` edge, which suits details and editing while the page behind stays in view. Put the action buttons in `RudiDrawer.Footer`, primary action last. Change the props in the API reference below to try them.',
      },
      source: {
        code: `const [isOpen, setIsOpen] = useState(false)

<>
  <RudiButton onPress={() => setIsOpen(true)}>Edit shipment</RudiButton>
  <RudiDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit shipment">
    <RudiStack space="content">
      <RudiInput label="Reference" defaultValue="SHP-20418" />
      <RudiInput label="Carrier" defaultValue="DHL Medical Express" />
      <RudiTextarea label="Handling notes" defaultValue="Keep between 2 and 8 °C." />
    </RudiStack>
    <RudiDrawer.Footer>
      <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>Cancel</RudiButton>
      <RudiButton variant="primary" onPress={() => setIsOpen(false)}>Save</RudiButton>
    </RudiDrawer.Footer>
  </RudiDrawer>
</>`,
      },
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <RudiButton onPress={() => setIsOpen(true)}>Edit shipment</RudiButton>
        <RudiDrawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <EditForm onDone={() => setIsOpen(false)} />
        </RudiDrawer>
      </>
    )
  },
}

export const Placement: Story = {
  args: { size: 'sm' },
  parameters: {
    docs: {
      description: {
        story:
          'Open from the `end` edge for details and editing, and from the `start` edge for filters or navigation that sits on that side of the page. For an app\'s main navigation use `RudiAppShell`, which already turns its sidebar into a drawer on narrow screens.',
      },
      source: {
        code: `<RudiDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filters" placement="start" size="sm">
  <RudiStack space="content">
    <RudiInput label="Origin" />
    <RudiInput label="Destination" />
  </RudiStack>
  <RudiDrawer.Footer>
    <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>Clear</RudiButton>
    <RudiButton variant="primary" onPress={() => setIsOpen(false)}>Apply</RudiButton>
  </RudiDrawer.Footer>
</RudiDrawer>`,
      },
    },
  },
  render: (args) => {
    const [placement, setPlacement] = useState<'start' | 'end' | null>(null)
    const close = () => setPlacement(null)
    return (
      <>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <RudiButton variant="secondary" onPress={() => setPlacement('start')}>
            Show filters
          </RudiButton>
          <RudiButton variant="secondary" onPress={() => setPlacement('end')}>
            Show details
          </RudiButton>
        </div>
        <RudiDrawer
          {...args}
          isOpen={placement !== null}
          onClose={close}
          placement={placement ?? 'end'}
          title={placement === 'start' ? 'Filters' : 'Shipment details'}
        >
          <RudiStack space="content">
            <RudiInput label="Origin" />
            <RudiInput label="Destination" />
          </RudiStack>
          <RudiDrawer.Footer>
            <RudiButton variant="secondary" onPress={close}>
              Clear
            </RudiButton>
            <RudiButton variant="primary" onPress={close}>
              Apply
            </RudiButton>
          </RudiDrawer.Footer>
        </RudiDrawer>
      </>
    )
  },
}

const detailItems = Array.from({ length: 24 }, (_, i) => ({
  term: `Reading ${i + 1}`,
  description: `${(4 + Math.sin(i) * 1.5).toFixed(1)} °C at 0${i % 10}:00`,
}))

export const LongContent: Story = {
  args: { title: 'Temperature log', size: 'lg' },
  parameters: {
    docs: {
      description: {
        story:
          'The body scrolls on its own while the header and the footer stay in place, so use a drawer for long detail views that need more room than a dialog. For a short confirmation use `RudiDialog` instead.',
      },
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <RudiButton onPress={() => setIsOpen(true)}>View log</RudiButton>
        <RudiDrawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <RudiDescriptionList layout="inline" dividers items={detailItems} />
          <RudiDrawer.Footer>
            <RudiButton variant="primary" onPress={() => setIsOpen(false)}>
              Done
            </RudiButton>
          </RudiDrawer.Footer>
        </RudiDrawer>
      </>
    )
  },
}

export const RequiredReview: Story = {
  args: { title: 'Review changes', isDismissable: false },
  parameters: {
    docs: {
      description: {
        story:
          'With `isDismissable={false}` there is no close button, and Escape and the backdrop do nothing. Use it only when the person must finish the task, and make the footer offer a way out. Don\'t open a dialog or a second drawer from a drawer; keep the task in one panel.',
      },
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <RudiButton onPress={() => setIsOpen(true)}>Review changes</RudiButton>
        <RudiDrawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <EditForm onDone={() => setIsOpen(false)} />
        </RudiDrawer>
      </>
    )
  },
}
