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
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['bottom-end', 'top-end', 'bottom-center'],
      table: { category: 'Layout' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    'aria-label': {
      control: 'text',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof RudiToastRegion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Press a button to queue a toast of that variant. Keep titles short and put the detail in `description`. Change `placement` in the API reference below to move the region.',
      },
    },
  },
}

export const Placement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Choose `top-end`, `bottom-end` or `bottom-center` to keep toasts clear of the controls and content your screen relies on. Mount only one region per app, as every toast renders in it.',
      },
    },
  },
  args: { placement: 'top-end' },
}

function TimeoutButtons() {
  return (
    <RudiCluster>
      <RudiButton
        variant="secondary"
        onPress={() => {
          rudiToast.info('Syncing shipments', { timeout: 10000 })
        }}
      >
        Stay for 10 seconds
      </RudiButton>
      <RudiButton
        variant="secondary"
        onPress={() => {
          rudiToast.success('Report exported', {
            description: 'It stays until you close it.',
            timeout: 0,
          })
        }}
      >
        Stay until closed
      </RudiButton>
    </RudiCluster>
  )
}

export const Timeouts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `timeout` in milliseconds to change how long a toast stays, or `0` to keep it until closed. A toast always disappears eventually, so never make it the only path to a required action. Use an alert or a dialog for that.',
      },
    },
  },
  render: (args) => (
    <>
      <TimeoutButtons />
      <RudiToastRegion {...args} />
    </>
  ),
}
