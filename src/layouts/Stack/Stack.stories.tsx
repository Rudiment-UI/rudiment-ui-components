import type { Meta, StoryObj } from '@storybook/react'
import { RudiStack } from './Stack'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Stack',
  component: RudiStack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Arranges children in a vertical stack with consistent spacing between each item. Supports recursive spacing into nested elements and split positioning.',
      },
    },
  },
  args: {
    recursive: false,
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    recursive: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    space: spaceArgType,
    splitAfter: {
      control: 'number',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiStack>

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
          'Children stack vertically with the `group` step between them by default. Set `space` to change the gap.',
      },
    },
  },
  render: (args) => (
    <RudiStack {...args}>
      <Placeholder label="First child" />
      <Placeholder label="Second child" />
      <Placeholder label="Third child" />
    </RudiStack>
  ),
}

export const Spacing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pick the step that matches how related the items are: `inline` for tightly coupled items, `content` for fields and paragraphs, `section` for page sections. Each stack below carries its `space` value as a label.',
      },
    },
  },
  render: () => (
    <RudiStack space="section">
      {(['inline', 'content', 'section'] as const).map((space) => (
        <RudiStack key={space} space={space}>
          <Placeholder label={`space="${space}", first`} />
          <Placeholder label={`space="${space}", second`} />
          <Placeholder label={`space="${space}", third`} />
        </RudiStack>
      ))}
    </RudiStack>
  ),
}

export const PushItemsApart: Story = {
  name: 'Push items apart',
  parameters: {
    docs: {
      description: {
        story:
          'Set `splitAfter` to the 1-based index of the last item that should stay at the top. The following items move to the bottom of the stack. The stack needs a taller container to have room to push, here a fixed height.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="border border-dashed border-border-default" style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <RudiStack {...args} splitAfter={2} style={{ height: '100%' }}>
      <Placeholder label="Top item 1" />
      <Placeholder label="Top item 2" />
      <Placeholder label="Pushed to bottom" />
    </RudiStack>
  ),
}

export const SemanticList: Story = {
  name: 'Semantic list',
  parameters: {
    docs: {
      description: {
        story:
          'Render the stack as a `ul` or `ol` when the items are a list. Bullets and indent are removed, and `role="list"` keeps the list announced by VoiceOver, which drops list semantics when markers are hidden.',
      },
    },
  },
  render: () => (
    <RudiStack as="ul" space={3} role="list">
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </RudiStack>
  ),
}

export const Nesting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Nest stacks to give each level its own rhythm: a wide `section` gap between groups and a tight `content` gap inside each one. Each stack sets its own `space`, so the inner gaps do not follow the outer one. Set `recursive` instead to apply one gap through every nested element.',
      },
    },
  },
  render: () => (
    <RudiStack space="section">
      <RudiStack space="content">
        <Placeholder label="Group 1, item 1" />
        <Placeholder label="Group 1, item 2" />
        <Placeholder label="Group 1, item 3" />
      </RudiStack>
      <RudiStack space="content">
        <Placeholder label="Group 2, item 1" />
        <Placeholder label="Group 2, item 2" />
      </RudiStack>
    </RudiStack>
  ),
}

export const Responsive: Story = {
  parameters: {
    devicePreview: { height: 300 },
    docs: {
      description: {
        story:
          'Named steps re-resolve per breakpoint. `section` is 2rem on small screens and 3rem from the `md` breakpoint (48rem), while `content` stays 1rem, so the page gets airier on wider screens with no media queries. Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-theme-responsive-spacing--docs) for the full scale and how to override it.',
      },
    },
  },
  render: () => (
    <RudiStack space="section">
      <Placeholder label="First section" />
      <Placeholder label="Second section" />
      <Placeholder label="Third section" />
    </RudiStack>
  ),
}
