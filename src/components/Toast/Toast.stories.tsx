import { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiToastRegion } from './Toast'
import { rudiToast } from './toastQueue'
import { RudiButton } from '../Button/Button'
import { RudiCluster } from '../../layouts/Cluster/Cluster'
import { RudiStack } from '../../layouts/Stack/Stack'
import { RudiText } from '../../typography/Text/Text'

function VariantButtons() {
  const lastKey = useRef<string | null>(null)
  return (
    <RudiStack>
      <RudiText>
        Success, info, and warning toasts close after 5 seconds. Error toasts stay until closed.
      </RudiText>
      <RudiCluster>
        <RudiButton
          variant="secondary"
          onPress={() => {
            lastKey.current = rudiToast.success('Shipment booked', {
              description: 'Pickup confirmed for Tuesday at 9:00.',
            })
          }}
        >
          Success
        </RudiButton>
        <RudiButton
          variant="secondary"
          onPress={() => {
            lastKey.current = rudiToast.info('Courier assigned')
          }}
        >
          Info
        </RudiButton>
        <RudiButton
          variant="secondary"
          onPress={() => {
            lastKey.current = rudiToast.warning('Dry shipper due back soon', {
              description: 'Return it within 48 hours to avoid a late fee.',
            })
          }}
        >
          Warning
        </RudiButton>
        <RudiButton
          variant="secondary"
          onPress={() => {
            lastKey.current = rudiToast.error('Could not save consent form', {
              description: 'Check your connection and try again.',
            })
          }}
        >
          Error
        </RudiButton>
        <RudiButton
          variant="ghost"
          onPress={() => {
            if (lastKey.current) rudiToast.close(lastKey.current)
          }}
        >
          Close last toast
        </RudiButton>
      </RudiCluster>
    </RudiStack>
  )
}

const meta = {
  title: 'Components/Toast',
  component: RudiToastRegion,
  tags: ['autodocs'],
  render: (args) => (
    <>
      <VariantButtons />
      <RudiToastRegion {...args} />
    </>
  ),
  parameters: {
    docs: {
      description: {
        component:
          'Brief notifications that appear in a corner of the viewport. Mount one `RudiToastRegion` near the app root, then call `rudiToast.success()`, `.info()`, `.warning()`, `.error()`, or `.add()` from anywhere; each returns a key for `rudiToast.close(key)`. Toasts are announced to screen readers, the region is a landmark reachable with F6, and timers pause while the pointer or focus is in the region. Enter and exit animations are skipped when the user prefers reduced motion.',
      },
    },
  },
  args: {
    placement: 'bottom-end',
    className: '',
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['bottom-end', 'top-end', 'bottom-center'],
      description: 'The viewport corner the toasts stack from',
      table: { category: 'Layout' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to apply to the region',
      table: { category: 'Appearance' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the notifications landmark',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof RudiToastRegion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TopEnd: Story = {
  name: 'Top end',
  args: { placement: 'top-end' },
}

export const BottomCenter: Story = {
  name: 'Bottom center',
  args: { placement: 'bottom-center' },
}
