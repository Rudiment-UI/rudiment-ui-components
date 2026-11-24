import type { Meta, StoryObj } from '@storybook/react'
import { RudiCard } from './Card'
import { RudiButton } from '../Button/Button'
import { RudiGrid } from '../../layouts/Grid/Grid'

const meta = {
  title: 'Components/Elements/Card',
  component: RudiCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A container component with optional Header, Body, and Footer slots. Supports outlined and elevated styles.',
      },
    },
  },
  args: {
    variant: 'outlined',
    padding: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
      table: { category: 'Appearance' },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof RudiCard>

export default meta
type Story = StoryObj<typeof RudiCard>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Wrap related content in a card to group it on the page. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
  render: (args) => (
    <RudiCard {...args}>
      <RudiCard.Body>
        <p>This is a basic card with body content.</p>
      </RudiCard.Body>
    </RudiCard>
  ),
}

export const WithHeaderAndFooter: Story = {
  name: 'With header and footer',
  parameters: {
    docs: {
      description: {
        story:
          'Use `Card.Header` and `Card.Footer` to separate a title and actions from the body. Each part inherits the padding set on the card.',
      },
    },
  },
  render: (args) => (
    <RudiCard {...args}>
      <RudiCard.Header>
        <h3>Card title</h3>
      </RudiCard.Header>
      <RudiCard.Body>
        <p>The header, body and footer share the padding of the card.</p>
      </RudiCard.Body>
      <RudiCard.Footer>
        <RudiButton variant="secondary">Action</RudiButton>
      </RudiCard.Footer>
    </RudiCard>
  ),
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `outlined` as the default for most content containers. Reserve `elevated` for the one card that needs emphasis, since elevating every card in a dense layout flattens the hierarchy. Do not nest cards inside cards; it adds visual noise and a confusing depth hierarchy.',
      },
    },
  },
  render: (args) => (
    <RudiGrid minCellWidth="12rem" space="content">
      {(['default', 'outlined', 'elevated'] as const).map((variant) => (
        <RudiCard key={variant} {...args} variant={variant}>
          <RudiCard.Header>
            <h3>{variant}</h3>
          </RudiCard.Header>
          <RudiCard.Body>
            <p>
              {variant === 'default'
                ? 'Background only.'
                : variant === 'outlined'
                  ? 'With a border.'
                  : 'With a shadow.'}
            </p>
          </RudiCard.Body>
        </RudiCard>
      ))}
    </RudiGrid>
  ),
}

export const Padding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `padding="none"` for full-bleed content such as images or tables, and add your own spacing inside. The other steps scale the space around the content.',
      },
    },
  },
  render: (args) => (
    <RudiGrid minCellWidth="12rem" space="content">
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <RudiCard key={padding} {...args} padding={padding}>
          <RudiCard.Body>
            <p>padding="{padding}"</p>
          </RudiCard.Body>
        </RudiCard>
      ))}
    </RudiGrid>
  ),
}
