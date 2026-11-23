import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiButton } from './Button'
import { RudiIconButton } from '@/components/IconButton/IconButton'
import { RudiIcon } from '@/components/Icon/Icon'
import { RudiCluster } from '@/layouts/Cluster/Cluster'

const meta = {
  title: 'Components/Button',
  component: RudiButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A button for actions on the page: saving, deleting, opening a dialog. Use a link for navigation, and `RudiIconButton` when there is no visible label.',
      },
    },
  },
  args: {
    children: 'Save changes',
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    iconBefore: {
      control: 'text',
      table: { category: 'Content' },
    },
    iconAfter: {
      control: 'text',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    isLoading: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled and non-interactive',
      table: { category: 'State' },
    },
    onPress: {
      action: 'pressed',
      description: 'Called when the button is pressed',
      table: { category: 'Events' },
    },
    onPressStart: {
      action: 'pressStarted',
      description: 'Called when a press interaction starts',
      table: { category: 'Events' },
    },
    onPressEnd: {
      action: 'pressEnded',
      description: 'Called when a press interaction ends',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A primary, medium button. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `primary` for the one action you want people to take, and only one per section; two primaries leave people unsure which is the main action. Use `secondary` for the alternatives, `destructive` for actions that can't be undone, and `ghost` for low-emphasis actions such as \"Learn more\". Ghost buttons are easy to overlook, so don't use them for anything important.",
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiButton variant="primary">Save changes</RudiButton>
      <RudiButton variant="secondary">Cancel</RudiButton>
      <RudiButton variant="destructive">Delete account</RudiButton>
      <RudiButton variant="ghost">Learn more</RudiButton>
    </RudiCluster>
  ),
}

export const PairingActions: Story = {
  name: 'Pairing actions',
  parameters: {
    docs: {
      description: {
        story:
          'In a form or dialog footer, pair the primary action with a secondary one for the way out. Put the primary action last, at the end people read towards.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline" justify="flex-end">
      <RudiButton variant="secondary">Cancel</RudiButton>
      <RudiButton variant="primary">Save changes</RudiButton>
    </RudiCluster>
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`md` suits most forms and toolbars. Use `sm` in dense places such as table rows and card headers, and `lg` for a single call to action on a sparse page.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiButton size="sm">Small</RudiButton>
      <RudiButton size="md">Medium</RudiButton>
      <RudiButton size="lg">Large</RudiButton>
    </RudiCluster>
  ),
}

export const WithIcons: Story = {
  name: 'With icons',
  parameters: {
    docs: {
      description: {
        story:
          'Pass an Iconify name to `iconBefore` or `iconAfter`. An icon before the label reinforces the action (add, download); one after it suggests direction (next, open). The label stays the accessible name, so the icons are hidden from screen readers.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiButton iconBefore="mdi:plus">Add item</RudiButton>
      <RudiButton variant="secondary" iconAfter="mdi:arrow-right">
        Next
      </RudiButton>
      <RudiButton variant="secondary" iconBefore="mdi:download">
        Download
      </RudiButton>
    </RudiCluster>
  ),
}

export const IconOnly: Story = {
  name: 'Icon only',
  parameters: {
    docs: {
      description: {
        story:
          '`RudiButton` always has a visible label. For an icon with no text, such as a toolbar or a close control, use [`RudiIconButton`](?path=/docs/components-iconbutton--docs), which requires an `aria-label`.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiIconButton aria-label="Edit" variant="ghost">
        <RudiIcon icon="mdi:pencil" />
      </RudiIconButton>
      <RudiIconButton aria-label="Delete" variant="ghost">
        <RudiIcon icon="mdi:trash-can-outline" />
      </RudiIconButton>
    </RudiCluster>
  ),
}

function SaveButton() {
  const [isSaving, setIsSaving] = useState(false)
  const save = () => {
    setIsSaving(true)
    window.setTimeout(() => setIsSaving(false), 2000)
  }
  return (
    <RudiButton isLoading={isSaving} onPress={save}>
      {isSaving ? 'Saving…' : 'Save changes'}
    </RudiButton>
  )
}

export const LoadingState: Story = {
  name: 'Loading state',
  parameters: {
    docs: {
      description: {
        story:
          'Set `isLoading` while an async action such as a form submission runs. It shows a spinner, sets `aria-busy` and blocks a second press. Press the button to try it.',
      },
      source: {
        code: `function SaveButton() {
  const [isSaving, setIsSaving] = useState(false)

  async function save() {
    setIsSaving(true)
    await saveChanges()
    setIsSaving(false)
  }

  return (
    <RudiButton isLoading={isSaving} onPress={save}>
      {isSaving ? 'Saving…' : 'Save changes'}
    </RudiButton>
  )
}`,
      },
    },
  },
  render: () => <SaveButton />,
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A disabled button can't be focused, so keyboard and screen-reader users may not find it or learn why it's unavailable. Where you can, leave the button enabled and explain what's missing when it's pressed, for example with form validation.",
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiButton isDisabled>Save changes</RudiButton>
      <RudiButton variant="secondary" isDisabled>
        Cancel
      </RudiButton>
    </RudiCluster>
  ),
}
