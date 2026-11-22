import { createContext } from 'react'
import type { CheckboxGroupState } from 'react-stately'

/** Shared by RudiCheckboxGroup and the RudiCheckbox items inside it. */
export const CheckboxGroupContext = createContext<CheckboxGroupState | null>(null)
