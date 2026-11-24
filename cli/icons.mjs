#!/usr/bin/env node
/**
 * rudiment-ui-icons: bundle the Iconify icons an app uses.
 *
 * RudiIcon renders icons by name. Any icon whose data isn't registered is downloaded from
 * api.iconify.design when it first renders. This CLI scans the app's source for icon names
 * (`"prefix:name"` string literals), looks each one up in the icon sets installed as
 * `@iconify-json/<prefix>` (or the all-in-one `@iconify/json`), and writes only those icons
 * to a JSON file, keyed by prefix. The app passes that file to `registerRudiIcons()`.
 *
 * Strings whose prefix isn't an installed icon set are ignored, so `"key:value"` strings
 * elsewhere in the code are harmless. Comments are skipped.
 *
 * It has no dependencies, like the MCP server: it's an optional dev tool and shouldn't add
 * packages to every consumer's install.
 *
 * Usage: rudiment-ui-icons [dirs...] [--out <file>] [--check]
 *   dirs     directories to scan (default: src)
 *   --out    output file (default: src/rudiment-icons.json)
 *   --check  write nothing; exit 1 if the output file is missing or out of date
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts', '.mdx'])
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'coverage', 'storybook-static'])

// Collection-level fields that apply to every icon in the set. Everything else
// (info, categories, chars, …) is metadata the renderer never reads.
const COLLECTION_FIELDS = ['prefix', 'width', 'height', 'left', 'top', 'rotate', 'hFlip', 'vFlip', 'lastModified']

const SEGMENT = '[a-z0-9]+(?:-[a-z0-9]+)*'
const ICON_LITERAL = new RegExp(`(["'\`])(${SEGMENT}):(${SEGMENT})\\1`, 'g')

/** Removes block comments and line comments, so JSDoc examples don't count as usage. */
export function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1')
}

/** Every `prefix:name` string literal in `code`, as a Set of `"prefix:name"`. */
export function findIconNames(code, names = new Set()) {
  for (const match of stripComments(code).matchAll(ICON_LITERAL)) names.add(`${match[2]}:${match[3]}`)
  return names
}

/** Source files under `dir`, skipping dependency, build, and hidden directories. */
export function listSourceFiles(dir, accept = () => true) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) files.push(...listSourceFiles(full, accept))
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name)) && accept(full)) {
      files.push(full)
    }
  }
  return files
}

/** Icon names used in every source file under `dirs`. */
export function scanIconNames(dirs, accept) {
  const names = new Set()
  for (const dir of dirs) {
    for (const file of listSourceFiles(dir, accept)) findIconNames(fs.readFileSync(file, 'utf8'), names)
  }
  return names
}

/** The installed icon set for `prefix`, resolved from `fromDir`, or null if none is installed. */
export function loadCollection(prefix, fromDir) {
  const require = createRequire(path.join(path.resolve(fromDir), 'package.json'))
  for (const id of [`@iconify-json/${prefix}/icons.json`, `@iconify/json/json/${prefix}.json`]) {
    try {
      return JSON.parse(fs.readFileSync(require.resolve(id), 'utf8'))
    } catch {
      // Not installed under this name; try the next one.
    }
  }
  return null
}

/**
 * A copy of `collection` holding only `names`. An alias brings its parent icons with it.
 * Returns the subset and the names the set doesn't contain.
 */
export function subsetCollection(collection, names) {
  const subset = { icons: {} }
  for (const field of COLLECTION_FIELDS) if (field in collection) subset[field] = collection[field]
  const missing = []

  const add = (name) => {
    if (subset.icons[name] || subset.aliases?.[name]) return true
    if (collection.icons[name]) {
      subset.icons[name] = collection.icons[name]
      return true
    }
    const alias = collection.aliases?.[name]
    if (alias && add(alias.parent)) {
      subset.aliases ??= {}
      subset.aliases[name] = alias
      return true
    }
    return false
  }

  for (const name of [...names].sort()) if (!add(name)) missing.push(name)
  return { subset, missing }
}

