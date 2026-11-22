import { useButton } from 'react-aria'
import type { AriaButtonProps } from 'react-aria'
import type { RefObject } from 'react'

/**
 * Button behavior with a loading state, for building custom buttons. Wraps React Aria's `useButton`,
 * disables the button while `isLoading` (so it cannot be pressed twice) and sets `aria-busy`.
 * Spread the returned `buttonProps` on a `<button>`; `RudiButton` uses this internally.
 *
 * @example
 * const ref = useRef<HTMLButtonElement>(null)
 * const { buttonProps } = useLoadingButton({ onPress: save }, isSaving, ref)
 * return <button {...buttonProps} ref={ref}>Save</button>
 */
export function useLoadingButton(
  ariaProps: AriaButtonProps,
  isLoading: boolean,
  ref: RefObject<HTMLButtonElement | null>,
) {
  const { buttonProps } = useButton(
    { ...ariaProps, isDisabled: ariaProps.isDisabled || isLoading },
    ref,
  )
  return {
    buttonProps: {
      ...buttonProps,
      'aria-busy': isLoading || undefined,
    },
  }
}
