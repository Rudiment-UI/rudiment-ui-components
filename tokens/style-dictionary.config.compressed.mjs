import { RESPONSIVE_CATEGORIES } from './responsive-categories.mjs'

// Compressed (light): default palette + typeface, with a very tight spacing
// scale and a very small radius scale. Colors + font cascade from :root; only
// spacing, radius, and the tokens that reference them are emitted.
export default {
  // Theme overlays override base tokens (collisions) and reference primitives that
  // the filter leaves in :root (filtered references); both are by design, so the
  // warnings are off here. scripts/check-token-refs.mjs verifies every var() resolves.
  log: { warnings: 'disabled' },
  source: [
    'tokens/tokens.json',
    'tokens/responsive.json',
    'tokens/semantic.json',
    'tokens/components.json',
    'tokens/themes/compressed/tokens.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'rudi',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens-compressed.css',
          format: 'css/variables',
          options: { selector: '[data-theme="compressed"]', outputReferences: true },
          filter: (token) => {
            if (RESPONSIVE_CATEGORIES.has(token.path[0])) return false
            const category = token.path[0]
            if (category === 'color' || category === 'font' || category === 'motion') return false
            return true
          },
        },
      ],
    },
  },
}
