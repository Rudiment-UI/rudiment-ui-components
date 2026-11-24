import type { Meta, StoryObj } from '@storybook/react'
import { RudiBrand } from './Brand'
import { RudiIcon } from '../Icon/Icon'
import { RudiStack } from '../../layouts/Stack/Stack'

const meta = {
  title: 'Components/App Layout/Brand',
  component: RudiBrand,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A logo lockup: a mark plus the product name, optionally linking home. The name is always the accessible name; use `hideName` when the mark already contains the wordmark.',
      },
    },
  },
  args: {
    name: 'Helexa',
    size: 'md',
    mark: <RudiIcon icon="lucide:dna" />,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    name: { control: 'text', table: { category: 'Content' } },
    mark: { control: false, table: { category: 'Content' } },
    hideName: { control: 'boolean', table: { category: 'Content' } },
    href: { control: 'text', table: { category: 'Content' } },
    className: { control: 'text', table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof RudiBrand>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A mark with the product name. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const AsHomeLink: Story = {
  name: 'As home link',
  parameters: {
    docs: {
      description: {
        story:
          'Pass `href` (usually `/`) in the app header so the logo links home. Do not put a visible text heading next to a brand that already shows the name.',
      },
    },
  },
  args: { href: '/' },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `sm` in dense or mobile headers, `md` in the standard app bar and `lg` on sign-in and marketing screens.',
      },
    },
  },
  render: (args) => (
    <RudiStack space="content">
      <RudiBrand {...args} size="sm" />
      <RudiBrand {...args} size="md" />
      <RudiBrand {...args} size="lg" />
    </RudiStack>
  ),
}
