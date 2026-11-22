import {
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  Header,
  Collection,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

/** Props for `RudiMenuSection`. Inherits `items` and `children` from React Aria's `MenuSection`. */
export interface RudiMenuSectionProps<T extends object>
  extends AriaMenuSectionProps<T> {
  /** Heading rendered above the section's items. Omit for an unlabelled group. */
  title?: string
  /** Class merged onto the section element. */
  className?: string
}

/**
 * Groups related `RudiMenuItem`s inside a `RudiMenu`, with an optional `title` heading. Use
 * `RudiMenuSeparator` instead when you only need a divider with no heading.
 *
 * @example
 * <RudiMenuSection title="Danger zone">
 *   <RudiMenuItem id="delete" label="Delete" isDestructive />
 * </RudiMenuSection>
 */
export function RudiMenuSection<T extends object>({
  title,
  className,
  children,
  ...props
}: RudiMenuSectionProps<T>) {
  return (
    <AriaMenuSection {...props} className={cn('rudi-menu__section', className)}>
      {title && (
        <Header className="rudi-menu__section-header">{title}</Header>
      )}
      <Collection items={props.items}>{children}</Collection>
    </AriaMenuSection>
  )
}
