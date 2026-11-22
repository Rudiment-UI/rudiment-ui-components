import { cn } from '@/utils/cn'
import { RudiIcon } from '@/components/Icon/Icon'
import './stepper.css'

/** Progress state of a step: finished, in progress, or not yet reached. */
export type RudiStepStatus = 'complete' | 'current' | 'upcoming'

/** One step in a `RudiStepper`. */
export interface RudiStepperStep {
  /** Step title. */
  label: string
  /** Secondary text shown under the label. */
  description?: string
  /** Iconify icon name for the node. Falls back to a check (complete) or the step number. */
  icon?: string
  /**
   * Progress state of the step.
   * @default 'upcoming'
   */
  status?: RudiStepStatus
}

/** Props for `RudiStepper`. */
export interface RudiStepperProps {
  /** Steps in order. */
  steps: RudiStepperStep[]
  /**
   * `horizontal` is a progress track; `vertical` is a timeline.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Size of the step nodes and text.
   * @default 'md'
   */
  size?: 'sm' | 'md'
  /** Extra class names, merged with the component's own classes rather than replacing them. */
  className?: string
}

function nodeContent(step: RudiStepperStep, index: number) {
  if (step.icon) return <RudiIcon icon={step.icon} size="sm" />
  if (step.status === 'complete') return <RudiIcon icon="lucide:check" size="sm" />
  return <span className="rudi-stepper__number">{index + 1}</span>
}

/**
 * Ordered list of steps that shows progress through a multi-step process. Display only: it has no internal state or navigation, so set each step's `status` from your own state.
 * The step with `status: 'current'` gets `aria-current="step"`; steps without a status are treated as `upcoming`.
 * @example
 * ```tsx
 * <RudiStepper
 *   steps={[
 *     { label: 'Cart', status: 'complete' },
 *     { label: 'Payment', status: 'current' },
 *     { label: 'Confirm' },
 *   ]}
 * />
 * ```
 */
export function RudiStepper({
  steps,
  orientation = 'horizontal',
  size = 'md',
  className,
}: RudiStepperProps) {
  return (
    <ol
      className={cn(
        'rudi-stepper',
        `rudi-stepper--${orientation}`,
        `rudi-stepper--${size}`,
        className,
      )}
    >
      {steps.map((step, i) => {
        const status = step.status ?? 'upcoming'
        const filled = status === 'complete' || status === 'current'
        // A connector is "filled" once the step it leads into is reached.
        const nextReached =
          i < steps.length - 1 && (steps[i + 1].status ?? 'upcoming') !== 'upcoming'
        return (
          <li
            key={`${step.label}-${i}`}
            className={cn('rudi-stepper__step', `rudi-stepper__step--${status}`)}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            <div className="rudi-stepper__marker">
              {i > 0 && (
                <span
                  className={cn(
                    'rudi-stepper__connector',
                    'rudi-stepper__connector--before',
                    filled && 'rudi-stepper__connector--filled',
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'rudi-stepper__node',
                  filled && 'rudi-stepper__node--filled',
                )}
              >
                {nodeContent(step, i)}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    'rudi-stepper__connector',
                    'rudi-stepper__connector--after',
                    nextReached && 'rudi-stepper__connector--filled',
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="rudi-stepper__content">
              <span className="rudi-stepper__label">{step.label}</span>
              {step.description && (
                <span className="rudi-stepper__description">{step.description}</span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
