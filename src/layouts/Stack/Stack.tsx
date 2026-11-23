import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import { cn } from '@/utils/cn'
import { resolveSpace, type RudiSpace } from '@/utils/space'
import './stack.css'

export interface RudiStackProps extends React.HTMLAttributes<HTMLElement> {
  /** Gap between children: a step of the spacing scale (`"inline"`, `"content"`, `"group"`, `"section"`, `"gutter"`, or a fixed step: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`) or any CSS length. Falls back to the `--rudi-layout-stack-space-default` token (`group`). */
  space?: RudiSpace
  /**
   * Apply spacing recursively to all nested elements, not just direct children.
   *
   * @default false
   */
  recursive?: boolean
  /** 1-based index of the child after which to insert an auto margin, splitting the stack. */
  splitAfter?: number
  /**
   * HTML element to render.
   *
   * @default 'div'
   */
  as?: React.ElementType
  /** Items to space out vertically. */
  children?: React.ReactNode
}

/**
 * Vertical list of children with consistent spacing. Choose it for forms, card content, and page sections; use `RudiCluster` for items that run horizontally and wrap, and `RudiSwitcher` for a row that collapses to a column.
 * Polymorphic through `as` (use `"ul"` or `"ol"` for a list; bullets and indent are removed); unrecognised DOM props are spread onto the root element, and `className` is merged with the built-in class, not replaced.
 *
 * @example
 * <RudiStack space="content">
 *   <RudiInput label="Name" />
 *   <RudiInput label="Email" />
 * </RudiStack>
 */
export const RudiStack = forwardRef<HTMLElement, RudiStackProps>(function RudiStack(
  {
    space,
    recursive = false,
    splitAfter,
    as: Element = 'div',
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const customProperties: Record<string, string> = {}
  const spaceValue = resolveSpace(space)
  if (spaceValue) customProperties['--stack-space'] = spaceValue

  // Apply margin-block-end: auto to the splitAfter child via React.
  // CSS :nth-child() does not accept custom properties, so this must
  // be handled in the component rather than in the stylesheet.
  // Children.toArray filters null/false values so conditional children
  // do not shift the numeric index.
  const childArray = Children.toArray(children)
  const styledChildren = splitAfter
    ? childArray.map((child, index) => {
        if (index === splitAfter - 1 && isValidElement(child)) {
          return cloneElement(
            child as React.ReactElement<{ style?: React.CSSProperties }>,
            {
              style: {
                ...(child.props as { style?: React.CSSProperties }).style,
                marginBlockEnd: 'auto',
              },
            },
          )
        }
        return child
      })
    : children

  return (
    <Element
      ref={ref}
      className={cn(
        'rudi-stack',
        recursive && 'rudi-stack--recursive',
        splitAfter && 'rudi-stack--split',
        className,
      )}
      style={{ ...customProperties, ...style } as React.CSSProperties}
      {...props}
    >
      {styledChildren}
    </Element>
  )
})
