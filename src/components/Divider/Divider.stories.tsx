import type { Meta, StoryObj } from '@storybook/react'
import { RudiDivider } from './Divider'

const meta = {
  title: 'Components/Divider',
  component: RudiDivider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A thin rule that separates content. Supports horizontal and vertical orientation, spacing presets, and an optional centered label.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
    spacing: 'md',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { category: 'Appearance' },
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    className: { control: 'text', table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof RudiDivider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A horizontal rule between two blocks of content. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
  render: (args) => (
    <div>
      <p>Above the divider</p>
      <RudiDivider {...args} />
      <p>Below the divider</p>
    </div>
  ),
}

export const Spacing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tune the gap around the rule with `spacing`. Prefer whitespace alone where it already groups content, since too many rules add noise.',
      },
    },
  },
  render: () => (
    <div>
      {(['none', 'sm', 'md', 'lg'] as const).map((spacing) => (
        <div key={spacing}>
          <p>Spacing: {spacing}</p>
          <RudiDivider spacing={spacing} />
        </div>
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  name: 'With a label',
  parameters: {
    docs: {
      description: {
        story:
          'Caption a divider when it introduces a break, for example "OR" between sign-in options.',
      },
    },
  },
  args: { label: 'OR' },
  render: (args) => (
    <div>
      <p>Sign in with email</p>
      <RudiDivider {...args} />
      <p>Continue with a passkey</p>
    </div>
  ),
}

export const Orientation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use a vertical divider between inline items such as navigation links. It needs a parent with a height to render, so place it in a sized flex container.',
      },
    },
  },
  args: { orientation: 'vertical', spacing: 'sm' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', height: '2rem' }}>
      <span>Home</span>
      <RudiDivider {...args} />
      <span>Docs</span>
      <RudiDivider {...args} />
      <span>Pricing</span>
    </div>
  ),
}
