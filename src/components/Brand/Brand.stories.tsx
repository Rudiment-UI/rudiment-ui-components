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
      description: 'Mark height and name size',
      table: { category: 'Appearance' },
    },
    name: { control: 'text', description: 'Product name; always the accessible name', table: { category: 'Content' } },
    mark: { control: false, description: 'Logo mark: an icon, svg or img (decorative)', table: { category: 'Content' } },
    hideName: { control: 'boolean', description: 'Visually hide the name when the mark is a full wordmark', table: { category: 'Content' } },
    href: { control: 'text', description: 'Makes the lockup a link', table: { category: 'Content' } },
    className: { control: 'text', description: 'Extra class names', table: { category: 'Appearance' } },
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
