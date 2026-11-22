/**
 * Markdown rendering for the rudiment-ui API manifest (`dist/components.json`).
 *
 * Pure functions with no dependencies, so they can ship in the published package.
 * `scripts/component-docs.mjs` uses them at build time to write `dist/llms*.txt`,
 * and `mcp/server.mjs` uses them at runtime to answer tool calls.
 */

const cell = (s) => String(s ?? '').replaceAll('|', '\\|').replace(/\s*\n\s*/g, ' ')

/** First sentence of a description, ignoring the periods in "e.g." and similar. */
export function firstSentence(s = '') {
  const flat = s.replace(/\s+/g, ' ').trim()
  return (flat.match(/^(?:e\.g\.|i\.e\.|etc\.|vs\.|[^.!?])*[.!?](?=\s|$)/)?.[0] ?? flat).trim()
}

const fence = (code, lang = 'tsx') => (code.startsWith('```') ? code : '```' + lang + '\n' + code + '\n```')

function propTable(props) {
  const rows = props.map(
    (p) =>
      `| \`${p.name}\`${p.required ? ' *(required)*' : ''} | \`${cell(p.type)}\` | ${p.default !== undefined ? `\`${cell(p.default)}\`` : ''} | ${cell(p.deprecated ? `**Deprecated.** ${p.description}` : p.description)} |`,
  )
  return ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...rows].join('\n')
}

/**
 * One component (and its compound parts) as Markdown.
 * `inheritedDetail: true` lists inherited React Aria props with types and summaries
 * instead of names only.
 */
export function componentMarkdown(c, { depth = 3, inheritedDetail = false } = {}) {
  const h = '#'.repeat(depth)
  const out = [`${h} ${c.name}`, '']
  if (c.reexportedFrom) out.push(`Re-exported unchanged from \`${c.reexportedFrom}\`.`, '')
  if (c.description) out.push(c.description, '')
  for (const ex of c.examples ?? []) out.push(fence(ex), '')
  const own = c.props.filter((p) => p.origin === 'own' || p.origin === 'dom')
  const inherited = c.props.filter((p) => p.origin === 'react-aria' || p.origin === 'other')
  if (own.length) out.push(propTable(own), '')
  if (inherited.length) {
    if (inheritedDetail) {
      out.push(`Inherited from React Aria (${inherited.length}):`, '')
      out.push(
        inherited
          .map((p) => `- \`${p.name}${p.required ? '' : '?'}: ${p.type}\`${p.description ? ` — ${firstSentence(p.description)}` : ''}`)
          .join('\n'),
        '',
      )
    } else {
      out.push(
        `Inherited from React Aria (types and descriptions in \`components.json\`): ${inherited.map((p) => `\`${p.name}\``).join(', ')}.`,
        '',
      )
    }
  }
  const extras = []
  if (c.refElement) extras.push(`\`ref\` forwards to \`${c.refElement}\`.`)
  if (c.ariaGlobals) extras.push(`Also accepts React Aria's global DOM props (\`${c.ariaGlobals.join('`, `')}\`).`)
  if (c.domAttributes?.length) extras.push(`Spreads remaining props onto the DOM element (\`${c.domAttributes.join('`, `')}\`).`)
  if (extras.length) out.push(extras.join(' '), '')
  for (const part of c.parts ?? []) out.push(componentMarkdown(part, { depth: depth + 1, inheritedDetail }))
  return out.join('\n')
}

export function functionMarkdown(f, depth = 3) {
  const out = [`${'#'.repeat(depth)} ${f.name}`, '', f.description, '', fence(f.signature, 'ts'), '']
  for (const ex of f.examples ?? []) out.push(fence(ex), '')
  return out.join('\n')
}

export function typeMarkdown(t, depth = 3) {
  const out = [`${'#'.repeat(depth)} ${t.name}`, '']
  if (t.description) out.push(t.description, '')
  if (t.definition) out.push(fence(`type ${t.name} = ${t.definition}`, 'ts'), '')
  if (t.fields) out.push(propTable(t.fields), '')
  return out.join('\n')
}

/** One line per component and part: "- `RudiButton` — summary". */
export function componentIndex(api) {
  const lines = []
  for (const c of api.components) {
    lines.push(`- \`${c.name}\` — ${firstSentence(c.description) || (c.reexportedFrom ? `re-export from ${c.reexportedFrom}` : '')}`)
    for (const p of c.parts ?? []) lines.push(`  - \`${p.name}\` — ${firstSentence(p.description)}`)
  }
  return lines.join('\n')
}

/**
 * `full: false` gives the short llms.txt: conventions plus a one-line index.
 * `full: true` gives llms-full.txt with every prop table.
 */
export function renderMarkdown(api, { full = true } = {}) {
  const out = [api.conventions.trim(), '', '## Component index', '']
  if (!full)
    out.push(
      'Props, defaults and examples for each component are in `llms-full.txt` next to this file. Search it for `### RudiName`. The `.d.ts` files carry the same JSDoc.',
      '',
    )
  out.push(componentIndex(api))
  if (!full) {
    out.push('', '## Functions and hooks', '')
    for (const f of api.functions) out.push(`- \`${f.name}\` — ${firstSentence(f.description)}`)
    return tidy(out)
  }
  out.push('', '## Components', '')
  for (const c of api.components) out.push(componentMarkdown(c))
  out.push('## Functions and hooks', '')
  for (const f of api.functions) out.push(functionMarkdown(f))
  out.push('## Supporting types', '')
  for (const t of api.types) out.push(typeMarkdown(t))
  return tidy(out)
}

const tidy = (lines) => lines.join('\n').replace(/\n{3,}/g, '\n\n') + '\n'
