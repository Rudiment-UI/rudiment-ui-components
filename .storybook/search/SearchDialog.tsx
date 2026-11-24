import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { brand, fonts } from '../brand/brand'
import { normalizeQuery, toHits, type PagefindData, type SearchHit } from './results'

// Full-text search over the docs pages, backed by the Pagefind index that
// scripts/search-index.mjs writes to <storybook-static>/pagefind/. The
// manager chrome follows the OS appearance (manager.ts), so this is styled
// from brand.ts with a prefers-color-scheme switch, not --rudi-* tokens.

type Pagefind = {
  init: () => Promise<void>
  debouncedSearch: (
    term: string,
    options?: object,
    debounceMs?: number,
  ) => Promise<{ results: { data: () => Promise<PagefindData> }[] } | null>
}

let pagefindPromise: Promise<Pagefind> | undefined
function loadPagefind(): Promise<Pagefind> {
  pagefindPromise ??= (async () => {
    // A runtime URL, so the manager bundler leaves the import alone.
    const url = new URL('pagefind/pagefind.js', document.baseURI).href
    const pagefind = (await import(/* @vite-ignore */ url)) as Pagefind
    await pagefind.init()
    return pagefind
  })()
  pagefindPromise.catch(() => {
    pagefindPromise = undefined
  })
  return pagefindPromise
}

const MAX_PAGES = 8

type Status = 'idle' | 'loading' | 'ready' | 'missing'

