import type { Meta, StoryObj } from '@storybook/react'
import { RudiCover } from './Cover'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Cover',
  component: RudiCover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A vertical layout that fills a minimum height, pins an optional first and last child to the top and bottom, and centers its principal child in between. Ideal for hero sections and full-page layouts.',
      },
    },
  },
  args: {
    minHeight: '25rem',
    space: 8,
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
    minHeight: {
      control: 'text',
      table: { category: 'Layout' },
    },
    space: spaceArgType,
  },
} satisfies Meta<typeof RudiCover>

export default meta
type Story = StoryObj<typeof meta>

function Placeholder({
  label,
  centered,
}: {
  label: string
  centered?: boolean
}) {
  const Element = centered ? RudiCover.Centered : 'div'
  return (
    <Element
      className={
        centered
          ? 'border border-border-default rounded-md p-8 bg-surface-raised text-center'
          : 'border border-border-default rounded-md p-4 bg-surface-raised'
      }
    >
      {label}
    </Element>
  )
}

const doc = (story: string) => ({ docs: { description: { story } } })

export const Default: Story = {
  parameters: doc(
    'Pin a header and footer to the edges of a tall region and center the main content between them. This cover is driven by its args, so the controls in the API reference below change it. Leave `minHeight` unset to fill the viewport (`100vh`).',
  ),
  render: (args) => (
    <RudiCover {...args}>
      <Placeholder label="Header" />
      <Placeholder label="Centered content" centered />
      <Placeholder label="Footer" />
    </RudiCover>
  ),
}

export const OptionalParts: Story = {
  name: 'Optional header and footer',
  parameters: doc(
    'Only `RudiCover.Centered` is required. Drop the footer for a hero with a top bar, or both edges for a sign-in page where the content just sits in the middle.',
  ),
  render: (args) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <RudiCover {...args}>
        <Placeholder label="Header" />
        <Placeholder label="Centered content" centered />
      </RudiCover>
      <RudiCover {...args}>
        <Placeholder label="Centered content" centered />
      </RudiCover>
    </div>
  ),
}

export const SpacingBetweenChildren: Story = {
  name: 'Spacing between children',
  args: { minHeight: '12rem' },
  parameters: doc(
    '`space` is the minimum gap between children, so the centered child keeps at least that much room from the header and footer even when the cover is short. When the cover is taller, the extra room goes around the centered child.',
  ),
  render: (args) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {(['inline', 'section'] as const).map((space) => (
        <RudiCover key={space} {...args} space={space}>
          <Placeholder label={`Header (space: ${space})`} />
          <Placeholder label="Centered content" centered />
          <Placeholder label="Footer" />
        </RudiCover>
      ))}
    </div>
  ),
}

export const Responsive: Story = {
  args: { minHeight: '16rem', space: 'section' },
  parameters: {
    devicePreview: { height: 420 },
    ...doc(
      'Name a step of the spacing scale instead of a length and the gaps follow your breakpoint rules: with the default theme, `section` is 2rem on small screens and 3rem from `md` (48rem) up. Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-theme-responsive-spacing--docs) for the steps and how to set your own values. The cover itself needs no breakpoint props.',
    ),
  },
  render: (args) => (
    <RudiCover {...args}>
      <Placeholder label="Header" />
      <Placeholder label="Centered content" centered />
      <Placeholder label="Footer" />
    </RudiCover>
  ),
}

export const LandmarkElements: Story = {
  name: 'Landmark elements',
  args: { minHeight: '16rem' },
  parameters: doc(
    'Render the cover as a `section` and use `header`, `main` and `footer` children so assistive technology gets landmarks. A child that is not `RudiCover.Centered` can take the `rudi-cover__centered` class to be centered the same way.',
  ),
  render: (args) => (
    <RudiCover {...args} as="section" aria-label="Welcome">
      <header className="border border-border-default rounded-md p-4 bg-surface-raised">
        Header
      </header>
      <main className="rudi-cover__centered border border-border-default rounded-md p-8 bg-surface-raised text-center">
        Main content
      </main>
      <footer className="border border-border-default rounded-md p-4 bg-surface-raised">
        Footer
      </footer>
    </RudiCover>
  ),
}
