#!/usr/bin/env node
/**
 * rudiment-ui MCP server.
 *
 * Serves the API reference of the *installed* rudiment-ui version to coding agents
 * over the Model Context Protocol (stdio transport). It reads `dist/components.json`,
 * which the build generates from the TypeScript source and JSDoc, so its answers
 * always match the code in node_modules.
 *
 * It has no dependencies: stdio MCP is newline-delimited JSON-RPC 2.0, and a UI library
 * shouldn't make every consumer install an SDK for an optional dev tool.
 *
 * Run: `npx rudiment-ui-mcp` (see mcp/README.md for client setup).
 * Override the manifest location with RUDIMENT_UI_MANIFEST=/path/to/components.json.
 */
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import { componentIndex, componentMarkdown, firstSentence, functionMarkdown, typeMarkdown } from './render.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const MANIFEST = process.env.RUDIMENT_UI_MANIFEST ?? path.join(HERE, '../dist/components.json')
const SUPPORTED_PROTOCOLS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05']
const CATEGORIES = ['component', 'layout', 'typography', 'chart']

const INSTRUCTIONS = `Reference for the rudiment-ui React component library, generated from the installed version's source.

Workflow:
1. Call get_conventions once before writing UI code with rudiment-ui. The library has rules that differ from other React libraries: onPress instead of onClick, onChange receives a value, label is a required prop, icons are Iconify name strings, and layout spacing takes CSS lengths.
2. Call list_components to find candidates, or search when you know the behaviour you need but not the name (for example "drawer", "sortable", "required asterisk").
3. Call get_component for each component before using it. It returns every prop with its type, default and description, along with examples and compound parts (RudiCard.Header, …).

Prefer these answers over memory: they match the installed version exactly.`

// ------------------------------------------------------------------ data

let cache = null
function loadApi() {
  if (cache) return cache
  if (!fs.existsSync(MANIFEST)) {
    throw new ToolError(
      `rudiment-ui manifest not found at ${MANIFEST}. In the rudiment-ui repo, run \`npm run build\`. In a consumer project, reinstall rudiment-ui.`,
    )
  }
  const api = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  const entries = []
  for (const c of api.components) {
    entries.push({ kind: 'component', item: c, category: c.category })
    for (const p of c.parts ?? []) entries.push({ kind: 'component', item: p, category: c.category, parent: c.name })
  }
  for (const f of api.functions) entries.push({ kind: 'function', item: f })
  for (const t of api.types) entries.push({ kind: 'type', item: t })
  cache = { api, entries }
  return cache
}

/** "button", "Button", "RudiButton", "rudi-button" and "card.header" all resolve. */
const normalise = (name) =>
  String(name)
    .trim()
    .replace(/^<|\/?>$/g, '')
    .replace(/[-_\s]/g, '')
    .toLowerCase()
    .replace(/^rudi(?=.)/, '')

function findEntry(name) {
  const { entries } = loadApi()
  const key = normalise(name)
  return entries.find((e) => normalise(e.item.name) === key) ?? null
}

/** Closest names for a typo, by shared-prefix and substring match. */
function suggestions(name, limit = 5) {
  const key = normalise(name)
  const { entries } = loadApi()
  return entries
    .map((e) => {
      const n = normalise(e.item.name)
      let score = 0
      if (n.includes(key) || key.includes(n)) score += 10
      let i = 0
      while (i < n.length && i < key.length && n[i] === key[i]) i++
      score += i
      return { name: e.item.name, score }
    })
    .filter((s) => s.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.name)
}

// ----------------------------------------------------------------- tools

class ToolError extends Error {}

