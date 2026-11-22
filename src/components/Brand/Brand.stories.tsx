import type { Meta, StoryObj } from '@storybook/react'
import { RudiBrand } from './Brand'
import { RudiIcon } from '../Icon/Icon'
import { RudiStack } from '../../layouts/Stack/Stack'

const meta = {
  title: 'Components/Brand',
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
    hideName: false,
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

export const Default: Story = {}

export const AsHomeLink: Story = { args: { href: '/' } }

export const Sizes: Story = {
  render: (args) => (
    <RudiStack space="1rem">
      <RudiBrand {...args} size="sm" />
      <RudiBrand {...args} size="md" />
      <RudiBrand {...args} size="lg" />
    </RudiStack>
  ),
}
