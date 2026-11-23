/**
 * A named step of the responsive spacing scale. Each one is a `--rudi-space-*` token
 * that can change at breakpoints and follows the active density theme.
 *
 * - `inline`: between controls in a row (buttons, tags, icon + label)
 * - `content`: between fields, paragraphs and list items; padding inside a box
 * - `group`: between related blocks (cards in a grid, form sections, panels)
 * - `section`: between page sections
 * - `gutter`: page edge padding
 */
export type RudiSpaceStep = 'inline' | 'content' | 'group' | 'section' | 'gutter'

/**
 * A step of the fixed spacing scale, mapped to `--rudi-spacing-<n>`. Follows the
 * density theme but does not change at breakpoints.
 */
export type RudiSpaceScale = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12

// `string & {}` keeps editor autocomplete for the named steps while still accepting any string.
/**
 * A spacing value for a layout primitive: a named step of the responsive scale
 * (`"group"`), a step of the fixed scale (`4`), or any CSS length (`"1.25rem"`,
 * `"var(--my-space)"`) as an escape hatch.
 */
export type RudiSpace = RudiSpaceStep | RudiSpaceScale | (string & {})

const STEPS: ReadonlySet<string> = new Set<RudiSpaceStep>([
  'inline',
  'content',
  'group',
  'section',
  'gutter',
])

/** Turns a `RudiSpace` value into a CSS value. `undefined` stays `undefined`. */
export function resolveSpace(value: RudiSpace | undefined): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number') return `var(--rudi-spacing-${value})`
  if (STEPS.has(value)) return `var(--rudi-space-${value})`
  return value
}
