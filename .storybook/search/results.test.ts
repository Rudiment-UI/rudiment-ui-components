import {
  hitPath,
  isSearchShortcut,
  normalizeQuery,
  parseDocsUrl,
  toHits,
  type PagefindData,
} from './results'

describe('parseDocsUrl', () => {
  it('splits the docs id and anchor', () => {
    expect(parseDocsUrl('/docs/components-elements-button--docs#loading-state')).toEqual({
      docsId: 'components-elements-button--docs',
      anchor: 'loading-state',
    })
  })

  it('returns no anchor for the page itself', () => {
    expect(parseDocsUrl('/docs/getting-started-theme-theming--docs')).toEqual({
      docsId: 'getting-started-theme-theming--docs',
    })
  })
})

describe('toHits', () => {
  const page: PagefindData = {
    url: '/docs/components-elements-button--docs',
    excerpt: 'A <mark>button</mark> for actions',
    meta: { title: 'Button', section: 'Components' },
  }

  it('lists the matching sections of a page', () => {
    const hits = toHits({
      ...page,
      sub_results: [
        { title: 'Loading state', url: '/docs/components-elements-button--docs#loading-state', excerpt: 'x' },
        { title: 'Variants', url: '/docs/components-elements-button--docs#variants', excerpt: 'y' },
      ],
    })
    expect(hits.map((h) => [h.title, h.anchor, h.page, h.section])).toEqual([
      ['Loading state', 'loading-state', 'Button', 'Components'],
      ['Variants', 'variants', 'Button', 'Components'],
    ])
    expect(new Set(hits.map((h) => h.key)).size).toBe(2)
  })

  it('falls back to the page when no section matched', () => {
    expect(toHits(page)).toEqual([
      {
        key: 'components-elements-button--docs#',
        docsId: 'components-elements-button--docs',
        anchor: undefined,
        title: 'Button',
        page: 'Button',
        section: 'Components',
        excerpt: 'A <mark>button</mark> for actions',
      },
    ])
  })

  it('labels a section without an anchor with the page title', () => {
    const [hit] = toHits({
      ...page,
      sub_results: [{ title: 'Ignored', url: '/docs/components-elements-button--docs', excerpt: 'z' }],
    })
    expect(hit.title).toBe('Button')
  })

  it('puts the best-matching section first', () => {
    const at = (title: string, scores: number[]) => ({
      title,
      url: `/docs/components-elements-button--docs#${title.toLowerCase()}`,
      excerpt: '',
      weighted_locations: scores.map((balanced_score) => ({ balanced_score })),
    })
    const hits = toHits({
      ...page,
      sub_results: [at('Api', [1]), at('Loading', [5, 4]), at('Sizes', [2])],
    })
    expect(hits.map((h) => h.title)).toEqual(['Loading', 'Sizes', 'Api'])
  })

  it('caps the sections per page', () => {
    const sub_results = Array.from({ length: 5 }, (_, i) => ({
      title: `S${i}`,
      url: `/docs/components-elements-button--docs#s${i}`,
      excerpt: '',
    }))
    expect(toHits({ ...page, sub_results }, 2)).toHaveLength(2)
  })
})

describe('hitPath', () => {
  it('builds the manager path', () => {
    expect(hitPath({ docsId: 'layouts-grid--docs' })).toBe('/docs/layouts-grid--docs')
  })
})

describe('isSearchShortcut', () => {
  it('opens on a bare slash', () => {
    expect(isSearchShortcut({ key: '/', target: { tagName: 'BODY' } })).toBe(true)
    expect(isSearchShortcut({ key: '/' })).toBe(true)
  })

  it('ignores a slash typed into a field', () => {
    for (const tagName of ['INPUT', 'TEXTAREA', 'SELECT']) {
      expect(isSearchShortcut({ key: '/', target: { tagName } })).toBe(false)
    }
    expect(isSearchShortcut({ key: '/', target: { tagName: 'DIV', isContentEditable: true } })).toBe(false)
  })

  it('ignores other keys and modified slashes', () => {
    expect(isSearchShortcut({ key: 'k', metaKey: true })).toBe(false)
    expect(isSearchShortcut({ key: '/', metaKey: true })).toBe(false)
    expect(isSearchShortcut({ key: '/', ctrlKey: true })).toBe(false)
  })
})

describe('normalizeQuery', () => {
  it('splits hyphenated fragments into words', () => {
    expect(normalizeQuery('button-primary-bg')).toBe('button primary bg')
    expect(normalizeQuery('  data-theme  auto ')).toBe('data theme auto')
  })

  it('keeps full token names intact', () => {
    expect(normalizeQuery('--rudi-component-button-primary-bg')).toBe(
      '--rudi-component-button-primary-bg',
    )
    expect(normalizeQuery('rudi-space-group')).toBe('rudi-space-group')
  })

  it('leaves other queries alone', () => {
    expect(normalizeQuery('loading state')).toBe('loading state')
    expect(normalizeQuery('use client')).toBe('use client')
  })
})