const TOOLS = [
  {
    name: 'get_conventions',
    title: 'Get rudiment-ui conventions',
    description:
      'Library-wide rules for writing code with rudiment-ui: setup, the Rudi prefix, onPress/onChange semantics, required labels, Iconify icons, layout primitives, theming with data-theme, and token overrides. Call it once before writing UI code.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
    run() {
      const { api } = loadApi()
      return `${api.conventions}\n\n---\n${api.components.length} components. Call list_components to browse them or get_component for props.`
    },
  },
  {
    name: 'list_components',
    title: 'List rudiment-ui components',
    description:
      'Every rudiment-ui component and compound part with a one-line summary. Filter by category, or by a case-insensitive substring of the name or summary.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: CATEGORIES, description: 'Only components in this group.' },
        query: { type: 'string', description: 'Case-insensitive substring of the name or summary, e.g. "date" or "chart".' },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    run({ category, query } = {}) {
      const { api } = loadApi()
      if (category && !CATEGORIES.includes(category)) throw new ToolError(`category must be one of: ${CATEGORIES.join(', ')}`)
      const q = query?.toLowerCase()
      const matches = (c) => !q || c.name.toLowerCase().includes(q) || (c.description ?? '').toLowerCase().includes(q)
      const picked = api.components
        .filter((c) => !category || c.category === category)
        .map((c) => (matches(c) ? c : { ...c, parts: (c.parts ?? []).filter(matches), _viaPart: true }))
        .filter((c) => !c._viaPart || c.parts.length)
      if (!picked.length) return `No components match${category ? ` category "${category}"` : ''}${q ? ` and "${query}"` : ''}. Try search for prop-level matches.`
      const header = `${picked.length} component${picked.length === 1 ? '' : 's'}${category ? ` (${category})` : ''}. Call get_component for props.`
      return `${header}\n\n${componentIndex({ components: picked })}`
    },
  },
  {
    name: 'get_component',
    title: 'Get a rudiment-ui component',
    description:
      'Full reference for one export: summary, examples, a props table (type, default, required, description), compound parts, the element ref forwards to, and props inherited from React Aria. Accepts component names with or without the Rudi prefix ("Button", "RudiCard.Header"), and functions or types (rudiToast, useChartTheme, RudiStepperStep).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Export name, e.g. "RudiSelect", "Select", "RudiAppShell.Sidebar", "rudiToast".' },
        includeInherited: {
          type: 'boolean',
          description: 'List inherited React Aria props with their types and summaries rather than names only. Defaults to false.',
        },
      },
      required: ['name'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    run({ name, includeInherited = false } = {}) {
      if (!name || typeof name !== 'string') throw new ToolError('`name` is required, e.g. "RudiButton".')
      const entry = findEntry(name)
      if (!entry) {
        const near = suggestions(name)
        throw new ToolError(`No export named "${name}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''} Call list_components to see all names.`)
      }
      if (entry.kind === 'function') return functionMarkdown(entry.item, 2)
      if (entry.kind === 'type') return typeMarkdown(entry.item, 2)
      const c = entry.item
      const lines = [componentMarkdown(c, { depth: 2, inheritedDetail: includeInherited })]
      const meta = [`Import: \`import { ${(entry.parent ?? c.name).split('.')[0]} } from 'rudiment-ui'\``]
      if (entry.parent) meta.push(`Part of \`${entry.parent}\`; use it as \`<${c.name}>\`.`)
      if (c.source) meta.push(`Source: \`${c.source}\``)
      return `${lines.join('\n')}\n${meta.join('  \n')}\n`
    },
  },
  {
    name: 'search',
    title: 'Search the rudiment-ui API',
    description:
      'Find components, props, functions and types by keyword across names and descriptions. Use it when you know the behaviour you need but not which component or prop provides it, e.g. "dismiss", "sticky header", "aria-label required".',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'One or more keywords. All of them must match.' },
        limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Maximum results. Defaults to 20.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    run({ query, limit = 20 } = {}) {
      if (!query || typeof query !== 'string') throw new ToolError('`query` is required.')
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
      const { entries } = loadApi()
      const hits = []
      const score = (name, text) => {
        const hay = `${name} ${text}`.toLowerCase()
        if (!terms.every((t) => hay.includes(t))) return 0
        return terms.reduce((s, t) => s + (name.toLowerCase().includes(t) ? 3 : 1), 0)
      }
      for (const e of entries) {
        const it = e.item
        const s = score(it.name, it.description ?? '')
        if (s) hits.push({ s: s + 2, line: `- \`${it.name}\` (${e.kind}) — ${firstSentence(it.description ?? '')}` })
        for (const p of e.kind === 'component' ? it.props.filter((p) => p.origin === 'own') : (it.fields ?? [])) {
          const ps = score(p.name, `${p.type} ${p.description ?? ''}`)
          if (ps) hits.push({ s: ps, line: `- \`${it.name}\` prop \`${p.name}: ${p.type}\` — ${firstSentence(p.description ?? '')}` })
        }
      }
      if (!hits.length) return `No matches for "${query}". Try fewer or broader keywords, or list_components.`
      hits.sort((a, b) => b.s - a.s)
      const shown = hits.slice(0, limit)
      return `${hits.length} match${hits.length === 1 ? '' : 'es'}${hits.length > shown.length ? `, showing ${shown.length}` : ''}. Call get_component for full details.\n\n${shown.map((h) => h.line).join('\n')}`
    },
  },
]

