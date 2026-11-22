// Roomy dark: the dark palette over the roomy neutral ramp, with the roomy
// spacing + radius scales, a brightened slate brand accent, and Rubik.
const PRIMITIVE_GROUPS = new Set(['blue', 'red', 'green', 'amber'])

export default {
  // Theme overlays override base tokens (collisions) and reference primitives that
  // the filter leaves in :root (filtered references); both are by design, so the
  // warnings are off here. scripts/check-token-refs.mjs verifies every var() resolves.
  log: { warnings: 'disabled' },
  source: [
    'tokens/tokens.json',
    'tokens/themes/dark/semantic.json',
    'tokens/themes/roomy-dark/semantic.json',
    'tokens/components.json',
    'tokens/themes/dark/components.json',
    'tokens/themes/roomy/tokens.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'rudi',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens-roomy-dark.css',
          format: 'css/variables',
          options: { selector: '[data-theme="roomy-dark"]', outputReferences: true },
          filter: (token) => {
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
