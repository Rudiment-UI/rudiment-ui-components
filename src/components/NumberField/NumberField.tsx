import React from 'react'
import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField,
  Text,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import { RudiIcon } from '../Icon/Icon'
import './number-field.css'

export interface RudiNumberFieldProps {
  label: string
  /** Controlled value. `null` renders an empty field. */
  value?: number | null
  defaultValue?: number | null
  /** Receives the parsed number, or `null` when the field is cleared. */
  onChange?: (value: number | null) => void
  minValue?: number
  maxValue?: number
  /** Increment for the stepper buttons and arrow keys; values snap to it. */
  step?: number
  /**
   * Display format, e.g. `{ style: 'currency', currency: 'USD' }` or
   * `{ style: 'percent' }`. Percent values are fractions (`0.25` shows `25%`).
   */
  formatOptions?: Intl.NumberFormatOptions
  placeholder?: string
  description?: string
  /** Shows the message and marks the field invalid. */
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  /** Form field name; submits the raw number. */
  name?: string
  /** Hide the − / + stepper buttons (arrow keys still work). */
  hideStepper?: boolean
  className?: string
}

const toInternal = (v: number | null | undefined) =>
  v === undefined ? undefined : v === null ? NaN : v

export const RudiNumberField = React.forwardRef<HTMLInputElement, RudiNumberFieldProps>(
  function RudiNumberField(
    {
      label,
      value,
      defaultValue,
      onChange,
      minValue,
      maxValue,
      step,
      formatOptions,
      placeholder,
      description,
      errorMessage,
      isRequired = false,
      isDisabled = false,
      isReadOnly = false,
      name,
      hideStepper = false,
      className,
    },
    ref,
  ) {
    return (
      <NumberField
        className={cn('rudi-number-field', className)}
        value={toInternal(value)}
        defaultValue={toInternal(defaultValue)}
        onChange={(next) => onChange?.(Number.isNaN(next) ? null : next)}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        formatOptions={formatOptions}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={errorMessage ? true : undefined}
        validationBehavior="aria"
        name={name}
      >
        {({ isInvalid }) => (
          <>
            <Label className="rudi-number-field__label">
              {label}
              {isRequired && (
                <span className="rudi-number-field__required" aria-hidden="true">
                  {' '}
                  *
                </span>
              )}
            </Label>
            <Group className="rudi-number-field__field">
              <Input
                ref={ref}
                placeholder={placeholder}
                className="rudi-number-field__input"
              />
              {!hideStepper && (
                <>
                  <Button slot="decrement" className="rudi-number-field__stepper">
                    <RudiIcon icon="lucide:minus" size="sm" />
                  </Button>
                  <Button slot="increment" className="rudi-number-field__stepper">
                    <RudiIcon icon="lucide:plus" size="sm" />
                  </Button>
                </>
              )}
            </Group>
            {description && !isInvalid && (
              <Text slot="description" className="rudi-number-field__description">
                {description}
              </Text>
            )}
            <FieldError className="rudi-number-field__error">
              {errorMessage || undefined}
            </FieldError>
          </>
        )}
      </NumberField>
    )
  },
)
