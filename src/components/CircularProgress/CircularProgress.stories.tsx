import type { Meta, StoryObj } from '@storybook/react'
import { RudiCircularProgress } from './CircularProgress'
import { RudiIcon } from '../Icon/Icon'
import { RudiCluster } from '@/layouts/Cluster/Cluster'

const meta = {
  title: 'Components/Feedback/CircularProgress',
  component: RudiCircularProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A radial progress indicator for goal and completion tracking. Built with React Aria for accessible progress reporting. Supports a center content slot for custom labels or icons.',
      },
    },
  },
  args: {
    value: 65,
    label: 'Progress',
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
      options: ['sm', 'md', 'lg'],
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
} satisfies Meta<typeof RudiCircularProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A ring at 65% with a visible label. `value` is required, and the ring is determinate only, so it suits goals and completion you can measure. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `variant` to show status, for example `error` when a metric falls below its target and `success` when a goal is met.',
      },
    },
  },
  render: () => (
    <RudiCluster space="section" align="flex-start">
      <RudiCircularProgress label="Default" value={65} variant="default" showValueLabel />
      <RudiCircularProgress label="Success" value={85} variant="success" showValueLabel />
      <RudiCircularProgress label="Warning" value={45} variant="warning" showValueLabel />
      <RudiCircularProgress label="Error" value={25} variant="error" showValueLabel />
    </RudiCluster>
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `lg` for a dashboard goal, `md` for a card, and `sm` beside text or in a dense list.',
      },
    },
  },
  render: () => (
    <RudiCluster space="section" align="flex-end">
      <RudiCircularProgress label="Small" value={60} size="sm" showValueLabel />
      <RudiCircularProgress label="Medium" value={60} size="md" showValueLabel />
      <RudiCircularProgress label="Large" value={60} size="lg" showValueLabel />
    </RudiCluster>
  ),
}

export const WithValueLabel: Story = {
  name: 'With value label',
  parameters: {
    docs: {
      description: {
        story:
          'Turn on `showValueLabel` to print the rounded percentage in the ring, which matters most on goal-tracking dashboards where people read the exact number.',
      },
    },
  },
  args: {
    showValueLabel: true,
  },
}

export const WithCenterContent: Story = {
  name: 'With center content',
  parameters: {
    docs: {
      description: {
        story:
          'Pass `children` to replace the percentage with an icon or custom text. Use either `children` or `showValueLabel`, not both: the children override the value label.',
      },
    },
  },
  args: {
    value: 100,
    variant: 'success',
  },
  render: (args) => (
    <RudiCircularProgress {...args}>
      <RudiIcon icon="lucide:check" size="md" />
    </RudiCircularProgress>
  ),
}

export const StartAndFinish: Story = {
  name: 'Start and finish',
  parameters: {
    docs: {
      description: {
        story:
          'The ring renders an empty track at the minimum and a full one at the maximum. Pair the finished state with `variant="success"` and update the label so the change is clear.',
      },
    },
  },
  render: () => (
    <RudiCluster space="section" align="flex-start">
      <RudiCircularProgress label="Not started" value={0} showValueLabel />
      <RudiCircularProgress label="Complete" value={100} variant="success" showValueLabel />
    </RudiCluster>
  ),
}
