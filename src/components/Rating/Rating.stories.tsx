import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RudiRating } from './Rating'

const meta = {
  title: 'Components/Rating',
  component: RudiRating,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A star rating with half-star support. Read-only by default (exposed as an image); pass `onChange` for an interactive radiogroup.',
      },
    },
  },
  args: {
    value: 4.5,
    max: 5,
    size: 'md',
    showValue: false,
  },
  argTypes: {
    value: { control: { type: 'number', step: 0.5 }, table: { category: 'Content' } },
    max: { control: 'number', table: { category: 'Content' } },
    count: { control: 'number', table: { category: 'Content' } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    showValue: { control: 'boolean', table: { category: 'Content' } },
  },
} satisfies Meta<typeof RudiRating>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A read-only rating, exposed to assistive technology as a labeled image. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const ReadOnlyRating: Story = {
  name: 'Read-only rating',
  parameters: {
    docs: {
      description: {
        story:
          'Show the numeric score and review count next to the stars with `showValue` and `count`. Without `onChange` the rating is not clickable, so do not style it as if it were. Give it a `label` that says what is rated.',
      },
    },
  },
  args: { value: 4.8, showValue: true, count: 128, label: 'Customer rating' },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `sm` in dense lists and cards, `md` in most layouts and `lg` for a prominent summary. Keep `max` at 5 unless the domain needs finer granularity.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RudiRating value={3.5} size="sm" />
      <RudiRating value={3.5} size="md" />
      <RudiRating value={3.5} size="lg" />
    </div>
  ),
}

export const InteractiveRating: Story = {
  name: 'Interactive rating',
  parameters: {
    docs: {
      description: {
        story:
          'Pass `onChange` only when users should set the rating. It becomes a radio group with one tab stop, and the arrow keys change the value.',
      },
    },
  },
  render: () => {
    const [value, setValue] = useState(0)
    return <RudiRating value={value} onChange={setValue} label="Your rating" showValue />
  },
}
