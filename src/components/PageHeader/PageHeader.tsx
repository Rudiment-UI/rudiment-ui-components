import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { RudiHeading } from '@/typography/Heading/Heading'
import { RudiText } from '@/typography/Text/Text'
import './page-header.css'

export interface RudiPageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Page title, rendered as the heading. */
  title: React.ReactNode
  /** Supporting line below the title, in caption text. */
  subtitle?: React.ReactNode
  /** Content above the title, e.g. a breadcrumb or a small overline. Rendered in a `div`. */
  eyebrow?: React.ReactNode
  /** Content below the subtitle, e.g. a row of badges or key facts. Rendered in a `div`. */
  meta?: React.ReactNode
  /** Content pinned to the inline-end, e.g. primary page actions. */
  actions?: React.ReactNode
  /**
   * Heading level for the title. Defaults to 1.
   *
   * @default 1
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Extra class names, merged with the built-in classes. */
  className?: string
}

/**
 * Title block for a page: heading with optional eyebrow, subtitle, metadata, and an actions slot. Use it once at the top of a page; use `RudiSectionHeader` for sections within a page. The title is visually sized 2 whatever `headingLevel` is. Other DOM props go on the root `div`.
 *
 * @example
 * <RudiPageHeader title="Projects" subtitle="12 active" actions={<RudiButton onPress={create}>New</RudiButton>} />
 */
export const RudiPageHeader = forwardRef<HTMLDivElement, RudiPageHeaderProps>(
  function RudiPageHeader(
    { title, subtitle, eyebrow, meta, actions, headingLevel = 1, className, ...props },
    ref,
  ) {
    return (
      <div ref={ref} className={cn('rudi-page-header', className)} {...props}>
        <div className="rudi-page-header__text">
          {eyebrow != null && (
            <div className="rudi-page-header__eyebrow">{eyebrow}</div>
          )}
          <RudiHeading
            level={headingLevel}
            size={2}
            noMargin
            className="rudi-page-header__title"
          >
            {title}
          </RudiHeading>
          {subtitle != null && (
            <RudiText
              variant="caption"
              noMargin
              className="rudi-page-header__subtitle"
            >
              {subtitle}
            </RudiText>
          )}
          {meta != null && (
            <div className="rudi-page-header__meta">{meta}</div>
          )}
        </div>
        {actions != null && (
          <div className="rudi-page-header__actions">{actions}</div>
        )}
      </div>
    )
  },
)
