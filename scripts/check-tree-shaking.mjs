// Fails when importing one component from the built package drags in dependencies
// that belong to other components. Bundles `import { X } from <package entry>` the way
// a consumer's bundler would (peer dependencies external, everything else included)
// and checks which packages end up in the output.
//
//   node scripts/check-tree-shaking.mjs           # checks the package's "module" entry
//   node scripts/check-tree-shaking.mjs path.js   # checks another build of the entry
//
// Run after `npm run build`. Sizes are tracked separately by size-limit (`.size-limit.json`);
// this guards *what* ends up in the bundle, with a message that names the leak.
import { build } from 'esbuild'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const entry = resolve(process.argv[2] ?? pkg.module)
const peers = Object.keys(pkg.peerDependencies ?? {})

// Each dependency that only some components need, mapped to a test for the package names
// esbuild reports. Anything else in `dependencies` is shared enough not to police.
const heavy = {
  recharts: (p) => p === 'recharts' || p.startsWith('d3-') || p === 'victory-vendor',
  '@dnd-kit': (p) => p.startsWith('@dnd-kit/'),
  'date pickers': (p) => p === '@internationalized/date' || p.endsWith('/datepicker') || p.endsWith('/calendar'),
  'tables': (p) => p === '@react-aria/table' || p === '@react-stately/table' || p === '@react-aria/grid',
}

const checks = [
  { imports: ['RudiStack', 'RudiText', 'RudiHeading'], forbid: Object.keys(heavy) },
  { imports: ['RudiButton'], forbid: Object.keys(heavy) },
  { imports: ['RudiIcon'], forbid: Object.keys(heavy) },
  { imports: ['RudiLineChart'], forbid: ['@dnd-kit', 'date pickers', 'tables'] },
  { imports: ['RudiKanbanBoard'], forbid: ['recharts', 'date pickers', 'tables'] },
]

const packageOf = (path) => path.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1] ?? null

let failed = 0
for (const { imports, forbid } of checks) {
  const result = await build({
    stdin: {
      contents: `import { ${imports.join(', ')} } from ${JSON.stringify(entry)}\nconsole.log(${imports.join(', ')})`,
      resolveDir: process.cwd(),
    },
    bundle: true,
    write: false,
    metafile: true,
    minify: true,
    format: 'esm',
    outdir: 'out',
    logLevel: 'silent',
    loader: { '.css': 'empty' },
    // Match `react` and its subpaths (`react/jsx-runtime`, `react-dom/client`).
    external: peers.flatMap((p) => [p, `${p}/*`]),
  })
  const [output] = Object.values(result.metafile.outputs)
  const bytes = new Map()
  for (const [path, { bytesInOutput }] of Object.entries(output.inputs)) {
    const name = packageOf(path)
    if (name && bytesInOutput > 0) bytes.set(name, (bytes.get(name) ?? 0) + bytesInOutput)
  }
  const leaks = forbid.flatMap((group) => {
    const hits = [...bytes].filter(([name]) => heavy[group](name))
    return hits.length ? [`${group} (${hits.map(([n, b]) => `${n} ${(b / 1024).toFixed(1)} kB`).join(', ')})`] : []
  })
  const label = `import { ${imports.join(', ')} }`
  if (leaks.length) {
    failed++
    console.error(`✖ ${label} pulls in:\n    ${leaks.join('\n    ')}`)
  } else {
    console.log(`✔ ${label}`)
  }
}

if (failed) {
  console.error(
    `\n${failed} of ${checks.length} imports include code for components they didn't import.` +
      '\nA top-level call the bundler cannot prove pure (forwardRef, Object.assign, createContext)' +
      ' keeps its module alive; check the build output shape in vite.config.ts.',
  )
  process.exit(1)
}
