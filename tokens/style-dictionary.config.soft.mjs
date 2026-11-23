import { RESPONSIVE_CATEGORIES } from './responsive-categories.mjs'

// Soft (light): default layout with a soft warm palette, a soft periwinkle
// brand accent, the Nunito typeface, an enlarged radius scale, and pill
// buttons. Spacing is unchanged (cascades from :root). Base primitive color
// ramps (blue/red/green/amber) cascade from :root; neutral + the soft accent
// + semantic colors are emitted.
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
    'tokens/themes/soft/semantic.json',
    'tokens/components.json',
    'tokens/themes/soft/tokens.json',
    'tokens/themes/soft/components.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'rudi',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens-soft.css',
          format: 'css/variables',
          options: { selector: '[data-theme="soft"]', outputReferences: true },
          filter: (token) => {
            if (RESPONSIVE_CATEGORIES.has(token.path[0])) return false
            const category = token.path[0]
            if (category === 'spacing' || category === 'motion') return false
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
