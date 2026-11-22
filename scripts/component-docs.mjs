#!/usr/bin/env node
/**
 * Builds the agent-facing API reference from the TypeScript source.
 *
 * Walks every export of `src/index.ts`, resolves component props through the
 * type checker, and writes:
 *   - dist/components.json  machine-readable manifest
 *   - dist/llms.txt         conventions + one-line component index (read first)
 *   - dist/llms-full.txt    conventions + every component's props, defaults, examples
 *
 * Markdown rendering lives in `mcp/render.mjs` so the MCP server can ship it.
 * JSDoc on the source interfaces is the single source of truth. Run after
 * `vite build` (see the `build` script); `src/component-docs.test.ts` uses
 * `collectApi()` to fail when an export or own prop is undocumented.
 */
import ts from 'typescript'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderMarkdown } from '../mcp/render.mjs'

/**
 * React Aria interfaces that every component inherits and that say nothing
 * component-specific. They are summarised in one line instead of listed.
 */
const SUMMARISED_ARIA = new Set(['GlobalDOMEvents', 'GlobalDOMAttributes', 'DOMRenderProps', 'PossibleLinkDOMRenderProps', 'SlotProps'])

/** The DOM props worth listing in a component's own table, with house wording. */
const DOM_PROP_DOCS = {
  children: 'Content.',
  className: "Extra class names, merged with the component's own classes.",
}

const declaringInterface = (decl) =>
  decl.parent && (ts.isInterfaceDeclaration(decl.parent) || ts.isTypeLiteralNode(decl.parent))
    ? (decl.parent.name?.text ?? decl.parent.parent?.name?.text ?? '')
    : ''

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENTRY = path.join(ROOT, 'src/index.ts')

/** Where a prop was declared, which decides how much of it we print. */
function originOf(fileName) {
  const f = fileName.replaceAll('\\', '/')
  if (!f.includes('/node_modules/')) return 'own'
  if (/\/node_modules\/(@react-types|@react-aria|react-aria|react-aria-components|react-stately|@react-stately|@internationalized)\//.test(f))
    return 'react-aria'
  if (f.includes('/node_modules/@types/react/')) return 'dom'
  return 'other'
}

function createProgram() {
  const configPath = path.join(ROOT, 'tsconfig.json')
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, ROOT)
  return ts.createProgram({ rootNames: [ENTRY], options: { ...parsed.options, noEmit: true } })
}

function docOf(symbol, checker) {
  const description = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()
  const tags = {}
  for (const tag of symbol.getJsDocTags(checker)) {
    const text = ts.displayPartsToString(tag.text ?? []).trim()
    if (tag.name === 'example') (tags.examples ??= []).push(text)
    else tags[tag.name] = text
  }
  return { description, tags }
}

/**
 * JSDoc written on our own `export { X as RudiY } from '…'` re-export, found by
 * walking the alias chain. Returns null when no re-export in src carries one.
 */
function reexportDoc(symbol, checker) {
  let current = symbol
  while (current && current.flags & ts.SymbolFlags.Alias) {
    const spec = current.declarations?.find(ts.isExportSpecifier)
    if (spec && originOf(spec.getSourceFile().fileName) === 'own') {
      const jsDocs = ts.getJSDocCommentsAndTags(spec.parent.parent).filter(ts.isJSDoc)
      const jsDoc = jsDocs[jsDocs.length - 1]
      if (jsDoc) {
        const examples = (jsDoc.tags ?? []).filter((t) => t.tagName.text === 'example').map((t) => ts.getTextOfJSDocComment(t.comment)?.trim() ?? '')
        return { description: ts.getTextOfJSDocComment(jsDoc.comment)?.trim() ?? '', tags: examples.length ? { examples } : {} }
      }
    }
    current = checker.getImmediateAliasedSymbol(current)
  }
  return null
}

const TYPE_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.InTypeAlias

function typeText(type, checker, node) {
  return checker.typeToString(type, node, TYPE_FLAGS)
}

/** Props type of a component value, or null when the value isn't a component. */
function propsTypeOf(valueType, checker) {
  const sigs = valueType.getCallSignatures()
  if (!sigs.length) return null
  const sig = sigs[0]
  const ret = checker.typeToString(sig.getReturnType())
  if (!/(ReactNode|ReactElement|Element)/.test(ret) || sig.parameters.length > 2) return null
  const param = sig.parameters[0]
  if (!param) return { propsType: null }
  return { propsType: checker.getTypeOfSymbol(param) }
}

