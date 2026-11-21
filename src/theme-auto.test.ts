import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const read = (path: string) => readFileSync(resolve(__dirname, path), 'utf8')
const body = (css: string) => css.slice(css.indexOf('{'))

describe('data-theme="auto"', () => {
  it('re-emits exactly the dark tokens under [data-theme="auto"]', () => {
    const dark = read('../tokens/build/tokens-dark.css')
    const auto = read('../tokens/build/tokens-auto-dark.css')
    expect(auto).toContain('[data-theme="auto"] {')
    expect(body(auto)).toBe(body(dark))
  })

  it('is imported only when the OS prefers dark', () => {
    for (const entry of ['styles.css', 'app.css']) {
      expect(read(entry)).toContain(
        "@import '../tokens/build/tokens-auto-dark.css' (prefers-color-scheme: dark);",
      )
    }
  })
})
