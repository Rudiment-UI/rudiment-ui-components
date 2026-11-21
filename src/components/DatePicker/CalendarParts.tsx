import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  FieldError,
  Heading,
  Label,
  Text,
} from 'react-aria-components'
import { RudiIcon } from '../Icon/Icon'
import './date-picker.css'

/** Month heading flanked by previous / next buttons. Shared by both calendars. */
export function RudiCalendarHeader() {
  return (
    <header className="rudi-date-picker__calendar-header">
      <Button slot="previous" className="rudi-date-picker__nav">
        <RudiIcon icon="lucide:chevron-left" size="sm" />
      </Button>
      <Heading className="rudi-date-picker__heading" />
      <Button slot="next" className="rudi-date-picker__nav">
        <RudiIcon icon="lucide:chevron-right" size="sm" />
      </Button>
    </header>
  )
}

/** Weekday header + day cells. Works inside `Calendar` and `RangeCalendar`. */
export function RudiCalendarMonth() {
  return (
    <CalendarGrid className="rudi-date-picker__grid">
      <CalendarGridHeader>
        {(day) => (
          <CalendarHeaderCell className="rudi-date-picker__weekday">
            {day}
          </CalendarHeaderCell>
        )}
      </CalendarGridHeader>
      <CalendarGridBody>
        {(date) => (
          <CalendarCell date={date} className="rudi-date-picker__cell" />
        )}
      </CalendarGridBody>
    </CalendarGrid>
  )
}

/** The calendar trigger button that sits at the end of the field. */
export function RudiCalendarTrigger() {
  return (
    <Button className="rudi-date-picker__trigger">
      <RudiIcon icon="lucide:calendar" size="sm" />
    </Button>
  )
}

interface FieldChromeProps {
  label: string
  isRequired?: boolean
}

/** Label with the same required asterisk treatment as `RudiInput`. */
export function RudiFieldLabel({ label, isRequired }: FieldChromeProps) {
  return (
    <Label className="rudi-date-picker__label">
      {label}
      {isRequired && (
        <span className="rudi-date-picker__required" aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </Label>
  )
}

interface FieldFooterProps {
  description?: string
  errorMessage?: string
  isInvalid: boolean
}

/** Description (hidden while invalid, as in `RudiInput`) and error text. */
export function RudiFieldFooter({
  description,
  errorMessage,
  isInvalid,
}: FieldFooterProps) {
  return (
    <>
      {description && !isInvalid && (
        <Text slot="description" className="rudi-date-picker__description">
          {description}
        </Text>
      )}
      <FieldError className="rudi-date-picker__error">
        {errorMessage || undefined}
      </FieldError>
    </>
  )
}
