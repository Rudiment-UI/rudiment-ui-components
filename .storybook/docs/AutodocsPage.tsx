import { useContext, type ComponentType } from 'react'
import {
  Controls,
  Description,
  DocsContext,
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
 * summary → primary example → API reference (its controls drive the primary
 * example, so it sits right below) → Customizing (component tokens) → usage
 * guidelines → the remaining examples → previous / next. A page
 * whose meta sets `parameters.devicePreview` gets a device switcher for its
 * Default story, since Storybook hides the toolbar's viewport tool on docs pages.
 */
export function AutodocsPage() {
  const { preparedMeta } = useOf('meta', ['meta'])
  // The story <Primary /> renders: the first autodocs story in file order.
  // (csfFile.stories is keyed alphabetically, so it can't be used for this.)
  const primary = useContext(DocsContext)
    .componentStories()
    .find((story) => story.tags.includes('autodocs'))
  const key = guidelineKey(preparedMeta.title)
  const Guidelines = key ? GUIDELINES[key] : undefined
  const isRecipe = preparedMeta.title.startsWith('Patterns/')
  const hasDevicePreview = Boolean(preparedMeta.parameters?.devicePreview)
  const tokenPrefixes = componentTokenPrefixes(preparedMeta.title)
  const name = preparedMeta.title.split('/').pop()!

  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      {primary && <Description of={primary.moduleExport} />}
      <Primary />
      {hasDevicePreview && (
        <>
          <Heading>Device preview</Heading>
          <DevicePreview storyId={`${preparedMeta.id}--default`} />
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
      {Guidelines && (
        <>
          <Heading>Usage guidelines</Heading>
          <Guidelines />
        </>
      )}
      {/* The primary example is already shown, with its controls, above. */}
      <Stories title="Examples" includePrimary={false} />
      <PrevNext docsId={`${preparedMeta.id}--docs`} />
    </>
  )
}
