import type { InputType } from 'storybook/internal/types'

/**
 * Shared Storybook control for every `RudiSpace` prop on the layout primitives:
 * the named responsive steps first, then the fixed scale. Raw CSS lengths still
 * work in code; the control just offers the scale.
 */
export const spaceArgType = {
  control: 'select',
  options: ['inline', 'content', 'group', 'section', 'gutter', 0, 1, 2, 3, 4, 6, 8, 12],
  table: { category: 'Layout' },
} satisfies InputType
