# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `RudiNumberField`: `labelHidden` keeps the label as the accessible name but hides it visually, for fields inside table cells.
- `RudiSwitch`: `aria-label` and `aria-labelledby` props, and `children` is now optional when one of them names the switch. Use it for switches repeated per table row.
- **`RudiCheckbox` `errorMessage`:** a standalone checkbox (an agreement, say) can show and announce an error.
- **`RudiBox` `sticky`:** keeps a box in view while its container scrolls; pass a string for the top offset (`sticky="1rem"`).
- **`RudiDatePicker`, `RudiDateRangePicker`:** a segmented date field with a calendar popover. Values are plain ISO strings (`YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with `granularity="minute"`), with `minValue`/`maxValue` and `isDateUnavailable(date: string)`; ranges are `{ start, end }`. Consumers never import `@internationalized/date`.
- **`RudiNumberField`:** a locale-aware number input with − / + steppers and `formatOptions` (currency, percent). It clamps to `minValue`/`maxValue` on blur, and `onChange` gets a number or `null`.
- **`RudiTable`, `RudiTableHeader`, `RudiTableColumn`, `RudiTableBody`, `RudiTableRow`, `RudiTableCell`:** an accessible data table (React Aria) with controlled sorting, row links (`href`) and `onRowAction`, checkbox selection, `renderEmptyState`, horizontal scrolling, `stickyHeader` with `maxHeight`, `compact` density, optional striping, and per-column `align` / `width`.
- **`RudiComboBox`:** a searchable select that filters `RudiOption` items as you type (case-insensitive "contains" on `textValue`), with `menuTrigger`, `allowsCustomValue`, `emptyMessage`, controlled or uncontrolled `selectedKey` and `inputValue`, and the same field states as `RudiSelect`.
- **`RudiToastRegion` and `rudiToast`:** toasts in four variants, queued from anywhere with `rudiToast.success/info/warning/error/add` (each returns a key for `rudiToast.close(key)`). Screen readers announce them, errors stay until closed, and animation is skipped under reduced motion.
- **`RudiTabs`, `RudiTabList`, `RudiTab`, `RudiTabPanel`:** accessible tabs (React Aria) with controlled or uncontrolled selection, underline and pill variants, vertical orientation, icons, count badges, link tabs via `RudiRouterProvider`, and tab lists that scroll horizontally instead of wrapping.
- **`RudiEmptyState`:** a centered placeholder with icon, title, description and one action, sized for page sections (`md`) or table cells (`sm`).
- **`RudiForm`:** passes `onSubmit` the form's `FormData` without reloading, and when `errors` is non-empty shows an error summary ("2 problems to fix") at the top and moves focus to it.
- **`RudiLineChart` reference lines, y-domain and unit:** `referenceLines` (`{ y, label, tone? }`, dashed and labelled, in feedback colors), `yDomain` and `unit`. `useChartTheme` now also returns `tones`. `RudiChartReferenceLine` is exported.
- **`RudiDialog.Footer`:** an action row after the body (primary action last). Dismissable dialogs now show a close button, and tall content scrolls inside the body while the title and footer stay visible.
- **`RudiCover.Centered`:** marks the child that sits in the vertical middle of a `RudiCover`. Previously consumers had to add the internal `rudi-cover__centered` class by hand.
- **`RudiInput` form attributes:** `name`, `autoComplete`, `inputMode`, `maxLength`, `isReadOnly`, `autoFocus` and `onBlur` pass through to the input, so it works with native forms, password managers and one-time-code autofill.
- **`data-theme="auto"`:** follows the OS color scheme in pure CSS, using the dark tokens under `prefers-color-scheme: dark` and the defaults otherwise. `useChartTheme` now also re-resolves when the OS scheme changes. Built from the dark config as `tokens/build/tokens-auto-dark.css`.
- **`RudiBrand`:** a logo lockup (mark + name, `sm` / `md` / `lg`), optionally a home link. The mark is decorative and the name is always the accessible name, visible unless `hideName`. New `component.brand.*` tokens.
- **`RudiRouterProvider`:** connects Rudi links to your router (pass `navigate`, and optionally `useHref`) so `RudiLink`, `RudiNavItem` and `RudiBreadcrumb` navigate client-side instead of reloading the page. It re-exports React Aria's `RouterProvider`, so apps don't import `react-aria` directly.
- **App chrome is now exported:** `RudiAppShell` (with `.Sidebar`, `.Content`, `.Main`, `.MenuButton`), `RudiTopBar`, `RudiPageHeader` and `RudiSectionHeader`, plus their Props types. Before export, the shell's mobile drawer gained `aria-expanded` / `aria-controls` on the menu button, closes on Escape (returning focus to the menu button), and is hidden from keyboard and assistive tech while off-canvas. `RudiFooter` stays internal.
- **`RudiRadio`:** the option component for `RudiRadioGroup` is now exported (with `RudiRadioProps`). Previously the group was unusable from the package because nothing could be rendered inside it; the only radio item lived in a story.

### Fixed

- `RudiTable`: hovered rows are now distinguishable from striped rows. `component.table.row-hover-bg` uses `surface-sunken` in light themes and `neutral.700` in dark themes (both previously matched the stripe color).
- **Form controls meet WCAG 1.4.11 non-text contrast.** Input, textarea, select, checkbox and radio borders, and the switch's off track, used `#e5e5e5`/`#d4d4d4` on white (about 1.3:1 and 1.5:1). They now use a new semantic `color.border.control` (`neutral.500`, about 4.7:1); the date, number and combo fields follow through the input tokens. Decorative borders (cards, tables, top bar) keep `color.border.default`.
- **`RudiSidebar side="right"` no longer always wraps.** The sidebar (last child) kept the content's `contentMin` minimum from the base rule, so both columns needed it and they never sat side by side.
- **`RudiCheckboxGroup` now drives its checkboxes.** The group's `value`, `defaultValue` and `onChange` never reached the `RudiCheckbox` children (no shared state), so groups only worked as a label. Checkboxes inside a group now use the group's state (give each a `value`).
- **Group errors are announced.** `RudiRadioGroup` and `RudiCheckboxGroup` mark themselves invalid and link `errorMessage` to the group when it's set.
- **`RudiForm` moves focus to the summary only after a submit,** not whenever `errors` changes, so live validation no longer pulls focus away from the field being edited.
- **Layout primitives rendered as lists drop browser list styling.** `RudiStack`, `RudiCluster` and `RudiGrid` with `as="ul"` / `"ol"` keep list semantics without bullets or indent. `RudiEmptyState` also accepts `headingLevel={1}`, for not-found pages.
- **`RudiNavItem` announces the current page.** An active item now sets `aria-current` (`page` on links, `true` on buttons); before, "active" was visual only.
- **`RudiLink` and `RudiBreadcrumb` links now honor a router.** They rendered plain anchors, so every click was a full page load in a single-page app. They now use React Aria's `useLink`, like `RudiNavItem`.
- **README uses the real export names.** Usage examples, prop tables and inline references now use the `Rudi`-prefixed names (`RudiButton`, not `Button`), and the Select example uses `RudiOption` instead of `react-stately`'s `Item`. The old examples did not compile.
- **`RudiDialog` now has an accessible name when opened after mount.** React Aria resolves the title id once, on mount, and the dialog mounted its hooks while closed, so a dialog toggled open (the normal case) rendered `role="dialog"` with no `aria-labelledby`. The panel now mounts only while open.
- **`rudiment-ui/styles` type-checks on TypeScript 6+.** The export now has a `types` condition pointing to an empty declaration, so `import 'rudiment-ui/styles'` no longer fails with TS2882 under `noUncheckedSideEffectImports` (the default since TypeScript 6).

## [0.3.0] - 2026-08-04

### Changed

- **BREAKING — Themes replaced:** the `teal` / `teal-dark` and `cyberpunk` / `cyberpunk-dark` themes were removed and replaced by three modifier themes — `roomy` / `roomy-dark`, `soft` / `soft-dark`, and `compressed` / `compressed-dark` — bringing the total to eight (default and dark plus the three modifiers). Consumers setting `data-theme="teal"` or `data-theme="cyberpunk"` must switch to one of the new names.
- **BREAKING — Default typefaces changed:** the `font.family.sans` primitive moved from `Inter, system-ui, sans-serif` to `'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif`, and `font.family.mono` from `JetBrains Mono, monospace` to `'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace`. Roomy references Rubik and Soft references Nunito. No fonts are bundled — load the ones your active themes use, or text falls back to the system sans-serif.
- **BREAKING — `RudiSubmenuTrigger` is now a first-party wrapper** (`./components/Menu/SubmenuTrigger`) rather than an alias re-export of React Aria's `SubmenuTrigger`, and it now has its own `RudiSubmenuTriggerProps` type. Usage is unchanged; the identity of the exported component is not.
- Themes are pure token overlays again — every `[data-theme='teal']` / `[data-theme='cyberpunk']` override was deleted from the component stylesheets (Alert, Button, Card, Checkbox, IconButton, Input, Menu, NavItem, RadioGroup, Select, Switch), so per-theme appearance now comes only from re-emitted custom properties.
- `RudiProgressBar` clamps its computed percentage to 0–100 and guards a zero-width range, so out-of-bounds `value` or `minValue === maxValue` no longer produces an overflowing or `NaN` fill.
- `RudiBarChart` and `RudiLineChart` accept `Array<Record<string, string | number | null>>` for `data`, so a series can carry gaps (e.g. a burndown line that stops mid-sprint) and strongly typed row objects pass without a cast.

### Added

- **UI Components:** Breadcrumb, Divider, Dot, Image, Link, Pagination, Rating, Stepper, Textarea
- **Closed third-party API leaks:** `RudiOption` (Select) and `RudiMenuSeparator` (Menu) are now exported, so composing a Select or Menu no longer requires importing `Item` from `react-stately` or `Separator` from `react-aria-components`.
- **Menu item content props:** `RudiMenuItem` accepts `icon`, `label`, `description`, and `shortcut` and composes the layout for you, deriving `textValue` so typeahead keeps working with non-string content.
- **ProgressBar thresholds:** a `thresholds` prop drives the fill color from the current percentage (highest matching `at` wins); `RudiProgressBarVariant` and `RudiProgressBarThreshold` are exported.
- **Typography props:** `RudiText` and `RudiHeading` accept `weight`, `tone`, `align`, and `noMargin`, with `RudiTypographyWeight`, `RudiTypographyTone`, and `RudiTypographyAlign` exported.
- **Design Tokens:** component tokens for every new component (breadcrumb, divider, dot, image, link, pagination, rating, stepper, textarea) plus the internal shell components, and full token sets for the six new theme files.
- **Example Apps:** 26 Storybook example pages across four domains (biotech marketing site, CRM, ecommerce, project management), each rendering its full source in the docs, plus `src/stories/examples/DEPARTURES.md` — a gap analysis of every place those examples had to reach outside the library.
- **Internal shell components:** AppShell, TopBar, Footer, PageHeader, and SectionHeader back the example apps. They ship with tests and stories but are deliberately **not exported** from the package yet.
- **Testing:** story and unit coverage for Heading and Text.

### Removed

- The `teal`, `teal-dark`, `cyberpunk`, and `cyberpunk-dark` themes, along with their Style Dictionary configs and token sources.
- The ten standalone page-composition stories (App Shell, Article Page, Empty State, Footer, Header, Marketing Hero, Settings Page, Sidebar Layout, Sign-In Form, Simple Form), superseded by the four example apps.

## [0.2.0] - 2026-07-24

### Changed

- **BREAKING — Namespaced CSS classes:** the component class prefix changed from `rudiment-` to `rudi-` (e.g. `.rudiment-card__header` → `.rudi-card__header`). Any consumer styles or selectors targeting `.rudiment-*` classes must be updated.
- **BREAKING — Namespaced design tokens:** the CSS custom property prefix changed from `--token-` to `--rudi-` (e.g. `var(--token-color-brand-primary)` → `var(--rudi-color-brand-primary)`). Any consumer overrides or theming referencing `--token-*` variables must be updated. This affects all six built-in themes.
- **BREAKING — Namespaced component exports:** every exported component and its prop/data types are now prefixed with `Rudi` (e.g. `Button` → `RudiButton`, `ButtonProps` → `RudiButtonProps`, `Card` → `RudiCard`). The re-exported React Aria primitives are also aliased (`Separator` → `RudiSeparator`, `SubmenuTrigger` → `RudiSubmenuTrigger`). Update imports accordingly: `import { RudiButton } from 'rudiment-ui'`. Hooks (`useLoadingButton`, `useChartTheme`) and the `cn` utility are unchanged.
- Replaced hardcoded transition values across component CSS files with motion tokens

### Added

- **UI Components:** Badge, Tag, Avatar, Card (slot-based with Header/Body/Footer), Icon (Iconify integration), NavItem, ProgressBar, StatCard
- **Design Tokens:** Surface tokens (base, raised, sunken, overlay), data visualization color ramp (8-color categorical palette), motion tokens (duration and easing primitives)
- **Runtime Theming:** CSS custom property scoping via `data-theme` attribute with dual Style Dictionary build
- **Page Examples:** 10 full-page compositions (App Shell, Settings Page, Sign-In Form, Marketing Hero, Sidebar Layout, Article Page, Simple Form, Empty State, Header, Footer) updated to use new components (Avatar, Badge, NavItem, Icon)
- **Documentation:** Component guidelines for all new components, accessibility docs for ProgressBar, Icon, Tag, and NavItem

## [0.1.0] - 2026-03-31

### Added

- **UI Components:** Button, Input, Checkbox, CheckboxGroup, Select, Dialog, Switch, RadioGroup, Tooltip, Alert, IconButton
- **Typography:** Heading, Text, Prose
- **Layout Primitives:** Box, Stack, Cluster, Grid, Sidebar, Center, Cover, Switcher
- **Design Tokens:** Three-tier architecture (primitive, semantic, component) via Style Dictionary
- **Accessibility:** React Aria integration with full keyboard and screen reader support
- **Testing:** Vitest test suite with vitest-axe accessibility checks
- **Documentation:** Storybook with autodocs, interactive controls, and example pages
- **Theming:** Light and dark mode support via semantic token layer
