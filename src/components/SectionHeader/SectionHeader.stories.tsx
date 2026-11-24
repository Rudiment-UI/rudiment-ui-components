import type { Meta, StoryObj } from '@storybook/react'
import { RudiSectionHeader } from './SectionHeader'
import { RudiButton } from '@/components/Button/Button'

const meta = {
  title: 'Components/SectionHeader',
  component: RudiSectionHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A section-level heading composite: a title with an optional description and a trailing action such as a "see all" link.',
      },
    },
  },
  args: {
    title: 'Recent activity',
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    headingLevel: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiSectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A section title. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const WithAction: Story = {
  name: 'With description and action',
  parameters: {
    docs: {
      description: {
        story:
          'Add a description and a trailing action such as a "See all" link to a dashboard region. The title renders an `h2` by default; set `headingLevel` so the page outline stays correct when the section is nested deeper.',
      },
    },
  },
  args: {
    description: 'Across all projects, last 30 days.',
    action: (
      <RudiButton variant="ghost" size="sm" iconAfter="lucide:arrow-right">
        See all
      </RudiButton>
    ),
  },
}
