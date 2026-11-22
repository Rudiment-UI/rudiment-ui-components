import type { ReactNode } from 'react'
import {
  MenuItem as AriaMenuItem,
  Text,
  type MenuItemProps as AriaMenuItemProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'
import { RudiIcon } from '../Icon/Icon'
import { RudiKeyboard } from './Keyboard'

/** Props for `RudiMenuItem`. Inherits `id`, `href`, `onAction`, `isDisabled` and `textValue` from React Aria's `MenuItem`. */
export interface RudiMenuItemProps extends AriaMenuItemProps {
  /** Styles the item as a destructive action (for example Delete) and sets `data-destructive`. */
  isDestructive?: boolean
  /** Iconify icon name rendered before the label. */
  icon?: string
  /** Primary text. When set, content is composed for you (no need to pass children). */
  label?: string
  /** Secondary text shown beneath the label. */
  description?: ReactNode
  /** Keyboard shortcut hint shown at the trailing edge. */
  shortcut?: ReactNode
}

/**
 * A single action in a `RudiMenu`. Give it a `label` (plus optional `icon`, `description` and
 * `shortcut`) for structured content, or pass plain `children`. Give every item an `id`, which is
 * the key delivered to the menu's `onAction`. When `children` is not a plain string and no `label`
 * is set, pass `textValue` so typeahead works.
 *
 * @example
 * <RudiMenuItem id="delete" label="Delete" icon="mdi:delete" shortcut="⌫" isDestructive />
 */
export function RudiMenuItem({
  isDestructive,
  icon,
  label,
  description,
  shortcut,
  className,
  textValue,
  children,
  ...props
}: RudiMenuItemProps) {
  const isStructured =
    label != null || icon != null || description != null || shortcut != null

  // RAC needs a textValue for typeahead when children aren't a plain string.
  const resolvedTextValue =
    textValue ?? label ?? (typeof children === 'string' ? children : undefined)

  return (
    <AriaMenuItem
      {...props}
      textValue={resolvedTextValue}
      className={(renderProps) =>
        cn(
          'rudi-menu__item',
          isDestructive && 'rudi-menu__item--destructive',
          typeof className === 'function' ? className(renderProps) : className,
        )
      }
      data-destructive={isDestructive || undefined}
    >
      {isStructured ? (
        <>
          {icon && <RudiIcon icon={icon} className="rudi-menu__item-icon" />}
          {(label != null || description != null) && (
            <span className="rudi-menu__item-content">
              {label != null && (
                <Text slot="label" className="rudi-menu__item-label">
                  {label}
                </Text>
              )}
              {description != null && (
                <Text slot="description" className="rudi-menu__item-description">
                  {description}
                </Text>
              )}
            </span>
          )}
          {shortcut != null && <RudiKeyboard>{shortcut}</RudiKeyboard>}
        </>
      ) : (
        children
      )}
    </AriaMenuItem>
  )
}
