import type { Meta, StoryObj } from '@storybook/react'
import { RudiHeading } from './Heading'

const meta = {
  title: 'Typography/Heading',
  component: RudiHeading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A semantic heading, `h1` to `h6`, whose visual size is set separately from its level, so the document outline stays correct while the look follows the design. Use `RudiText` for body text.',
      },
    },
  },
  argTypes: {
    children: {
      table: { category: 'Content' },
    },
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
      table: { category: 'Appearance' },
    },
    size: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
      table: { category: 'Appearance' },
    },
    weight: {
      control: 'select',
      options: [undefined, 'regular', 'medium', 'semibold', 'bold'],
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: [
        undefined,
        'default',
        'subtle',
        'disabled',
        'brand',
        'inverted',
        'success',
        'warning',
        'error',
        'info',
      ],
      table: { category: 'Appearance' },
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 'justify'],
      table: { category: 'Appearance' },
    },
    noMargin: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    className: {
      table: { category: 'Appearance' },
    },
  },
  args: {
    level: 2,
    children: 'Section heading',
  },
} satisfies Meta<typeof RudiHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pick `level` from where the heading sits in the page outline. This heading is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
}

export const Levels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each level renders its own element and, by default, its own size. Keep levels in order without skipping, since screen reader users navigate by them.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <RudiHeading key={level} level={level}>
          Heading level {level}
        </RudiHeading>
      ))}
    </div>
  ),
}

export const SizeIndependentOfLevel: Story = {
  name: 'Size independent of level',
  parameters: {
    docs: {
      description: {
        story:
          'When the design calls for a smaller or larger heading than its level, set `size` instead of picking the wrong level. A card title can stay an `h3` and look like a size 5, and a page title can stay the `h1` while looking quieter.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <RudiHeading level={1} size={3}>
        An h1 at size 3
      </RudiHeading>
      <RudiHeading level={3} size={5}>
        An h3 at size 5
      </RudiHeading>
    </div>
  ),
}

export const Weights: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`weight` overrides the weight that comes with the size, for example a lighter display heading on a landing page.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
        <RudiHeading key={weight} level={3} weight={weight}>
          {weight} weight
        </RudiHeading>
      ))}
    </div>
  ),
}

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`tone` maps to semantic color tokens, so the color follows the theme. Use `inverted` only on an inverted surface, and don\'t rely on color alone to carry meaning.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['default', 'subtle', 'brand', 'success', 'warning', 'error', 'info'] as const).map(
        (tone) => (
          <RudiHeading key={tone} level={3} tone={tone}>
            {tone} tone
          </RudiHeading>
        ),
      )}
      <div style={{ background: 'var(--rudi-color-background-inverted)', padding: '1rem' }}>
        <RudiHeading level={3} tone="inverted">
          inverted tone
        </RudiHeading>
      </div>
    </div>
  ),
}

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`start` and `end` follow the writing direction, so they flip in right-to-left layouts. Center short headings only, such as an empty state or a hero.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['start', 'center', 'end'] as const).map((align) => (
        <RudiHeading key={align} level={3} align={align}>
          {align} aligned
        </RudiHeading>
      ))}
    </div>
  ),
}
