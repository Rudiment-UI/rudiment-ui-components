import type { Meta, StoryObj } from '@storybook/react'
import { RudiLink } from './Link'
import { RudiCluster } from '@/layouts/Cluster/Cluster'

const meta = {
  title: 'Components/Navigation/Link',
  component: RudiLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A styled anchor for navigation, with variants, configurable underline behavior, and safe external-link handling. Use a button for actions that do not navigate.',
      },
    },
  },
  args: {
    href: '#',
    children: 'Learn more',
  },
  argTypes: {
    href: { control: 'text', table: { category: 'Content' } },
    children: { control: 'text', table: { category: 'Content' } },
    variant: {
      control: 'inline-radio',
      options: ['default', 'subtle', 'standalone'],
      table: { category: 'Appearance' },
    },
    underline: {
      control: 'inline-radio',
      options: ['always', 'hover', 'none'],
      table: { category: 'Appearance' },
    },
    external: { control: 'boolean', table: { category: 'State' } },
  },
} satisfies Meta<typeof RudiLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A default link that underlines on hover. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `default` in body copy, `subtle` for muted secondary links such as footer items, and `standalone` for a self-contained link such as "Learn more" that sits on its own line.',
      },
    },
  },
  render: () => (
    <RudiCluster space="group">
      <RudiLink href="#" variant="default">
        Getting started
      </RudiLink>
      <RudiLink href="#" variant="subtle">
        Terms of service
      </RudiLink>
      <RudiLink href="#" variant="standalone">
        Learn more
      </RudiLink>
    </RudiCluster>
  ),
}

export const InProse: Story = {
  name: 'In prose',
  parameters: {
    docs: {
      description: {
        story:
          'Links inside a sentence inherit the surrounding font size and weight. Write link text that makes sense out of context, so people scanning the page can tell where each link goes.',
      },
    },
  },
  render: () => (
    <p>
      Read the <RudiLink href="#">getting-started guide</RudiLink> or browse the{' '}
      <RudiLink href="https://example.com" external>
        API reference
      </RudiLink>
      .
    </p>
  ),
}

export const Underline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Keep the underline on inline links in body text, where it is the main sign that they are clickable. `hover` and `none` suit links in navigation or footers, where position already shows they are links.',
      },
    },
  },
  render: () => (
    <RudiCluster space="group">
      <RudiLink href="#" underline="always">
        Always
      </RudiLink>
      <RudiLink href="#" underline="hover">
        On hover
      </RudiLink>
      <RudiLink href="#" underline="none">
        None
      </RudiLink>
    </RudiCluster>
  ),
}

export const ExternalLinks: Story = {
  name: 'External links',
  parameters: {
    docs: {
      description: {
        story:
          'Set `external` for links that leave your site. The link opens in a new tab with a safe `rel` and shows an external-link icon automatically.',
      },
    },
  },
  args: { href: 'https://example.com', external: true, children: 'View the docs' },
}