function describeProps(propsType, checker, node) {
  const props = []
  const domSources = new Set()
  const ariaSummarised = new Set()
  let refElement = null
  for (const prop of checker.getPropertiesOfType(propsType)) {
    const decl = prop.declarations?.[0]
    if (!decl) continue
    const origin = originOf(decl.getSourceFile().fileName)
    if (prop.name === 'ref') {
      const m = checker.typeToString(checker.getTypeOfSymbol(prop)).match(/Ref<(\w+)>/)
      refElement = m?.[1] ?? null
      continue
    }
    if (prop.name === 'key') continue
    if (origin === 'dom' && !(prop.name in DOM_PROP_DOCS)) {
      domSources.add(declaringInterface(decl) || 'DOMAttributes')
      continue
    }
    if (origin === 'react-aria' && SUMMARISED_ARIA.has(declaringInterface(decl))) {
      ariaSummarised.add(declaringInterface(decl))
      continue
    }
    const doc = docOf(prop, checker)
    const { tags } = doc
    const description = origin === 'dom' ? DOM_PROP_DOCS[prop.name] : doc.description
    const optional = (prop.flags & ts.SymbolFlags.Optional) !== 0
    // Prefer the type as written (keeps aliases like React.ReactNode readable).
    const written = decl.type?.getText().replace(/\s+/g, ' ').replace(/ \| undefined$/, '')
    const type = written ?? typeText(checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(prop, node)), checker, node)
    props.push({
      name: prop.name,
      type,
      required: !optional,
      ...(tags.default !== undefined && { default: tags.default }),
      description,
      ...(tags.deprecated !== undefined && { deprecated: tags.deprecated || true }),
      origin,
    })
  }
  const rank = { own: 0, dom: 1, 'react-aria': 2, other: 3 }
  props.sort((a, b) => rank[a.origin] - rank[b.origin] || Number(b.required) - Number(a.required))
  return {
    props,
    refElement,
    domAttributes: [...domSources].sort(),
    ...(ariaSummarised.size && { ariaGlobals: [...ariaSummarised].sort() }),
  }
}

/** Finds the function that implements a component, through forwardRef/memo/Object.assign. */
function implementationOf(node, checker, seen = new Set()) {
  if (!node || seen.has(node)) return null
  seen.add(node)
  if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) return node
  if (ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node)) return implementationOf(node.initializer, checker, seen)
  if (ts.isShorthandPropertyAssignment(node)) {
    const sym = checker.getShorthandAssignmentValueSymbol(node)
    return implementationOf(sym?.declarations?.[0], checker, seen)
  }
  if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isSatisfiesExpression?.(node))
    return implementationOf(node.expression, checker, seen)
  if (ts.isCallExpression(node)) {
    for (const arg of node.arguments) {
      const impl = implementationOf(arg, checker, seen)
      if (impl) return impl
    }
    return null
  }
  if (ts.isIdentifier(node)) {
    let sym = checker.getSymbolAtLocation(node)
    if (sym && sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym)
    return implementationOf(sym?.declarations?.[0], checker, seen)
  }
  return null
}

/** Default values from the props destructuring: `{ size = 'md' }` → { size: "'md'" }. */
function implementationDefaults(decl, checker) {
  const impl = implementationOf(decl, checker)
  const pattern = impl?.parameters[0]?.name
  const defaults = {}
  if (pattern && ts.isObjectBindingPattern(pattern)) {
    for (const el of pattern.elements) {
      if (!el.initializer || el.dotDotDotToken) continue
      const key = (el.propertyName ?? el.name).getText()
      defaults[key] = el.initializer.getText().replace(/\s+/g, ' ')
    }
  }
  return defaults
}

/** Groups a component by where it lives: layout, typography, chart, or component. */
function categoryOf(source) {
  if (!source) return 'component'
  if (source.startsWith('src/layouts/')) return 'layout'
  if (source.startsWith('src/typography/')) return 'typography'
  if (source.startsWith('src/components/Charts/')) return 'chart'
  return 'component'
}

