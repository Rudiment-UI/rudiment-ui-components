import type { Meta, StoryObj } from '@storybook/react'
import { RudiCircularProgress } from './CircularProgress'
import { RudiIcon } from '../Icon/Icon'

const meta = {
  title: 'Components/CircularProgress',
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
    className: '',
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

export const Default: Story = {}

export const WithValueLabel: Story = {
  args: {
    showValueLabel: true,
  },
}

export const WithCenterContent: Story = {
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

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <RudiCircularProgress label="Default" value={65} variant="default" showValueLabel />
      <RudiCircularProgress label="Success" value={85} variant="success" showValueLabel />
      <RudiCircularProgress label="Warning" value={45} variant="warning" showValueLabel />
      <RudiCircularProgress label="Error" value={25} variant="error" showValueLabel />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'end' }}>
      <RudiCircularProgress label="Small" value={60} size="sm" showValueLabel />
      <RudiCircularProgress label="Medium" value={60} size="md" showValueLabel />
      <RudiCircularProgress label="Large" value={60} size="lg" showValueLabel />
    </div>
  ),
}

export const ZeroProgress: Story = {
  args: {
    value: 0,
    label: 'Not started',
    showValueLabel: true,
  },
}

export const FullProgress: Story = {
  args: {
    value: 100,
    label: 'Complete',
    variant: 'success',
    showValueLabel: true,
  },
}
