import { useRef } from 'react'
import { useButton } from 'react-aria'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './pagination.css'

/** Props for `RudiPagination`. */
export interface RudiPaginationProps {
  /** Current page (1-based). */
  page: number
  /** Total number of pages. */
  pageCount: number
  /** Called with the new 1-based page number when the user picks a page. Not called when the target is the current page. */
  onPageChange: (page: number) => void
  /**
   * Pages shown on each side of the current page before truncating.
   * @default 1
   */
  siblingCount?: number
  /**
   * Accessible label for the nav landmark.
   * @default 'Pagination'
   */
  label?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

type PageToken = number | 'ellipsis-start' | 'ellipsis-end'

/** Build the visible token list: first, last, current ± siblings, ellipses. */
function paginationRange(
  page: number,
  pageCount: number,
  siblingCount: number,
): PageToken[] {
  // Show every page when the count is small enough that ellipses add nothing.
  const totalShown = siblingCount * 2 + 5 // first, last, current, 2 ellipses
  if (pageCount <= totalShown) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, pageCount)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < pageCount - 1

  const tokens: PageToken[] = [1]
  if (showLeftEllipsis) tokens.push('ellipsis-start')
  else for (let p = 2; p < left; p++) tokens.push(p)

  for (let p = left; p <= right; p++) {
    if (p !== 1 && p !== pageCount) tokens.push(p)
  }

  if (showRightEllipsis) tokens.push('ellipsis-end')
  else for (let p = right + 1; p < pageCount; p++) tokens.push(p)

  tokens.push(pageCount)
  return tokens
}

interface PaginationButtonProps {
  className: string
  'aria-label': string
  'aria-current'?: 'page'
  isDisabled?: boolean
  onPress: () => void
  children: React.ReactNode
}

/** Button with React Aria press handling, shared by the page, previous and next controls. */
function PaginationButton({ className, children, ...ariaProps }: PaginationButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(ariaProps, ref)
  return (
    <button ref={ref} {...buttonProps} className={className}>
      {children}
    </button>
  )
}

/**
 * Page navigation with previous and next buttons and numbered pages, truncated with ellipses for long ranges. Controlled: the parent owns `page`. A `page` outside 1 to `pageCount` is clamped for rendering.
 * Renders nothing when `pageCount` is 1 or less.
 * @example
 * ```tsx
 * <RudiPagination page={page} pageCount={12} onPageChange={setPage} />
 * ```
 */
export function RudiPagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  label = 'Pagination',
  className,
}: RudiPaginationProps) {
  if (pageCount <= 1) return null

  const current = Math.min(Math.max(page, 1), pageCount)
  const tokens = paginationRange(current, pageCount, siblingCount)
  const goTo = (p: number) => {
    const clamped = Math.min(Math.max(p, 1), pageCount)
    if (clamped !== current) onPageChange(clamped)
  }

  return (
    <nav aria-label={label} className={cn('rudi-pagination', className)}>
      <ul className="rudi-pagination__list">
        <li>
          <PaginationButton
            className="rudi-pagination__control"
            aria-label="Go to previous page"
            isDisabled={current <= 1}
            onPress={() => goTo(current - 1)}
          >
            <RudiIcon icon="lucide:chevron-left" size="sm" />
          </PaginationButton>
        </li>

        {tokens.map((token) =>
          typeof token === 'number' ? (
            <li key={token}>
              <PaginationButton
                className={cn(
                  'rudi-pagination__page',
                  token === current && 'rudi-pagination__page--active',
                )}
                aria-label={`Go to page ${token}`}
                aria-current={token === current ? 'page' : undefined}
                onPress={() => goTo(token)}
              >
                {token}
              </PaginationButton>
            </li>
          ) : (
            <li key={token} className="rudi-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ),
        )}

        <li>
          <PaginationButton
            className="rudi-pagination__control"
            aria-label="Go to next page"
            isDisabled={current >= pageCount}
            onPress={() => goTo(current + 1)}
          >
            <RudiIcon icon="lucide:chevron-right" size="sm" />
          </PaginationButton>
        </li>
      </ul>
    </nav>
  )
}
