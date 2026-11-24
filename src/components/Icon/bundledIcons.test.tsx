// Uses the real @iconify/react (Icon.test.tsx mocks it) to check what reaches the DOM and server HTML.
import fs from 'node:fs'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
// @ts-expect-error: untyped build script
import { generateBundledIcons, OUT_FILE } from '../../../scripts/build-icons.mjs'
import { bundledIcons } from './bundledIcons'
import { RudiIcon, registerRudiIcons } from './Icon'

const bundledNames = bundledIcons.flatMap((c) =>
  [...Object.keys(c.icons), ...Object.keys(c.aliases ?? {})].map((name) => `${c.prefix}:${name}`),
)

describe('bundled icons', () => {
  afterEach(() => vi.restoreAllMocks())

  it('is generated from the current library source', () => {
    expect(fs.readFileSync(OUT_FILE, 'utf8')).toBe(generateBundledIcons().source)
  })

  it('includes the icons components render by default', () => {
    expect(bundledNames).toEqual(expect.arrayContaining(['lucide:x', 'lucide:chevron-right', 'mdi:close', 'lucide:circle-alert']))
  })

  it('renders every bundled icon on the first render without a request', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    for (const name of bundledNames) {
      const { container, unmount } = render(<RudiIcon icon={name} />)
      expect(container.querySelector('svg'), name).not.toBeNull()
      unmount()
    }
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('renders bundled icons into server HTML', () => {
    expect(renderToString(<RudiIcon icon="lucide:x" />)).toContain('<svg')
  })

  it('renders an empty span on the server for an icon that is not registered', () => {
    const html = renderToString(<RudiIcon icon="lucide:not-registered-anywhere" />)
    expect(html).toContain('rudi-icon')
    expect(html).not.toContain('<svg')
  })
})

describe('registerRudiIcons', () => {
  it('registers one set, a list, or sets keyed by prefix, so those icons render immediately', () => {
    registerRudiIcons({ prefix: 'rudi-test-a', icons: { dot: { body: '<circle cx="12" cy="12" r="4"/>' } }, width: 24, height: 24 })
    registerRudiIcons([{ prefix: 'rudi-test-b', icons: { bar: { body: '<path d="M4 12h16"/>' } }, width: 24, height: 24 }])
    registerRudiIcons({ 'rudi-test-c': { prefix: 'rudi-test-c', icons: { box: { body: '<rect width="8" height="8"/>' } } } })
    expect(renderToString(<RudiIcon icon="rudi-test-a:dot" />)).toContain('<circle')
    expect(renderToString(<RudiIcon icon="rudi-test-b:bar" />)).toContain('<path')
    expect(renderToString(<RudiIcon icon="rudi-test-c:box" />)).toContain('<rect')
  })
})
