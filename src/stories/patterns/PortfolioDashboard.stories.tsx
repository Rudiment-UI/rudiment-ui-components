import type { Meta, StoryObj } from '@storybook/react-vite'
import { PortfolioDashboard } from './PortfolioDashboard'
import source from './PortfolioDashboard.tsx?raw'
import styles from './PortfolioDashboard.css?raw'
import { recipeParameters } from './recipeStory'

const meta = {
  title: 'Patterns/Portfolio Dashboard',
  component: PortfolioDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Device switcher on the docs page (.storybook/docs/AutodocsPage.tsx).
    devicePreview: true,
    ...recipeParameters(
      source,
      "A trading-desk overview for a data-dense product: stat cards with sparklines, a positions table, and an alerts rail. The layout props name spacing steps (`space=\"group\"`, `space=\"section\"`), and `PortfolioDashboard.css` keeps those steps tight at every width so more rows fit. Use the **viewport** tool in the toolbar, or open the Phone and Tablet stories, to see the stat grid and the alerts rail reflow and the gutters widen from laptop width up. The same file also suits a claims queue or a lab inventory.", { file: 'PortfolioDashboard.css', css: styles },
    ),
  },
} satisfies Meta<typeof PortfolioDashboard>

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
