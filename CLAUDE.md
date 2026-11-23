# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Storybook on :6006 — the primary dev environment
npm run build:tokens     # Regenerate tokens/build/*.css from the token JSON (8 separate style-dictionary runs)
npm run build            # Vite library build → dist/ (run build:tokens first if tokens changed)
npm run build-storybook  # Static Storybook
npm run test             # Both vitest projects: unit + storybook
```

Single test / focused runs:

```bash
npx vitest run --project unit src/components/Button/Button.test.tsx
npx vitest run --project unit -t "sets aria-busy"
npx vitest run --project storybook          # Renders every story in headless Chromium with a11y checks
npx tsc --noEmit                            # Type check (no lint tooling is configured in this repo)
```

The `unit` project is jsdom + Testing Library + vitest-axe. The `storybook` project uses `@storybook/addon-vitest` with a real Playwright Chromium browser and needs browsers installed (`npx playwright install chromium`); it smoke-renders every `*.stories.tsx` and runs the a11y addon against it, which is why stories carry no `play` functions.

## Architecture

### Tokens are the styling layer

Three tiers of JSON compile to `--rudi-*` CSS custom properties via Style Dictionary:

1. `tokens/tokens.json` — primitives (raw hex, rem, ms values)
2. `tokens/semantic.json` — intent aliases referencing primitives (`color.brand.primary` → `{color.neutral.900}`)
3. `tokens/components.json` — per-component tokens referencing semantics (`component.button.primary-bg` → `{color.brand.primary}`)

`tokens/responsive.json` holds the breakpoints and the named spacing steps (`space.inline|content|group|section|gutter`, per-breakpoint values in `$extensions["rudi.responsive"]`). Its own config (`style-dictionary.config.responsive.mjs`) emits `tokens-responsive.css` on `:root, [data-theme]` plus one `@media` block per breakpoint, so the steps re-resolve against each density theme's spacing. Every other config sources the file for references but filters those categories out (`tokens/responsive-categories.mjs`). Layout spacing props take a `RudiSpace` (`src/utils/space.ts`): named step → `--rudi-space-*`, number → `--rudi-spacing-*`, other strings pass through.

Components read **only** tier 3/tier 2 custom properties. No hardcoded colors, spacing, or sizes in CSS or TSX.

`tokens/build/*.css` is **generated but committed** — after editing any token JSON, run `npm run build:tokens` and commit the regenerated CSS or the change won't ship.

### Themes are token-filtered overlays

Eight themes: default (`:root`, no attribute) plus `dark`, `roomy`, `roomy-dark`, `soft`, `soft-dark`, `compressed`, `compressed-dark`, each activated by `data-theme` on any ancestor element. Each theme has its own `tokens/style-dictionary.config.<theme>.mjs` whose `filter` decides which tokens get re-emitted under that selector; everything filtered out cascades from `:root`. Example: the `compressed` config emits only spacing/radius (colors and fonts inherit), while `dark` emits semantic + component colors but excludes theme-invariant primitives. `auto` is not a separate theme: the dark config also emits `tokens-auto-dark.css` under `[data-theme="auto"]`, which `src/styles.css` and `src/app.css` import inside `(prefers-color-scheme: dark)`. Adding a theme means adding a config, a `tokens/themes/<name>/` directory, an `@import` in both `src/styles.css` and `src/app.css`, a `build:tokens` entry in package.json, and a toolbar item in `.storybook/preview.tsx`.

Because `:root` and `[data-theme=...]` have equal specificity and theme blocks come later in the stylesheet, a consumer's `:root` override loses inside a themed subtree — overrides must be repeated per theme.

### CSS delivery: BEM, not Tailwind

Each component imports its own stylesheet (`import './button.css'`) so the CSS reaches the bundle through the component graph. `src/index.ts` imports `src/styles.css`, which imports only the token files — **deliberately not Tailwind**, so the published package ships no preflight reset and no bare-element selectors that could clobber a consumer's styles. `src/app.css` (Tailwind + tokens) is loaded by Storybook only.

Class names are BEM: `rudi-button`, `rudi-button--primary`, `rudi-button__icon`. `className` is merged, never replaced, via `cn()` (`clsx` + `tailwind-merge`) from `src/utils/cn.ts`.

### Library build

`vite.config.ts` externalizes every bare specifier (only relative and `@/` imports stay bundled), so consumers resolve their own React Aria copy — duplicates break React Aria's context. Output is a single ES file with a `'use client'` banner so the package drops into a Next.js App Router Server Component without a re-export barrel. `vite-plugin-dts` emits types from `src`, excluding tests, stories, and `src/stories/**`.

### Agent-facing API reference

`npm run build` then runs `scripts/component-docs.mjs`, which walks every export of `src/index.ts` with the TypeScript checker and writes `dist/llms.txt` (`scripts/llms-intro.md` + a component index), `dist/llms-full.txt` (plus every prop table) and `dist/components.json`. All three ship in the package and are exported under the same names (`rudiment-ui/llms.txt`, …). **JSDoc on the Props interfaces is the single source.** Defaults are read from the props destructuring, compound parts from `Object.assign`, and inherited React Aria props are listed by name. Storybook serves the same three files from its site root (a Vite plugin in `.storybook/main.ts`, generated from `src` per request in dev and once in `storybook build`). `mcp/server.mjs` (bin `rudiment-ui-mcp`) is a zero-dependency stdio MCP server that serves the same manifest with the shared renderer `mcp/render.mjs`. `mcp/server.test.mjs` drives it over stdio, and `mcp/README.md` covers client setup. `scripts/component-docs.test.mjs` (in the `unit` project) fails when an export, part, own prop, or exported type field has no description, or when a `@default` tag doesn't match the destructured default. Edit `scripts/llms-intro.md` when a library-wide convention changes.

## Component conventions

- **Every export is `Rudi`-prefixed**: `RudiButton`, `RudiButtonProps`, `RudiStack`. Keep README examples and prop tables on the prefixed names too.
- Interactive components wrap React Aria hooks (`useButton`, `useRadio`, …) and take `onPress`, not `onClick`. `onChange` handlers receive a **value**, not an event.
- `label` is a required prop (not children) on `Input`, `Select`, `RadioGroup`, `CheckboxGroup`, `ProgressBar`, and the charts.
- Icons are Iconify name strings (`icon="mdi:close"`), never imported components.
- `React.forwardRef` + `useObjectRef` where a DOM ref is meaningful.
- Layout primitives (`src/layouts/`) and typography (`src/typography/`) are polymorphic (`as` prop) and spread DOM props; they pass tunable values down as CSS custom properties on `style` (e.g. `--box-padding`). Regular components have closed prop interfaces and do not spread.
- Compound components use `Object.assign` (`RudiCard.Header`, `RudiCard.Footer`). Document each part with JSDoc on its property in the `Object.assign` literal.
- **JSDoc is required** on every exported component (summary + `@example`), every prop it declares (description + `@default` matching the destructuring), and every exported supporting type. Rules: CONTRIBUTING.md → "Documenting the Public API".

### Adding a component

`src/components/Name/` containing `Name.tsx`, `name.css`, `Name.stories.tsx`, `Name.test.tsx`; then export the component **and** its Props type from `src/index.ts`. Multi-part components (Menu, Select, Kanban, Charts) put each part in its own file with one shared stylesheet and one combined test/story file.

Stories: `title: 'Components/Name'` (or `Layouts/` / `Typography/`), `tags: ['autodocs']` (add `'new'` for a component added in the latest minor release that added any, and drop it when the next one ships; `'beta'` for an API that may still change; both render as sidebar badges from `.storybook/manager.ts`), a `parameters.docs.description.component` blurb, and `table.category` of `Appearance` / `Content` / `Layout` / `State` / `Events` (that order is enforced in `.storybook/preview.tsx`). Prop descriptions come from JSDoc via Storybook's `react-docgen`. Give an argType a `description` only when docgen can't see the prop, which means inherited React Aria props and story-only args. A preview decorator auto-syncs controlled args (`value`, `isSelected`, `selectedKey`) with `onChange`, so controlled props in `meta.args` stay interactive.

Each story is a section of the docs page (CONTRIBUTING.md → "Writing Component Docs"). Name it after the reader's task ("Variants", "With icons", "Loading state"), not a prop value, and give it 1–2 sentences of `parameters.docs.description.story` on when and why. `.storybook/docs/storyDocs.test.ts` enforces this, except for the pages still listed in its `UNMIGRATED` set. Show related options side by side in one story, and move a do/don't from `src/docs/guidelines/<Name>.mdx` into the description of the example it applies to.

Tests: render, `axe` accessibility assertion, keyboard/pointer interaction, and state coverage (disabled/loading/error).

## Docs

- `src/stories/patterns/` — the Storybook **Patterns** recipes. Each recipe is one consumer-style file importing from `../../index`, and its story shows the whole file as the source (`?raw`, with the import rewritten to `'rudiment-ui'` by `recipeStory.tsx`). Recipes use only the public API; when one has to reach outside it, log the gap in `DEPARTURES.md`. `src/stories/**` is excluded from the type declarations and the library build. `patterns.test.tsx` covers their behavior. A recipe with its own stylesheet (the responsive spacing recipes) passes it to `recipeParameters` so the docs page shows the CSS too; those stylesheets scope their rules to a class so they don't leak into other stories. Viewport presets live in `.storybook/viewports.ts`, named by spacing breakpoint.

- `src/docs/*.mdx` — the "Getting Started" Storybook pages (Token Architecture, Theming, Accessibility, Component Guidelines, Layout Primitives, Typography). Component-level do/don't guidance lives in `src/docs/guidelines/<Name>.mdx` (body only, no heading). Each file appears on its component's autodocs page (template: `.storybook/docs/AutodocsPage.tsx`) and is imported under a heading in `ComponentGuidelines.mdx`. When you add a component, add its file and import it there. Components that share a section are mapped in `.storybook/docs/guidelineKeys.ts`, and `guidelineKeys.test.ts` fails if a component story has no file.
- `src/docs/Vitrea.mdx` — the "Getting Started/Vitrea" page featuring Vitrea, the app that stress-tests the library (separate repo, live demo at https://vitrea-rudiment.netlify.app). Its screenshots live in `.storybook/public/vitrea/` (Storybook-only static files, not shipped).
- `DEPARTURES.md` — a gap analysis cataloguing every place real screens had to reach outside the components (inline styles, raw HTML, missing primitives), from the former Storybook example pages and from Vitrea. Read it before designing new component APIs; it is the current backlog signal.

Update `CHANGELOG.md` (Keep a Changelog format) for user-facing changes.
