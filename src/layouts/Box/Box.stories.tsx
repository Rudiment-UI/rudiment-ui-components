import type { Meta, StoryObj } from '@storybook/react'
import { RudiBox } from './Box'
import { RudiStack } from '../Stack/Stack'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Box',
  component: RudiBox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A foundational container that applies consistent padding, optional borders, and color inversion. The basic building block for composing layouts.',
      },
    },
  },
  args: {
    bordered: false,
    invert: false,
    padding: 'content',
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    bordered: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    invert: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    padding: spaceArgType,
  },
} satisfies Meta<typeof RudiBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A plain container that pads its content. With no `padding`, it uses the `content` step of the spacing scale.',
      },
    },
  },
  render: (args) => <RudiBox {...args}>Box content</RudiBox>,
}

export const Surfaces: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `bordered` to set a panel apart on the page, and `invert` for a callout that should stand out. The two combine, and `invert` follows the active theme, so a dark panel on a light theme becomes a light one on a dark theme.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiBox bordered>Bordered</RudiBox>
      <RudiBox invert>Inverted</RudiBox>
      <RudiBox bordered invert>
        Bordered and inverted
      </RudiBox>
    </RudiStack>
  ),
}

export const Padding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Match the padding to the box\'s role: `content` for a compact callout, `group` for a panel, `section` for a feature block. A number picks a fixed step that does not change at breakpoints.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiBox bordered padding="content">
        padding=&quot;content&quot;
      </RudiBox>
      <RudiBox bordered padding="group">
        padding=&quot;group&quot;
      </RudiBox>
      <RudiBox bordered padding="section">
        padding=&quot;section&quot;
      </RudiBox>
      <RudiBox bordered padding={8}>
        padding={'{8}'} (fixed step)
      </RudiBox>
    </RudiStack>
  ),
}

export const Sticky: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `sticky` to keep a box in view while its scroll container scrolls, such as a summary beside a long form. Pass a string like `"1rem"` to leave a gap above it. Sticky positioning needs a scrollable ancestor, which is the bordered area here.',
      },
    },
  },
  render: () => (
    <div
      className="h-48 overflow-auto border border-border-default"
      role="region"
      aria-label="Scrollable example"
      tabIndex={0}
    >
      <RudiBox sticky="0.5rem" bordered invert>
        Stays at the top while you scroll
      </RudiBox>
      <RudiBox>
        <p>Scroll this area to see the sticky box hold its place.</p>
        <div style={{ height: '24rem' }} />
        <p>End of content.</p>
      </RudiBox>
    </div>
  ),
}

export const Semantic: Story = {
  name: 'Semantic element',
  parameters: {
    docs: {
      description: {
        story:
          'Use `as` to render the element that matches the content, such as a `section` or `article`, instead of a bare `div`. A `section` needs an accessible name, like the `aria-label` here, to count as a landmark.',
      },
    },
  },
  render: () => (
    <RudiBox as="section" aria-label="Order summary" bordered padding="group">
      Rendered as a <code>&lt;section&gt;</code> element
    </RudiBox>
  ),
}

export const Responsive: Story = {
  parameters: {
    devicePreview: { height: 200 },
    docs: {
      description: {
        story:
          'Named steps change with the screen. `gutter` is 1rem on small screens, 1.5rem from the `md` breakpoint (48rem) and 2rem from `lg` (64rem), so a page-edge box needs no media queries. Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-responsive-spacing--docs) for the full scale and how to override it.',
      },
    },
  },
  render: () => (
    <RudiBox bordered padding="gutter">
      Page-edge content
    </RudiBox>
  ),
}
