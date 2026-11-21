import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import { RudiAlert } from '@/components/Alert/Alert'
import './form.css'

export interface RudiFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  /** Called on submit with the form's data. The page never reloads. */
  onSubmit?: (data: FormData, event: React.FormEvent<HTMLFormElement>) => void
  /**
   * Problems to fix, shown as a summary at the top. After each submit that leaves
   * problems, the summary receives focus so keyboard and screen-reader users land
   * on it. Updating `errors` while the user edits never moves focus.
   */
  errors?: string[]
  /** Summary heading. Defaults to "1 problem to fix" / "N problems to fix". */
  errorTitle?: (count: number) => string
  children: React.ReactNode
  className?: string
}

const defaultTitle = (count: number) => `${count} ${count === 1 ? 'problem' : 'problems'} to fix`

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
