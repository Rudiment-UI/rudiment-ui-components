import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsPage } from './SettingsPage'
import source from './SettingsPage.tsx?raw'
import { recipeParameters, withToastRegion } from './recipeStory'

const meta = {
  title: 'Patterns/Settings Page',
  component: SettingsPage,
  tags: ['autodocs'],
  decorators: [withToastRegion],
  parameters: recipeParameters(
    source,
    "A settings page under a `RudiPageHeader`, split into `RudiTabs`. Each tab uses the saving model that suits it: **Profile** is a `RudiForm` with an explicit save, and **Notifications** uses `RudiSwitch`es that apply immediately and confirm with a toast. Don't mix the two models in one group, or people won't know whether a change has been saved.",
  ),
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
