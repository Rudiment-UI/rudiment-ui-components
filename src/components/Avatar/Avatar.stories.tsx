import type { Meta, StoryObj } from '@storybook/react'
import { RudiAvatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: RudiAvatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A user or entity representation with image support, an icon or initials fallback, an optional tint for colored tiles, and an optional status indicator. `tint="auto"` picks a categorical color from `name`.',
      },
    },
  },
  args: {
    name: 'John Doe',
    size: 'md',
  },
  argTypes: {
    src: {
      control: 'text',
      table: { category: 'Content' },
    },
    alt: {
      control: 'text',
      table: { category: 'Content' },
    },
    name: {
      control: 'text',
      table: { category: 'Content' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    status: {
      control: 'select',
      options: [undefined, 'success', 'warning', 'error', 'info'],
      table: { category: 'Appearance' },
    },
    icon: {
      control: 'text',
      table: { category: 'Content' },
    },
    tint: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Initials from `name` when there is no image. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Images: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `src` with `alt` for a photo. Keep `name` set as well: its initials show if the image fails to load. Pair the avatar with a visible name in lists and profiles instead of relying on the image alone. An Avatar with no `alt` or `name` is treated as decorative and hidden from screen readers, so avoid an empty circle with no context.',
      },
    },
  },
  args: {
    src: 'https://i.pravatar.cc/100',
    alt: 'John Doe',
    name: 'John Doe',
  },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `sm` in dense lists and tables, `md` in most layouts and `lg` in profile headers.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiAvatar name="John Doe" size="sm" />
      <RudiAvatar name="John Doe" size="md" />
      <RudiAvatar name="John Doe" size="lg" />
    </div>
  ),
}

export const Fallbacks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With no image the avatar shows up to two initials from `name`. A single word gives one initial.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiAvatar name="John Doe" />
      <RudiAvatar name="Alice" />
    </div>
  ),
}

export const StatusIndicator: Story = {
  name: 'Status indicator',
  parameters: {
    docs: {
      description: {
        story:
          'Use `status` sparingly, for presence or assignment states. Pass `statusLabel` (for example "Busy") so the status is part of the accessible name and not only a colored dot.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiAvatar name="John Doe" status="success" statusLabel="Online" />
      <RudiAvatar name="John Doe" status="warning" statusLabel="Away" />
      <RudiAvatar name="John Doe" status="error" statusLabel="Busy" />
      <RudiAvatar name="John Doe" status="info" statusLabel="In a meeting" />
    </div>
  ),
}

export const IconTiles: Story = {
  name: 'Icon tiles',
  parameters: {
    docs: {
      description: {
        story:
          'Combine `icon` with `tint` for entity tiles, such as a page-title icon for "Shipments". Keep `name` set so the tile has an accessible name.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <RudiAvatar name="Shipments" icon="lucide:truck" tint="var(--rudi-color-dataviz-series-1)" size="lg" />
      <RudiAvatar name="Contacts" icon="lucide:users" tint="var(--rudi-color-dataviz-series-4)" size="lg" />
      <RudiAvatar name="Devices" icon="lucide:thermometer" tint="var(--rudi-color-dataviz-series-6)" size="lg" />
      <RudiAvatar name="Ada Lovelace" tint="var(--rudi-color-dataviz-series-2)" size="lg" />
    </div>
  ),
}

export const AutoTint: Story = {
  name: 'Auto tint',
  parameters: {
    docs: {
      description: {
        story:
          '`tint="auto"` picks a categorical color from `name`, so each person or organization keeps the same color everywhere it appears.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Northside Fertility', 'Coastal IVF'].map(
        (name) => (
          <RudiAvatar key={name} name={name} tint="auto" />
        ),
      )}
    </div>
  ),
}
