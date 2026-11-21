import React, { forwardRef, useEffect, useRef } from 'react'
import { useObjectRef } from '@react-aria/utils'
import { cn } from '@/utils/cn'
import { RudiAlert } from '@/components/Alert/Alert'
import './form.css'

export interface RudiFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  /** Called on submit with the form's data. The page never reloads. */
  onSubmit?: (data: FormData, event: React.FormEvent<HTMLFormElement>) => void
  /**
   * Problems to fix. When this goes from empty to non-empty (usually right after
   * a submit) the summary is shown at the top and receives focus, so keyboard and
   * screen-reader users land on it.
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
  const errorKey = errors.join('\n')

  // Focus the summary whenever a new set of problems appears.
  useEffect(() => {
    if (hasErrors) summaryRef.current?.focus()
  }, [hasErrors, errorKey])

  return (
    <form
      {...props}
      ref={ref}
      noValidate={noValidate}
      className={cn('rudi-form', className)}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(new FormData(event.currentTarget), event)
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
