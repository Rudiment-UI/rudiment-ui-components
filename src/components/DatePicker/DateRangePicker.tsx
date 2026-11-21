import React, { useMemo } from 'react'
import {
  DateInput,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Popover,
  RangeCalendar,
} from 'react-aria-components'
import type { CalendarDate, DateValue } from '@internationalized/date'
import { cn } from '@/utils/cn'
import {
  adaptIsDateUnavailable,
  formatDateValue,
  parseDateString,
} from './dateUtils'
import {
  RudiCalendarHeader,
  RudiCalendarMonth,
  RudiCalendarTrigger,
  RudiFieldFooter,
  RudiFieldLabel,
} from './CalendarParts'
import './date-picker.css'

/** A date range as `YYYY-MM-DD` strings. */
export interface RudiDateRange {
  start: string
  end: string
}

export interface RudiDateRangePickerProps {
  label: string
  /** Controlled range of `YYYY-MM-DD` strings. `null` clears the field. */
  value?: RudiDateRange | null
  defaultValue?: RudiDateRange | null
  /** Receives `{ start, end }` once both ends are set, or `null` when cleared. */
  onChange?: (value: RudiDateRange | null) => void
  /** Earliest selectable date, `YYYY-MM-DD`. */
  minValue?: string
  /** Latest selectable date, `YYYY-MM-DD`. */
  maxValue?: string
  /** Return `true` to disable a `YYYY-MM-DD` date. */
  isDateUnavailable?: (date: string) => boolean
  description?: string
  /** Shows the message and marks the field invalid. */
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  /** Form field name for the start date (submits `YYYY-MM-DD`). */
  startName?: string
  /** Form field name for the end date (submits `YYYY-MM-DD`). */
  endName?: string
  className?: string
}

function parseRange(
  range: RudiDateRange | null | undefined,
): { start: CalendarDate; end: CalendarDate } | null {
  if (!range) return null
  const start = parseDateString(range.start, 'day') as CalendarDate | null
  const end = parseDateString(range.end, 'day') as CalendarDate | null
  return start && end ? { start, end } : null
}

export const RudiDateRangePicker = React.forwardRef<
  HTMLDivElement,
  RudiDateRangePickerProps
>(function RudiDateRangePicker(
  {
    label,
    value,
    defaultValue,
    onChange,
    minValue,
    maxValue,
    isDateUnavailable,
    description,
    errorMessage,
    isRequired = false,
    isDisabled = false,
    isReadOnly = false,
    startName,
    endName,
    className,
  },
  ref,
) {
  const valueKey = value === undefined ? undefined : value ? `${value.start}/${value.end}` : null
  const parsedValue = useMemo(
    () => (value === undefined ? undefined : parseRange(value)),
    // valueKey captures the range contents, so new-but-equal objects don't re-parse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueKey],
  )
  const parsedDefault = useMemo(
    () => parseRange(defaultValue) ?? undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const parsedMin = useMemo(() => parseDateString(minValue) ?? undefined, [minValue])
  const parsedMax = useMemo(() => parseDateString(maxValue) ?? undefined, [maxValue])
  const unavailable = useMemo(
    () => adaptIsDateUnavailable(isDateUnavailable),
    [isDateUnavailable],
  )

  const handleChange = (next: { start: DateValue; end: DateValue } | null) => {
    onChange?.(
      next
        ? { start: formatDateValue(next.start), end: formatDateValue(next.end) }
        : null,
    )
  }

  return (
    <DateRangePicker<DateValue>
      ref={ref}
      className={cn('rudi-date-picker', className)}
      value={parsedValue}
      defaultValue={parsedDefault}
      onChange={handleChange}
      granularity="day"
      minValue={parsedMin}
      maxValue={parsedMax}
      isDateUnavailable={unavailable}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={errorMessage ? true : undefined}
      validationBehavior="aria"
      startName={startName}
      endName={endName}
      shouldForceLeadingZeros
    >
      {({ isInvalid }) => (
        <>
          <RudiFieldLabel label={label} isRequired={isRequired} />
          <Group className="rudi-date-picker__field">
            <DateInput slot="start" className="rudi-date-picker__input">
              {(segment) => (
                <DateSegment segment={segment} className="rudi-date-picker__segment" />
              )}
            </DateInput>
            <span className="rudi-date-picker__range-separator" aria-hidden="true">
              –
            </span>
            <DateInput slot="end" className="rudi-date-picker__input">
              {(segment) => (
                <DateSegment segment={segment} className="rudi-date-picker__segment" />
              )}
            </DateInput>
            <RudiCalendarTrigger />
          </Group>
          <RudiFieldFooter
            description={description}
            errorMessage={errorMessage}
            isInvalid={isInvalid}
          />
          <Popover className="rudi-date-picker__popover" placement="bottom start">
            <Dialog className="rudi-date-picker__dialog">
              <RangeCalendar className="rudi-date-picker__calendar rudi-date-picker__calendar--range">
                <RudiCalendarHeader />
                <RudiCalendarMonth />
              </RangeCalendar>
            </Dialog>
          </Popover>
        </>
      )}
    </DateRangePicker>
  )
})
