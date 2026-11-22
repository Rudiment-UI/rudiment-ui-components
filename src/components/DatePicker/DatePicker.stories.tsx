import type { Meta, StoryObj } from '@storybook/react'
import { RudiDatePicker } from './DatePicker'
import { RudiDateRangePicker } from './DateRangePicker'

/** US federal holidays observed by couriers (sample list for the story). */
const US_HOLIDAYS_2026 = new Set([
  '2026-01-01',
  '2026-01-19',
  '2026-02-16',
  '2026-05-25',
  '2026-06-19',
  '2026-07-03',
  '2026-09-07',
  '2026-10-12',
  '2026-11-11',
  '2026-11-26',
  '2026-12-25',
])

const isWeekendOrHoliday = (iso: string) => {
  const day = new Date(`${iso}T00:00:00`).getDay()
  return day === 0 || day === 6 || US_HOLIDAYS_2026.has(iso)
}

const meta = {
  title: 'Components/DatePicker',
  component: RudiDatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A segmented date (or date-and-time) field with a calendar popover. Values are plain ISO strings: `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with `granularity="minute"`. Use `isDateUnavailable` to block specific days such as weekends and holidays. `RudiDateRangePicker` shares the same field and calendar for start/end ranges.',
      },
    },
  },
  args: {
    label: 'Pickup date',
    granularity: 'day',
    description: '',
    errorMessage: '',
    isRequired: false,
    isDisabled: false,
    isReadOnly: false,
    className: '',
  },
  argTypes: {
    label: {
      control: 'text',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      table: { category: 'Content' },
    },
    errorMessage: {
      control: 'text',
      table: { category: 'Content' },
    },
    granularity: {
      control: 'inline-radio',
      options: ['day', 'minute'],
      table: { category: 'Appearance' },
    },
    hourCycle: {
      control: 'inline-radio',
      options: [12, 24],
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance' },
    },
    name: {
      control: 'text',
      table: { category: 'Content' },
    },
    value: {
      control: 'text',
      table: { category: 'State' },
    },
    defaultValue: {
      control: 'text',
      table: { category: 'State' },
    },
    minValue: {
      control: 'text',
      table: { category: 'State' },
    },
    maxValue: {
      control: 'text',
      table: { category: 'State' },
    },
    isDateUnavailable: {
      control: false,
      table: { category: 'State' },
    },
    isRequired: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    isReadOnly: {
      control: 'boolean',
      table: { category: 'State' },
    },
    onChange: {
      action: 'changed',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof RudiDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    description: 'Month, day, year',
  },
}

export const WithTime: Story = {
  name: 'With time',
  args: {
    label: 'Pickup window starts',
    granularity: 'minute',
    defaultValue: '2026-03-16T09:30',
  },
}

export const UnavailableWeekends: Story = {
  name: 'Unavailable weekends',
  args: {
    label: 'Courier pickup',
    description: 'Couriers do not pick up on weekends or US holidays.',
    defaultValue: '2026-11-24',
    isDateUnavailable: isWeekendOrHoliday,
  },
}

export const MinMax: Story = {
  name: 'Min/max',
  args: {
    label: 'Ship date',
    description: 'Between March 5 and March 20, 2026.',
    defaultValue: '2026-03-10',
    minValue: '2026-03-05',
    maxValue: '2026-03-20',
  },
}

export const ErrorState: Story = {
  name: 'Error',
  args: {
    label: 'Pickup date',
    defaultValue: '2026-03-14',
    errorMessage: 'Choose a weekday.',
    isRequired: true,
  },
}

export const Range: Story = {
  args: {
    label: 'Pickup date between',
  },
  render: (args) => (
    <RudiDateRangePicker
      label={args.label}
      description="Filter shipments by scheduled pickup."
      defaultValue={{ start: '2026-03-02', end: '2026-03-06' }}
      isDateUnavailable={isWeekendOrHoliday}
      isDisabled={args.isDisabled}
      isRequired={args.isRequired}
      errorMessage={args.errorMessage}
    />
  ),
}
