import type { Meta, StoryObj } from '@storybook/react'
import { RudiCenter } from './Center'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Center',
  component: RudiCenter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Horizontally centers content with a configurable maximum width. Add gutters for edge padding or use intrinsic mode to let children size to their own content.',
      },
    },
  },
  args: {
    intrinsic: false,
    maxWidth: '60rem',
    gutters: 'gutter',
    as: 'div',
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    intrinsic: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    maxWidth: {
      control: 'text',
      table: { category: 'Layout' },
    },
    gutters: spaceArgType,
  },
} satisfies Meta<typeof RudiCenter>

export default meta
type Story = StoryObj<typeof meta>

function Placeholder({ label }: { label: string }) {
  return (
    <div className="border border-border-default rounded-md p-4 bg-surface-raised">
      {label}
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Wrap a page or article in a column that stays centered and never grows past a maximum width. This wrapper is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
  render: (args) => (
    <RudiCenter {...args}>
      <Placeholder label="Centered content" />
    </RudiCenter>
  ),
}

export const CenteredText: Story = {
  name: 'Centered text',
  parameters: {
    docs: {
      description: {
        story:
          'Cap `maxWidth` near 40 to 45rem for reading text, since long lines are hard to follow. Wider caps suit dashboards and page-width wrappers.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {['30rem', '90rem'].map((width) => (
        <RudiCenter key={width} maxWidth={width}>
          <Placeholder label={`maxWidth="${width}"`} />
        </RudiCenter>
      ))}
    </div>
  ),
}

export const EdgeGutters: Story = {
  name: 'Edge gutters',
  parameters: {
    docs: {
      description: {
        story:
          '`gutters` is padding that keeps content off the viewport edge when the screen is narrower than `maxWidth`. It is added to the maximum width, because the box uses `content-box` sizing.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {([2, 12] as const).map((gutters) => (
        <RudiCenter key={gutters} maxWidth="30rem" gutters={gutters}>
          <Placeholder label={`gutters={${gutters}}`} />
        </RudiCenter>
      ))}
    </div>
  ),
}

export const CenteredChildren: Story = {
  name: 'Centered children',
  parameters: {
    docs: {
      description: {
        story:
          'Set `intrinsic` for hero copy or a call to action, where each child should be centered at its own content width instead of stretching to the column.',
      },
    },
  },
  args: { intrinsic: true },
  render: (args) => (
    <RudiCenter {...args}>
      <Placeholder label="Short label" />
      <Placeholder label="A slightly longer label" />
      <Placeholder label="Short" />
    </RudiCenter>
  ),
}

export const AsASection: Story = {
  name: 'As a section',
  parameters: {
    docs: {
      description: {
        story:
          'Use `as` to give the wrapper the right landmark or element, such as `section`, `main` or `article`, instead of nesting an extra element.',
      },
    },
  },
  render: () => (
    <RudiCenter as="section" maxWidth="40rem" aria-label="Introduction">
      <Placeholder label="Inside a section element" />
    </RudiCenter>
  ),
}

export const Responsive: Story = {
  parameters: {
    devicePreview: { height: 200 },
    docs: {
      description: {
        story:
          'The column shrinks with the screen once it is narrower than `maxWidth`, and the default `gutters` is the `gutter` step: 1rem on small screens, 1.5rem from `md` (48rem) and 2rem from `lg` (64rem). Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-responsive-spacing--docs).',
      },
    },
  },
  render: () => (
    <RudiCenter maxWidth="40rem" gutters="gutter">
      <Placeholder label="Gutters keep the content off the screen edge" />
    </RudiCenter>
  ),
}
