import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { DataStates } from './DataStates'
import source from './DataStates.tsx?raw'
import { recipeParameters } from './recipeStory'

const meta = {
  title: 'Patterns/Data States',
  component: DataStates,
  tags: ['autodocs'],
  parameters: recipeParameters(
    source,
    "Every panel that loads data has four states: loading, error, empty and loaded. Design all four up front. The heading and frame stay put across states so the layout doesn't jump, the error offers a retry, and the empty state explains what will appear and how to get there. Switch `status` in the controls to compare them.",
  ),
  args: { status: 'ready', onRetry: fn(), onCreate: fn() },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error', 'ready'],
      table: { category: 'State' },
    },
    onRetry: { table: { category: 'Events' } },
    onCreate: { table: { category: 'Events' } },
  },
} satisfies Meta<typeof DataStates>

export default meta
type Story = StoryObj<typeof meta>

export const Loaded: Story = {}
export const Loading: Story = { args: { status: 'loading' } }
export const Empty: Story = { args: { status: 'empty' } }
export const Error: Story = { args: { status: 'error' } }