/**
 * Groups `names` by prefix and subsets each installed icon set.
 * Returns the collections (sorted by prefix), the names missing from an installed set,
 * and the prefixes with no installed set.
 */
export function buildIconData(names, fromDir) {
  const byPrefix = new Map()
  for (const name of names) {
    const [prefix, icon] = name.split(':')
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, new Set())
    byPrefix.get(prefix).add(icon)
  }

  const collections = []
  const missing = []
  const unknownPrefixes = []
  for (const prefix of [...byPrefix.keys()].sort()) {
    const collection = loadCollection(prefix, fromDir)
    if (!collection) {
      unknownPrefixes.push(prefix)
      continue
    }
    const result = subsetCollection(collection, byPrefix.get(prefix))
    missing.push(...result.missing.map((icon) => `${prefix}:${icon}`))
    if (Object.keys(result.subset.icons).length) collections.push(result.subset)
  }
  return { collections, missing, unknownPrefixes }
}

/** Counts the icons in a list of collections, aliases included. */
export function countIcons(collections) {
  return collections.reduce((n, c) => n + Object.keys(c.icons).length + Object.keys(c.aliases ?? {}).length, 0)
}

function parseArgs(argv) {
  const options = { dirs: [], out: 'src/rudiment-icons.json', check: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--out') options.out = argv[++i]
    else if (arg.startsWith('--out=')) options.out = arg.slice(6)
    else if (arg === '--check') options.check = true
    else if (arg === '--help' || arg === '-h') options.help = true
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`)
    else options.dirs.push(arg)
  }
  if (!options.out) throw new Error('--out needs a file path')
  if (!options.dirs.length) options.dirs.push('src')
  return options
}

const HELP = `Usage: rudiment-ui-icons [dirs...] [--out <file>] [--check]

Scans dirs (default: src) for Iconify icon names and writes the icons found in the
installed @iconify-json/* sets to a JSON file (default: src/rudiment-icons.json).
Pass the file to registerRudiIcons() from rudiment-ui.

  --out <file>  output file
  --check       write nothing; exit 1 if the output file is missing or out of date`

export function main(argv, cwd = process.cwd(), log = console) {
  let options
  try {
    options = parseArgs(argv)
  } catch (error) {
    log.error(`${error.message}\n\n${HELP}`)
    return 2
  }
  if (options.help) {
    log.log(HELP)
    return 0
  }

  const dirs = options.dirs.map((dir) => path.resolve(cwd, dir))
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      log.error(`Directory not found: ${path.relative(cwd, dir) || dir}`)
      return 2
    }
  }

  const outFile = path.resolve(cwd, options.out)
  const names = scanIconNames(dirs, (file) => file !== outFile)
  const { collections, missing, unknownPrefixes } = buildIconData(names, cwd)
  // Keyed by prefix: TypeScript infers each set's type separately, where an array of sets
  // would widen to a union that isn't assignable to IconifyJSON.
  const json = `${JSON.stringify(Object.fromEntries(collections.map((c) => [c.prefix, c])), null, 2)}\n`

  for (const name of missing) log.warn(`Not found in its installed icon set: ${name}`)
  if (unknownPrefixes.length) {
    log.log(`Skipped prefixes with no installed icon set: ${unknownPrefixes.join(', ')}`)
    log.log('Install @iconify-json/<prefix> to bundle those icons. Without it they load from api.iconify.design.')
  }

  const relOut = path.relative(cwd, outFile)
  if (options.check) {
    const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : null
    if (current !== json) {
      log.error(`${relOut} is out of date. Run rudiment-ui-icons to update it.`)
      return 1
    }
    log.log(`${relOut} is up to date (${countIcons(collections)} icons).`)
    return 0
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, json)
  const prefixes = collections.map((c) => c.prefix).join(', ') || 'none'
  log.log(`Wrote ${countIcons(collections)} icons (${prefixes}) to ${relOut}, ${Buffer.byteLength(json)} bytes.`)
  return 0
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
