import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import './card.css'

/** Props for `RudiCard`. */
export interface RudiCardProps {
  /**
   * Surface treatment: plain, bordered, or raised with a shadow.
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'elevated'
  /**
   * Inner padding of the card.
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Card content, usually `RudiCard.Header`, `RudiCard.Body`, and `RudiCard.Footer`. */
  children: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/** Props for `RudiCard.Header`. */
export interface RudiCardHeaderProps {
  /** Header content, such as a title and actions. */
  children: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/** Props for `RudiCard.Body`. */
export interface RudiCardBodyProps {
  /** Main card content. */
  children: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

/** Props for `RudiCard.Footer`. */
export interface RudiCardFooterProps {
  /** Footer content, such as buttons or metadata. */
  children: React.ReactNode
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

const CardRoot = forwardRef<HTMLDivElement, RudiCardProps>(
  function RudiCard(
    { variant = 'default', padding = 'md', children, className },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'rudi-card',
          `rudi-card--${variant}`,
          `rudi-card--padding-${padding}`,
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

function CardHeader({ children, className }: RudiCardHeaderProps) {
  return (
    <div className={cn('rudi-card__header', className)}>{children}</div>
  )
}

function CardBody({ children, className }: RudiCardBodyProps) {
  return (
    <div className={cn('rudi-card__body', className)}>{children}</div>
  )
}

function CardFooter({ children, className }: RudiCardFooterProps) {
  return (
    <div className={cn('rudi-card__footer', className)}>{children}</div>
  )
}

/**
 * Surface container that groups related content. Compose it with `RudiCard.Header`, `RudiCard.Body`, and `RudiCard.Footer`. Use `RudiStatCard` for a single metric.
 * Forwards its ref to the root `div`.
 * @example
 * ```tsx
 * <RudiCard variant="outlined">
 *   <RudiCard.Header>Billing</RudiCard.Header>
 *   <RudiCard.Body>Next invoice on 1 March.</RudiCard.Body>
 * </RudiCard>
 * ```
 */
export const RudiCard = Object.assign(CardRoot, {
  /** Top section of the card; holds the title and actions. */
  Header: CardHeader,
  /** Main content area of the card. */
  Body: CardBody,
  /** Bottom section of the card; holds buttons or metadata. */
  Footer: CardFooter,
})
