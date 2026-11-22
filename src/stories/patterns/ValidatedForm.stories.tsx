import type { Meta, StoryObj } from '@storybook/react-vite'
import { ValidatedForm } from './ValidatedForm'
import source from './ValidatedForm.tsx?raw'
import { recipeParameters, withToastRegion } from './recipeStory'

const meta = {
  title: 'Patterns/Validated Form',
  component: ValidatedForm,
  tags: ['autodocs'],
  decorators: [withToastRegion],
  parameters: recipeParameters(
    source,
    'A form that validates on submit. `RudiForm` shows every problem in a focused summary at the top while each field shows its own message, so people can see the whole list and then fix fields in place. Submit the empty form to see it. Validation reads the submitted `FormData`, so the fields stay uncontrolled.',
  ),
} satisfies Meta<typeof ValidatedForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
