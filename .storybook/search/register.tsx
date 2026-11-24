import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { addons, types, type API } from 'storybook/manager-api'
import { IconButton } from 'storybook/internal/components'
import { PREVIEW_KEYDOWN } from 'storybook/internal/core-events'
import { SearchDialog, SearchGlyph } from './SearchDialog'
import { hitPath, isSearchShortcut, type SearchHit } from './results'
import { SCROLL_EVENT } from './scrollEvent'

// "Search docs" toolbar button and `/` shortcut. ⌘K stays with Storybook's
// sidebar filter, which matches titles only.

const ADDON_ID = 'rudiment/search'

function SearchTool({ api }: { api: API }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSearchShortcut(event as unknown as Parameters<typeof isSearchShortcut>[0])) return
      event.preventDefault()
      setOpen(true)
    }
    // `/` pressed while focus is inside the preview iframe arrives over the
    // channel; the preview only forwards keys typed outside its text fields.
    const onPreviewKeyDown = ({ event }: { event: Parameters<typeof isSearchShortcut>[0] }) => {
      if (isSearchShortcut({ ...event, target: null })) setOpen(true)
    }
    document.addEventListener('keydown', onKeyDown)
    api.on(PREVIEW_KEYDOWN, onPreviewKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      api.off(PREVIEW_KEYDOWN, onPreviewKeyDown)
    }
  }, [api])

  const close = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus()
  }, [])

  const select = useCallback(
    (hit: SearchHit) => {
      setOpen(false)
      api.navigate(hitPath(hit))
      // The preview scrolls to the section once the page has rendered
      // (scrollToHit.ts).
      api.emit(SCROLL_EVENT, { docsId: hit.docsId, anchor: hit.anchor })
    },
    [api],
  )

  return (
    <>
      <IconButton
        ref={buttonRef}
        key="search"
        title="Search docs (/)"
        aria-label="Search docs"
        onClick={() => setOpen(true)}
      >
        <SearchGlyph />
        <span>Search</span>
        <kbd className="sb-search-tool__kbd">/</kbd>
      </IconButton>
      {open && createPortal(<SearchDialog onClose={close} onSelect={select} />, document.body)}
    </>
  )
}

/**
 * Adds the toolbar button. Called from manager.ts rather than run on import:
 * the package's `sideEffects` field would let the bundler drop a bare import.
 */
export function registerSearch() {
  addons.register(ADDON_ID, (api) => {
    addons.add(`${ADDON_ID}/tool`, {
      type: types.TOOL,
      title: 'Search docs',
      match: () => true,
      render: () => <SearchTool api={api} />,
    })
  })
}