// ------------------------------------------------------------- resources

const RESOURCES = [
  {
    uri: 'rudiment-ui://conventions',
    name: 'conventions',
    title: 'rudiment-ui conventions',
    description: 'Library-wide rules: setup, props semantics, theming, tokens.',
    mimeType: 'text/markdown',
    read: () => loadApi().api.conventions,
  },
  {
    uri: 'rudiment-ui://components.json',
    name: 'components.json',
    title: 'rudiment-ui API manifest',
    description: 'Every export, prop, default and inherited prop as JSON.',
    mimeType: 'application/json',
    read: () => fs.readFileSync(MANIFEST, 'utf8'),
  },
]

// --------------------------------------------------------------- JSON-RPC

const PKG_VERSION = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(HERE, '../package.json'), 'utf8')).version
  } catch {
    return '0.0.0'
  }
})()

class RpcError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

const handlers = {
  initialize(params = {}) {
    const requested = params.protocolVersion
    return {
      protocolVersion: SUPPORTED_PROTOCOLS.includes(requested) ? requested : SUPPORTED_PROTOCOLS[0],
      capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
      serverInfo: { name: 'rudiment-ui', title: 'rudiment-ui component reference', version: PKG_VERSION },
      instructions: INSTRUCTIONS,
    }
  },
  ping: () => ({}),
  'tools/list': () => ({ tools: TOOLS.map(({ run, ...t }) => t) }),
  'tools/call'(params = {}) {
    const tool = TOOLS.find((t) => t.name === params.name)
    if (!tool) throw new RpcError(-32602, `Unknown tool: ${params.name}`)
    try {
      return { content: [{ type: 'text', text: tool.run(params.arguments ?? {}) }] }
    } catch (err) {
      if (err instanceof ToolError) return { content: [{ type: 'text', text: err.message }], isError: true }
      throw err
    }
  },
  'resources/list': () => ({ resources: RESOURCES.map(({ read, ...r }) => r) }),
  'resources/templates/list': () => ({ resourceTemplates: [] }),
  'resources/read'(params = {}) {
    const res = RESOURCES.find((r) => r.uri === params.uri)
    if (!res) throw new RpcError(-32002, `Resource not found: ${params.uri}`)
    try {
      return { contents: [{ uri: res.uri, mimeType: res.mimeType, text: res.read() }] }
    } catch (err) {
      throw new RpcError(-32603, err.message)
    }
  },
}

function send(message) {
  process.stdout.write(JSON.stringify(message) + '\n')
}

function handle(message) {
  if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    if (message && 'id' in message && !('method' in message)) return // a response to us; we send no requests
    return send({ jsonrpc: '2.0', id: message?.id ?? null, error: { code: -32600, message: 'Invalid Request' } })
  }
  const isNotification = !('id' in message)
  const handler = handlers[message.method]
  if (isNotification) return // notifications/initialized, notifications/cancelled, …: nothing to do
  if (!handler) return send({ jsonrpc: '2.0', id: message.id, error: { code: -32601, message: `Method not found: ${message.method}` } })
  try {
    send({ jsonrpc: '2.0', id: message.id, result: handler(message.params) })
  } catch (err) {
    const code = err instanceof RpcError ? err.code : -32603
    send({ jsonrpc: '2.0', id: message.id, error: { code, message: err.message } })
  }
}

const rl = readline.createInterface({ input: process.stdin })
rl.on('line', (line) => {
  if (!line.trim()) return
  let message
  try {
    message = JSON.parse(line)
  } catch {
    return send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } })
  }
  handle(message)
})
rl.on('close', () => process.exit(0))
process.stderr.write(`rudiment-ui MCP server ${PKG_VERSION} ready (manifest: ${MANIFEST})\n`)
