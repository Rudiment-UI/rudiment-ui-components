import type { Meta, StoryObj } from '@storybook/react'
import { RudiSparkline } from './Sparkline'

const data = [4.2, 4.6, 5.1, 4.8, 5.9, 6.4, 6.1, 7.2, 6.8, 7.5]

const meta = {
  title: 'Components/Charts/Sparkline',
  component: RudiSparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small inline trend line drawn in SVG, for table rows and stat tiles. It has no axes or tooltip, so give it a descriptive `label`.',
      },
    },
  },
  args: { data, label: 'Temperature over the last 10 readings', tone: 'neutral' },
  argTypes: {
    data: { control: 'object', table: { category: 'Content' } },
    label: { control: 'text', table: { category: 'Content' } },
    width: { control: 'number', table: { category: 'Layout' } },
    height: { control: 'number', table: { category: 'Layout' } },
    threshold: { control: 'number', table: { category: 'Content' } },
    tone: { control: 'select', options: ['neutral', 'brand', 'error', 'success'], table: { category: 'Appearance' } },
    showEndpoint: { control: 'boolean', table: { category: 'Appearance' } },
    className: { control: 'text', table: { category: 'Appearance' } },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '16rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RudiSparkline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithThreshold: Story = { args: { threshold: 6, tone: 'error', showEndpoint: true } }

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {(['neutral', 'brand', 'error', 'success'] as const).map((tone) => (
        <RudiSparkline key={tone} data={data} tone={tone} label={`${tone} trend`} showEndpoint />
      ))}
    </div>
  ),
}

export const FixedSize: Story = { args: { width: 96, height: 24, showEndpoint: true } }

export const SinglePoint: Story = { args: { data: [5] } }

export const Empty: Story = { args: { data: [] } }
