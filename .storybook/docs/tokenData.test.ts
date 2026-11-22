import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { TOKENS, createAliasLookup } from './tokenData'
import { THEMES } from './themes'

// The token browser builds CSS names from the JSON sources. If that naming
// drifts from Style Dictionary's output, swatches render blank, so compare
// against the generated default-theme stylesheet.
const buildDir = resolve(__dirname, '../../tokens/build')
const sheets = Object.fromEntries(
  readdirSync(buildDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => [f, readFileSync(resolve(buildDir, f), 'utf8')]),
)
const css = sheets['tokens.css']
// Vitest blanks CSS imports, so the browser's ?raw glob can't be used here;
// build the same lookup from the files on disk.
const aliasOf = createAliasLookup(sheets)
const cssNames = new Set(css.match(/--rudi-[\w-]+(?=\s*:)/g))
const builtNames = new Set(TOKENS.map((t) => t.name))
// Roomy and Soft add primitives (an accent ramp) that only their own sheet declares.
const anySheetNames = new Set(
  Object.values(sheets).flatMap((s) => s.match(/--rudi-[\w-]+(?=\s*:)/g) ?? []),
)

describe('token browser data', () => {
  it('parsed both sources (guards against vacuous passes)', () => {
    expect(cssNames.size).toBeGreaterThan(500)
    expect(builtNames.size).toBe(TOKENS.length)
  })

  it('builds only names that exist in tokens.css', () => {
    expect([...builtNames].filter((n) => !cssNames.has(n))).toEqual([])
  })

  it('covers every token in tokens.css', () => {
    expect([...cssNames].filter((n) => !builtNames.has(n))).toEqual([])
  })

  it.each(THEMES.map((t) => t.value))(
    'resolves every %s alias to a known token',
    (theme) => {
      const broken = TOKENS.map((t) => aliasOf(t.name, theme)).filter(
        (ref) => ref !== undefined && !anySheetNames.has(ref),
      )
      expect(broken).toEqual([])
    },
  )

  it('reads aliases per theme', () => {
    const surface = '--rudi-color-background-surface-base'
    expect(aliasOf(surface, 'light')).toBe('--rudi-color-neutral-0')
    expect(aliasOf(surface, 'dark')).toBe('--rudi-color-neutral-900')
    // compressed doesn't re-emit colors, so it falls back to :root.
    expect(aliasOf(surface, 'compressed')).toBe('--rudi-color-neutral-0')
    // A literal value has no alias.
    expect(aliasOf('--rudi-color-neutral-900', 'light')).toBeUndefined()
  })
})
