import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { findIconNames, main, stripComments, subsetCollection } from './icons.mjs'

const SET = {
  prefix: 'tst',
  width: 24,
  height: 24,
  info: { name: 'Test set' },
  icons: {
    close: { body: '<path d="M6 6l12 12"/>' },
    check: { body: '<path d="M5 12l5 5"/>' },
    star: { body: '<path d="M12 2l3 7"/>' },
  },
  aliases: { x: { parent: 'close' }, cross: { parent: 'x' } },
}

describe('findIconNames', () => {
  it('finds prefix:name string literals in any quote style', () => {
    const code = `<Icon icon="mdi:close" /> const a = 'lucide:chevron-right'; const b = \`tst:x\``
    expect([...findIconNames(code)].sort()).toEqual(['lucide:chevron-right', 'mdi:close', 'tst:x'])
  })

  it('ignores comments, URLs, and strings without a colon', () => {
    const code = `'use client'
      /** <RudiIcon icon="mdi:home" /> */
      // icon="mdi:delete"
      const url = "https://example.com"
      const icon = "tst:check" // trailing comment "mdi:skip"`
    expect([...findIconNames(code)]).toEqual(['tst:check'])
  })

  it('keeps code after a URL inside a string', () => {
    expect(stripComments(`const u = "https://x.dev"; const i = "tst:star"`)).toContain('tst:star')
  })
})

describe('subsetCollection', () => {
  it('copies only the requested icons and the collection defaults', () => {
    const { subset, missing } = subsetCollection(SET, ['check'])
    expect(subset).toEqual({ prefix: 'tst', width: 24, height: 24, icons: { check: SET.icons.check } })
    expect(missing).toEqual([])
  })

  it('brings an alias chain with its parent icon', () => {
    const { subset } = subsetCollection(SET, ['cross'])
    expect(subset.icons).toEqual({ close: SET.icons.close })
    expect(subset.aliases).toEqual({ cross: { parent: 'x' }, x: { parent: 'close' } })
  })

  it('reports names the set does not contain', () => {
    expect(subsetCollection(SET, ['nope', 'star']).missing).toEqual(['nope'])
  })
})

describe('rudiment-ui-icons CLI', () => {
  let dir
  let logs
  const log = {
    log: (m) => logs.push(['log', m]),
    warn: (m) => logs.push(['warn', m]),
    error: (m) => logs.push(['error', m]),
  }
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    fs.writeFileSync(path.join(dir, file), text)
  }
  const output = () => JSON.parse(fs.readFileSync(path.join(dir, 'src/rudiment-icons.json'), 'utf8')).tst

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rudi-icons-'))
    logs = []
    write('package.json', '{"name":"app"}')
    write('node_modules/@iconify-json/tst/package.json', '{"name":"@iconify-json/tst"}')
    write('node_modules/@iconify-json/tst/icons.json', JSON.stringify(SET))
    write('src/App.tsx', `<RudiIcon icon="tst:check" /><RudiButton iconBefore="tst:x" />`)
    write('src/node_modules/ignored.tsx', `"tst:star"`)
  })
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }))

  it('writes the icons the source uses from installed sets', () => {
    expect(main([], dir, log)).toBe(0)
    const collection = output()
    expect(Object.keys(collection.icons).sort()).toEqual(['check', 'close'])
    expect(collection.aliases).toEqual({ x: { parent: 'close' } })
    expect(collection.info).toBeUndefined()
  })

  it('reports prefixes with no installed set and names missing from a set', () => {
    write('src/More.tsx', `"lucide:menu" "tst:typo"`)
    expect(main([], dir, log)).toBe(0)
    expect(logs).toContainEqual(['warn', 'Not found in its installed icon set: tst:typo'])
    expect(logs.some(([, m]) => m.includes('no installed icon set: lucide'))).toBe(true)
  })

  it('--check passes when current and fails after a new icon appears', () => {
    main([], dir, log)
    expect(main(['--check'], dir, log)).toBe(0)
    write('src/New.tsx', `"tst:star"`)
    expect(main(['--check'], dir, log)).toBe(1)
    expect(Object.keys(output().icons)).not.toContain('star')
  })

  it('takes directories and an output path', () => {
    write('app/page.tsx', `"tst:star"`)
    expect(main(['app', '--out', 'icons/out.json'], dir, log)).toBe(0)
    const { tst: collection } = JSON.parse(fs.readFileSync(path.join(dir, 'icons/out.json'), 'utf8'))
    expect(Object.keys(collection.icons)).toEqual(['star'])
  })

  it('fails on a missing directory or an unknown option', () => {
    expect(main(['nowhere'], dir, log)).toBe(2)
    expect(main(['--bogus'], dir, log)).toBe(2)
  })
})
