import { RESPONSIVE_CATEGORIES } from './responsive-categories.mjs'

// Roomy (light): default layout with an enlarged spacing scale, a slightly
// rounded radius scale, a moderately soft warm palette, a muted slate brand
// accent, and the Rubik typeface. Base primitive color ramps cascade from
// :root; neutral + the roomy accent + semantic colors are emitted.
const PRIMITIVE_GROUPS = new Set(['blue', 'red', 'green', 'amber'])

export default {
  // Theme overlays override base tokens (collisions) and reference primitives that
  // the filter leaves in :root (filtered references); both are by design, so the
  // warnings are off here. scripts/check-token-refs.mjs verifies every var() resolves.
  log: { warnings: 'disabled' },
  source: [
    'tokens/tokens.json',
    'tokens/responsive.json',
    'tokens/semantic.json',
    'tokens/themes/roomy/semantic.json',
    'tokens/components.json',
    'tokens/themes/roomy/tokens.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'rudi',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens-roomy.css',
          format: 'css/variables',
          options: { selector: '[data-theme="roomy"]', outputReferences: true },
          filter: (token) => {
            if (RESPONSIVE_CATEGORIES.has(token.path[0])) return false
            const category = token.path[0]
            if (category === 'motion') return false
            if (category === 'font') return token.path[1] === 'family'
            if (category === 'color') {
              const group = token.path[1]
              if (group === 'dataviz') return String(token.path[2]).startsWith('series')
              return !PRIMITIVE_GROUPS.has(group)
            }
            return true
          },
        },
      ],
    },
  },
}