export function SearchDialog({
  onClose,
  onSelect,
}: {
  onClose: () => void
  onSelect: (hit: SearchHit) => void
}) {
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const listId = `${id}-results`
  const optionId = (i: number) => `${id}-option-${i}`

  useEffect(() => {
    inputRef.current?.focus()
    loadPagefind().catch(() => setStatus('missing'))
  }, [])

  useEffect(() => {
    const term = query.trim()
    if (!term) {
      setHits([])
      setStatus((s) => (s === 'missing' ? s : 'idle'))
      return
    }
    let stale = false
    setStatus((s) => (s === 'missing' ? s : 'loading'))
    loadPagefind()
      .then(async (pagefind) => {
        const search = await pagefind.debouncedSearch(normalizeQuery(term), {}, 150)
        if (!search || stale) return
        const pages = await Promise.all(search.results.slice(0, MAX_PAGES).map((r) => r.data()))
        if (stale) return
        setHits(pages.flatMap((page) => toHits(page)))
        setActive(0)
        setStatus('ready')
      })
      .catch(() => !stale && setStatus('missing'))
    return () => {
      stale = true
    }
  }, [query])

  useEffect(() => {
    listRef.current
      ?.querySelector(`[id="${optionId(active)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, hits])

  // Rows grouped under their page, keeping Pagefind's ranking order.
  const groups = useMemo(() => {
    const byPage = new Map<string, { page: string; section: string; rows: number[] }>()
    hits.forEach((hit, i) => {
      const group = byPage.get(hit.docsId) ?? { page: hit.page, section: hit.section, rows: [] }
      group.rows.push(i)
      byPage.set(hit.docsId, group)
    })
    return [...byPage.entries()]
  }, [hits])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if (event.key === 'ArrowDown' && hits.length) {
      event.preventDefault()
      setActive((i) => (i + 1) % hits.length)
    } else if (event.key === 'ArrowUp' && hits.length) {
      event.preventDefault()
      setActive((i) => (i - 1 + hits.length) % hits.length)
    } else if (event.key === 'Enter' && hits[active]) {
      event.preventDefault()
      onSelect(hits[active])
    } else if (event.key === 'Tab') {
      // The input is the dialog's only tab stop; keep focus in the dialog.
      event.preventDefault()
    }
  }

  const term = query.trim()
  const message =
    status === 'missing'
      ? 'The search index isn’t built. Run npm run build-storybook to create it.'
      : !term
        ? 'Search guides, components, props and tokens.'
        : status === 'ready' && hits.length === 0
          ? `No results for “${term}”.`
          : null

  return (
    <div className="sb-search" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <style>{CSS}</style>
      <div
        className="sb-search__dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search docs"
        onKeyDown={onKeyDown}
      >
        <div className="sb-search__bar">
          <SearchGlyph />
          <input
            ref={inputRef}
            className="sb-search__input"
            type="text"
            role="combobox"
            aria-label="Search docs"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={hits.length ? optionId(active) : undefined}
            placeholder="Search docs"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="sb-search__kbd">Esc</kbd>
        </div>
        <div ref={listRef} id={listId} role="listbox" aria-label="Results" className="sb-search__results">
          {groups.map(([docsId, group]) => (
            <div key={docsId} role="group" aria-labelledby={`${id}-${docsId}`}>
              <div id={`${id}-${docsId}`} className="sb-search__page">
                {group.section && <span className="sb-search__section">{group.section}</span>}
                {group.page}
              </div>
              {group.rows.map((i) => (
                <div
                  key={hits[i].key}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  className="sb-search__option"
                  onMouseMove={() => setActive(i)}
                  onClick={() => onSelect(hits[i])}
                >
                  <div className="sb-search__title">{hits[i].title}</div>
                  <div
                    className="sb-search__excerpt"
                    // Pagefind escapes the indexed text and adds only <mark>.
                    dangerouslySetInnerHTML={{ __html: hits[i].excerpt }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="sb-search__message" role="status">
          {message ?? (status === 'ready' ? `${hits.length} results` : '')}
        </p>
      </div>
    </div>
  )
}

export function SearchGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const CSS = `
.sb-search {
  --s-bg: ${brand.surface}; --s-ink: ${brand.ink}; --s-muted: ${brand.muted};
  --s-line: ${brand.line}; --s-hover: ${brand.hover}; --s-accent: ${brand.redDeep};
  --s-mark: #FDE7E6;
  position: fixed; inset: 0; z-index: 100000;
  display: flex; justify-content: center; align-items: flex-start;
  padding: 12vh 16px 16px;
  background: rgb(0 0 0 / 0.35);
  font-family: ${fonts.sans};
}
@media (prefers-color-scheme: dark) {
  .sb-search {
    --s-bg: ${brand.nightRaised}; --s-ink: ${brand.canvas}; --s-muted: ${brand.nightMuted};
    --s-line: ${brand.nightLine}; --s-hover: ${brand.nightHover}; --s-accent: ${brand.redBright};
    --s-mark: #4A1614;
    background: rgb(0 0 0 / 0.6);
  }
}
.sb-search__dialog {
  width: min(640px, 100%); max-height: 70vh;
  display: flex; flex-direction: column;
  background: var(--s-bg); color: var(--s-ink);
  border: 1px solid var(--s-line); border-radius: 12px;
  box-shadow: 0 16px 48px rgb(0 0 0 / 0.25);
  overflow: hidden;
}
.sb-search__bar {
  display: flex; align-items: center; gap: 10px;
  padding: 0 14px; border-bottom: 1px solid var(--s-line); color: var(--s-muted);
}
.sb-search__input {
  flex: 1; min-width: 0; height: 52px; border: 0; outline: 0;
  background: transparent; color: var(--s-ink); font: inherit; font-size: 16px;
}
.sb-search__input::placeholder { color: var(--s-muted); }
.sb-search__kbd, .sb-search-tool__kbd {
  font-family: ${fonts.mono}; font-size: 11px; line-height: 1;
  padding: 3px 5px; border: 1px solid var(--s-line, currentColor); border-radius: 4px; color: inherit;
}
.sb-search__results { overflow-y: auto; padding: 4px 8px; }
.sb-search__results:empty { display: none; }
.sb-search__page {
  display: flex; align-items: baseline; gap: 8px;
  padding: 12px 8px 4px; font-size: 13px; font-weight: 600;
}
.sb-search__section {
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--s-muted);
}
.sb-search__option { padding: 8px 10px; border-radius: 8px; cursor: pointer; }
.sb-search__option[aria-selected='true'] { background: var(--s-hover); box-shadow: inset 2px 0 0 var(--s-accent); }
.sb-search__title { font-size: 14px; font-weight: 500; }
.sb-search__excerpt {
  margin-top: 2px; font-size: 12.5px; line-height: 1.45; color: var(--s-muted);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.sb-search__excerpt mark { background: var(--s-mark); color: var(--s-ink); border-radius: 2px; padding: 0 1px; }
.sb-search__message { margin: 0; padding: 10px 16px; font-size: 12px; color: var(--s-muted); border-top: 1px solid var(--s-line); }
.sb-search__message:empty { display: none; }
@media (prefers-reduced-motion: no-preference) {
  .sb-search__dialog { animation: sb-search-in 120ms ease-out; }
}
@keyframes sb-search-in { from { opacity: 0; transform: translateY(-4px); } }
`
