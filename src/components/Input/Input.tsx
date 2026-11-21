import React from 'react'
import { useTextField } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import './input.css'

export interface RudiInputProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search' | 'number'
  placeholder?: string
  description?: string
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Called when the field loses focus, e.g. to validate on blur. */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Form field name, for native form submission and password managers. */
  name?: string
  /** Autofill hint, e.g. `email`, `one-time-code`, `current-password`. */
  autoComplete?: string
  /** Virtual-keyboard hint, e.g. `numeric` for a one-time code. */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  maxLength?: number
  isReadOnly?: boolean
  autoFocus?: boolean
  className?: string
}

export const RudiInput = React.forwardRef<HTMLInputElement, RudiInputProps>(
  function RudiInput(
    {
      label,
      type = 'text',
      placeholder,
      description,
      errorMessage,
      isRequired = false,
      isDisabled = false,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      autoComplete,
      inputMode,
      maxLength,
      isReadOnly,
      autoFocus,
      className,
    },
    forwardedRef,
  ) {
    const ref = useObjectRef(forwardedRef)
    const {
      labelProps,
      inputProps,
      descriptionProps,
      errorMessageProps,
      isInvalid,
    } = useTextField(
      {
        label,
        type,
        placeholder,
        description,
        errorMessage,
        isRequired,
        isDisabled,
        value,
        defaultValue,
        onChange,
        onBlur,
        name,
        autoComplete,
        inputMode,
        maxLength,
        isReadOnly,
        autoFocus,
        isInvalid: !!errorMessage,
      },
      ref,
    )

    return (
      <div className={cn('rudi-input', className)}>
        <label {...labelProps} className="rudi-input__label">
          {label}
          {isRequired && (
            <span className="rudi-input__required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        <input
          {...inputProps}
          ref={ref}
          className={cn(
            'rudi-input__field',
            isInvalid && 'rudi-input__field--error',
          )}
        />
        {description && !isInvalid && (
          <p {...descriptionProps} className="rudi-input__description">
            {description}
          </p>
        )}
        {isInvalid && errorMessage && (
          <p {...errorMessageProps} className="rudi-input__error">
            {errorMessage}
          </p>
        )}
      </div>
    )
  },
)
