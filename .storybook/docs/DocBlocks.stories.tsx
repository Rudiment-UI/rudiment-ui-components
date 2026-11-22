import type { Meta, StoryObj } from '@storybook/react'
import { TokenBrowser } from './TokenBrowser'
import { ThemeMatrix } from './ThemeMatrix'

// Live blocks embedded in the Getting Started MDX pages with <Canvas of>.
// `!dev` keeps them out of the sidebar; they still render in docs and run in
// the storybook vitest project. The root theme is locked to the default
// because these blocks set `data-theme` themselves, and the default theme has
// no selector of its own: a dark toolbar theme would leak into "Default".
const meta = {
  title: 'Getting Started/Doc Blocks',
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'light' },
  parameters: {
    docs: { canvas: { sourceState: 'none' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PrimitiveTokens: Story = {
  render: () => <TokenBrowser tiers={['primitive']} />,
}

export const SemanticTokens: Story = {
  render: () => <TokenBrowser tiers={['semantic']} />,
}

export const ComponentTokens: Story = {
  render: () => <TokenBrowser tiers={['component']} collapsed />,
}

export const DatavizPalette: Story = {
  render: () => (
    <TokenBrowser
      tiers={['primitive', 'semantic']}
      prefixes={['color.dataviz']}
      searchable={false}
    />
  ),
}

export const SurfaceTokens: Story = {
  render: () => (
    <TokenBrowser
      tiers={['semantic']}
      prefixes={['color.background']}
      searchable={false}
    />
  ),
}

export const ThemeComparison: Story = {
  render: () => <ThemeMatrix />,
}
