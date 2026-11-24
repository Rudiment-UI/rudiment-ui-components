import type { Meta, StoryObj } from '@storybook/react'
import { RudiProse } from './Prose'

const meta = {
  title: 'Typography/Prose',
  component: RudiProse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A wrapper that styles plain HTML children (paragraphs, headings, lists, quotes, code, tables) with consistent typography and vertical rhythm. Use it for articles, help pages and CMS or Markdown output; compose `RudiHeading` and `RudiText` instead when you build interface copy piece by piece.',
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
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      table: { category: 'Appearance' },
    },
    className: {
      table: { category: 'Appearance' },
    },
  },
  args: {
    size: 'base',
  },
} satisfies Meta<typeof RudiProse>

export default meta
type Story = StoryObj<typeof RudiProse>

const SampleContent = () => (
  <>
    <h2>Section heading</h2>
    <p>
      Prose sets the spacing between its children, so plain elements read as a
      document without any classes.
    </p>
    <h3>Sub-section heading</h3>
    <p>
      Headings get more space above them than below, which ties each one to
      the content it introduces.
    </p>
  </>
)

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Wrap content you don\'t control element by element, such as rendered Markdown, in Prose. This block is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
  render: (args) => (
    <RudiProse {...args}>
      <h2>Getting started</h2>
      <p>
        Prose handles the vertical rhythm between its children, so you{' '}
        <strong>don't manage spacing by hand</strong>. Links such as{' '}
        <a href="#prose">this one</a> and <code>inline code</code> are styled
        too.
      </p>
      <h3>What it styles</h3>
      <ul>
        <li>Paragraphs, headings and lists</li>
        <li>
          Nested lists
          <ul>
            <li>with spacing at each level</li>
          </ul>
        </li>
        <li>Quotes, code blocks, tables and figures</li>
      </ul>
      <blockquote>
        <p>Good typography is invisible.</p>
      </blockquote>
      <pre>
        <code>{`import { RudiProse } from 'rudiment-ui'`}</code>
      </pre>
      <p>Code blocks get extra room above and below.</p>
    </RudiProse>
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size` scales the whole block, and every em-based gap scales with it. Use `sm` for side panels and help text, and `lg` for a focused reading view such as a blog post.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      {(['sm', 'base', 'lg'] as const).map((size) => (
        <RudiProse key={size} size={size}>
          <SampleContent />
        </RudiProse>
      ))}
    </div>
  ),
}

export const Tables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Plain tables inside Prose get a compact, bordered style for reference data in an article. For sortable or selectable data in an app, use `RudiTable`.',
      },
    },
  },
  render: () => (
    <RudiProse>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>Use for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>sm</td>
            <td>Side panels and help text</td>
          </tr>
          <tr>
            <td>base</td>
            <td>Most documentation</td>
          </tr>
          <tr>
            <td>lg</td>
            <td>Focused reading views</td>
          </tr>
        </tbody>
      </table>
    </RudiProse>
  ),
}

export const AsAnArticle: Story = {
  name: 'As an article',
  parameters: {
    docs: {
      description: {
        story:
          'Use `as="article"` for self-contained content such as a post, so the wrapper is also the landmark instead of an extra `div`.',
      },
    },
  },
  render: () => (
    <RudiProse as="article">
      <SampleContent />
    </RudiProse>
  ),
}
