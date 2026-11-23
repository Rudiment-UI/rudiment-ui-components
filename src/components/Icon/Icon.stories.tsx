import type { Meta, StoryObj } from '@storybook/react'
import { RudiIcon } from './Icon'

const meta = {
  title: 'Components/Icon',
  component: RudiIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A wrapper component for rendering icons with consistent sizing and color via Iconify.',
      },
    },
  },
  args: {
    icon: 'lucide:home',
    size: 'md',
    label: 'Icon label',
  },
  argTypes: {
    icon: {
      control: 'text',
      table: { category: 'Content' },
    },
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    color: {
      control: 'color',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A single icon with an accessible label. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `sm`, `md` and `lg` to match the surrounding text, or pass a number for a custom pixel size. Pick the size from the context instead of scaling with CSS.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <RudiIcon icon="lucide:home" size="sm" label="Small" />
      <RudiIcon icon="lucide:home" size="md" label="Medium" />
      <RudiIcon icon="lucide:home" size="lg" label="Large" />
      <RudiIcon icon="lucide:home" size={32} label="Custom 32px" />
    </div>
  ),
}

export const DecorativeVsMeaningful: Story = {
  name: 'Decorative or meaningful',
  parameters: {
    docs: {
      description: {
        story:
          'Provide a `label` when the icon conveys meaning that the surrounding text does not, such as an icon-only status. Omit `label` when the icon sits next to visible text, which hides it from screen readers. Avoid icon-only controls for critical actions unless the meaning is universally understood.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <RudiIcon icon="lucide:check-circle" label="Saved" />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <RudiIcon icon="lucide:star" />
        Favorites
      </span>
    </div>
  ),
}

export const Color: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Icons inherit the text color through `currentColor`, so they stay in sync with their parent. Set `color` only when the icon needs a color of its own.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <span style={{ color: 'var(--rudi-color-text-secondary)' }}>
        <RudiIcon icon="lucide:home" label="Inherited color" />
      </span>
      <RudiIcon icon="lucide:home" color="red" label="Custom color" />
    </div>
  ),
}
