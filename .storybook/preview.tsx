import { useEffect } from 'react'
import type { Preview } from '@storybook/react'
import { useArgs } from 'storybook/preview-api'
import { create } from 'storybook/theming/create'
import '../src/app.css'
import { brand, fonts } from './brand/brand'
import { THEMES } from './docs/themes'
import { AutodocsPage } from './docs/AutodocsPage'

// Light docs theme so the "Show code" Source block renders the dark-on-light
// `lightSyntaxColors` palette. Without it the block falls back to the dark
// syntax palette (light tokens), which is illegible on the light code surface
// set in preview-head.html. Mirrors the light brand theme in manager.ts.
const docsTheme = create({
  base: 'light',
  fontBase: fonts.sans,
  fontCode: fonts.mono,
  colorPrimary: brand.ink,
  colorSecondary: brand.redDeep,
  appBg: brand.canvas,
  appContentBg: brand.surface,
  appPreviewBg: brand.surface,
  appBorderColor: brand.line,
  appBorderRadius: 12,
  textColor: brand.ink,
  textMutedColor: brand.muted,
  barBg: brand.surface,
  barTextColor: brand.muted,
  barSelectedColor: brand.redDeep,
})

const preview: Preview = {
  parameters: {
    docs: {
      theme: docsTheme,
      // Default autodocs plus each component's usage guidelines.
      page: AutodocsPage,
    },
    options: {
      categorySort: {
        order: ['Appearance', 'Content', 'Layout', 'State', 'Events'],
      },
      storySort: {
        order: [
          'Getting Started',
          [
            'Introduction',
            'Accessibility',
            'Token Architecture',
            'Layout Primitives',
            'Typography',
            'Component Guidelines',
            'Theming',
            'Vitrea',
            'Changelog',
          ],
          'Components',
          'Layouts',
          'Typography',
          'Patterns',
          ['Validated Form', 'Filterable Table', 'Data States', 'Confirm Dialog', 'Settings Page'],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {},
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: THEMES.map(({ value, title, icon }) => ({ value, title, icon })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        return () => document.documentElement.removeAttribute('data-theme')
      }, [theme])
      // Full-bleed stories (AppShell, TopBar, Footer) sit flush to the frame.
      const fullscreen = context.parameters.layout === 'fullscreen'
      return (
        <div
          style={{
            padding: fullscreen ? 0 : '2rem',
            backgroundColor: 'var(--rudi-color-background-surface)',
            color: 'var(--rudi-color-text-default)',
            fontFamily: 'var(--rudi-font-family-sans)',
          }}
        >
          <Story />
        </div>
      )
    },
    // Sync controlled-prop args with onChange so form elements (Checkbox,
    // Switch, Input, RadioGroup, Select) remain interactive when a controlled
    // prop like `value`, `isSelected`, or `selectedKey` is set in meta.args.
    (Story) => {
      const [args, updateArgs] = useArgs<Record<string, unknown>>()
      const hasIsSelected = 'isSelected' in args
      const hasValue = 'value' in args
      const hasSelectedKey = 'selectedKey' in args

      if (!hasIsSelected && !hasValue && !hasSelectedKey) {
        return <Story />
      }

      const originalOnChange = args.onChange as
        | ((v: unknown) => void)
        | undefined
      const originalOnSelectionChange = args.onSelectionChange as
        | ((v: unknown) => void)
        | undefined

      const override: Record<string, unknown> = {}

      if (hasIsSelected || hasValue) {
        override.onChange = (newValue: unknown) => {
          if (hasIsSelected) updateArgs({ isSelected: newValue })
          if (hasValue) updateArgs({ value: newValue })
          originalOnChange?.(newValue)
        }
      }

      if (hasSelectedKey) {
        override.onSelectionChange = (newValue: unknown) => {
          updateArgs({ selectedKey: newValue })
          originalOnSelectionChange?.(newValue)
        }
      }

      return <Story args={{ ...args, ...override }} />
    },
  ],
}

export default preview
