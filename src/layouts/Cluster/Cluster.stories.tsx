import type { Meta, StoryObj } from '@storybook/react'
import { RudiCluster } from './Cluster'
import { RudiStack } from '../Stack/Stack'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Cluster',
  component: RudiCluster,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A horizontal wrapping layout for inline elements like tags, buttons, or badges. Items flow naturally and wrap to the next line when space runs out.',
      },
    },
  },
  args: {
    space: 'inline',
    justify: 'flex-start',
    align: 'center',
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    space: spaceArgType,
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
      ],
      table: { category: 'Layout' },
    },
    align: {
      control: 'select',
      options: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiCluster>

export default meta
type Story = StoryObj<typeof meta>

function Tag({ label }: { label: string }) {
  return (
    <div className="border border-border-default rounded-md px-3 py-1 bg-surface-raised">
      {label}
    </div>
  )
}

const tags = ['Design', 'Development', 'Accessibility', 'Typography', 'Layout']

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Items sit in a row and wrap onto new lines when the container is too narrow. Use it for tags, button groups and breadcrumbs.',
      },
    },
  },
  render: (args) => (
    <RudiCluster {...args}>
      {tags.map((tag) => (
        <Tag key={tag} label={tag} />
      ))}
    </RudiCluster>
  ),
}

export const Spacing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One `space` value sets the gap between items and between wrapped rows. Use a small gap for dense tag lists and a larger one when each item is a heavier control. The label above each cluster names its value.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      {([1, 'inline', 8] as const).map((space) => (
        <RudiStack key={space} space="inline">
          <p>{`space={${typeof space === 'number' ? space : `"${space}"`}}`}</p>
          <RudiCluster space={space}>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </RudiCluster>
        </RudiStack>
      ))}
    </RudiStack>
  ),
}

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`justify` places items along each row: centre a row of tags, or use `space-between` to push a first and last item to opposite edges, as in a toolbar. The default is `flex-start`.',
      },
    },
  },
  render: () => (
    <RudiStack space="group">
      {(['center', 'space-between', 'flex-end'] as const).map((justify) => (
        <RudiStack key={justify} space="inline">
          <p>{`justify="${justify}"`}</p>
          <RudiCluster justify={justify}>
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </RudiCluster>
        </RudiStack>
      ))}
    </RudiStack>
  ),
}

export const SemanticList: Story = {
  name: 'Semantic list',
  parameters: {
    docs: {
      description: {
        story:
          'Render the cluster as a `ul` or `ol` when the items are a list. Bullets and indent are removed, and `role="list"` keeps the list announced by VoiceOver, which drops list semantics when markers are hidden.',
      },
    },
  },
  render: () => (
    <RudiCluster as="ul" space={3} role="list">
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
      <li>Fourth item</li>
    </RudiCluster>
  ),
}

export const Responsive: Story = {
  parameters: {
    devicePreview: { height: 240 },
    docs: {
      description: {
        story:
          'Named steps re-resolve per breakpoint. `section` is 2rem on small screens and 3rem from the `md` breakpoint (48rem), so this cluster spreads out on wider screens with no media queries. Most clusters want `inline` or `content`, which stay constant. Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-theme-responsive-spacing--docs) for the full scale and how to override it.',
      },
    },
  },
  render: (args) => (
    <RudiCluster {...args} space="section">
      {tags.map((tag) => (
        <Tag key={tag} label={tag} />
      ))}
    </RudiCluster>
  ),
}
