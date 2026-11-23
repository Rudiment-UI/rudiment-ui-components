import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiStepper } from './Stepper'
import type { RudiStepStatus } from './Stepper'
import { RudiButton } from '@/components/Button/Button'
import { RudiCluster } from '@/layouts/Cluster/Cluster'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Stepper',
  component: RudiStepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A discrete step indicator for progress through an ordered sequence, such as checkout or delivery. It is display only: set each step\'s `status` from your own state.',
      },
    },
  },
  args: {
    steps: [
      { label: 'Ordered', icon: 'lucide:package', status: 'complete' },
      { label: 'Packed', icon: 'lucide:box', status: 'complete' },
      { label: 'Shipped', icon: 'lucide:truck', status: 'current' },
      { label: 'Delivered', icon: 'lucide:home', status: 'upcoming' },
    ],
  },
  argTypes: {
    steps: {
      control: 'object',
      table: { category: 'Content' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { category: 'Layout' },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A horizontal track with two steps complete, one current, and one upcoming. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Orientation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `horizontal` for a progress track in a wide header. Use `vertical` for a timeline in a narrow column, where each step can carry a `description` beneath its label.',
      },
    },
  },
  render: () => (
    <RudiStack space="section">
      <RudiStepper
        orientation="horizontal"
        steps={[
          { label: 'Ordered', icon: 'lucide:package', status: 'complete' },
          { label: 'Shipped', icon: 'lucide:truck', status: 'current' },
          { label: 'Delivered', icon: 'lucide:home', status: 'upcoming' },
        ]}
      />
      <RudiStepper
        orientation="vertical"
        steps={[
          {
            label: 'Order placed',
            description: 'We received your order.',
            icon: 'lucide:package',
            status: 'complete',
          },
          {
            label: 'In transit',
            description: 'Your package is on the way.',
            icon: 'lucide:truck',
            status: 'current',
          },
          {
            label: 'Out for delivery',
            description: 'Arriving today.',
            icon: 'lucide:map-pin',
            status: 'upcoming',
          },
        ]}
      />
    </RudiStack>
  ),
}

export const NumberedSteps: Story = {
  name: 'Numbered steps',
  parameters: {
    docs: {
      description: {
        story:
          'Without an `icon`, a step shows its number, and a completed step shows a check. Use numbers for forms and checkout, where people think in "step 2 of 4".',
      },
    },
  },
  render: () => (
    <RudiStepper
      steps={[
        { label: 'Cart', status: 'complete' },
        { label: 'Shipping', status: 'current' },
        { label: 'Payment', status: 'upcoming' },
        { label: 'Review', status: 'upcoming' },
      ]}
    />
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`md` suits a page header. Use `sm` where space is tight, such as inside a card or a dialog.',
      },
    },
  },
  render: () => (
    <RudiStack space="section">
      <RudiStepper
        size="sm"
        steps={[
          { label: 'Cart', status: 'complete' },
          { label: 'Shipping', status: 'current' },
          { label: 'Payment' },
        ]}
      />
      <RudiStepper
        size="md"
        steps={[
          { label: 'Cart', status: 'complete' },
          { label: 'Shipping', status: 'current' },
          { label: 'Payment' },
        ]}
      />
    </RudiStack>
  ),
}

const checkoutLabels = ['Cart', 'Shipping', 'Payment', 'Review']

function CheckoutProgress() {
  const [current, setCurrent] = useState(1)
  const steps = checkoutLabels.map((label, i) => ({
    label,
    status: (i < current ? 'complete' : i === current ? 'current' : 'upcoming') as RudiStepStatus,
  }))
  return (
    <RudiStack space="content">
      <RudiStepper steps={steps} />
      <RudiCluster space="inline">
        <RudiButton
          variant="secondary"
          isDisabled={current === 0}
          onPress={() => setCurrent(current - 1)}
        >
          Back
        </RudiButton>
        <RudiButton
          isDisabled={current === checkoutLabels.length - 1}
          onPress={() => setCurrent(current + 1)}
        >
          Next
        </RudiButton>
      </RudiCluster>
    </RudiStack>
  )
}

export const ProgressThroughSteps: Story = {
  name: 'Progress through steps',
  parameters: {
    docs: {
      description: {
        story:
          'The stepper holds no state and does not navigate. Keep the current index in your own state, derive each step\'s `status` from it, and mark only one step `current` so the position is unambiguous. Press Back and Next to try it.',
      },
      source: {
        code: `function CheckoutProgress() {
  const [current, setCurrent] = useState(1)

  const steps = ['Cart', 'Shipping', 'Payment', 'Review'].map((label, i) => ({
    label,
    status: i < current ? 'complete' : i === current ? 'current' : 'upcoming',
  }))

  return (
    <>
      <RudiStepper steps={steps} />
      <RudiButton onPress={() => setCurrent(current + 1)}>Next</RudiButton>
    </>
  )
}`,
      },
    },
  },
  render: () => <CheckoutProgress />,
}
