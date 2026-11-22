import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConfirmDialog } from './ConfirmDialog'
import source from './ConfirmDialog.tsx?raw'
import { recipeParameters, withToastRegion } from './recipeStory'

const meta = {
  title: 'Patterns/Confirm Dialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  decorators: [withToastRegion],
  parameters: recipeParameters(
    source,
    'Confirming a destructive action with `RudiDialog`. The title asks about the specific item, the body says what else is lost, and the destructive button repeats the action ("Delete shipment", never "OK"). While the request runs, the dialog can\'t be dismissed and the button shows a spinner. Because the deleted row\'s button no longer exists, focus moves to the list heading afterwards. Use a dialog only when the action can\'t be undone; for reversible actions, act straight away and let people undo.',
  ),
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
