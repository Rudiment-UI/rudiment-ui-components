// The token list behind the Storybook token browser, built from the token
// JSON sources (not the generated CSS) so each token's tier comes from the file
// that declares it. tokenData.test.ts checks that every name built here exists
// in tokens/build/tokens.css (or tokens-responsive.css) and vice versa.
import primitives from '../../tokens/tokens.json'
import semantic from '../../tokens/semantic.json'
import responsive from '../../tokens/responsive.json'
import components from '../../tokens/components.json'

export type TokenTier = 'primitive' | 'semantic' | 'component'

export interface TokenEntry {
  /** CSS custom property, e.g. `--rudi-color-brand-primary`. */
  name: string
  /** Dotted source path, e.g. `color.brand.primary`. */
  path: string
  tier: TokenTier
  /** First one or two path segments, e.g. `color.brand` or `spacing`. */
  group: string
}

type TokenTree = { [key: string]: TokenTree | string | number }

// Mirrors Style Dictionary's `name/kebab` transform (css transformGroup):
// segments joined with `-`, camelCase split (`lineHeight` → `line-height`).
function toCssName(path: string[]): string {
  const kebab = path
    .join('-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
  return `--rudi-${kebab}`
}

function walk(
  tree: TokenTree,
  tier: TokenTier,
  path: string[],
  out: TokenEntry[],
) {
  if ('$value' in tree) {
    out.push({
      name: toCssName(path),
      path: path.join('.'),
      tier,
      group: path.length > 2 ? path.slice(0, 2).join('.') : path[0],
    })
    return
  }
  for (const [key, child] of Object.entries(tree)) {
    if (key.startsWith('$') || typeof child !== 'object') continue
    walk(child, tier, [...path, key], out)
  }
}

function build(): TokenEntry[] {
  const out: TokenEntry[] = []
  walk(primitives as TokenTree, 'primitive', [], out)
  walk(semantic as TokenTree, 'semantic', [], out)
  // Breakpoints and the named spacing steps sit between primitives and components.
  walk(responsive as TokenTree, 'semantic', [], out)
  walk(components as TokenTree, 'component', [], out)
  return out
}

export const TOKENS: readonly TokenEntry[] = build()

// Aliases come from the generated CSS, not the JSON, because each theme can
// re-point a token (dark maps `color.text.default` to a different neutral).
// Value per name: the token it aliases, or null when the theme sets a literal.
type AliasMap = Map<string, string | null>

export function parseAliases(css: string): AliasMap {
  const map: AliasMap = new Map()
  for (const [, name, value] of css.matchAll(
    /(--rudi-[\w-]+)\s*:\s*([^;]+);/g,
  )) {
    map.set(name, /^var\((--rudi-[\w-]+)\)$/.exec(value.trim())?.[1] ?? null)
  }
  return map
}

export type AliasLookup = (name: string, theme: string) => string | undefined

/**
 * Builds an alias lookup from the generated sheets, keyed by file path:
 * tokens.css → 'light', tokens-dark.css → 'dark', tokens-auto-dark.css → 'auto'.
 * tokens-responsive.css applies to every theme, so its base declarations (before
 * the first breakpoint block) are merged into 'light'.
 * A theme sheet only holds the tokens it re-emits; the rest fall back to `:root`.
 */
export function createAliasLookup(sheets: Record<string, string>): AliasLookup {
  const byTheme: Record<string, AliasMap> = {}
  for (const [file, css] of Object.entries(sheets)) {
    const theme = /tokens-?([\w-]*)\.css$/.exec(file)?.[1] || 'light'
    if (theme === 'responsive') continue
    byTheme[theme === 'auto-dark' ? 'auto' : theme] = parseAliases(css)
  }
  const responsive = Object.entries(sheets).find(([file]) => file.endsWith('tokens-responsive.css'))
  if (responsive) {
    const base = parseAliases(responsive[1].split('@media')[0])
    byTheme.light = new Map([...(byTheme.light ?? []), ...base])
  }
  return (name, theme) => {
    const own = theme === 'light' ? undefined : byTheme[theme]?.get(name)
    if (own !== undefined) return own ?? undefined
    return byTheme.light?.get(name) ?? undefined
  }
}

export const aliasOf: AliasLookup = createAliasLookup(
  import.meta.glob('../../tokens/build/*.css', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
)
