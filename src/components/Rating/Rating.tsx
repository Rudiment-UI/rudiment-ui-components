import { useRef } from 'react'
import { useFocusRing, useRadio, useRadioGroup, VisuallyHidden } from 'react-aria'
import { useRadioGroupState } from 'react-stately'
import type { RadioGroupState } from 'react-stately'
import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './rating.css'

/** Props for `RudiRating`. */
export interface RudiRatingProps {
  /** Current rating. Supports halves (e.g. `4.5`) in static mode. When `onChange` is set the value is rounded to the nearest whole number for display and selection, so half stars appear only in static mode. */
  value: number
  /**
   * Number of stars.
   * @default 5
   */
  max?: number
  /**
   * Size of the stars.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /** Makes the rating interactive. Called with the new rating (1 to `max`) when a star is chosen by pointer or keyboard (Arrow keys move and select, Home and End jump to the first and last star); receives the value, not an event. */
  onChange?: (value: number) => void
  /**
   * Shows the numeric value (e.g. `4.8`) beside the stars.
   * @default false
   */
  showValue?: boolean
  /** Review count rendered beside the stars, e.g. `(128)`. */
  count?: number
  /** Accessible name. Defaults to `"Rated {value} out of {max}"`. */
  label?: string
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

type StarState = 'full' | 'half' | 'empty'

function starState(index: number, value: number): StarState {
  if (value >= index + 1) return 'full'
  if (value >= index + 0.5) return 'half'
  return 'empty'
}

interface RatingStarProps {
  index: number
  state: StarState
  size: 'sm' | 'md' | 'lg'
  groupState: RadioGroupState
}

function RatingStar({ index, state, size, groupState }: RatingStarProps) {
  const ref = useRef<HTMLInputElement>(null)
  const n = index + 1
  const { inputProps } = useRadio(
    { value: String(n), 'aria-label': `${n} star${n === 1 ? '' : 's'}` },
    groupState,
    ref,
  )
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <label
      className={cn(
        'rudi-rating__button',
        isFocusVisible && 'rudi-rating__button--focus-visible',
      )}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <RudiIcon
        icon={state === 'half' ? 'lucide:star-half' : 'lucide:star'}
        size={size}
        className={cn('rudi-rating__star', `rudi-rating__star--${state}`)}
      />
    </label>
  )
}

interface InteractiveRatingProps {
  stars: StarState[]
  size: 'sm' | 'md' | 'lg'
  value: number
  label: string
  onChange: (value: number) => void
  className?: string
  text: React.ReactNode
}

function InteractiveRating({ stars, size, value, label, onChange, className, text }: InteractiveRatingProps) {
  const ariaProps = {
    'aria-label': label,
    orientation: 'horizontal' as const,
    value: value >= 1 ? String(value) : null,
    onChange: (v: string) => onChange(Number(v)),
  }
  const state = useRadioGroupState(ariaProps)
  const { radioGroupProps } = useRadioGroup(ariaProps, state)

  // Native radios and React Aria give Arrow-key movement; Home and End are added here.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Home' && e.key !== 'End') return
    const radios = e.currentTarget.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    const target = e.key === 'Home' ? radios[0] : radios[radios.length - 1]
    if (!target) return
    e.preventDefault()
    target.focus()
    state.setSelectedValue(target.value)
  }

  return (
    <div
      {...radioGroupProps}
      onKeyDown={onKeyDown}
      className={cn('rudi-rating', `rudi-rating--${size}`, className)}
    >
      {stars.map((s, i) => (
        <RatingStar key={i} index={i} state={s} size={size} groupState={state} />
      ))}
      {text}
    </div>
  )
}

/**
 * Star rating display that becomes an input when `onChange` is provided. Static mode is a single `role="img"`; interactive mode is a `radiogroup` of one native radio input per star, with a single tab stop and arrow-key navigation.
 * Controlled only: the parent owns `value`. In interactive mode `value` is rounded to a whole number for display and selection, so half stars appear only in static mode.
 * @example
 * ```tsx
 * <RudiRating value={rating} onChange={setRating} label="Rate this product" />
 * ```
 */
export function RudiRating({
  value,
  max = 5,
  size = 'md',
  onChange,
  showValue = false,
  count,
  label,
  className,
}: RudiRatingProps) {
  const interactive = typeof onChange === 'function'
  const displayValue = interactive ? Math.round(value) : value
  const stars = Array.from({ length: max }, (_, i) => starState(i, displayValue))
  const accessibleLabel = label ?? `Rated ${displayValue} out of ${max}`

  const icon = (state: StarState) => (
    <RudiIcon
      icon={state === 'half' ? 'lucide:star-half' : 'lucide:star'}
      size={size}
      className={cn('rudi-rating__star', `rudi-rating__star--${state}`)}
    />
  )

  const text = (showValue || count != null) && (
    <span className="rudi-rating__text">
      {showValue && displayValue.toFixed(1)}
      {count != null && ` (${count})`}
    </span>
  )

  if (interactive) {
    return (
      <InteractiveRating
        stars={stars}
        size={size}
        value={displayValue}
        label={accessibleLabel}
        onChange={onChange}
        className={className}
        text={text}
      />
    )
  }

  return (
    <div
      className={cn('rudi-rating', `rudi-rating--${size}`, className)}
      role="img"
      aria-label={accessibleLabel}
    >
      <span className="rudi-rating__stars" aria-hidden="true">
        {stars.map((state, i) => (
          <span key={i}>{icon(state)}</span>
        ))}
      </span>
      {text}
    </div>
  )
}
