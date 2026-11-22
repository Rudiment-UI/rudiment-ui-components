// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { collectApi } from './component-docs.mjs'

/**
 * The generated agent docs (dist/llms.txt, dist/components.json) are only as
 * good as the JSDoc they're built from. These checks keep every public export
 * documented and every documented default honest.
 */
const api = collectApi()
const allComponents = api.components.flatMap((c) => [c, ...(c.parts ?? [])])
const norm = (s) => s.replace(/\s+/g, ' ').replace(/"/g, "'").trim()

describe('public API documentation', () => {
  it('describes every component and compound part', () => {
    const missing = allComponents.filter((c) => !c.reexportedFrom && !c.description).map((c) => c.name)
    expect(missing).toEqual([])
  })

  it('describes every prop the library declares', () => {
    const missing = allComponents.flatMap((c) =>
      c.props.filter((p) => p.origin === 'own' && !p.description).map((p) => `${c.name}.${p.name}`),
    )
    expect(missing).toEqual([])
  })

  it('documents every implementation default with a matching @default tag', () => {
    const wrong = allComponents.flatMap((c) =>
      c.props
        .filter((p) => p.origin === 'own' && p.implementationDefault !== undefined)
        .filter((p) => p.default === undefined || norm(p.default) !== norm(p.implementationDefault))
        .map((p) => `${c.name}.${p.name}: code ${p.implementationDefault}, @default ${p.default ?? '(missing)'}`),
    )
    expect(wrong).toEqual([])
  })

  it('describes every exported function, hook, and supporting type', () => {
    const missing = [...api.functions, ...api.types].filter((x) => !x.description).map((x) => x.name)
    expect(missing).toEqual([])
  })

  it('describes the fields of exported object types', () => {
    const missing = api.types.flatMap((t) =>
      (t.fields ?? []).filter((f) => f.origin === 'own' && !f.description).map((f) => `${t.name}.${f.name}`),
    )
    expect(missing).toEqual([])
  })
})
