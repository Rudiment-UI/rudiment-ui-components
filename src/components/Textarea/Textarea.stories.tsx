import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RudiTextarea } from './Textarea'
import { RudiStack } from '@/layouts/Stack/Stack'

const meta = {
  title: 'Components/Forms/Textarea',
  component: RudiTextarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A multi-line text field for free text such as comments, descriptions and notes. It takes the same label, description and error props as `RudiInput`. Use [`RudiInput`](?path=/docs/components-forms-input--docs) for short single-line values.',
      },
    },
  },
  args: {
    label: 'Message',
    placeholder: 'Write your message…',
  },
  argTypes: {
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      table: { category: 'Appearance' },
    },
    rows: { control: 'number', table: { category: 'Appearance' } },
    isRequired: { control: 'boolean', table: { category: 'State' } },
    isDisabled: { control: 'boolean', table: { category: 'State' } },
  },
} satisfies Meta<typeof RudiTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A four-row text area with a label and a placeholder. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const DescriptionAndErrors: Story = {
  name: 'Description and errors',
  parameters: {
    docs: {
      description: {
        story:
          'Use `description` for guidance people need while they write. Setting `errorMessage` marks the field invalid and replaces the description, so surface validation problems there and clear it when the value is valid.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiTextarea label="Notes" description="Markdown is supported." />
      <RudiTextarea label="Message" errorMessage="Please enter a message." />
    </RudiStack>
  ),
}

export const SizeAndResize: Story = {
  name: 'Size and resize',
  parameters: {
    docs: {
      description: {
        story:
          'Set `rows` to hint at the expected length: a few rows for a comment, more for a long description. `resize` controls drag-resizing and defaults to `vertical`. Avoid `none` when people may need to see long content while editing.',
      },
    },
  },
  render: () => (
    <RudiStack space="content">
      <RudiTextarea label="Short comment" rows={2} />
      <RudiTextarea label="Description" rows={8} />
      <RudiTextarea label="Fixed size" resize="none" />
    </RudiStack>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `isDisabled` for content that can't be edited right now. Disabled fields are skipped by keyboard navigation, so use `isReadOnly` when people still need to focus and copy the text.",
      },
    },
  },
  args: { isDisabled: true, defaultValue: 'Locked content' },
}

function CommentField() {
  const [comment, setComment] = useState('')
  return (
    <RudiTextarea
      label="Comment"
      value={comment}
      onChange={setComment}
      maxLength={200}
      description={`${comment.length} of 200 characters`}
    />
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `value` and `onChange` to keep the text in your own state, for example to show a character count. `onChange` receives the new string, not an event.',
      },
      source: {
        code: `function CommentField() {
  const [comment, setComment] = useState('')
  return (
    <RudiTextarea
      label="Comment"
      value={comment}
      onChange={setComment}
      maxLength={200}
      description={\`\${comment.length} of 200 characters\`}
    />
  )
}`,
      },
    },
  },
  render: () => <CommentField />,
}
