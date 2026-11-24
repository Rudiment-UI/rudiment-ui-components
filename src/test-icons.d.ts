// The icon data test-global-setup.ts provides to every unit test file.
import type { IconifyJSON } from '@iconify/react'

declare module 'vitest' {
  export interface ProvidedContext {
    rudiIcons: IconifyJSON[]
  }
}
