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
    className: '',
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
      <RudiStack space="var(--rudi-spacing-4)">
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
      source: {
        code: `const [isOpen, setIsOpen] = useState(false)

<>
  <RudiButton onPress={() => setIsOpen(true)}>Edit shipment</RudiButton>
  <RudiDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit shipment">
    <RudiStack space="var(--rudi-spacing-4)">
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

export const StartPlacement: Story = {
  args: { placement: 'start', size: 'sm', title: 'Filters' },
  parameters: {
    docs: {
      source: {
        code: `<RudiDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filters" placement="start" size="sm">
  …
</RudiDrawer>`,
      },
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <RudiButton variant="secondary" onPress={() => setIsOpen(true)}>
          Show filters
        </RudiButton>
        <RudiDrawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <RudiStack space="var(--rudi-spacing-4)">
            <RudiInput label="Origin" />
            <RudiInput label="Destination" />
          </RudiStack>
          <RudiDrawer.Footer>
            <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>
              Clear
            </RudiButton>
            <RudiButton variant="primary" onPress={() => setIsOpen(false)}>
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
        story: 'The body scrolls on its own; the header and the footer stay in place.',
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

export const NotDismissable: Story = {
  args: { title: 'Review changes', isDismissable: false },
  parameters: {
    docs: {
      description: {
        story:
          'With `isDismissable={false}` there is no close button, and Escape and the backdrop do nothing. The footer must offer a way out.',
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
