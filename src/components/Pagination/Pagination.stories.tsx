import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RudiPagination } from './Pagination'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Navigation/Pagination',
  component: RudiPagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Page navigation with previous and next controls and truncated page ranges for large sets.',
      },
    },
  },
  args: {
    page: 1,
    pageCount: 10,
    onPageChange: () => {},
  },
  argTypes: {
    page: { control: 'number', table: { category: 'State' } },
    pageCount: { control: 'number', table: { category: 'Content' } },
    siblingCount: { control: 'number', table: { category: 'Appearance' } },
    label: { control: 'text', table: { category: 'Content' } },
    className: { control: 'text', table: { category: 'Appearance' } },
    onPageChange: { action: 'pageChanged', table: { category: 'Events' } },
  },
} satisfies Meta<typeof RudiPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Ten pages with the first selected. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

function ResultsPagination() {
  const [page, setPage] = useState(10)
  return <RudiPagination page={page} pageCount={20} onPageChange={setPage} />
}

export const ManyPages: Story = {
  name: 'Many pages',
  parameters: {
    docs: {
      description: {
        story:
          'The component is controlled: store the current page, pass it as `page`, and update it in `onPageChange`, which receives the new 1-based page number. Long ranges truncate to the first page, the last page, and the pages around the current one, with an ellipsis for each gap.',
      },
      source: {
        code: `function ResultsPagination() {
  const [page, setPage] = useState(10)

  return <RudiPagination page={page} pageCount={20} onPageChange={setPage} />
}`,
      },
    },
  },
  render: () => <ResultsPagination />,
}

function SiblingCounts() {
  const [page, setPage] = useState(10)
  return (
    <RudiStack space="group">
      <RudiPagination
        label="Pagination, one sibling"
        page={page}
        pageCount={20}
        siblingCount={1}
        onPageChange={setPage}
      />
      <RudiPagination
        label="Pagination, two siblings"
        page={page}
        pageCount={20}
        siblingCount={2}
        onPageChange={setPage}
      />
    </RudiStack>
  )
}

export const SiblingCount: Story = {
  name: 'Sibling count',
  parameters: {
    docs: {
      description: {
        story:
          '`siblingCount` sets how many page numbers appear on each side of the current page before truncating. Raise it from the default of 1 on wide layouts where people jump a few pages at a time. When the whole range fits, every page is shown.',
      },
      source: {
        code: `function SiblingCounts() {
  const [page, setPage] = useState(10)

  return (
    <>
      <RudiPagination page={page} pageCount={20} siblingCount={1} onPageChange={setPage} />
      <RudiPagination page={page} pageCount={20} siblingCount={2} onPageChange={setPage} />
    </>
  )
}`,
      },
    },
  },
  render: () => <SiblingCounts />,
}

function FewPagesExample() {
  const [page, setPage] = useState(1)
  return <RudiPagination page={page} pageCount={4} onPageChange={setPage} />
}

export const FewPages: Story = {
  name: 'Few pages',
  parameters: {
    docs: {
      description: {
        story:
          'With a small page count every page number is shown and nothing is truncated. A single page renders nothing.',
      },
      source: {
        code: `function FewPagesExample() {
  const [page, setPage] = useState(1)

  return <RudiPagination page={page} pageCount={4} onPageChange={setPage} />
}`,
      },
    },
  },
  render: () => <FewPagesExample />,
}
