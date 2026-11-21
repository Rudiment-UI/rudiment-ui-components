import { useCheckboxGroup } from 'react-aria'
import { useCheckboxGroupState } from 'react-stately'
import { cn } from '@/utils/cn'
import { CheckboxGroupContext } from './CheckboxGroupContext'
import './checkbox.css'

export interface RudiCheckboxGroupProps {
  label: string
  description?: string
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  isDisabled?: boolean
  errorMessage?: string
  children: React.ReactNode
  className?: string
}

export function RudiCheckboxGroup(props: RudiCheckboxGroupProps) {
  // isInvalid links the error message to the group and marks it invalid for assistive tech.
  const ariaProps = { ...props, isInvalid: !!props.errorMessage }
  const state = useCheckboxGroupState(ariaProps)
  const { groupProps, labelProps, descriptionProps, errorMessageProps } =
    useCheckboxGroup(ariaProps, state)

  return (
    <CheckboxGroupContext.Provider value={state}>
    <div
      {...groupProps}
      className={cn('rudi-checkbox-group', props.className)}
    >
      <span {...labelProps} className="rudi-checkbox-group__label">
        {props.label}
      </span>
      {props.children}
      {props.description && !props.errorMessage && (
        <p
          {...descriptionProps}
          className="rudi-checkbox-group__description"
        >
          {props.description}
        </p>
      )}
      {props.errorMessage && (
        <p {...errorMessageProps} className="rudi-checkbox-group__error">
          {props.errorMessage}
        </p>
      )}
    </div>
    </CheckboxGroupContext.Provider>
  )
}
