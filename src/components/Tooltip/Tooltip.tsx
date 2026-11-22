import React, { forwardRef, useRef } from 'react'
import {
  useTooltipTrigger,
  useTooltip as useTooltipAria,
} from 'react-aria'
import type { AriaTooltipProps } from 'react-aria'
import { useTooltipTriggerState } from 'react-stately'
import { cn } from '@/utils/cn'
import './tooltip.css'

/** Props for `RudiTooltipTrigger`. */
export interface RudiTooltipTriggerProps {
  /**
   * Milliseconds the pointer or focus must rest on the trigger before the tooltip opens.
   * @default 500
   */
  delay?: number
  /**
   * Milliseconds to wait before closing after the pointer or focus leaves.
   * @default 0
   */
  closeDelay?: number
  /** Exactly two elements: the trigger (must accept a `ref`, e.g. `RudiButton`), then the `RudiTooltip`. */
  children: [React.ReactElement, React.ReactElement]
}

/**
 * Shows a `RudiTooltip` when its trigger is hovered or focused. Takes exactly two children, the
 * trigger element then the `RudiTooltip`. The trigger is linked to the tooltip with
 * `aria-describedby`, so keep the tooltip to short supplementary text, not essential content or
 * interactive controls. The forwarded ref points at the wrapping `span`.
 *
 * @example
 * <RudiTooltipTrigger delay={300}>
 *   <RudiIconButton aria-label="Refresh" onPress={refresh}><RudiIcon icon="mdi:refresh" /></RudiIconButton>
 *   <RudiTooltip>Refresh data</RudiTooltip>
 * </RudiTooltipTrigger>
 */
export const RudiTooltipTrigger = forwardRef<HTMLSpanElement, RudiTooltipTriggerProps>(
  function RudiTooltipTrigger({ delay = 500, closeDelay = 0, children }, ref) {
    const state = useTooltipTriggerState({ delay, closeDelay })
    const triggerRef = useRef<HTMLElement>(null)
    const { triggerProps, tooltipProps: triggerTooltipProps } =
      useTooltipTrigger({ delay, closeDelay }, state, triggerRef)

    const [trigger, tooltip] = children
    const { 'aria-describedby': ariaDescribedBy, tabIndex: _tabIndex, ...eventProps } = triggerProps

    return (
      <span ref={ref} className="rudi-tooltip-trigger" {...eventProps}>
        {React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
          ref: triggerRef,
          'aria-describedby': ariaDescribedBy,
        })}
        {state.isOpen && React.cloneElement(tooltip, triggerTooltipProps)}
      </span>
    )
  },
)

/** Props for `RudiTooltip`. Also accepts React Aria's `AriaTooltipProps`. */
export interface RudiTooltipProps extends AriaTooltipProps {
  /** Tooltip text. */
  children: React.ReactNode
  /** Class merged onto the tooltip element. */
  className?: string
}

/**
 * Tooltip bubble. Use only as the second child of `RudiTooltipTrigger`, which controls when it
 * appears and where the open state comes from.
 *
 * @example
 * <RudiTooltip>Copy to clipboard</RudiTooltip>
 */
export const RudiTooltip = forwardRef<HTMLSpanElement, RudiTooltipProps>(
  function RudiTooltip({ children, className, ...props }, ref) {
    const { tooltipProps } = useTooltipAria(props)

    return (
      <span
        {...tooltipProps}
        ref={ref}
        className={cn('rudi-tooltip', className)}
        role="tooltip"
      >
        {children}
      </span>
    )
  },
)
