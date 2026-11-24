import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { componentTokenPrefixes, overrideSnippet, tokensFor } from './componentTokenGroups'
import { neighbors } from './PrevNext'

const root = resolve(__dirname, '../..')

function storyFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? storyFiles(join(dir, e.name))
      : e.name.endsWith('.stories.tsx')
        ? [join(dir, e.name)]
        : [],
  )
}

const componentTitles = storyFiles(join(root, 'src/components'))
  .map((f) => /^\s*title:\s*'(Components\/[^']+)'/m.exec(readFileSync(f, 'utf8'))?.[1])
  .filter((t): t is string => Boolean(t))

// Components that genuinely have no tokens of their own.
const NO_TOKENS = new Set<string>([])

describe('component tokens on docs pages', () => {
  it('found the component stories', () => {
    expect(componentTitles.length).toBeGreaterThan(40)
  })

  it.each(componentTitles.filter((t) => !NO_TOKENS.has(t)))(
    '%s maps to at least one token group',
    (title) => {
      expect(componentTokenPrefixes(title).length).toBeGreaterThan(0)
      expect(overrideSnippet(componentTokenPrefixes(title))).not.toBe('')
    },
  )

  it('layouts and typography have no Customizing section', () => {
    expect(componentTokenPrefixes('Layouts/Stack')).toEqual([])
    expect(componentTokenPrefixes('Typography/Text')).toEqual([])
  })

  it('kebab-cases multi-word names and honours explicit groups', () => {
    expect(componentTokenPrefixes('Components/Elements/IconButton')).toEqual(['component.icon-button'])
    expect(componentTokenPrefixes('Components/Forms/RadioGroup')).toEqual(['component.radio'])
  })

  it('does not pull a neighbouring group in by prefix', () => {
    const names = tokensFor(['component.button']).map((t) => t.name)
    expect(names.some((n) => n.startsWith('--rudi-component-icon-button'))).toBe(false)
  })

  it('writes a color override for every theme', () => {
    const css = overrideSnippet(['component.button'])
    expect(css).toMatch(/:root,\n\[data-theme\] \{\n {2}--rudi-component-button-[\w-]+: #7c3aed;/)
    expect(css).toContain("[data-theme$='dark']")
    expect(css).toContain("[data-theme='auto']")
  })

})

describe('previous / next pages', () => {
  const entries = [
    { id: 'a--docs', title: 'Getting Started/A', type: 'docs' },
    { id: 'hidden--docs', title: 'Getting Started/Hidden', type: 'docs', tags: ['!dev'] },
    { id: 'b--primary', title: 'Components/B', type: 'story' },
    { id: 'b--docs', title: 'Components/B', type: 'docs' },
    { id: 'c--docs', title: 'Components/C', type: 'docs' },
  ]

  it('skips stories and hidden pages', () => {
    expect(neighbors(entries, 'b--docs')).toEqual({ prev: entries[0], next: entries[4] })
  })

  it('has no previous on the first page and no next on the last', () => {
    expect(neighbors(entries, 'a--docs').prev).toBeUndefined()
    expect(neighbors(entries, 'c--docs').next).toBeUndefined()
  })

  it('returns nothing for an unknown page', () => {
    expect(neighbors(entries, 'nope--docs')).toEqual({})
  })
})
