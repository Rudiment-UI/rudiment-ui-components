import type { Meta, StoryObj } from '@storybook/react'
import { RudiSwitcher } from './Switcher'
import { spaceArgType } from '../../stories/spaceArgType'

const meta = {
  title: 'Layouts/Switcher',
  component: RudiSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A layout that shows its children in one row when its container is wider than a threshold and stacks them all in a single column when it is narrower. No media queries needed.',
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
    threshold: {
      control: 'text',
      table: { category: 'Layout' },
    },
    space: spaceArgType,
    limit: {
      control: 'number',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof RudiSwitcher>

export default meta
type Story = StoryObj<typeof meta>

function Placeholder({ label }: { label: string }) {
  return (
    <div className="border border-border-default rounded-md p-4 bg-surface-raised">
      {label}
    </div>
  )
}

const doc = (story: string) => ({ docs: { description: { story } } })

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="text-sm mb-2">{children}</p>
}

export const Default: Story = {
  parameters: doc(
    'Lay out two to four peers, such as form fields or pricing cards, that should sit side by side when there is room and stack when there is not. This switcher is driven by its args, so the controls in the API reference below change it.',
  ),
  render: (args) => (
    <RudiSwitcher {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiSwitcher>
  ),
}

export const ChangeTheThreshold: Story = {
  name: 'Change the threshold',
  parameters: doc(
    '`threshold` is compared with the width of the switcher itself, not the viewport. In the same 28rem container, a 20rem threshold keeps a row and a 40rem threshold stacks. Raise it for children that need more room, such as form fields.',
  ),
  render: (args) => (
    <div className="grid gap-6">
      {['20rem', '40rem'].map((threshold) => (
        <div key={threshold} className="max-w-md">
          <Caption>{`threshold: ${threshold}`}</Caption>
          <RudiSwitcher {...args} threshold={threshold}>
            <Placeholder label="First" />
            <Placeholder label="Second" />
            <Placeholder label="Third" />
          </RudiSwitcher>
        </div>
      ))}
    </div>
  ),
}

export const LimitTheColumns: Story = {
  name: 'Limit the columns',
  args: { threshold: '20rem' },
  parameters: doc(
    'Set `limit` to the most children you want sharing a row. With four children and a limit of 3, all four stack at any width, which avoids a cramped row or an orphan, whereas a limit of 4 keeps them in one row when there is room.',
  ),
  render: (args) => (
    <div className="grid gap-6">
      {[4, 3].map((limit) => (
        <div key={limit}>
          <Caption>{`limit: ${limit}, 4 children`}</Caption>
          <RudiSwitcher {...args} limit={limit}>
            <Placeholder label="First" />
            <Placeholder label="Second" />
            <Placeholder label="Third" />
            <Placeholder label="Fourth" />
          </RudiSwitcher>
        </div>
      ))}
    </div>
  ),
}

export const SpacingBetweenItems: Story = {
  name: 'Spacing between items',
  args: { threshold: '20rem' },
  parameters: doc(
    '`space` sets the gap in both the row and the stacked layout. Use `inline` for tight controls and `section` when each child is a large block.',
  ),
  render: (args) => (
    <div className="grid gap-6">
      {(['inline', 'section'] as const).map((space) => (
        <div key={space}>
          <Caption>{`space: ${space}`}</Caption>
          <RudiSwitcher {...args} space={space}>
            <Placeholder label="First" />
            <Placeholder label="Second" />
            <Placeholder label="Third" />
          </RudiSwitcher>
        </div>
      ))}
    </div>
  ),
}

export const Responsive: Story = {
  args: { threshold: '30rem', space: 'group' },
  parameters: {
    devicePreview: { height: 360 },
    ...doc(
      'The switcher flips from row to column when its own width drops below `threshold` (30rem here), so the same three children stack on a phone and sit in a row on a tablet. The gap is the `group` step. Pick a device above the example to see it change. See [Responsive Spacing](?path=/docs/getting-started-theme-responsive-spacing--docs).',
    ),
  },
  render: (args) => (
    <RudiSwitcher {...args}>
      <Placeholder label="First" />
      <Placeholder label="Second" />
      <Placeholder label="Third" />
    </RudiSwitcher>
  ),
}

export const LandmarkElements: Story = {
  name: 'Landmark elements',
  parameters: doc(
    'Render the switcher as a `section` or another element when the group has its own meaning in the page outline. Give it an accessible name when you do.',
  ),
  render: () => (
    <RudiSwitcher as="section" aria-label="Plans" threshold="30rem">
      <Placeholder label="First" />
      <Placeholder label="Second" />
    </RudiSwitcher>
  ),
}
