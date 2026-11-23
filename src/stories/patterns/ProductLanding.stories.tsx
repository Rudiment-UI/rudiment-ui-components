import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductLanding } from './ProductLanding'
import source from './ProductLanding.tsx?raw'
import styles from './ProductLanding.css?raw'
import { recipeParameters } from './recipeStory'

const meta = {
  title: 'Patterns/Product Landing',
  component: ProductLanding,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Device switcher on the docs page (.storybook/docs/AutodocsPage.tsx).
    devicePreview: true,
    ...recipeParameters(
      source,
      "A marketing page with a hero, a feature grid, pricing cards, and a call to action. `ProductLanding.css` makes the `section`, `group`, and `gutter` steps grow at the md and xl breakpoints, so the page opens up on large screens and the component file has no media queries. Use the **viewport** tool in the toolbar, or open the Phone and Tablet stories, to compare the spacing on each device.", { file: 'ProductLanding.css', css: styles },
    ),
  },
} satisfies Meta<typeof ProductLanding>

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
