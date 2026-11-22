import type { Decorator, Parameters } from '@storybook/react-vite'
import { RudiToastRegion } from '../../index'

/**
 * Story parameters for a recipe: the docs page opens with the whole recipe
 * file as its source. The file is imported with `?raw`, and the relative
 * import of the library becomes `'rudiment-ui'` so the code copies straight
 * into an app.
 */
export function recipeParameters(raw: string, description: string): Parameters {
  return {
    docs: {
      description: { component: description },
      source: {
        code: raw.replace(/from '(\.\.\/)+index'/g, "from 'rudiment-ui'").trim(),
        language: 'tsx',
      },
      canvas: { sourceState: 'shown' },
    },
  }
}

/** Mounts the one `RudiToastRegion` an app keeps near its root. */
export const withToastRegion: Decorator = (Story) => (
  <>
    <Story />
    <RudiToastRegion />
  </>
)
