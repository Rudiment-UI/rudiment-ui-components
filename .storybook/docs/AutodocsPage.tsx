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
import { guidelineKey } from './guidelineKeys'

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
 * Storybook's default autodocs layout plus a "Usage guidelines" section for
 * components that have one, placed after the primary example. Pattern recipes
 * don't repeat their primary story under "Stories".
 */
export function AutodocsPage() {
  const { preparedMeta } = useOf('meta', ['meta'])
  const key = guidelineKey(preparedMeta.title)
  const Guidelines = key ? GUIDELINES[key] : undefined
  // A recipe's primary story already shows the whole recipe and its source;
  // listing it again under "Stories" would repeat both.
  const isRecipe = preparedMeta.title.startsWith('Patterns/')

  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      {Guidelines && (
        <>
          <Heading>Usage guidelines</Heading>
          <Guidelines />
        </>
      )}
      <Controls />
      <Stories includePrimary={!isRecipe} />
    </>
  )
}
