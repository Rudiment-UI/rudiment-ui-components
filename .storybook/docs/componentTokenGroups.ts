// Maps a docs page to the component token group(s) it documents, and builds
// the override snippet its "Customizing" section shows.
// componentTokenGroups.test.ts checks that every mapped group exists.
import { TOKENS } from './tokenData'

// Components whose token group isn't their kebab-cased name (the last title segment).
const GROUPS: Record<string, string[]> = {
  RadioGroup: ['radio'],
  ProgressBar: ['progress'],
  KanbanBoard: ['kanban'],
  BarChart: ['chart'],
  LineChart: ['chart'],
  DonutChart: ['chart'],
  Sparkline: ['sparkline', 'chart'],
}

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/** Token paths (`component.<group>`) for a `Components/*` story title, or [] when it has none. */
export function componentTokenPrefixes(title: string): string[] {
  if (!title.startsWith('Components/')) return []
  const name = title.split('/').pop()!
  const groups = GROUPS[name] ?? [kebab(name)]
  return groups
    .map((g) => `component.${g}`)
    .filter((p) => TOKENS.some((t) => t.path.startsWith(`${p}.`)))
}

/** Every component token under the given prefixes. */
export function tokensFor(prefixes: string[]) {
  return TOKENS.filter((t) => prefixes.some((p) => t.path.startsWith(`${p}.`)))
}

// Names that hold a color, so the snippet can show a light and a dark value.
const COLOR = /-(bg|text|color|border|fill|stroke)(-|$)/

/**
 * A copyable override snippet. `:root, [data-theme]` reaches every themed
 * subtree (a bare `:root` rule loses inside one, since theme blocks share its
 * specificity and load later). Dark themes and `auto` get their own value.
 * Every component group has at least one color token (componentTokenGroups.test.ts).
 */
export function overrideSnippet(prefixes: string[]): string {
  // A background reads as the obvious thing to restyle; a focus ring doesn't.
  const tokens = tokensFor(prefixes)
  const color =
    tokens.find((t) => /-bg(-|$)/.test(t.name)) ??
    tokens.find((t) => COLOR.test(t.name))
  if (!color) return ''
  const n = color.name
  return [
    '/* Your stylesheet, loaded after rudiment-ui/styles */',
    ':root,',
    '[data-theme] {',
    `  ${n}: #7c3aed;`,
    '}',
    '',
    '/* Every dark theme, and auto when the OS prefers dark */',
    "[data-theme$='dark'] {",
    `  ${n}: #a78bfa;`,
    '}',
    '@media (prefers-color-scheme: dark) {',
    "  [data-theme='auto'] {",
    `    ${n}: #a78bfa;`,
    '  }',
    '}',
  ].join('\n')
}
