/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.{ts,tsx}', 'src/test-setup.ts', 'src/test-global-setup.ts', 'src/test-icons.d.ts', 'src/stories/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // Externalize every bare specifier. All runtime imports are declared in
      // `dependencies`, so consumers resolve their own copies — critical for
      // react-aria-components, whose React context breaks across duplicates.
      // `@/` is our own source alias and must stay bundled.
      external: (id) =>
        !id.startsWith('.') && !id.startsWith('@/') && !path.isAbsolute(id),
      output: {
        // One file per source module, so a consumer's bundler drops whole files it
        // doesn't use. In a single file, top-level calls a bundler can't prove pure
        // (forwardRef, Object.assign, createContext) kept every component alive.
        // `npm run size` (scripts/check-tree-shaking.mjs) guards this.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // Every module is a client module for the Next.js App Router.
        banner: "'use client';",
      },
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          globalSetup: ['src/test-global-setup.ts'],
          setupFiles: ['src/test-setup.ts'],
          include: ['src/**/*.test.{ts,tsx}', '.storybook/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs', 'mcp/**/*.test.mjs', 'cli/**/*.test.mjs'],
          // jsdom tests share CPU with the Storybook browser project in a full run;
          // the 5s default timed out cold first tests (Radio, DateRangePicker).
          testTimeout: 15_000,
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          // A file's first story loads the story module in the browser. In a full run it
          // shares the CPU with the unit project and timed out at the 15s browser default
          // (RadioGroup, Link, NavItem), though every story passes when run alone.
          testTimeout: 30_000,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
