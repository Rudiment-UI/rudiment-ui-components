import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { resolveSpace, type RudiSpace } from './space'
import { RudiBox } from '../layouts/Box/Box'
import { RudiCenter } from '../layouts/Center/Center'
import { RudiCluster } from '../layouts/Cluster/Cluster'
import { RudiCover } from '../layouts/Cover/Cover'
import { RudiGrid } from '../layouts/Grid/Grid'
import { RudiSidebar } from '../layouts/Sidebar/Sidebar'
import { RudiStack } from '../layouts/Stack/Stack'
import { RudiSwitcher } from '../layouts/Switcher/Switcher'

describe('resolveSpace', () => {
  it.each([
    ['inline', 'var(--rudi-space-inline)'],
    ['content', 'var(--rudi-space-content)'],
    ['group', 'var(--rudi-space-group)'],
    ['section', 'var(--rudi-space-section)'],
    ['gutter', 'var(--rudi-space-gutter)'],
  ] as const)('maps the named step %s to its responsive token', (step, expected) => {
    expect(resolveSpace(step)).toBe(expected)
  })

  it('maps a number to the fixed spacing scale, including 0', () => {
    expect(resolveSpace(4)).toBe('var(--rudi-spacing-4)')
    expect(resolveSpace(0)).toBe('var(--rudi-spacing-0)')
  })

  it('passes any other string through as raw CSS', () => {
    expect(resolveSpace('1.25rem')).toBe('1.25rem')
    expect(resolveSpace('var(--my-space)')).toBe('var(--my-space)')
  })

  it('leaves undefined unset', () => {
    expect(resolveSpace(undefined)).toBeUndefined()
  })
})

type Case = [name: string, render: (value: RudiSpace) => React.ReactElement, property: string]

const primitives: Case[] = [
  ['RudiBox padding', (v) => <RudiBox padding={v}>x</RudiBox>, '--box-padding'],
  ['RudiCenter gutters', (v) => <RudiCenter gutters={v}>x</RudiCenter>, '--center-gutters'],
  ['RudiCluster space', (v) => <RudiCluster space={v}>x</RudiCluster>, '--cluster-space'],
  ['RudiCover space', (v) => <RudiCover space={v}>x</RudiCover>, '--cover-space'],
  ['RudiGrid space', (v) => <RudiGrid space={v}>x</RudiGrid>, '--grid-space'],
  [
    'RudiSidebar space',
    (v) => (
      <RudiSidebar space={v}>
        <div>a</div>
        <div>b</div>
      </RudiSidebar>
    ),
    '--sidebar-space',
  ],
  ['RudiStack space', (v) => <RudiStack space={v}>x</RudiStack>, '--stack-space'],
  ['RudiSwitcher space', (v) => <RudiSwitcher space={v}>x</RudiSwitcher>, '--switcher-space'],
]

describe.each(primitives)('%s', (_, renderWith, property) => {
  const valueOf = (value: RudiSpace) => {
    const { container } = render(renderWith(value))
    return (container.firstChild as HTMLElement).style.getPropertyValue(property)
  }

  it('resolves a named step', () => {
    expect(valueOf('section')).toBe('var(--rudi-space-section)')
  })

  it('resolves a fixed step, including 0', () => {
    expect(valueOf(6)).toBe('var(--rudi-spacing-6)')
    expect(valueOf(0)).toBe('var(--rudi-spacing-0)')
  })

  it('keeps a raw CSS length', () => {
    expect(valueOf('1.25rem')).toBe('1.25rem')
  })
})
