import type { Meta, StoryObj } from '@storybook/react'
import { RudiDot } from './Dot'

const meta = {
  title: 'Components/Elements/Dot',
  component: RudiDot,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small colored dot for status and category indicators. Use a semantic `tone` or an explicit `color` token for domain accents.',
      },
    },
  },
  args: {
    tone: 'default',
    size: 'md',
    pulse: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      table: { category: 'Appearance' },
    },
    color: { control: 'text', table: { category: 'Appearance' } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    pulse: { control: 'boolean', table: { category: 'Appearance' } },
    label: { control: 'text', table: { category: 'Accessibility' } },
  },
} satisfies Meta<typeof RudiDot>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A neutral dot. Without a `label` it is hidden from assistive technology. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the semantic `tone` instead of a raw `color` so the indicator stays theme-aware. Pair each dot with a text label so color-blind readers can tell states apart.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <RudiDot tone="default" /> Default
      <RudiDot tone="success" /> Success
      <RudiDot tone="warning" /> Warning
      <RudiDot tone="error" /> Error
      <RudiDot tone="info" /> Info
    </div>
  ),
}

export const StatusIndicator: Story = {
  name: 'Status indicator',
  parameters: {
    docs: {
      description: {
        story:
          'When the dot is the only signal of status, give it a `label` so screen readers announce it.',
      },
    },
  },
  args: { tone: 'success', label: 'Online' },
}

export const CustomColor: Story = {
  name: 'Custom color',
  parameters: {
    docs: {
      description: {
        story:
          'Pass an explicit `color` token for domain accents that have no semantic tone, such as chart series or categories.',
      },
    },
  },
  args: { color: 'var(--rudi-color-dataviz-3)' },
}

export const LiveIndicator: Story = {
  name: 'Live indicator',
  parameters: {
    docs: {
      description: {
        story:
          '`pulse` animates the dot. Reserve it for live or active states, not static ones.',
      },
    },
  },
  args: { tone: 'error', pulse: true, label: 'Live' },
}