function componentEntry(name, valueType, symbol, checker, node) {
  const info = propsTypeOf(valueType, checker)
  if (!info) return null
  const { description, tags } = docOf(symbol, checker)
  const file = symbol.declarations?.[0]?.getSourceFile().fileName
  const source = file && originOf(file) === 'own' ? path.relative(ROOT, file) : undefined
  const entry = {
    name,
    kind: 'component',
    category: categoryOf(source),
    ...(source && { source }),
    description,
    ...(tags.examples && { examples: tags.examples }),
    ...(info.propsType ? describeProps(info.propsType, checker, node) : { props: [], refElement: null, domAttributes: [] }),
  }
  const defaults = implementationDefaults(symbol.declarations?.[0], checker)
  for (const prop of entry.props) {
    if (defaults[prop.name] === undefined) continue
    prop.implementationDefault = defaults[prop.name]
  }
  // Compound parts attached with Object.assign (RudiCard.Header, …).
  const parts = []
  for (const member of checker.getPropertiesOfType(valueType)) {
    if (!/^[A-Z]/.test(member.name)) continue
    const memberType = checker.getTypeOfSymbolAtLocation(member, node)
    const sub = componentEntry(`${name}.${member.name}`, memberType, member, checker, node)
    if (sub) {
      // A part without its own JSDoc inherits the doc on the function it points to.
      if (!sub.description) {
        const target = memberType.getSymbol()
        if (target) sub.description = docOf(target, checker).description
      }
      parts.push(sub)
    }
  }
  if (parts.length) entry.parts = parts
  return entry
}

/** Collects every public export. Pure: no file output. */
export function collectApi() {
  const program = createProgram()
  const checker = program.getTypeChecker()
  const source = program.getSourceFile(ENTRY)
  const moduleSymbol = checker.getSymbolAtLocation(source)
  const components = []
  const functions = []
  const types = []

  for (const exp of checker.getExportsOfModule(moduleSymbol)) {
    const target = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp
    const decl = target.declarations?.[0]
    if (!decl) continue
    const external = originOf(decl.getSourceFile().fileName) !== 'own'

    if (target.flags & ts.SymbolFlags.Value) {
      const valueType = checker.getTypeOfSymbolAtLocation(target, decl)
      const component = componentEntry(exp.name, valueType, target, checker, decl)
      if (component) {
        if (external) {
          component.reexportedFrom = decl.getSourceFile().fileName.split('node_modules/')[1]?.split('/').slice(0, 2).join('/').replace(/\/(dist|src)$/, '')
          const own = reexportDoc(exp, checker)
          if (own?.description) {
            component.description = own.description
            if (own.tags.examples) component.examples = own.tags.examples
          }
        }
        components.push(component)
      } else {
        const { description, tags } = docOf(target, checker)
        functions.push({
          name: exp.name,
          kind: valueType.getCallSignatures().length ? 'function' : 'value',
          signature: typeText(valueType, checker, decl),
          description,
          ...(tags.examples && { examples: tags.examples }),
        })
      }
    } else if (target.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) {
      if (/Props$/.test(exp.name)) continue // described with its component
      const { description } = docOf(target, checker)
      const t = checker.getDeclaredTypeOfSymbol(target)
      const entry = { name: exp.name, kind: 'type', description }
      if (target.flags & ts.SymbolFlags.Interface || (t.isUnionOrIntersection?.() === false && t.getProperties().length)) {
        entry.fields = describeProps(t, checker, decl).props
      } else {
        entry.definition = checker.typeToString(t, decl, TYPE_FLAGS | ts.TypeFormatFlags.InTypeAlias)
        if (entry.definition === exp.name) entry.definition = decl.type ? decl.type.getText() : entry.definition
      }
      types.push(entry)
    }
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  const conventions = fs
    .readFileSync(path.join(ROOT, 'scripts/llms-intro.md'), 'utf8')
    .replaceAll('{{version}}', pkg.version)
    .trim()
  return { package: pkg.name, version: pkg.version, conventions, components, functions, types }
}

// --------------------------------------------------------------------- CLI

/** `collectApi()` with one published `default` per prop: the documented one, else what the code does. */
export function buildManifest() {
  const api = collectApi()
  const finalise = (c) => {
    for (const p of c.props) {
      p.default ??= p.implementationDefault
      if (p.default === undefined) delete p.default
      delete p.implementationDefault
    }
    c.parts?.forEach(finalise)
  }
  api.components.forEach(finalise)
  return api
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const outDir = path.join(ROOT, process.argv[2] ?? 'dist')
  const api = buildManifest()
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'components.json'), JSON.stringify(api, null, 2) + '\n')
  fs.writeFileSync(path.join(outDir, 'llms.txt'), renderMarkdown(api, { full: false }))
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), renderMarkdown(api))
  console.log(`component-docs: ${api.components.length} components, ${api.functions.length} functions, ${api.types.length} types → ${path.relative(ROOT, outDir)}/`)
}
