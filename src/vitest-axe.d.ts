import type { AxeMatchers } from 'vitest-axe/matchers'

// Vitest 4 declares its matcher interfaces on the `vitest` module, so the
// augmentation must target it (the old `@vitest/expect` target no longer applies).
declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
