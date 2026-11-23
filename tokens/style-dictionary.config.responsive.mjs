// Responsive spacing scale: the semantic `space.*` steps and the `breakpoint.*` values
// from tokens/responsive.json, emitted as one stylesheet with a min-width media block
// per breakpoint.
//
// The steps are declared on `:root, [data-theme]`, not only `:root`. A custom property
// whose value is `var(--rudi-spacing-6)` is resolved on the element that declares it, so
// redeclaring the steps on every themed element makes them pick up that theme's spacing
// scale (compressed, roomy). Every other config filters these categories out
// (see responsive-categories.mjs) so a theme file can't flatten the breakpoints.
import { RESPONSIVE_CATEGORIES } from './responsive-categories.mjs'

const PREFIX = 'rudi'
const SELECTOR = ':root, [data-theme]'
const EXTENSION = 'rudi.responsive'

/** `{spacing.12}` → `var(--rudi-spacing-12)`; anything else passes through. */
const toCss = (value) =>
  String(value).replace(/\{([^}]+)\}/g, (_, ref) => `var(--${PREFIX}-${ref.replaceAll('.', '-')})`)

const block = (selector, lines, indent = '') =>
  `${indent}${selector} {\n${lines.map((l) => `${indent}  ${l}`).join('\n')}\n${indent}}`

function responsiveFormat({ dictionary }) {
  const breakpoints = dictionary.allTokens.filter((t) => t.path[0] === 'breakpoint')
  const steps = dictionary.allTokens.filter((t) => t.path[0] === 'space')
  const declare = (token, value) => {
    const comment = token.$description ? ` /* ${token.$description} */` : ''
    return `--${token.name}: ${value};${comment}`
  }

  const out = [
    '/**\n * Do not edit directly, this file was auto-generated.\n * Source: tokens/responsive.json\n */',
    block(':root', breakpoints.map((t) => declare(t, t.$value))),
    block(SELECTOR, steps.map((t) => declare(t, toCss(t.original.$value)))),
  ]

  for (const bp of breakpoints) {
    const key = bp.path[1]
    const overrides = steps.flatMap((t) => {
      const value = t.original.$extensions?.[EXTENSION]?.[key]
      return value === undefined ? [] : [`--${t.name}: ${toCss(value)};`]
    })
    if (overrides.length) {
      out.push(`@media (min-width: ${bp.$value}) {\n${block(SELECTOR, overrides, '  ')}\n}`)
    }
  }

  const unknown = steps.flatMap((t) =>
    Object.keys(t.original.$extensions?.[EXTENSION] ?? {})
      .filter((k) => !breakpoints.some((bp) => bp.path[1] === k))
      .map((k) => `${t.path.join('.')} → ${k}`),
  )
  if (unknown.length) throw new Error(`Unknown breakpoint in ${EXTENSION}: ${unknown.join(', ')}`)

  return `${out.join('\n\n')}\n`
}

export default {
  source: ['tokens/tokens.json', 'tokens/responsive.json'],
  hooks: { formats: { 'css/rudi-responsive': responsiveFormat } },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: PREFIX,
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens-responsive.css',
          format: 'css/rudi-responsive',
          filter: (token) => RESPONSIVE_CATEGORIES.has(token.path[0]),
        },
      ],
    },
  },
}
