import { Checkbox as AriaCheckbox } from 'react-aria-components'
import { cn } from '@/utils/cn'

/** Internal: the selection checkbox RAC wires up through `slot="selection"`. */
export function RudiTableSelectionCheckbox() {
  return (
    <AriaCheckbox slot="selection" className="rudi-table__checkbox">
      {({ isSelected, isIndeterminate }) => (
        <span
          aria-hidden="true"
          className={cn(
            'rudi-table__checkbox-control',
            isSelected && 'rudi-table__checkbox-control--checked',
            isIndeterminate && 'rudi-table__checkbox-control--indeterminate',
          )}
        />
      )}
    </AriaCheckbox>
  )
}
