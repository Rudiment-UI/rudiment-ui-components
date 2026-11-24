import type { Meta, StoryObj } from '@storybook/react'
import { RudiTag } from './Tag'

const meta = {
  title: 'Components/Elements/Tag',
  component: RudiTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact label component for categorization, with optional dismiss and click interactions.',
      },
    },
  },
  args: {
    variant: 'default',
    children: 'Tag',
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    dismissible: {
      control: 'boolean',
      table: { category: 'Content' },
    },
    onDismiss: {
      control: false,
      table: { category: 'Content' },
    },
    onPress: {
      control: false,
      table: { category: 'Content' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof RudiTag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A static label. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use a variant to group tags by meaning. Use Tag for user-generated labels and filters; use Badge when the label is system-defined and cannot be removed.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiTag variant="default">Default</RudiTag>
      <RudiTag variant="success">Success</RudiTag>
      <RudiTag variant="warning">Warning</RudiTag>
      <RudiTag variant="error">Error</RudiTag>
      <RudiTag variant="info">Info</RudiTag>
    </div>
  ),
}

export const RemovableTags: Story = {
  name: 'Removable tags',
  parameters: {
    docs: {
      description: {
        story:
          'Set `dismissible` and provide `onDismiss` when people can remove a tag, such as an applied filter.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiTag variant="default" dismissible onDismiss={() => {}}>Default</RudiTag>
      <RudiTag variant="success" dismissible onDismiss={() => {}}>Success</RudiTag>
      <RudiTag variant="warning" dismissible onDismiss={() => {}}>Warning</RudiTag>
      <RudiTag variant="error" dismissible onDismiss={() => {}}>Error</RudiTag>
      <RudiTag variant="info" dismissible onDismiss={() => {}}>Info</RudiTag>
    </div>
  ),
}

export const ClickableTags: Story = {
  name: 'Clickable tags',
  parameters: {
    docs: {
      description: {
        story:
          'Pass `onPress` to make the tag itself a button. With both `onPress` and `dismissible` the tag renders two separate buttons, the tag and its remove button, so each action stays distinct.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiTag onPress={() => {}}>Click me</RudiTag>
      <RudiTag onPress={() => {}} dismissible onDismiss={() => {}}>
        Click or remove
      </RudiTag>
    </div>
  ),
}

export const DisabledTags: Story = {
  name: 'Disabled tags',
  parameters: {
    docs: {
      description: {
        story:
          '`isDisabled` turns off both the tag and its remove button. To keep a tag from being removed, omit `dismissible` instead.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiTag isDisabled onPress={() => {}}>Disabled</RudiTag>
      <RudiTag isDisabled dismissible onDismiss={() => {}}>Disabled and removable</RudiTag>
    </div>
  ),
}
