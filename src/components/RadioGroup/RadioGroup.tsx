import { createContext } from 'react'
import { useRadioGroup } from 'react-aria'
import { useRadioGroupState } from 'react-stately'
import type { RadioGroupState } from 'react-stately'
import { cn } from '@/utils/cn'
import './radio-group.css'

export const RadioGroupContext = createContext<RadioGroupState | null>(null)

export interface RudiRadioGroupProps {
  label: string
  description?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  isDisabled?: boolean
  errorMessage?: string
  children: React.ReactNode
  className?: string
}

export function RudiRadioGroup(props: RudiRadioGroupProps) {
  // isInvalid links the error message to the group and marks it invalid for assistive tech.
  const ariaProps = { ...props, isInvalid: !!props.errorMessage }
  const state = useRadioGroupState(ariaProps)
  const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
    useRadioGroup(ariaProps, state)

  return (
    <RadioGroupContext.Provider value={state}>
      <div
        {...radioGroupProps}
        className={cn('rudi-radio-group', props.className)}
      >
        <span {...labelProps} className="rudi-radio-group__label">
          {props.label}
        </span>
        <div
          className={cn(
            'rudi-radio-group__options',
            props.orientation === 'horizontal' &&
              'rudi-radio-group__options--horizontal',
          )}
        >
          {props.children}
        </div>
        {props.description && !props.errorMessage && (
          <p {...descriptionProps} className="rudi-radio-group__description">
            {props.description}
          </p>
        )}
        {props.errorMessage && (
          <p {...errorMessageProps} className="rudi-radio-group__error">
            {props.errorMessage}
          </p>
        )}
      </div>
    </RadioGroupContext.Provider>
  )
}
