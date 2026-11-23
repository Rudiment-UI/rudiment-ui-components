import type { Decorator, Parameters } from '@storybook/react-vite'
import { RudiToastRegion } from '../../index'

/**
 * Story parameters for a recipe: the docs page opens with the whole recipe
 * file as its source. The file is imported with `?raw`, and the relative
 * import of the library becomes `'rudiment-ui'` so the code copies straight
 * into an app. A recipe with its own stylesheet passes it as `styles`, and
 * the CSS is shown under the description.
 */
export function recipeParameters(
  raw: string,
  description: string,
  styles?: { file: string; css: string },
): Parameters {
  const component = styles
    ? `${description}\n\n**Spacing rules** (\`${styles.file}\`)\n\n\`\`\`css\n${styles.css.trim()}\n\`\`\``
    : description
  return {
    docs: {
      description: { component },
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
