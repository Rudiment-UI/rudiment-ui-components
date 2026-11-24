import type { Meta, StoryObj } from '@storybook/react'
import { RudiProgressBar } from './ProgressBar'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Feedback/ProgressBar',
  component: RudiProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A determinate progress indicator with label and optional value display. Built with React Aria for accessible progress reporting.',
      },
    },
  },
  args: {
    value: 60,
    label: 'Loading...',
    variant: 'default',
    size: 'md',
    showValueLabel: false,
    minValue: 0,
    maxValue: 100,
  },
  argTypes: {
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    showValueLabel: {
      control: 'boolean',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      table: { category: 'State' },
    },
    minValue: {
      control: 'number',
      table: { category: 'State' },
    },
    maxValue: {
      control: 'number',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof RudiProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A bar at 60% with a visible label. `value` is required, and the bar is determinate only, so it suits work whose progress you can measure. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `variant` to match the bar to what it reports: `success` for a completed or healthy state, `warning` for something nearing a limit, `error` for a final failure. Set `error` only when the end state is a failure, not for a failing step mid-progress.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiProgressBar label="Default" value={60} variant="default" showValueLabel />
      <RudiProgressBar label="Success" value={75} variant="success" showValueLabel />
      <RudiProgressBar label="Warning" value={45} variant="warning" showValueLabel />
      <RudiProgressBar label="Error" value={30} variant="error" showValueLabel />
    </RudiStack>
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `md` as the main indicator on a page and `sm` for a compact bar inside a card, table row, or list item.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiProgressBar label="Medium" value={60} size="md" />
      <RudiProgressBar label="Small" value={60} size="sm" />
    </RudiStack>
  ),
}

export const WithValueLabel: Story = {
  name: 'With value label',
  parameters: {
    docs: {
      description: {
        story:
          'Turn on `showValueLabel` when people need the exact percentage, such as an upload or quota. Leave it off when the bar only shows roughly how far along something is.',
      },
    },
  },
  args: {
    showValueLabel: true,
  },
}

export const CustomRange: Story = {
  name: 'Custom range',
  parameters: {
    docs: {
      description: {
        story:
          'Set `minValue` and `maxValue` when the bar tracks counts instead of percentages. The fill and the value label are computed as a percentage of that range.',
      },
    },
  },
  args: {
    minValue: 0,
    maxValue: 500,
    value: 250,
    label: 'Items processed',
    showValueLabel: true,
  },
}

export const StartAndFinish: Story = {
  name: 'Start and finish',
  parameters: {
    docs: {
      description: {
        story:
          'The bar renders an empty track at the minimum and a full one at the maximum. Pair the finished state with `variant="success"` and update the label so the change is clear.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      <RudiProgressBar label="Not started" value={0} showValueLabel />
      <RudiProgressBar label="Complete" value={100} variant="success" showValueLabel />
    </RudiStack>
  ),
}

export const Thresholds: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `thresholds` for a quota or capacity meter whose color should change as it fills, without you tracking the percentage yourself. The highest threshold the percentage reaches wins.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      {[45, 85, 100].map((value) => (
        <RudiProgressBar
          key={value}
          label={`Capacity ${value}%`}
          value={value}
          showValueLabel
          thresholds={[
            { at: 80, variant: 'warning' },
            { at: 100, variant: 'error' },
          ]}
        />
      ))}
    </RudiStack>
  ),
}
