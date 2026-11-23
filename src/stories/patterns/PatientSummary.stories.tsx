import type { Meta, StoryObj } from '@storybook/react-vite'
import { PatientSummary } from './PatientSummary'
import source from './PatientSummary.tsx?raw'
import { recipeParameters } from './recipeStory'

const meta = {
  title: 'Patterns/Patient Summary',
  component: PatientSummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Device switcher on the docs page (.storybook/docs/AutodocsPage.tsx).
    devicePreview: true,
    ...recipeParameters(
      source,
      "A clinical summary with patient details, an alert, vitals with trends, and a medication list. It has no spacing CSS: every gap uses the library's default steps. `section` grows from 2rem to 3rem at the md breakpoint and the page gutters widen at md and lg. `group` and `content` stay the same at every width. Start here, and add spacing rules only when your product needs them. Use the **viewport** tool in the toolbar, or open the Phone and Tablet stories, to compare devices.",
    ),
  },
} satisfies Meta<typeof PatientSummary>

export default meta
type Story = StoryObj<typeof meta>

/** Sizes to the preview. Pick a device with the viewport tool in the toolbar. */
export const Default: Story = {}

/** Locked to the 375px phone preset (base spacing). Not shown on the docs page, which can't resize a story. */
export const Phone: Story = {
  tags: ['!autodocs'],
  globals: { viewport: { value: 'phone', isRotated: false } },
}

/** Locked to the 768px tablet preset (md spacing). Not shown on the docs page, which can't resize a story. */
export const Tablet: Story = {
  tags: ['!autodocs'],
  globals: { viewport: { value: 'tablet', isRotated: false } },
}
