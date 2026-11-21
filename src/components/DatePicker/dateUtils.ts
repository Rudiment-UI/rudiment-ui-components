import {
  CalendarDate,
  CalendarDateTime,
  parseDate,
  parseDateTime,
  toCalendarDate,
  toCalendarDateTime,
  type DateValue,
} from '@internationalized/date'

export type RudiDateGranularity = 'day' | 'minute'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Parses a public `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm[:ss]` string into a
 * date value. Returns `null` for empty or malformed input so a bad prop never
 * throws during render. With `granularity: 'minute'` a date-only string is
 * promoted to midnight so the field renders its time segments.
 */
export function parseDateString(
  value: string | null | undefined,
  granularity: RudiDateGranularity = 'day',
): CalendarDate | CalendarDateTime | null {
  if (!value) return null
  try {
    if (value.includes('T')) {
      const dateTime = parseDateTime(value)
      return granularity === 'day' ? toCalendarDate(dateTime) : dateTime
    }
    const date = parseDate(value)
    return granularity === 'minute' ? toCalendarDateTime(date) : date
  } catch {
    return null
  }
}

/** Formats a date value as `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` for minute granularity. */
export function formatDateValue(
  value: DateValue,
  granularity: RudiDateGranularity = 'day',
): string {
  const date = toCalendarDate(value).toString()
  if (granularity === 'day') return date
  const time = 'hour' in value ? value : { hour: 0, minute: 0 }
  return `${date}T${pad(time.hour)}:${pad(time.minute)}`
}

/** Adapts a string-based `isDateUnavailable` callback to React Aria's DateValue signature. */
export function adaptIsDateUnavailable(
  fn: ((date: string) => boolean) | undefined,
): ((date: DateValue) => boolean) | undefined {
  if (!fn) return undefined
  return (date) => fn(toCalendarDate(date).toString())
}
