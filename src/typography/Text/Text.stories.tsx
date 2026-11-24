import type { Meta, StoryObj } from '@storybook/react'
import { RudiText } from './Text'

const meta = {
  title: 'Typography/Text',
  component: RudiText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Body-level text in five variants: body, small body, caption, overline and inline code. It renders a `p` by default, and `as` swaps in any other element. Use `RudiHeading` for headings and `RudiProse` for long-form content.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      table: { category: 'Content' },
    },
    children: {
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['body', 'body-sm', 'caption', 'overline', 'code'],
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
    variant: 'body',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
} satisfies Meta<typeof RudiText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `body` variant for paragraphs of interface copy. This text is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pick the variant from the text\'s role, not its size: `body-sm` for supporting copy, `caption` for metadata such as dates, `overline` for a short uppercase label above a heading, and `code` for values a user might type or copy.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <RudiText variant="body">body: The quick brown fox jumps over the lazy dog.</RudiText>
      <RudiText variant="body-sm">body-sm: The quick brown fox jumps over the lazy dog.</RudiText>
      <RudiText variant="caption">caption: Last updated March 2026</RudiText>
      <RudiText variant="overline">overline: Section label</RudiText>
      <RudiText variant="code">npm install rudiment-ui</RudiText>
    </div>
  ),
}

export const InlineText: Story = {
  name: 'Inline text',
  parameters: {
    docs: {
      description: {
        story:
          'Inside a sentence, render a `span` with `as="span"`. The default `p` can\'t be nested in another paragraph.',
      },
    },
  },
  render: () => (
    <RudiText>
      Run{' '}
      <RudiText as="span" variant="code">
        npm run dev
      </RudiText>{' '}
      to start Storybook.
    </RudiText>
  ),
}

export const OtherElements: Story = {
  name: 'Other elements',
  parameters: {
    docs: {
      description: {
        story:
          'Give `as` the element the content needs, such as `label`, `strong` or `time`. Attributes for that element, like `htmlFor` or `dateTime`, type-check and pass through.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <RudiText as="label" variant="overline" htmlFor="text-story-email">
        Email
      </RudiText>
      <input id="text-story-email" type="email" className="border border-border-default rounded-md p-2" />
      <RudiText as="time" variant="caption" tone="subtle" dateTime="2026-03-14">
        March 14, 2026
      </RudiText>
    </div>
  ),
}

export const Weights: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`weight` overrides the variant\'s default weight. For emphasis inside a sentence, prefer `as="strong"` so the stress is in the markup too.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
        <RudiText key={weight} weight={weight}>
          {weight}: The quick brown fox.
        </RudiText>
      ))}
    </div>
  ),
}

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`tone` maps to semantic color tokens, so the color follows the theme. Use `subtle` for secondary text and the feedback tones for status messages, and say the status in words too rather than relying on color. `disabled` text is low contrast by design, so keep it for content that is unavailable.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <RudiText tone="default">default: primary body color</RudiText>
      <RudiText tone="subtle">subtle: secondary, supporting text</RudiText>
      <RudiText tone="disabled">disabled: unavailable content</RudiText>
      <RudiText tone="brand">brand: brand accent</RudiText>
      <RudiText tone="success">success: Changes saved</RudiText>
      <RudiText tone="warning">warning: Your trial ends in 3 days</RudiText>
      <RudiText tone="error">error: Payment failed</RudiText>
      <RudiText tone="info">info: A new version is available</RudiText>
      <div style={{ background: 'var(--rudi-color-background-inverted)', padding: '1rem' }}>
        <RudiText tone="inverted">inverted: on an inverted surface</RudiText>
      </div>
    </div>
  ),
}

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`start` and `end` follow the writing direction, so they flip in right-to-left layouts. Keep body text start-aligned; centered and justified paragraphs are harder to read.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {(['start', 'center', 'end'] as const).map((align) => (
        <RudiText key={align} align={align}>
          {align} aligned
        </RudiText>
      ))}
    </div>
  ),
}
