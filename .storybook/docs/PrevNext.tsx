import type { CSSProperties } from 'react'
import { AnchorMdx } from '@storybook/addon-docs/blocks'
import { brand } from '../brand/brand'
import './docs-blocks.css'

export interface DocsEntry {
  id: string
  title: string
  type: string
  tags?: string[]
}

/**
 * The docs pages either side of `currentId`, in sidebar order. The story index
 * is already sorted by `storySort`, so its order is the sidebar's. Entries
 * tagged `!dev` (hidden from the sidebar) are skipped.
 */
export function neighbors(
  entries: readonly DocsEntry[],
  currentId: string,
): { prev?: DocsEntry; next?: DocsEntry } {
  const pages = entries.filter(
    (e) => e.type === 'docs' && !e.tags?.includes('!dev'),
  )
  const i = pages.findIndex((e) => e.id === currentId)
  if (i === -1) return {}
  return { prev: pages[i - 1], next: pages[i + 1] }
}

type PreviewGlobal = {
  __STORYBOOK_PREVIEW__?: {
    storyStoreValue?: { storyIndex?: { entries?: Record<string, DocsEntry> } }
  }
}

function indexEntries(): DocsEntry[] {
  const entries = (globalThis as PreviewGlobal).__STORYBOOK_PREVIEW__
    ?.storyStoreValue?.storyIndex?.entries
  return entries ? Object.values(entries) : []
}

const palette = {
  '--sb-pager-ink': brand.ink,
  '--sb-pager-muted': brand.muted,
  '--sb-pager-line': brand.line,
  '--sb-pager-focus': brand.redDeep,
} as CSSProperties

const label = (title: string) => title.split('/').pop()
const section = (title: string) => title.split('/').slice(0, -1).join(' / ')

/** "Previous" / "Next" links at the foot of a docs page. */
export function PrevNext({ docsId }: { docsId: string }) {
  const { prev, next } = neighbors(indexEntries(), docsId)
  if (!prev && !next) return null
  return (
    <nav
      className="sb-pager skip-toc"
      aria-label="Previous and next pages"
      style={palette}
    >
      {prev ? (
        <AnchorMdx href={`?path=/docs/${prev.id}`} className="sb-pager__link">
          <span className="sb-pager__dir">← Previous</span>
          <span className="sb-pager__section">{section(prev.title)}</span>
          <span className="sb-pager__title">{label(prev.title)}</span>
        </AnchorMdx>
      ) : (
        <span />
      )}
      {next && (
        <AnchorMdx
          href={`?path=/docs/${next.id}`}
          className="sb-pager__link sb-pager__link--next"
        >
          <span className="sb-pager__dir">Next →</span>
          <span className="sb-pager__section">{section(next.title)}</span>
          <span className="sb-pager__title">{label(next.title)}</span>
        </AnchorMdx>
      )}
    </nav>
  )
}
