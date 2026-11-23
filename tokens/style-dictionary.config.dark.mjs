import { withoutResponsive } from './responsive-categories.mjs'

// Primitive token groups that are theme-invariant and should be excluded from dark output
const PRIMITIVE_GROUPS = new Set(['blue', 'neutral', 'red', 'green', 'amber'])
const PRIMITIVE_CATEGORIES = new Set(['spacing', 'radius', 'font', 'motion'])

const darkFilter = (token) => {
  const category = token.path[0]
  // Exclude theme-invariant primitives (spacing, radius, font, motion)
  if (PRIMITIVE_CATEGORIES.has(category)) return false
  // Exclude primitive color ramps but include semantic + component color tokens
  if (category === 'color') {
    const group = token.path[1]
    if (group === 'dataviz') {
      return String(token.path[2]).startsWith('series')
    }
    return !PRIMITIVE_GROUPS.has(group)
  }
  // Include component and typography tokens so they re-resolve in dark scope
  return true
}

export default {
  // Theme overlays override base tokens (collisions) and reference primitives that
  // the filter leaves in :root (filtered references); both are by design, so the
  // warnings are off here. scripts/check-token-refs.mjs verifies every var() resolves.
  log: { warnings: 'disabled' },
  source: [
    'tokens/tokens.json',
    'tokens/responsive.json',
    'tokens/themes/dark/semantic.json',
    'tokens/components.json',
    'tokens/themes/dark/components.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'rudi',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens-dark.css',
          format: 'css/variables',
          options: {
            selector: '[data-theme="dark"]',
            outputReferences: true,
          },
          filter: withoutResponsive(darkFilter),
        },
        {
          // Same tokens under [data-theme="auto"]; src/styles.css imports this file
          // inside (prefers-color-scheme: dark), so "auto" follows the OS setting.
          destination: 'tokens-auto-dark.css',
          format: 'css/variables',
          options: {
            selector: '[data-theme="auto"]',
            outputReferences: true,
          },
          filter: withoutResponsive(darkFilter),
        },
      ],
    },
  },
}
