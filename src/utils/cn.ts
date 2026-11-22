import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Joins class names with `clsx` and resolves conflicting Tailwind utilities with `tailwind-merge`.
 * Falsy values are dropped. Components use it so a consumer's `className` is merged, not replaced.
 *
 * @example
 * cn('rudi-button', isBusy && 'rudi-button--busy', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
