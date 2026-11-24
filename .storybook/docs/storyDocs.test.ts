// Every example on a component, layout or typography docs page needs a line
// of prose saying when and why to use it (CONTRIBUTING.md → "Writing
// component docs"). Pages not yet migrated to that convention are listed in
// UNMIGRATED, which shrinks as each batch lands (plans/tailwind-grade-docs.md).

type StoryLike = {
  tags?: string[]
  parameters?: { docs?: { description?: { story?: string } } }
}
type StoryModule = Record<string, unknown> & {
  default: { title: string; tags?: string[] }
}

const modules = import.meta.glob<StoryModule>(
  [
    '../../src/components/**/*.stories.tsx',
    '../../src/layouts/**/*.stories.tsx',
    '../../src/typography/**/*.stories.tsx',
  ],
  { eager: true },
)

/** Pages still to migrate. Delete each title as its page is rewritten. */
const UNMIGRATED = new Set<string>([
  'Layouts/Box',
  'Layouts/Center',
  'Layouts/Cluster',
  'Layouts/Cover',
  'Layouts/Grid',
  'Layouts/Sidebar',
  'Layouts/Stack',
  'Layouts/Switcher',
  'Typography/Heading',
  'Typography/Prose',
  'Typography/Text',
])

const isStory = (value: unknown): value is StoryLike =>
  typeof value === 'object' || typeof value === 'function'

/** The examples a page shows, with the names of those that lack prose. */
const pages = Object.values(modules)
  .filter((mod) => !mod.default.tags?.includes('!autodocs'))
  .map((mod) => {
    const stories = Object.entries(mod).filter(
      ([name, value]) =>
        name !== 'default' &&
        name !== '__namedExportsOrder' &&
        isStory(value) &&
        !(value as StoryLike).tags?.includes('!autodocs'),
    ) as [string, StoryLike][]
    const missing = stories
      .filter(([, story]) => !story.parameters?.docs?.description?.story?.trim())
      .map(([name]) => name)
    return { title: mod.default.title, count: stories.length, missing }
  })

describe('component docs examples', () => {
  it('found the docs pages', () => {
    expect(pages.length).toBeGreaterThan(50)
  })

  it.each(pages.filter((p) => !UNMIGRATED.has(p.title)).map((p) => [p.title, p]))(
    '%s describes every example',
    (_title, page) => {
      expect(page.count).toBeGreaterThan(0)
      expect(
        page.missing,
        'Add parameters.docs.description.story to these stories',
      ).toEqual([])
    },
  )

  it('lists only pages that exist and still need migrating', () => {
    const byTitle = new Map(pages.map((p) => [p.title, p]))
    for (const title of UNMIGRATED) {
      const page = byTitle.get(title)
      expect(page, `${title} is not a docs page`).toBeDefined()
      expect(
        page!.missing.length,
        `${title} is fully described; remove it from UNMIGRATED`,
      ).toBeGreaterThan(0)
    }
  })
})
