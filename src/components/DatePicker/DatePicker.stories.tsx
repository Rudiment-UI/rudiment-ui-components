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
          'A segmented date (or date-and-time) field with a calendar popover. Values are plain ISO strings, so you never need `@internationalized/date`: `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with `granularity="minute"`. `RudiDateRangePicker` shares the same field and calendar for start and end dates. For a date far in the past or future that people know exactly, such as a birthday, typing the segments is faster than paging through the calendar.',
      },
    },
  },
  args: {
    label: 'Pickup date',
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
  parameters: {
    docs: {
      description: {
        story:
          'A date field with a calendar popover. Change the props in the API reference below to try every option on this example.',
      },
    },
  },
}

export const WithTime: Story = {
  name: 'With time',
  parameters: {
    docs: {
      description: {
        story:
          'Set `granularity="minute"` when a time matters, instead of adding a separate time input. The value then reads `YYYY-MM-DDTHH:mm`.',
      },
    },
  },
  args: {
    label: 'Pickup window starts',
    granularity: 'minute',
    defaultValue: '2026-03-16T09:30',
  },
}

export const UnavailableDates: Story = {
  name: 'Unavailable dates',
  parameters: {
    docs: {
      description: {
        story:
          'Use `isDateUnavailable` for business rules such as weekends and holidays. The calendar disables those days, and typing one into the field marks it invalid.',
      },
    },
  },
  args: {
    label: 'Courier pickup',
    description: 'Couriers do not pick up on weekends or US holidays.',
    defaultValue: '2026-11-24',
    isDateUnavailable: isWeekendOrHoliday,
  },
}

export const MinAndMax: Story = {
  name: 'Minimum and maximum',
  parameters: {
    docs: {
      description: {
        story:
          'Use `minValue` and `maxValue` to limit the range of dates. A value outside the range marks the field invalid, so say the range in `description`.',
      },
    },
  },
  args: {
    label: 'Ship date',
    description: 'Between March 5 and March 20, 2026.',
    defaultValue: '2026-03-10',
    minValue: '2026-03-05',
    maxValue: '2026-03-20',
  },
}

export const ErrorMessage: Story = {
  name: 'Error message',
  parameters: {
    docs: {
      description: {
        story:
          'Set `errorMessage` to mark the field invalid and replace the help text with the problem. Say how to fix it ("Choose a weekday.") rather than only that the value is wrong.',
      },
    },
  },
  args: {
    label: 'Pickup date',
    defaultValue: '2026-03-14',
    errorMessage: 'Choose a weekday.',
    isRequired: true,
  },
}

export const DateRange: Story = {
  name: 'Date range',
  parameters: {
    docs: {
      description: {
        story:
          'Use `RudiDateRangePicker` for a start and end date, such as a filter. It takes the same props as `RudiDatePicker`, with a `{ start, end }` value.',
      },
    },
  },
  render: () => (
    <RudiDateRangePicker
      label="Pickup date between"
      description="Filter shipments by scheduled pickup."
      defaultValue={{ start: '2026-03-02', end: '2026-03-06' }}
      isDateUnavailable={isWeekendOrHoliday}
    />
  ),
}
