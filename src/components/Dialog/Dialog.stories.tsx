import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiDialog, type RudiDialogProps } from './Dialog'
import { RudiButton } from '../Button/Button'

type DialogStoryArgs = Omit<RudiDialogProps, 'isOpen' | 'onClose' | 'children'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const meta: Meta<DialogStoryArgs> = {
  title: 'Components/Overlays/Dialog',
  component: RudiDialog as any,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal dialog that overlays the page to capture user attention. Traps keyboard focus, prevents background scrolling, and supports three sizes.',
      },
    },
  },
  args: {
    size: 'md',
    isDismissable: true,
    title: 'Confirm action',
  },
  argTypes: {
    title: {
      control: 'text',
      table: { category: 'Content' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    isDismissable: {
      control: 'boolean',
      table: { category: 'State' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A dialog is controlled: you own `isOpen` and clear it in `onClose`. Put the action buttons in `RudiDialog.Footer`, primary action last. Change the props in the API reference below to try them on this example.',
      },
      source: {
        code: `const [isOpen, setIsOpen] = useState(false)

<>
  <RudiButton onPress={() => setIsOpen(true)}>Open dialog</RudiButton>
  <RudiDialog
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Confirm action"
  >
    <p>Are you sure you want to continue? This cannot be undone.</p>
    <RudiDialog.Footer>
      <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>Cancel</RudiButton>
      <RudiButton variant="primary" onPress={() => setIsOpen(false)}>Confirm</RudiButton>
    </RudiDialog.Footer>
  </RudiDialog>
</>`,
      },
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <RudiButton onPress={() => setIsOpen(true)}>Open dialog</RudiButton>
        <RudiDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>Are you sure you want to continue? This cannot be undone.</p>
          <RudiDialog.Footer>
            <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>
              Cancel
            </RudiButton>
            <RudiButton variant="primary" onPress={() => setIsOpen(false)}>
              Confirm
            </RudiButton>
          </RudiDialog.Footer>
        </RudiDialog>
      </>
    )
  },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `sm` for short confirmations, `md` for most tasks and `lg` for long or dense content such as terms or a table. Long bodies scroll while the title and `RudiDialog.Footer` stay in view.',
      },
      source: {
        code: `<RudiDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Terms of service" size="lg">
  <p>Please read the following terms carefully before proceeding.</p>
  <RudiDialog.Footer>
    <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>Decline</RudiButton>
    <RudiButton variant="primary" onPress={() => setIsOpen(false)}>Accept</RudiButton>
  </RudiDialog.Footer>
</RudiDialog>`,
      },
    },
  },
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null)
    const close = () => setSize(null)
    return (
      <>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <RudiButton variant="secondary" onPress={() => setSize('sm')}>
            Small
          </RudiButton>
          <RudiButton variant="secondary" onPress={() => setSize('md')}>
            Medium
          </RudiButton>
          <RudiButton variant="secondary" onPress={() => setSize('lg')}>
            Large
          </RudiButton>
        </div>
        <RudiDialog
          isOpen={size !== null}
          onClose={close}
          title="Terms of service"
          size={size ?? 'md'}
        >
          <p>Please read the following terms carefully before proceeding.</p>
          <p
            style={{
              marginTop: '1rem',
              color: 'var(--rudi-color-text-subtle)',
              fontSize: '0.875rem',
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <RudiDialog.Footer>
            <RudiButton variant="secondary" onPress={close}>
              Decline
            </RudiButton>
            <RudiButton variant="primary" onPress={close}>
              Accept
            </RudiButton>
          </RudiDialog.Footer>
        </RudiDialog>
      </>
    )
  },
}

export const ConfirmationDialog: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use a small dialog to confirm an action the person can\'t undo, with a destructive primary button that names the result. For passive notifications use `RudiAlert` instead, and don\'t open a dialog from inside a dialog.',
      },
      source: {
        code: `<RudiDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete item" size="sm">
  <p>This item will be permanently deleted.</p>
  <RudiDialog.Footer>
    <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>Cancel</RudiButton>
    <RudiButton variant="destructive" onPress={() => setIsOpen(false)}>Delete</RudiButton>
  </RudiDialog.Footer>
</RudiDialog>`,
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <RudiButton variant="destructive" onPress={() => setIsOpen(true)}>
          Delete item
        </RudiButton>
        <RudiDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete item"
          size="sm"
        >
          <p>This item will be permanently deleted.</p>
          <RudiDialog.Footer>
            <RudiButton variant="secondary" onPress={() => setIsOpen(false)}>
              Cancel
            </RudiButton>
            <RudiButton variant="destructive" onPress={() => setIsOpen(false)}>
              Delete
            </RudiButton>
          </RudiDialog.Footer>
        </RudiDialog>
      </>
    )
  },
}

export const RequiredAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `isDismissable={false}` there is no close button, and Escape and outside clicks do nothing. Use it only when the person must act before continuing, and always give the footer a way out.',
      },
      source: {
        code: `<RudiDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Required action" isDismissable={false}>
  <p>You must complete this step before continuing.</p>
  <RudiDialog.Footer>
    <RudiButton variant="primary" onPress={() => setIsOpen(false)}>Got it</RudiButton>
  </RudiDialog.Footer>
</RudiDialog>`,
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <RudiButton onPress={() => setIsOpen(true)}>
          Open required dialog
        </RudiButton>
        <RudiDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Required action"
          isDismissable={false}
        >
          <p>You must complete this step before continuing.</p>
          <RudiDialog.Footer>
            <RudiButton variant="primary" onPress={() => setIsOpen(false)}>
              Got it
            </RudiButton>
          </RudiDialog.Footer>
        </RudiDialog>
      </>
    )
  },
}
