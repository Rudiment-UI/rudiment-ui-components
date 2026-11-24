// Maps a story title to its usage-guidelines file in src/docs/guidelines/.
// A component's guidelines live in `<ComponentName>.mdx` (the last title
// segment) unless it shares a section with another component, listed here.
// Keyed by name, so moving a component to another sidebar category changes nothing.
const SHARED: Record<string, string> = {
  Checkbox: 'CheckboxVsSwitch',
  Switch: 'CheckboxVsSwitch',
  KanbanBoard: 'Kanban',
  SectionHeader: 'PageHeader',
}

/** The guidelines file name (without `.mdx`) for a `Components/<Category>/<Name>` story title. */
export function guidelineKey(title: string): string | undefined {
  if (!title.startsWith('Components/')) return undefined
  if (title.includes('/Charts/')) return 'Charts'
  const name = title.split('/').pop()!
  return SHARED[name] ?? name
}
