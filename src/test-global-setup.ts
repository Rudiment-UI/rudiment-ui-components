// Runs once per test run. Collects every icon the source uses from the installed
// @iconify-json sets and hands it to each test file through `provide` (see test-setup.ts).
import type { IconifyJSON } from '@iconify/react'
// @ts-expect-error: untyped zero-dependency CLI module
import { buildIconData, scanIconNames } from '../cli/icons.mjs'

export default function setup(project: { provide(key: 'rudiIcons', value: IconifyJSON[]): void }) {
  const { collections } = buildIconData(scanIconNames(['src', '.storybook']), '.')
  project.provide('rudiIcons', collections)
}
