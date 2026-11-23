import type { Meta, StoryObj } from '@storybook/react'
import { RudiImage } from './Image'
import { RudiBadge } from '../Badge/Badge'

const PHOTO =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80'

const meta = {
  title: 'Components/Image',
  component: RudiImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A framed, aspect-ratio-aware image with object-fit control, radius presets, and an overlay slot for badges or scrims.',
      },
    },
  },
  args: {
    src: PHOTO,
    alt: 'A framed photograph',
    aspectRatio: '4 / 3',
    fit: 'cover',
    radius: 'md',
  },
  argTypes: {
    aspectRatio: { control: 'text', table: { category: 'Layout' } },
    fit: {
      control: 'inline-radio',
      options: ['cover', 'contain'],
      table: { category: 'Layout' },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      table: { category: 'Appearance' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RudiImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A framed 4:3 photograph. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const AspectRatios: Story = {
  name: 'Aspect ratios',
  parameters: {
    docs: {
      description: {
        story:
          'Set an `aspectRatio` to reserve space and prevent layout shift while the image loads. Use `cover` to fill the frame, and `contain` when cropping would hide important detail.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: 'none' }}>
      <RudiImage src={PHOTO} alt="Photograph, 1:1 crop" aspectRatio="1 / 1" />
      <RudiImage src={PHOTO} alt="Photograph, 16:9 crop" aspectRatio="16 / 9" />
      <RudiImage src={PHOTO} alt="Photograph, fully visible" aspectRatio="1 / 1" fit="contain" />
    </div>
  ),
}

export const Radius: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Match the radius to the surrounding components: `full` suits avatars, `none` suits edge-to-edge media.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
      {(['none', 'sm', 'md', 'lg', 'full'] as const).map((radius) => (
        <RudiImage key={radius} src={PHOTO} alt={`Photograph with ${radius} radius`} aspectRatio="1 / 1" radius={radius} />
      ))}
    </div>
  ),
}

export const WithOverlay: Story = {
  name: 'With an overlay',
  parameters: {
    docs: {
      description: {
        story:
          'Layer a badge or scrim over the image with `overlay`. Keep essential controls reachable by keyboard instead of placing them only in the overlay.',
      },
    },
  },
  args: {
    aspectRatio: '1 / 1',
    overlay: (
      <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
        <RudiBadge variant="error">Sale</RudiBadge>
      </div>
    ),
  },
}

export const FailedToLoad: Story = {
  name: 'Failed to load',
  parameters: {
    docs: {
      description: {
        story:
          'Images that may be missing, such as user uploads, show a placeholder that keeps the frame and the `alt` text as its accessible name. Pass `fallback` to replace it.',
      },
    },
  },
  args: {
    src: 'https://invalid.example/missing.jpg',
    alt: 'Profile photo unavailable',
  },
}
