import type { ComponentType } from 'react'
import {
  Controls,
  Description,
  Heading,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks'
import { ComponentTokens } from './ComponentTokens'
import { componentTokenPrefixes } from './componentTokenGroups'
import { DevicePreview } from './DevicePreview'
import { guidelineKey } from './guidelineKeys'
import { PrevNext } from './PrevNext'
import './docs-blocks.css'

// The same snippets the Component Guidelines page imports, so the guidance is
// written once and shown in both places.
const GUIDELINES = Object.fromEntries(
  Object.entries(
    import.meta.glob<ComponentType>('../../src/docs/guidelines/*.mdx', {
      eager: true,
      import: 'default',
    }),
  ).map(([file, Component]) => [
    file.split('/').pop()!.replace('.mdx', ''),
    Component,
  ]),
)

/**
 * The page every component, layout and typography entry renders, in the order
 * a reader needs it (plans/tailwind-grade-docs.md, "Page anatomy"):
 * summary → primary example → task sections (the stories) → usage guidelines →
 * API reference → Customizing (component tokens) → previous / next.
 * Pattern recipes don't repeat their primary story under "Examples". A page
 * whose meta sets `parameters.devicePreview` gets a device switcher for its
 * Default story, since Storybook hides the toolbar's viewport tool on docs pages.
 */
export function AutodocsPage() {
  const { preparedMeta } = useOf('meta', ['meta'])
  const key = guidelineKey(preparedMeta.title)
  const Guidelines = key ? GUIDELINES[key] : undefined
  // A recipe's primary story already shows the whole recipe and its source;
  // listing it again under "Examples" would repeat both.
  const isRecipe = preparedMeta.title.startsWith('Patterns/')
  const hasDevicePreview = Boolean(preparedMeta.parameters?.devicePreview)
  const tokenPrefixes = componentTokenPrefixes(preparedMeta.title)
  const name = preparedMeta.title.split('/').pop()!

  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      {hasDevicePreview && (
        <>
          <Heading>Device preview</Heading>
          <DevicePreview storyId={`${preparedMeta.id}--default`} />
        </>
      )}
      <Stories title="Examples" includePrimary={!isRecipe} />
      {Guidelines && (
        <>
          <Heading>Usage guidelines</Heading>
          <Guidelines />
        </>
      )}
      {!isRecipe && (
        <>
          <Heading>API reference</Heading>
          {/* The stock prop table is ~660px wide; scroll it, not the page. */}
          <div className="sb-api">
            <Controls />
          </div>
        </>
      )}
      {tokenPrefixes.length > 0 && (
        <>
          <Heading>Customizing</Heading>
          <ComponentTokens name={name} prefixes={tokenPrefixes} />
        </>
      )}
      <PrevNext docsId={`${preparedMeta.id}--docs`} />
    </>
  )
}
