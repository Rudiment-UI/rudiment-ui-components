// Fails the token build if any var(--rudi-*) in tokens/build/*.css points at a
// custom property that is defined neither in that file nor globally (tokens.css, plus the
// responsive spacing steps in tokens-responsive.css, declared on :root and every [data-theme]).
// Theme configs disable Style Dictionary's warnings, so this is the guard.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'tokens/build'
const defs = (css) => new Set([...css.matchAll(/^\s*(--rudi-[\w-]+)\s*:/gm)].map((m) => m[1]))
const root = new Set([
  ...defs(readFileSync(join(dir, 'tokens.css'), 'utf8')),
  ...defs(readFileSync(join(dir, 'tokens-responsive.css'), 'utf8')),
])

const missing = []
for (const file of readdirSync(dir).filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(join(dir, file), 'utf8')
  const own = defs(css)
  for (const [, name] of css.matchAll(/var\((--rudi-[\w-]+)/g)) {
    if (!own.has(name) && !root.has(name)) missing.push(`${file}: ${name}`)
  }
}

if (missing.length) {
  console.error(`Unresolved token references:\n  ${[...new Set(missing)].join('\n  ')}`)
  process.exit(1)
}
console.log('✔ All token references resolve')
