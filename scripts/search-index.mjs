// Builds the full-text search index for the static Storybook.
//
// Storybook renders every docs page in the browser, so the built HTML holds no
// page text for Pagefind to read. This script serves the build, renders each
// docs entry from index.json in headless Chromium, keeps the prose, headings,
// prop tables and token tables (dropping rendered examples and their code,
// whose demo text would pollute results), and writes a Pagefind index to
// <build>/pagefind/. The manager's search dialog (.storybook/search/) loads it.
//
// Usage: node scripts/search-index.mjs [storybook-static]
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import * as pagefind from 'pagefind'

const root = path.resolve(process.argv[2] ?? 'storybook-static')
const TABS = 4
// A page with less text than this failed to render (an error box, a blank page).
const MIN_CHARS = 200

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

function serve(dir) {
  const server = http.createServer(async (req, res) => {
    const file = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!file.startsWith(dir)) return res.writeHead(403).end()
    try {
      const body = await readFile(file.endsWith(path.sep) ? path.join(file, 'index.html') : file)
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

// Runs in the page: strips what shouldn't be searchable and returns the HTML.
function extract() {
  const content = document.querySelector('.sbdocs-content')
  content
    .querySelectorAll(
      [
        '.sbdocs-preview', // rendered examples and their "Show code" source
        '.sb-device', // device-width previews of responsive examples
        '.sb-pager', // previous/next links
        '.sb-tokens__controls', // token table filter and theme picker
        '.docblock-argstable thead', // "Name Description Default Control"
        'style',
        'svg',
        'button',
        'input',
        'select',
        'textarea',
      ].join(','),
    )
    .forEach((el) => el.remove())
  return { html: content.innerHTML, chars: content.innerText.trim().length }
}

async function main() {
  const index = JSON.parse(await readFile(path.join(root, 'index.json'), 'utf8'))
  const docs = Object.values(index.entries).filter((entry) => entry.type === 'docs')
  const server = await serve(root)
  const base = `http://127.0.0.1:${server.address().port}`
  const browser = await chromium.launch()
  const pages = []
  const failures = []

  const queue = [...docs]
  await Promise.all(
    Array.from({ length: TABS }, async () => {
      const tab = await browser.newPage()
      for (let entry = queue.shift(); entry; entry = queue.shift()) {
        // One retry: a page can time out while the machine is still busy
        // (straight after `storybook build`). A page that fails twice is broken.
        for (let attempt = 1; ; attempt++) {
          try {
            await tab.goto(`${base}/iframe.html?id=${entry.id}&viewMode=docs`)
            await tab.waitForSelector('.sbdocs-content', { timeout: 30_000 })
            // Let late blocks (token tables, guidelines) settle. Pages with
            // device-preview frames may never go idle, so cap the wait; the
            // text check below still catches a page that didn't render.
            await tab.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {})
            const { html, chars } = await tab.evaluate(extract)
            if (chars < MIN_CHARS) throw new Error(`only ${chars} characters rendered`)
            pages.push({ entry, html })
            break
          } catch (error) {
            const reason = `${entry.title}: ${error.message.split('\n')[0]}`
            if (attempt === 2) {
              failures.push(reason)
              break
            }
            console.warn(`Search index: retrying ${reason}`)
          }
        }
      }
      await tab.close()
    }),
  )
  await browser.close()
  server.close()

  if (failures.length) {
    console.error(`Search index: ${failures.length} docs page(s) failed to render:`)
    for (const failure of failures) console.error(`  - ${failure}`)
    process.exit(1)
  }

  const { index: search, errors } = await pagefind.createIndex()
  if (!search) throw new Error(errors.join('\n'))
  for (const { entry, html } of pages) {
    const section = entry.title.split('/')[0]
    const content = `<!doctype html><html lang="en"><body data-pagefind-body data-pagefind-meta="section:${section}">${html}</body></html>`
    const added = await search.addHTMLFile({ url: `/docs/${entry.id}`, content })
    if (added.errors.length) throw new Error(`${entry.title}: ${added.errors.join(', ')}`)
  }
  const written = await search.writeFiles({ outputPath: path.join(root, 'pagefind') })
  if (written.errors.length) throw new Error(written.errors.join('\n'))
  await pagefind.close()
  console.log(`Search index: ${pages.length} docs pages → ${path.relative(process.cwd(), written.outputPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
