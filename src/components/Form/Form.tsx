import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import { RudiAlert } from '@/components/Alert/Alert'
import './form.css'

/**
 * Props for `RudiForm`. Also accepts native `<form>` attributes except `onSubmit` and `children`,
 * and spreads them onto the element. `noValidate` defaults to `true`, so validation is left to the app.
 */
export interface RudiFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  /** Called on submit with the form's data. The page never reloads. */
  onSubmit?: (data: FormData, event: React.FormEvent<HTMLFormElement>) => void
  /**
   * Problems to fix, shown as a summary at the top. After each submit that leaves
   * problems, the summary receives focus so keyboard and screen-reader users land
   * on it. Updating `errors` while the user edits never moves focus.
   * @default []
   */
  errors?: string[]
  /**
   * Builds the summary heading from the error count.
   * @default defaultTitle
   */
  errorTitle?: (count: number) => string
  /** The form's fields and buttons. */
  children: React.ReactNode
  /** Extra class names for the form element, merged with the component's own classes. */
  className?: string
}

const defaultTitle = (count: number) => `${count} ${count === 1 ? 'problem' : 'problems'} to fix`

/**
 * A `<form>` that collects submitted values as `FormData`, never reloads the page, and shows a focusable error summary when `errors` is non-empty. Validate in `onSubmit` and pass the messages back via `errors`; field-level `errorMessage` props are set separately on each field.
 *
 * @example
 * <RudiForm onSubmit={(data) => save(data)} errors={errors}>
 *   <RudiInput label="Name" name="name" />
 *   <RudiButton type="submit">Save</RudiButton>
 * </RudiForm>
 */
export const RudiForm = forwardRef<HTMLFormElement, RudiFormProps>(function RudiForm(
  { onSubmit, errors = [], errorTitle = defaultTitle, noValidate = true, className, children, ...props },
  forwardedRef,
) {
  const ref = useObjectRef(forwardedRef)
  const summaryRef = useRef<HTMLDivElement>(null)
  const hasErrors = errors.length > 0
  const [submits, setSubmits] = useState(0)

  // Focus the summary after a submit that leaves problems (not while the user is editing).
  useEffect(() => {
    if (submits > 0 && hasErrors) summaryRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per submit only
  }, [submits])

  return (
    <form
      {...props}
      ref={ref}
      noValidate={noValidate}
      className={cn('rudi-form', className)}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(new FormData(event.currentTarget), event)
        setSubmits((n) => n + 1)
      }}
    >
      {hasErrors && (
        <div ref={summaryRef} tabIndex={-1} className="rudi-form__summary">
          <RudiAlert variant="error" title={errorTitle(errors.length)}>
            <ul className="rudi-form__summary-list">
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </RudiAlert>
        </div>
      )}
      {children}
    </form>
  )
})
