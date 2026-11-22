import React from 'react'
import { VisuallyHidden } from 'react-aria'
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

/** Props for `RudiNumberField`. */
export interface RudiNumberFieldProps {
  /** Visible label and the field's accessible name. Required. */
  label: string
  /**
   * Hides the label visually but keeps it as the accessible name.
   * @default false
   */
  labelHidden?: boolean
  /** Controlled value. `null` renders an empty field. */
  value?: number | null
  /** Initial value for an uncontrolled field. `null` starts empty. */
  defaultValue?: number | null
  /** Receives the parsed number, or `null` when the field is cleared. */
  onChange?: (value: number | null) => void
  /**
   * Smallest allowed value; the stepper and arrow keys stop here and typed values clamp to it.
   */
  minValue?: number
  /**
   * Largest allowed value; the stepper and arrow keys stop here and typed values clamp to it.
   */
  maxValue?: number
  /** Increment for the stepper buttons and arrow keys; values snap to it. */
  step?: number
  /**
   * Display format, e.g. `{ style: 'currency', currency: 'USD' }` or
   * `{ style: 'percent' }`. Percent values are fractions (`0.25` shows `25%`).
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Hint text shown while the field is empty. Not a substitute for `label`. */
  placeholder?: string
  /** Help text under the field. Hidden while `errorMessage` is shown. */
  description?: string
  /** Shows the message and marks the field invalid. */
  errorMessage?: string
  /**
   * Marks the field required and adds an asterisk to the label.
   * @default false
   */
  isRequired?: boolean
  /**
   * Disables the field and its stepper buttons.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Makes the value selectable and focusable but not editable.
   * @default false
   */
  isReadOnly?: boolean
  /** Form field name; submits the raw number. */
  name?: string
  /**
   * Hides the minus and plus buttons; arrow keys still change the value.
   * @default false
   */
  hideStepper?: boolean
  /** Extra class names for the wrapper element, merged with the component's own classes. */
  className?: string
}

const toInternal = (v: number | null | undefined) =>
  v === undefined ? undefined : v === null ? NaN : v

/**
 * A numeric field with locale-aware parsing, optional currency or percent formatting, and stepper buttons. Use it instead of `RudiInput type="number"`. `label` is required. `onChange` receives a number, or `null` when cleared. Ref points at the `<input>`.
 *
 * @example
 * <RudiNumberField label="Quantity" minValue={1} value={qty} onChange={setQty} />
 */
export const RudiNumberField = React.forwardRef<HTMLInputElement, RudiNumberFieldProps>(
  function RudiNumberField(
    {
      label,
      labelHidden = false,
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
            {labelHidden ? (
              <VisuallyHidden>
                <Label>{label}</Label>
              </VisuallyHidden>
            ) : (
              <Label className="rudi-number-field__label">
                {label}
                {isRequired && (
                  <span className="rudi-number-field__required" aria-hidden="true">
                    {' '}
                    *
                  </span>
                )}
              </Label>
            )}
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
