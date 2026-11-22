import type { Meta, StoryObj } from '@storybook/react'
import { RudiText } from './Text'

const meta = {
  title: 'Typography/Text',
  component: RudiText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A versatile text element with five typographic styles: body, small body, caption, overline, and inline code. Supports rendering as any HTML element.',
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
    variant: {
      control: 'select',
      options: ['body', 'body-sm', 'caption', 'overline', 'code'],
      table: { category: 'Appearance' },
    },
    weight: {
      control: 'select',
      options: [undefined, 'regular', 'medium', 'semibold', 'bold'],
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: [
        undefined,
        'default',
        'subtle',
        'disabled',
        'brand',
        'inverted',
        'success',
        'warning',
        'error',
        'info',
      ],
      table: { category: 'Appearance' },
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 'justify'],
      table: { category: 'Appearance' },
    },
    noMargin: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    className: {
      table: { category: 'Appearance' },
    },
  },
  args: {
    variant: 'body',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
} satisfies Meta<typeof RudiText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RudiText variant="body">body — The quick brown fox jumps over the lazy dog.</RudiText>
      <RudiText variant="body-sm">body-sm — The quick brown fox jumps over the lazy dog.</RudiText>
      <RudiText variant="caption">caption — Supporting detail or image description.</RudiText>
      <RudiText variant="overline">overline — Section label</RudiText>
      <RudiText variant="code">code — const x = 42</RudiText>
    </div>
  ),
}

export const AsSpan: Story = {
  render: () => (
    <p>
      This is a paragraph with a{' '}
      <RudiText as="span" variant="code">
        code
      </RudiText>{' '}
      snippet inline.
    </p>
  ),
}

export const AsLabel: Story = {
  render: () => (
    <RudiText as="label" variant="overline" htmlFor="example-input">
      Field label
    </RudiText>
  ),
}

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RudiText weight="regular">regular — The quick brown fox.</RudiText>
      <RudiText weight="medium">medium — The quick brown fox.</RudiText>
      <RudiText weight="semibold">semibold — The quick brown fox.</RudiText>
      <RudiText weight="bold">bold — The quick brown fox.</RudiText>
    </div>
  ),
}

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RudiText tone="default">default — primary body color</RudiText>
      <RudiText tone="subtle">subtle — secondary / supporting text</RudiText>
      <RudiText tone="disabled">disabled — de-emphasized text</RudiText>
      <RudiText tone="brand">brand — brand accent</RudiText>
      <RudiText tone="success">success — positive feedback</RudiText>
      <RudiText tone="warning">warning — cautionary feedback</RudiText>
      <RudiText tone="error">error — destructive feedback</RudiText>
      <RudiText tone="info">info — informational feedback</RudiText>
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RudiText align="start">start — aligned to the start edge</RudiText>
      <RudiText align="center">center — aligned to the center</RudiText>
      <RudiText align="end">end — aligned to the end edge</RudiText>
    </div>
  ),
}

export const CustomClassName: Story = {
  args: { variant: 'body', className: 'italic', children: 'Custom class applied' },
}
