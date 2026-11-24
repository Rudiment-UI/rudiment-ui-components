import { addons } from 'storybook/preview-api'
import { SCROLL_EVENT, type ScrollPayload } from './scrollEvent'

// Preview side of search navigation: once the chosen docs page has rendered,
// scroll to the section and move focus to its heading so keyboard and screen
// reader users land where they asked to go.

/** How long to wait for the page, and to keep the target in place after. */
const FIND_MS = 5000
const PIN_MS = 3000
let pending = 0

function scrollToHit({ docsId, anchor }: ScrollPayload) {
  const run = ++pending
  const started = Date.now()
  const find = () => {
    if (run !== pending || Date.now() - started > FIND_MS) return
    const onPage = new URLSearchParams(window.location.search).get('id') === docsId
    const content = document.querySelector<HTMLElement>('.sbdocs-content')
    const target = anchor
      ? document.getElementById(anchor)
      : content?.querySelector<HTMLElement>('h1')
    if (!onPage || !content || !target) return void setTimeout(find, 100)
    pin(run, content, target, Boolean(anchor))
  }
  find()
}

/**
 * Examples above the target render after it does and push it down the page,
 * so keep it at the top while the page grows, until the reader scrolls or
 * presses a key, or PIN_MS passes.
 */
function pin(run: number, content: HTMLElement, target: HTMLElement, toSection: boolean) {
  const place = () => {
    if (run !== pending) return stop()
    if (toSection) target.scrollIntoView({ block: 'start' })
    else window.scrollTo({ top: 0 })
  }
  const observer = new ResizeObserver(place)
  const stop = () => {
    observer.disconnect()
    for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown'] as const) {
      window.removeEventListener(type, stop)
    }
  }
  for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown'] as const) {
    window.addEventListener(type, stop, { passive: true })
  }
  observer.observe(content)
  setTimeout(stop, PIN_MS)

  // Room above the heading, so its focus ring isn't clipped by the frame edge.
  target.style.scrollMarginTop = '1rem'
  place()
  if (run !== pending) return stop()
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

/**
 * Starts listening. Called from preview.tsx rather than run on import: the
 * package's `sideEffects` field would let the bundler drop a bare import.
 */
export function listenForSearchScroll() {
  addons.getChannel().on(SCROLL_EVENT, scrollToHit)
}
