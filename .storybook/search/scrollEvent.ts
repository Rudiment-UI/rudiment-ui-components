// Channel event the manager's search dialog sends after navigating, so the
// preview can scroll to the chosen section (scrollToHit.ts).
export const SCROLL_EVENT = 'rudiment/search/scroll'

export type ScrollPayload = { docsId: string; anchor?: string }
