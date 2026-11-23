import type { Meta, StoryObj } from '@storybook/react'
import { RudiTooltip, RudiTooltipTrigger, type RudiTooltipTriggerProps } from './Tooltip'
import { RudiButton } from '../Button/Button'
import { RudiIconButton } from '../IconButton/IconButton'

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 7v4M8 5.5v.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

type TooltipStoryArgs = Omit<RudiTooltipTriggerProps, 'children'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const meta: Meta<TooltipStoryArgs> = {
  title: 'Components/Tooltip',
  component: RudiTooltipTrigger as any,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small text label that appears on hover or focus to provide supplementary information. Configurable open and close delays.',
      },
    },
  },
  args: {
    delay: 500,
    closeDelay: 0,
  },
  decorators: [
    (Story) => (
      <div
        style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}
      >
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <RudiTooltipTrigger {...(args as RudiTooltipTriggerProps)}>
      <RudiButton variant="secondary">Hover me</RudiButton>
      <RudiTooltip>This is a helpful tooltip</RudiTooltip>
    </RudiTooltipTrigger>
  ),
  argTypes: {
    delay: {
      control: 'number',
      table: { category: 'Appearance' },
    },
    closeDelay: {
      control: 'number',
      table: { category: 'Appearance' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Hover or focus the button and wait for the delay to pass. Change `delay` and `closeDelay` in the API reference below to try them on this example.',
      },
      source: {
        code: `<RudiTooltipTrigger>
  <RudiButton variant="secondary">Hover me</RudiButton>
  <RudiTooltip>This is a helpful tooltip</RudiTooltip>
</RudiTooltipTrigger>`,
      },
    },
  },
}

export const IconOnlyButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use a tooltip to name or explain an icon-only button, and keep the text under 80 characters. The button still needs its own `aria-label`, because the tooltip is supplementary and only appears on hover or focus.',
      },
      source: {
        code: `<RudiTooltipTrigger>
  <RudiIconButton aria-label="More information" variant="ghost">
    <InfoIcon />
  </RudiIconButton>
  <RudiTooltip>Additional context about this field</RudiTooltip>
</RudiTooltipTrigger>`,
      },
    },
  },
  render: ({}) => (
    <RudiTooltipTrigger>
      <RudiIconButton aria-label="More information" variant="ghost">
        <InfoIcon />
      </RudiIconButton>
      <RudiTooltip>Additional context about this field</RudiTooltip>
    </RudiTooltipTrigger>
  ),
}

export const OpenDelay: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The default 500 ms delay avoids flashing tooltips as the pointer crosses the page. Set `delay={0}` for a small, dense set of controls where people expect an immediate label.',
      },
      source: {
        code: `<>
  <RudiTooltipTrigger>
    <RudiButton variant="secondary">Default delay</RudiButton>
    <RudiTooltip>Appears after 500 ms</RudiTooltip>
  </RudiTooltipTrigger>
  <RudiTooltipTrigger delay={0}>
    <RudiButton variant="secondary">No delay</RudiButton>
    <RudiTooltip>Appears immediately on hover</RudiTooltip>
  </RudiTooltipTrigger>
</>`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '4rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: ({}) => (
    <>
      <RudiTooltipTrigger>
        <RudiButton variant="secondary">Default delay</RudiButton>
        <RudiTooltip>Appears after 500 ms</RudiTooltip>
      </RudiTooltipTrigger>
      <RudiTooltipTrigger delay={0}>
        <RudiButton variant="secondary">No delay</RudiButton>
        <RudiTooltip>Appears immediately on hover</RudiTooltip>
      </RudiTooltipTrigger>
    </>
  ),
}

export const ActionToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each trigger owns its tooltip, so a row of actions can explain what each one does without extra state. Don\'t put links or buttons inside a tooltip, and keep anything needed to finish the task on the page.',
      },
      source: {
        code: `<>
  <RudiTooltipTrigger>
    <RudiButton variant="primary">Save</RudiButton>
    <RudiTooltip>Save all changes</RudiTooltip>
  </RudiTooltipTrigger>
  <RudiTooltipTrigger>
    <RudiButton variant="secondary">Preview</RudiButton>
    <RudiTooltip>Preview before publishing</RudiTooltip>
  </RudiTooltipTrigger>
  <RudiTooltipTrigger>
    <RudiButton variant="ghost">Discard</RudiButton>
    <RudiTooltip>Discard unsaved changes</RudiTooltip>
  </RudiTooltipTrigger>
</>`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '4rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: ({}) => (
    <>
      <RudiTooltipTrigger>
        <RudiButton variant="primary">Save</RudiButton>
        <RudiTooltip>Save all changes</RudiTooltip>
      </RudiTooltipTrigger>
      <RudiTooltipTrigger>
        <RudiButton variant="secondary">Preview</RudiButton>
        <RudiTooltip>Preview before publishing</RudiTooltip>
      </RudiTooltipTrigger>
      <RudiTooltipTrigger>
        <RudiButton variant="ghost">Discard</RudiButton>
        <RudiTooltip>Discard unsaved changes</RudiTooltip>
      </RudiTooltipTrigger>
    </>
  ),
}
