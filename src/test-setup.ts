import '@testing-library/jest-dom/vitest'
import 'vitest-axe/extend-expect'
import * as axeMatchers from 'vitest-axe/matchers'
import { expect, inject } from 'vitest'
import { addCollection } from '@iconify/react'

expect.extend(axeMatchers)

// Register every icon the source uses (collected once in test-global-setup.ts), so no test
// downloads icons from api.iconify.design. A download that finished after a test file's
// jsdom environment was torn down crashed CI with "window is not defined".
for (const collection of inject('rudiIcons')) addCollection(collection)
