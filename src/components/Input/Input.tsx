import React from 'react'
import { useTextField } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import './input.css'

/** Props for `RudiInput`. */
export interface RudiInputProps {
  /** Visible label and the field's accessible name. Required. */
  label: string
  /**
   * Native input type. Prefer `RudiNumberField` over `"number"` for numeric entry.
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search' | 'number'
  /** Hint text shown while the field is empty. Not a substitute for `label`. */
  placeholder?: string
  /** Help text under the field. Hidden while `errorMessage` is shown. */
  description?: string
  /**
   * Error text shown under the field. Setting it marks the field invalid; leave it unset when the value is valid.
   */
  errorMessage?: string
  /**
   * Marks the field required and adds an asterisk to the label.
   * @default false
   */
  isRequired?: boolean
  /**
   * Disables the field.
   * @default false
   */
  isDisabled?: boolean
  /** Controlled value. Pair with `onChange`. */
  value?: string
  /** Initial value for an uncontrolled field. */
  defaultValue?: string
  /** Called with the new text (a string, not an event) on every edit. */
  onChange?: (value: string) => void
  /** Called when the field loses focus, e.g. to validate on blur. */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Form field name, for native form submission and password managers. */
  name?: string
  /** Autofill hint, e.g. `email`, `one-time-code`, `current-password`. */
  autoComplete?: string
  /** Virtual-keyboard hint, e.g. `numeric` for a one-time code. */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  /** Maximum number of characters the user can enter. */
  maxLength?: number
  /** Makes the value selectable and focusable but not editable. */
  isReadOnly?: boolean
  /** Focuses the field on mount. */
  autoFocus?: boolean
  /** Extra class names for the wrapper element, merged with the component's own classes. */
  className?: string
}

/**
 * A single-line text field with label, description and error message. `label` is required and is the accessible name. `onChange` receives the string value, not an event. The ref points at the `<input>`.
 *
 * @example
 * <RudiInput label="Email" type="email" value={email} onChange={setEmail} />
 */
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
