import type { Meta, StoryObj } from '@storybook/react'
import { RudiSwitch } from './Switch'

const meta = {
  title: 'Components/Switch',
  component: RudiSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A toggle switch for binary on/off settings. Visually distinct from a checkbox — best used for settings that take effect immediately.',
      },
    },
  },
  args: {
    isDisabled: false,
    defaultSelected: false,
    children: 'Enable notifications',
    isSelected: false,
    className: '',
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    isSelected: {
      control: 'boolean',
      table: { category: 'State' },
    },
    defaultSelected: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    onChange: {
      action: 'changed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Enable notifications',
  },
}

export const On: Story = {
  args: {
    children: 'Dark mode',
    defaultSelected: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Feature unavailable',
    isDisabled: true,
  },
}

export const DisabledOn: Story = {
  args: {
    children: 'Required setting',
    isDisabled: true,
    defaultSelected: true,
  },
}

export const AllStates: Story = {
  render: ({}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RudiSwitch>Off by default</RudiSwitch>
      <RudiSwitch defaultSelected>On by default</RudiSwitch>
      <RudiSwitch isDisabled>Disabled off</RudiSwitch>
      <RudiSwitch isDisabled defaultSelected>
        Disabled on
      </RudiSwitch>
    </div>
  ),
}
