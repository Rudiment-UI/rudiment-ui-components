import { Separator, type SeparatorProps } from 'react-aria-components'
import { cn } from '@/utils/cn'

/** Props for `RudiMenuSeparator`. Accepts the props of React Aria's `Separator`. */
export interface RudiMenuSeparatorProps extends SeparatorProps {}

/**
 * Horizontal divider between groups of items in a `RudiMenu`. Use `RudiMenuSection` when the
 * group also needs a heading.
 *
 * @example
 * <RudiMenuSeparator />
 */
export function RudiMenuSeparator({ className, ...props }: RudiMenuSeparatorProps) {
  return (
    <Separator
      {...props}
      className={cn('rudi-menu__separator', className)}
    />
  )
}
