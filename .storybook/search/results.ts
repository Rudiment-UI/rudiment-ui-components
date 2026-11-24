// Shapes Pagefind results for the search dialog. Kept free of React and the
// Storybook API so it can be unit-tested (results.test.ts).

/** A section of a page that matched, as Pagefind returns it. */
export type PagefindSubResult = {
  title: string
  url: string
  excerpt: string
  /** Each match in the section, with its relevance; headings weigh more. */
  weighted_locations?: { balanced_score: number }[]
}

const score = (sub: PagefindSubResult) =>
  (sub.weighted_locations ?? []).reduce((sum, l) => sum + l.balanced_score, 0)

/** One matching page, as `await result.data()` returns it. */
export type PagefindData = {
  url: string
  excerpt: string
  meta: { title?: string; section?: string }
  sub_results?: PagefindSubResult[]
}

/** One selectable row in the dialog: a page, or a section of one. */
export type SearchHit = {
  /** Unique within a result list; used as the option id. */
  key: string
  /** Storybook docs entry id, e.g. `components-elements-button--docs`. */
  docsId: string
  /** Heading id to scroll to, or undefined for the top of the page. */
  anchor?: string
  /** Row label: the section heading, or the page title for the page itself. */
  title: string
  /** The page the row belongs to. */
  page: string
  /** Top-level sidebar group, e.g. `Components`. */
  section: string
  /** Pagefind's excerpt: escaped text with `<mark>` around the matches. */
  excerpt: string
}

/** Splits an indexed URL (`/docs/<id>#<anchor>`) into its docs id and anchor. */
export function parseDocsUrl(url: string): { docsId: string; anchor?: string } {
  const [path, anchor] = url.split('#')
  const docsId = path.replace(/^.*\/docs\//, '').replace(/\/$/, '')
  return anchor ? { docsId, anchor: decodeURIComponent(anchor) } : { docsId }
}

/**
 * The rows for one matching page: its best-matching sections (at most
 * `maxSections`, best first; Pagefind lists them in page order), or the page
 * itself when no section matched on its own.
 */
export function toHits(data: PagefindData, maxSections = 3): SearchHit[] {
  const { docsId } = parseDocsUrl(data.url)
  const page = data.meta.title ?? docsId
  const section = data.meta.section ?? ''
  const subs = [...(data.sub_results ?? [])]
    .sort((a, b) => score(b) - score(a))
    .slice(0, maxSections)
  const rows = subs.length ? subs : [{ title: page, url: data.url, excerpt: data.excerpt }]
  return rows.map((row) => {
    const { anchor } = parseDocsUrl(row.url)
    return {
      key: `${docsId}#${anchor ?? ''}`,
      docsId,
      anchor,
      title: anchor ? row.title : page,
      page,
      section,
      excerpt: row.excerpt,
    }
  })
}

/**
 * Pagefind indexes `--rudi-component-button-primary-bg` as that whole word
 * plus its parts, but matches a hyphenated query only against whole words or
 * their start. So a fragment such as `primary-bg` or `data-theme` is searched
 * as separate words. A full token name (`--rudi-…`, `rudi-…`) is kept intact.
 */
export function normalizeQuery(query: string): string {
  return query
    .trim()
    .split(/\s+/)
    .map((term) => (/^(--)?rudi-/.test(term) ? term : term.replace(/(?<=\w)-(?=\w)/g, ' ')))
    .join(' ')
}

/** Manager path for a hit, as `api.navigate` takes it. */
export function hitPath(hit: Pick<SearchHit, 'docsId'>): string {
  return `/docs/${hit.docsId}`
}

/** Whether a keydown should open search: a bare `/` typed outside a text field. */
export function isSearchShortcut(event: {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  target?: { tagName?: string; isContentEditable?: boolean } | null
}): boolean {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return false
  const target = event.target
  if (!target) return true
  if (target.isContentEditable) return false
  return !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName?.toUpperCase() ?? '')
}
