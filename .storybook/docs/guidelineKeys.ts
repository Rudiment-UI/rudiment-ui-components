// Maps a story title to its usage-guidelines file in src/docs/guidelines/.
// A component's guidelines live in `<LastTitleSegment>.mdx` unless it shares
// a section with another component, listed here.
const SHARED: Record<string, string> = {
  'Components/Checkbox': 'CheckboxVsSwitch',
  'Components/Switch': 'CheckboxVsSwitch',
  'Components/KanbanBoard': 'Kanban',
  'Components/SectionHeader': 'PageHeader',
}

/** The guidelines file name (without `.mdx`) for a `Components/*` story title. */
export function guidelineKey(title: string): string | undefined {
  if (!title.startsWith('Components/')) return undefined
  if (title.startsWith('Components/Charts/')) return 'Charts'
  return SHARED[title] ?? title.split('/').pop()
}
