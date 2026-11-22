import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { RudiHeading } from '@/typography/Heading/Heading'
import { RudiText } from '@/typography/Text/Text'
import './section-header.css'

export interface RudiSectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section title, rendered as the heading. */
  title: React.ReactNode
  /** Supporting text below the title, in small body text. */
  description?: React.ReactNode
  /** Content pinned to the inline-end, e.g. a "see all" link or button. */
  action?: React.ReactNode
  /**
   * Heading level for the title. Defaults to 2.
   *
   * @default 2
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

/**
 * Heading row for a section of a page, with an optional description and an action slot. Use `RudiPageHeader` for the page title instead. The title is visually sized 5 whatever `headingLevel` is. Other DOM props go on the root `div`.
 *
 * @example
 * <RudiSectionHeader title="Recent activity" action={<RudiButton onPress={showAll}>See all</RudiButton>} />
 */
export const RudiSectionHeader = forwardRef<
  HTMLDivElement,
  RudiSectionHeaderProps
>(function RudiSectionHeader(
  { title, description, action, headingLevel = 2, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('rudi-section-header', className)} {...props}>
      <div className="rudi-section-header__text">
        <RudiHeading
          level={headingLevel}
          size={5}
          noMargin
          className="rudi-section-header__title"
        >
          {title}
        </RudiHeading>
        {description != null && (
          <RudiText
            variant="body-sm"
            noMargin
            className="rudi-section-header__description"
          >
            {description}
          </RudiText>
        )}
      </div>
      {action != null && (
        <div className="rudi-section-header__action">{action}</div>
      )}
    </div>
  )
})
