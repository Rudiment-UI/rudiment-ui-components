// Every `?path=/docs/…` and `?path=/story/…` link in the docs must point at a page that
// exists. Storybook builds an entry's id from its title, so moving a page in the sidebar
// changes its URL. This computes the ids the same way, from the source files.
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { sanitize, storyNameFromExport, toId } from 'storybook/internal/csf'

const root = resolve(__dirname, '../..')

function walk(dir: string, accept: (name: string) => boolean): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name === 'node_modules' || e.name.startsWith('.')) return []
    const full = join(dir, e.name)
    return e.isDirectory() ? walk(full, accept) : accept(e.name) ? [full] : []
  })
}

const sourceDirs = [join(root, 'src'), join(root, '.storybook')]
const storyFiles = sourceDirs.flatMap((d) => walk(d, (n) => /\.stories\.tsx?$/.test(n)))
const mdxFiles = walk(join(root, 'src/docs'), (n) => n.endsWith('.mdx'))

const ids = new Set<string>()
const componentTitles: string[] = []
for (const file of storyFiles) {
  const source = readFileSync(file, 'utf8')
  // The meta title starts with a sidebar section; other `title:` keys are story data.
  const title = /^\s*title:\s*'((?:Getting Started|Components|Layouts|Typography|Patterns)\/[^']+)'/m.exec(source)?.[1]
  if (!title) continue
  if (title.startsWith('Components/')) componentTitles.push(title)
  ids.add(`${sanitize(title)}--docs`)
  for (const [, name] of source.matchAll(/^export const (\w+)\b/gm)) {
    ids.add(toId(title, storyNameFromExport(name)))
  }
}
for (const file of mdxFiles) {
  const title = /<Meta\s+title="([^"]+)"/.exec(readFileSync(file, 'utf8'))?.[1]
  if (title) ids.add(`${sanitize(title)}--docs`)
}

const linkFiles = [
  ...sourceDirs.flatMap((d) => walk(d, (n) => /\.(mdx|tsx?|mjs)$/.test(n))),
  join(root, 'README.md'),
]
const links = linkFiles.flatMap((file) =>
  [...readFileSync(file, 'utf8').matchAll(/path=\/(?:docs|story)\/([a-z0-9-]+--[a-z0-9-]+)/g)].map(
    ([, id]) => ({ file: relative(root, file), id }),
  ),
)

describe('docs links', () => {
  it('found the pages and the links', () => {
    expect(ids.size).toBeGreaterThan(100)
    expect(links.length).toBeGreaterThan(50)
  })

  it('every link points at an existing page or story', () => {
    const broken = links.filter((l) => !ids.has(l.id)).map((l) => `${l.file}: ${l.id}`)
    expect(broken).toEqual([])
  })

  it('the Components overview lists every component page', () => {
    const overview = readFileSync(join(root, 'src/docs/ComponentsOverview.mdx'), 'utf8')
    const missing = componentTitles.filter((t) => !overview.includes(`path=/docs/${sanitize(t)}--docs`))
    expect(missing).toEqual([])
  })

  it('every component sits in a category: Components/<Category>/<Name>', () => {
    const flat = componentTitles.filter((t) => t.split('/').length < 3)
    expect(flat).toEqual([])
  })
})
