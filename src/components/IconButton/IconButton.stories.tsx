import type { Meta, StoryObj } from '@storybook/react'
import { RudiIconButton } from './IconButton'
import { RudiIcon } from '@/components/Icon/Icon'
import { RudiCluster } from '@/layouts/Cluster/Cluster'

const meta = {
  title: 'Components/Elements/IconButton',
  component: RudiIconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "A compact button containing only an icon. Requires an accessible label via the aria-label prop. Shares Button's visual variants and sizes.",
      },
    },
  },
  args: {
    'aria-label': 'Close',
    children: <RudiIcon icon="mdi:close" />,
  },
  argTypes: {
    'aria-label': {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      control: false,
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
} as Meta<typeof RudiIconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A secondary, medium icon button. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The variants match `RudiButton`: `primary` for the main action, `secondary` for alternatives, `destructive` for actions that cannot be undone, and `ghost` for low-emphasis controls such as toolbar buttons.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiIconButton aria-label="Add item" variant="primary">
        <RudiIcon icon="mdi:plus" />
      </RudiIconButton>
      <RudiIconButton aria-label="Edit" variant="secondary">
        <RudiIcon icon="mdi:pencil" />
      </RudiIconButton>
      <RudiIconButton aria-label="Delete" variant="destructive">
        <RudiIcon icon="mdi:trash-can-outline" />
      </RudiIconButton>
      <RudiIconButton aria-label="Close" variant="ghost">
        <RudiIcon icon="mdi:close" />
      </RudiIconButton>
    </RudiCluster>
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`md` suits most toolbars. Use `sm` in dense places such as table rows and card headers, and `lg` where the control needs a larger touch target.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiIconButton aria-label="Close small" size="sm">
        <RudiIcon icon="mdi:close" />
      </RudiIconButton>
      <RudiIconButton aria-label="Close medium" size="md">
        <RudiIcon icon="mdi:close" />
      </RudiIconButton>
      <RudiIconButton aria-label="Close large" size="lg">
        <RudiIcon icon="mdi:close" />
      </RudiIconButton>
    </RudiCluster>
  ),
}

export const Labelling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `aria-label` is the only name a screen reader announces, so describe the result of the action ("Close dialog"), not the icon. Use an icon alone only when its meaning is universally understood, such as close, search, or menu. For anything less obvious, use a [`RudiButton`](?path=/docs/components-elements-button--docs) with a visible label.',
      },
    },
  },
  render: () => (
    <RudiCluster space="inline">
      <RudiIconButton aria-label="Close dialog" variant="ghost">
        <RudiIcon icon="mdi:close" />
      </RudiIconButton>
      <RudiIconButton aria-label="Search" variant="ghost">
        <RudiIcon icon="mdi:magnify" />
      </RudiIconButton>
      <RudiIconButton aria-label="Open menu" variant="ghost">
        <RudiIcon icon="mdi:menu" />
      </RudiIconButton>
    </RudiCluster>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A disabled icon button can't be focused, and with no visible label there is little to explain why it is unavailable. Where you can, leave it enabled and explain what's missing when it's pressed.",
      },
    },
  },
  args: {
    'aria-label': 'Add item',
    isDisabled: true,
    children: <RudiIcon icon="mdi:plus" />,
  },
}
