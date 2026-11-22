import React from 'react'
import { useTextField } from 'react-aria'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import './textarea.css'

/** Props for `RudiTextarea`. */
export interface RudiTextareaProps {
  /** Visible label and the field's accessible name. Required. */
  label: string
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
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  /** Form field name, for native form submission. */
  name?: string
  /** Maximum number of characters the user can enter. */
  maxLength?: number
  /** Makes the value selectable and focusable but not editable. */
  isReadOnly?: boolean
  /** Focuses the field on mount. */
  autoFocus?: boolean
  /**
   * Visible height in text rows.
   * @default 4
   */
  rows?: number
  /**
   * Which directions the user can drag-resize the field.
   * @default 'vertical'
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  /** Extra class names for the wrapper element, merged with the component's own classes. */
  className?: string
}

/**
 * A multi-line text field with label, description and error message. `label` is required and is the accessible name. `onChange` receives the string value, not an event. The ref points at the `<textarea>`.
 *
 * @example
 * <RudiTextarea label="Notes" rows={6} value={notes} onChange={setNotes} />
 */
export const RudiTextarea = React.forwardRef<
  HTMLTextAreaElement,
  RudiTextareaProps
>(function RudiTextarea(
  {
    label,
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
    maxLength,
    isReadOnly,
    autoFocus,
    rows = 4,
    resize = 'vertical',
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
      maxLength,
      isReadOnly,
      autoFocus,
      isInvalid: !!errorMessage,
      inputElementType: 'textarea',
    },
    ref,
  )

  return (
    <div className={cn('rudi-textarea', className)}>
      <label {...labelProps} className="rudi-textarea__label">
        {label}
        {isRequired && (
          <span className="rudi-textarea__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <textarea
        {...inputProps}
        ref={ref}
        rows={rows}
        className={cn(
          'rudi-textarea__field',
          `rudi-textarea__field--resize-${resize}`,
          isInvalid && 'rudi-textarea__field--error',
        )}
      />
      {description && !isInvalid && (
        <p {...descriptionProps} className="rudi-textarea__description">
          {description}
        </p>
      )}
      {isInvalid && errorMessage && (
        <p {...errorMessageProps} className="rudi-textarea__error">
          {errorMessage}
        </p>
      )}
    </div>
  )
})
