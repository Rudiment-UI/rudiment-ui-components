import type { Meta, StoryObj } from '@storybook/react'
import { RudiBarChart } from './BarChart'

const sampleData = [
  { month: 'Jan', sales: 4000, returns: 240 },
  { month: 'Feb', sales: 3000, returns: 139 },
  { month: 'Mar', sales: 5000, returns: 380 },
  { month: 'Apr', sales: 2780, returns: 390 },
  { month: 'May', sales: 1890, returns: 480 },
  { month: 'Jun', sales: 2390, returns: 380 },
]

const meta = {
  title: 'Components/Charts/BarChart',
  component: RudiBarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A token-aware bar chart wrapper around Recharts. Supports vertical and horizontal layouts, stacked bars, and automatic dark mode theming via design tokens.',
      },
    },
  },
  args: {
    data: sampleData,
    dataKeys: ['sales'],
    indexKey: 'month',
    label: 'Monthly sales',
    layout: 'vertical',
    stacked: false,
    showLegend: true,
    showGrid: true,
    height: 300,
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      table: { category: 'Appearance' },
    },
    stacked: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    showLegend: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    showGrid: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    height: {
      control: 'number',
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof RudiBarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Compare one value across categories, such as sales per month. This chart is driven by its args, so the controls in the API reference below change it.',
      },
    },
  },
}

export const MultipleSeries: Story = {
  name: 'Multiple series',
  parameters: {
    docs: {
      description: {
        story:
          'List several keys in `dataKeys` to compare measures side by side for each category. Keep it to a handful of series so the bars stay readable.',
      },
    },
  },
  args: {
    dataKeys: ['sales', 'returns'],
    label: 'Sales vs returns',
  },
}

export const Stacked: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `stacked` when the series add up to a meaningful total per category. Use grouped bars instead when readers need to compare the series with each other.',
      },
    },
  },
  args: {
    dataKeys: ['sales', 'returns'],
    stacked: true,
    label: 'Stacked sales and returns',
  },
}

export const LongCategoryNames: Story = {
  name: 'Long category names',
  parameters: {
    docs: {
      description: {
        story:
          'Use `layout="horizontal"` when category names are long or there are many of them. The names then read left to right beside each bar instead of crowding the x-axis.',
      },
    },
  },
  args: {
    layout: 'horizontal',
    label: 'Sales by month, horizontal layout',
  },
}

export const Minimal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Turn off `showGrid` for a lighter chart when exact values matter less than the shape, such as in a dashboard tile.',
      },
    },
  },
  args: {
    showGrid: false,
    label: 'Sales without grid lines',
  },
}
