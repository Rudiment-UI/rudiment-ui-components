import { flushSync } from 'react-dom'
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components'

export type RudiToastVariant = 'info' | 'success' | 'warning' | 'error'

/** The content stored for each queued toast. */
export interface RudiToastContent {
  title: string
  description?: string
  variant: RudiToastVariant
}

export interface RudiToastOptions {
  /** Supporting text shown under the title. */
  description?: string
  /** Auto-dismiss delay in ms. Omit for the variant default; pass `0` to keep the toast until closed. */
  timeout?: number
  /** Called when the toast closes, by the user or by timeout. */
  onClose?: () => void
}

export interface RudiToastAddOptions extends RudiToastOptions {
  title: string
  variant: RudiToastVariant
}

/** Default auto-dismiss per variant. `undefined` means sticky. Errors stay until closed. */
const DEFAULT_TIMEOUT: Record<RudiToastVariant, number | undefined> = {
  success: 5000,
  info: 5000,
  warning: 5000,
  error: undefined,
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Animate toast enter/exit with the View Transitions API where it exists.
 * Skipped entirely under prefers-reduced-motion, so toasts appear and
 * disappear instantly.
 */
function wrapUpdate(fn: () => void) {
  if (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    !prefersReducedMotion()
  ) {
    document.startViewTransition(() => {
      flushSync(fn)
    })
  } else {
    fn()
  }
}

/** The single queue rendered by `RudiToastRegion`. */
export const toastQueue = new ToastQueue<RudiToastContent>({
  maxVisibleToasts: 5,
  wrapUpdate,
})

function add({ title, description, variant, timeout, onClose }: RudiToastAddOptions): string {
  const resolved = timeout === undefined ? DEFAULT_TIMEOUT[variant] : timeout
  return toastQueue.add(
    { title, description, variant },
    { timeout: resolved && resolved > 0 ? resolved : undefined, onClose },
  )
}

const byVariant =
  (variant: RudiToastVariant) =>
  (title: string, options: RudiToastOptions = {}): string =>
    add({ ...options, title, variant })

/**
 * Show toasts from anywhere: `rudiToast.success('Saved')`. Requires one
 * `RudiToastRegion` mounted near the app root. Every method returns the
 * toast's key, which `rudiToast.close(key)` accepts.
 */
export const rudiToast = {
  add,
  success: byVariant('success'),
  info: byVariant('info'),
  warning: byVariant('warning'),
  error: byVariant('error'),
  close: (key: string) => toastQueue.close(key),
  /** Removes every toast. Mainly useful in tests. */
  clear: () => toastQueue.clear(),
}
