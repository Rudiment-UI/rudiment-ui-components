// @vitest-environment node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildManifest } from '../scripts/component-docs.mjs'

/**
 * Drives the real server binary over stdio, the way an MCP client does. The manifest is
 * generated fresh from src, so the test doesn't depend on a previous `npm run build`.
 */
const SERVER = path.join(path.dirname(fileURLToPath(import.meta.url)), 'server.mjs')
let child
let nextId = 1
const pending = new Map()
let manifestDir

function request(method, params) {
  const id = nextId++
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
  return new Promise((resolve) => pending.set(id, resolve))
}
const call = async (name, args = {}) => (await request('tools/call', { name, arguments: args })).result

beforeAll(async () => {
  manifestDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rudi-mcp-'))
  const manifest = path.join(manifestDir, 'components.json')
  fs.writeFileSync(manifest, JSON.stringify(buildManifest()))
  child = spawn(process.execPath, [SERVER], { env: { ...process.env, RUDIMENT_UI_MANIFEST: manifest } })
  let buffer = ''
  child.stdout.on('data', (chunk) => {
    buffer += chunk
    let nl
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const message = JSON.parse(buffer.slice(0, nl))
      buffer = buffer.slice(nl + 1)
      pending.get(message.id)?.(message)
      pending.delete(message.id)
    }
  })
}, 60_000)

afterAll(() => {
  child?.kill()
  fs.rmSync(manifestDir, { recursive: true, force: true })
})

describe('rudiment-ui MCP server', () => {
  it('completes the initialize handshake and negotiates the protocol version', async () => {
    const { result } = await request('initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'test', version: '1' },
    })
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
    expect(result.protocolVersion).toBe('2025-06-18')
    expect(result.serverInfo.name).toBe('rudiment-ui')
    expect(result.capabilities.tools).toBeDefined()
    expect(result.instructions).toMatch(/get_conventions/)
  })

  it('answers an unknown protocol version with its latest supported one', async () => {
    const { result } = await request('initialize', { protocolVersion: '1999-01-01', capabilities: {} })
    expect(result.protocolVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result.protocolVersion).not.toBe('1999-01-01')
  })

  it('lists four read-only tools with input schemas', async () => {
    const { result } = await request('tools/list')
    expect(result.tools.map((t) => t.name)).toEqual(['get_conventions', 'list_components', 'get_component', 'search'])
    for (const tool of result.tools) {
      expect(tool.inputSchema.type).toBe('object')
      expect(tool.annotations.readOnlyHint).toBe(true)
      expect(tool.description.length).toBeGreaterThan(40)
    }
  })

  it('get_conventions returns the library rules', async () => {
    const text = (await call('get_conventions')).content[0].text
    expect(text).toMatch(/onPress/)
    expect(text).toMatch(/data-theme/)
  })

  it('list_components filters by category and query', async () => {
    const layouts = (await call('list_components', { category: 'layout' })).content[0].text
    expect(layouts).toMatch(/RudiStack/)
    expect(layouts).not.toMatch(/RudiButton/)
    const dates = (await call('list_components', { query: 'date' })).content[0].text
    expect(dates).toMatch(/RudiDatePicker/)
  })

  it('get_component resolves names with or without the prefix, including parts', async () => {
    for (const name of ['RudiButton', 'Button', 'button']) {
      const text = (await call('get_component', { name })).content[0].text
      expect(text).toMatch(/^## RudiButton/)
      expect(text).toMatch(/\| `variant` \|.*`'primary'`/)
      expect(text).toMatch(/onPress/)
    }
    const part = (await call('get_component', { name: 'card.header' })).content[0].text
    expect(part).toMatch(/^## RudiCard\.Header/)
    expect(part).toMatch(/Part of `RudiCard`/)
  })

  it('get_component can expand inherited React Aria props', async () => {
    const text = (await call('get_component', { name: 'RudiButton', includeInherited: true })).content[0].text
    expect(text).toMatch(/- `onPress\?: \(e: PressEvent\) => void` — /)
  })

  it('get_component covers functions and types', async () => {
    expect((await call('get_component', { name: 'rudiToast' })).content[0].text).toMatch(/^## rudiToast/)
    expect((await call('get_component', { name: 'RudiStepperStep' })).content[0].text).toMatch(/\| Prop \|/)
  })

  it('get_component reports a tool error with suggestions for unknown names', async () => {
    const result = await call('get_component', { name: 'Buton' })
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toMatch(/Did you mean: RudiButton/)
  })

  it('search finds props by behaviour', async () => {
    const text = (await call('search', { query: 'sticky header' })).content[0].text
    expect(text).toMatch(/RudiTable` prop `stickyHeader/)
  })

  it('serves the conventions and manifest as resources', async () => {
    const { result } = await request('resources/list')
    expect(result.resources.map((r) => r.uri)).toContain('rudiment-ui://conventions')
    const read = await request('resources/read', { uri: 'rudiment-ui://components.json' })
    expect(JSON.parse(read.result.contents[0].text).components.length).toBeGreaterThan(50)
  })

  it('returns JSON-RPC errors for unknown methods and tools', async () => {
    expect((await request('does/not/exist')).error.code).toBe(-32601)
    expect((await request('tools/call', { name: 'nope' })).error.code).toBe(-32602)
  })
})
