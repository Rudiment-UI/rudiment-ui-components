import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterableTable } from './FilterableTable'
import source from './FilterableTable.tsx?raw'
import { recipeParameters } from './recipeStory'

const meta = {
  title: 'Patterns/Filterable Table',
  component: FilterableTable,
  tags: ['autodocs'],
  parameters: recipeParameters(
    source,
    'A search field and a status filter over a `RudiTable`, paged with `RudiPagination`. Changing a filter returns to page 1, a polite live region announces the result count, and a search with no matches shows a `RudiEmptyState` with a **Clear filters** action instead of an empty grid. Filtering here happens in memory; with a server, send `query`, `status` and `page` to your API instead.',
  ),
} satisfies Meta<typeof FilterableTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
