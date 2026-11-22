import { flushSync } from 'react-dom'
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components'

/** Severity of a toast. Sets its icon and colors, and its default timeout (`error` stays until closed). */
export type RudiToastVariant = 'info' | 'success' | 'warning' | 'error'

/** The content stored for each queued toast. */
export interface RudiToastContent {
  /** Main message. */
  title: string
  /** Supporting text under the title. */
  description?: string
  /** Severity of the toast. */
  variant: RudiToastVariant
}

/** Options accepted by `rudiToast.success`, `info`, `warning` and `error`. */
export interface RudiToastOptions {
  /** Supporting text shown under the title. */
  description?: string
  /** Auto-dismiss delay in ms. Omit for the variant default; pass `0` to keep the toast until closed. */
  timeout?: number
  /** Called when the toast closes, by the user or by timeout. */
  onClose?: () => void
}

/** Options for `rudiToast.add`: the shared options plus the title and variant. */
export interface RudiToastAddOptions extends RudiToastOptions {
  /** Main message shown in bold. */
  title: string
  /** Severity of the toast; sets icon, colors and the default timeout. */
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
 * toast's key, which `rudiToast.close(key)` accepts. Success, info and warning toasts dismiss
 * after 5000 ms by default; error toasts stay until closed.
 *
 * @example
 * const key = rudiToast.error('Upload failed', { description: 'Try again.' })
 * rudiToast.close(key)
 */
export const rudiToast = {
  /** Queues a toast from a single options object (`title`, `variant`, plus `RudiToastOptions`). Returns its key. */
  add,
  /** Queues a success toast: `rudiToast.success(title, options?)`. Auto-dismisses after 5000 ms. Returns its key. */
  success: byVariant('success'),
  /** Queues an info toast: `rudiToast.info(title, options?)`. Auto-dismisses after 5000 ms. Returns its key. */
  info: byVariant('info'),
  /** Queues a warning toast: `rudiToast.warning(title, options?)`. Auto-dismisses after 5000 ms. Returns its key. */
  warning: byVariant('warning'),
  /** Queues an error toast: `rudiToast.error(title, options?)`. Stays until closed unless `timeout` is set. Returns its key. */
  error: byVariant('error'),
  /** Closes the toast with the given key, as returned by the other methods. */
  close: (key: string) => toastQueue.close(key),
  /** Removes every toast. Mainly useful in tests. */
  clear: () => toastQueue.clear(),
}
