import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { guidelineKey } from './guidelineKeys'

const root = resolve(__dirname, '../..')
const guidelinesDir = join(root, 'src/docs/guidelines')
const files = new Set(
  readdirSync(guidelinesDir).map((f) => f.replace(/\.mdx$/, '')),
)
const overview = readFileSync(
  join(root, 'src/docs/ComponentGuidelines.mdx'),
  'utf8',
)

function storyFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? storyFiles(join(dir, e.name))
      : e.name.endsWith('.stories.tsx')
        ? [join(dir, e.name)]
        : [],
  )
}

const componentTitles = storyFiles(join(root, 'src/components'))
  .map((f) => /^\s*title:\s*'(Components\/[^']+)'/m.exec(readFileSync(f, 'utf8'))?.[1])
  .filter((t): t is string => t?.startsWith('Components/') ?? false)

describe('component usage guidelines', () => {
  it('found the component stories', () => {
    expect(componentTitles.length).toBeGreaterThan(40)
  })

  it.each(componentTitles)('%s has a guidelines file', (title) => {
    expect(files).toContain(guidelineKey(title))
  })

  it('every guidelines file is used by a component and the overview page', () => {
    const used = new Set(componentTitles.map(guidelineKey))
    for (const file of files) {
      expect(used, `${file}.mdx is not mapped to any story`).toContain(file)
      expect(
        overview,
        `${file}.mdx is missing from ComponentGuidelines.mdx`,
      ).toContain(`./guidelines/${file}.mdx`)
    }
  })

  it('leaves non-component titles alone', () => {
    expect(guidelineKey('Layouts/Stack')).toBeUndefined()
  })
})
