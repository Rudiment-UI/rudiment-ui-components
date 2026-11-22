import React, { useMemo } from 'react'
import {
  Calendar,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components'
import type { DateValue } from '@internationalized/date'
import { cn } from '@/utils/cn'
import {
  adaptIsDateUnavailable,
  formatDateValue,
  parseDateString,
  type RudiDateGranularity,
} from './dateUtils'
import {
  RudiCalendarHeader,
  RudiCalendarMonth,
  RudiCalendarTrigger,
  RudiFieldFooter,
  RudiFieldLabel,
} from './CalendarParts'
import './date-picker.css'

/** Props for `RudiDatePicker`. Values are plain strings, not date objects. */
export interface RudiDatePickerProps {
  /** Visible label and the field's accessible name. Required. */
  label: string
  /**
   * Controlled value: `YYYY-MM-DD` for `granularity="day"`, or
   * `YYYY-MM-DDTHH:mm` for `granularity="minute"`. `null` clears the field.
   */
  value?: string | null
  /**
   * Initial value for an uncontrolled field, in the same string format as `value`. Read only on mount.
   */
  defaultValue?: string | null
  /** Receives the value in the same string format, or `null` when cleared or incomplete. */
  onChange?: (value: string | null) => void
  /**
   * `day` shows date segments; `minute` adds hour and minute segments.
   * @default 'day'
   */
  granularity?: RudiDateGranularity
  /** Earliest selectable value, same string format as `value`. */
  minValue?: string
  /** Latest selectable value, same string format as `value`. */
  maxValue?: string
  /** Return `true` to disable a `YYYY-MM-DD` date (weekends, holidays). */
  isDateUnavailable?: (date: string) => boolean
  /** Help text under the field. Hidden while the field is invalid (an `errorMessage`, or a value outside `minValue`/`maxValue` or flagged by `isDateUnavailable`). */
  description?: string
  /** Shows the message and marks the field invalid. */
  errorMessage?: string
  /**
   * Marks the field required and adds an asterisk to the label.
   * @default false
   */
  isRequired?: boolean
  /**
   * Disables the field and the calendar button.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Makes the value focusable but not editable, and disables the calendar.
   * @default false
   */
  isReadOnly?: boolean
  /** Form field name. Submits `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm:ss` with `granularity="minute"`. */
  name?: string
  /** Force a 12- or 24-hour clock in minute granularity. Defaults to the locale. */
  hourCycle?: 12 | 24
  /** Extra class names for the wrapper element, merged with the component's own classes. */
  className?: string
}

/**
 * A date (or date and time) field with segmented keyboard entry and a calendar popover. Values are ISO strings: `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with `granularity="minute"`. `label` is required. Use `RudiDateRangePicker` for a start and end date. Ref points at the wrapper `div`.
 *
 * @example
 * <RudiDatePicker label="Due date" value={due} onChange={setDue} />
 */
export const RudiDatePicker = React.forwardRef<HTMLDivElement, RudiDatePickerProps>(
  function RudiDatePicker(
    {
      label,
      value,
      defaultValue,
      onChange,
      granularity = 'day',
      minValue,
      maxValue,
      isDateUnavailable,
      description,
      errorMessage,
      isRequired = false,
      isDisabled = false,
      isReadOnly = false,
      name,
      hourCycle,
      className,
    },
    ref,
  ) {
    const parsedValue = useMemo(
      () => (value === undefined ? undefined : parseDateString(value, granularity)),
      [value, granularity],
    )
    const parsedDefault = useMemo(
      () => parseDateString(defaultValue, granularity) ?? undefined,
      // Only read on mount, like any uncontrolled default.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    )
    const parsedMin = useMemo(
      () => parseDateString(minValue, granularity) ?? undefined,
      [minValue, granularity],
    )
    const parsedMax = useMemo(
      () => parseDateString(maxValue, granularity) ?? undefined,
      [maxValue, granularity],
    )
    const unavailable = useMemo(
      () => adaptIsDateUnavailable(isDateUnavailable),
      [isDateUnavailable],
    )

    const handleChange = (next: DateValue | null) => {
      onChange?.(next ? formatDateValue(next, granularity) : null)
    }

    return (
      <DatePicker<DateValue>
        ref={ref}
        className={cn('rudi-date-picker', className)}
        value={parsedValue}
        defaultValue={parsedDefault}
        onChange={handleChange}
        granularity={granularity}
        minValue={parsedMin}
        maxValue={parsedMax}
        isDateUnavailable={unavailable}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={errorMessage ? true : undefined}
        validationBehavior="aria"
        name={name}
        hourCycle={hourCycle}
        shouldForceLeadingZeros
      >
        {({ isInvalid }) => (
          <>
            <RudiFieldLabel label={label} isRequired={isRequired} />
            <Group className="rudi-date-picker__field">
              <DateInput className="rudi-date-picker__input">
                {(segment) => (
                  <DateSegment
                    segment={segment}
                    className="rudi-date-picker__segment"
                  />
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
                <Calendar className="rudi-date-picker__calendar">
                  <RudiCalendarHeader />
                  <RudiCalendarMonth />
                </Calendar>
              </Dialog>
            </Popover>
          </>
        )}
      </DatePicker>
    )
  },
)
