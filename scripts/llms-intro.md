# rudiment-ui {{version}}

> Accessible React 19 component library built on React Aria. Styled with BEM classes and `--rudi-*` CSS custom properties (design tokens). It does not use Tailwind classes. Eight themes are switched with `data-theme`.

This file is generated from the package's TypeScript source and JSDoc (`scripts/component-docs.mjs`), so it matches the installed version. `llms.txt` holds the conventions and an index. `llms-full.txt` adds every component's props, defaults taken from the implementation, compound parts and examples. `components.json` holds the same data as JSON and adds types and descriptions for the props inherited from React Aria. The `.d.ts` files carry the same JSDoc for editor hovers.

## Setup

```tsx
// Once, at the app entry (main.tsx, app/layout.tsx, …)
import 'rudiment-ui/styles'

import { RudiButton, RudiInput, RudiStack } from 'rudiment-ui'
```

- No provider is required. `RudiDialog` portals itself. Mount `RudiToastRegion` once if you use `rudiToast`. Wrap the app in `RudiRouterProvider` for client-side routing with links.
- Every export is marked `'use client'`, so you can import it directly from a Next.js App Router Server Component.
- The stylesheet has no CSS reset and no bare-element selectors, so it won't change your app's own styles.

## Conventions (read before writing code)

- **Every export is prefixed `Rudi`**: `RudiButton`, `RudiButtonProps`. The only exceptions are `rudiToast`, `cn`, `useChartTheme` and `useLoadingButton`.
- **`onPress`, not `onClick`.** Interactive components use React Aria press events, which cover mouse, touch and keyboard.
- **`onChange` receives a value, not an event**: `RudiInput` passes a `string`, `RudiCheckbox` a `boolean`, `RudiCheckboxGroup` a `string[]`, `RudiNumberField` a `number | null`, and `RudiDatePicker` an ISO `string | null`.
- **State props use React Aria names**: `isDisabled`, `isRequired`, `isReadOnly`, `isSelected`, `isOpen`, `selectedKey`, `onSelectionChange`. Don't use the HTML `disabled`/`checked` attributes.
- **`label` is a required string prop**, not children, on the form fields (`RudiInput`, `RudiTextarea`, `RudiSelect`, `RudiComboBox`, `RudiRadioGroup`, `RudiCheckboxGroup`, `RudiNumberField`, the date pickers), on progress indicators and on charts. It is the accessible name. Validation text goes in `errorMessage`, which also sets the invalid state.
- **Icons are Iconify name strings**: `icon="mdi:close"` or `iconBefore="lucide:plus"`. Never import icon components.
- **`className` is merged** with the component's own classes (`clsx` + `tailwind-merge`), never replaced. To change how something looks, override tokens instead of piling on classes.
- **Compound components use dot parts**: `RudiCard.Header`, `RudiDialog.Footer`, `RudiAppShell.Sidebar`, `RudiCover.Centered`.
- **Collections use React Aria's pattern**: `items` plus a render function that returns `RudiOption`, `RudiMenuItem` or `RudiTableRow`, or static children with `id`s.
- **Layout and typography primitives** (`RudiBox`, `RudiStack`, `RudiCluster`, `RudiGrid`, `RudiSidebar`, `RudiCenter`, `RudiCover`, `RudiSwitcher`, `RudiText`, `RudiProse`) take an `as` prop and spread any DOM attribute. `RudiHeading` spreads DOM attributes too, but its `level` prop picks the tag. Their spacing props take **CSS length strings** (`"1rem"`, `"var(--rudi-spacing-6)"`), not a numeric scale. The spacing prop is always named `space`; on `RudiBox` it is `padding`. Most other components have closed prop interfaces. The reference notes each one that spreads DOM props.
- **Prefer the primitives over hand-written layout CSS**: use `RudiStack` for vertical rhythm, `RudiCluster` for wrapping inline groups, `RudiGrid` for responsive cards, `RudiSidebar` for a fixed side plus fluid content, `RudiSwitcher` for a row that becomes a column, and `RudiCenter` for a max-width column.

## Themes

Set `data-theme` on `<html>` or on any wrapper to theme a subtree. The default theme lives on `:root`, so leave the attribute off for it. There is no `"light"` value.

`dark`, `roomy`, `roomy-dark`, `soft`, `soft-dark`, `compressed`, `compressed-dark`, `auto`. `auto` follows the OS `prefers-color-scheme`.

## Tokens

Every visual value is a `--rudi-*` custom property in three tiers: primitive (`--rudi-color-neutral-900`), then semantic (`--rudi-color-brand-primary`), then component (`--rudi-component-button-primary-bg`). Override the semantic tier in a stylesheet loaded after `rudiment-ui/styles`. Theme blocks have the same specificity as `:root` and come later in the cascade, so repeat each override under every `[data-theme="…"]` you use.

Common semantic tokens:
- `--rudi-color-brand-primary` (with `-hover` and `-active`)
- `--rudi-color-background-{surface,raised,sunken,overlay}`
- `--rudi-color-text-{default,subtle,disabled}`
- `--rudi-color-border-{default,focus,error}`
- `--rudi-color-feedback-{error,success,warning,info}`
- `--rudi-spacing-{0,1,2,3,4,6,8,12}`
- `--rudi-radius-{none,sm,md,lg,full}`
- `--rudi-font-size-{xs…4xl}`

## Reading the prop reference (llms-full.txt)

- Each component's table lists the props it declares itself. **Required** props are marked, and a default comes from the implementation.
- "Inherited from React Aria" lists the extra props the component forwards, such as `onPress`, `isDisabled` and `aria-label`. React Aria documents their meaning, and `components.json` has their types.
- "`ref` forwards to …" names the DOM element a `ref` reaches.
