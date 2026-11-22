# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2026-11-22

### Added

- **`RudiDrawer`:** a modal panel that slides in from the `start` or `end` edge of the viewport (logical, so it flips in right-to-left layouts), full height, in `sm`, `md` and `lg` widths. It has the same contract as `RudiDialog`: controlled `isOpen`/`onClose`, a required `title` as the accessible name, `isDismissable`, `closeLabel`, and a `RudiDrawer.Footer` pinned below the scrolling body. It traps focus, restores focus on close and locks page scroll. It slides out before it unmounts, and doesn't animate under `prefers-reduced-motion`. Styled by the new `--rudi-component-drawer-*` tokens. Tagged `new` in Storybook, which moves the badge off `RudiDescriptionList` and `RudiSparkline`.
- **Live token browser in Storybook:** the Token Architecture page lists all 1,036 `--rudi-*` tokens by tier, with a preview, the live value, the token each one aliases, and a copy-as-`var()` button. A theme picker shows each theme's values and aliases, and a filter searches by name or value. It replaces the hand-written dataviz and surface value tables, which could drift from the build. A unit test fails if the browser's token names stop matching `tokens/build/tokens.css`.
- **Theme comparison in Storybook:** the Theming page shows the same form in all 8 built-in themes side by side.
- **Layout examples in Storybook:** the Layout Primitives page embeds each primitive's default story.
- **Usage guidelines on component docs pages:** each component's docs page now shows its do/don't guidance under **Usage guidelines**, after the primary example. The guidance moved from one long section in `ComponentGuidelines.mdx` to one file per component in `src/docs/guidelines/`. The Component Guidelines page imports the same files, so the guidance is written once. A unit test fails if a component story has no guidelines file, or if a file isn't used by any story or by the overview page.
- **Agent docs on the Storybook site:** `llms.txt`, `llms-full.txt` and `components.json` are served from the Storybook site root, so an agent can read the API reference from the docs URL without installing the package. They're generated from the source at build time and match the files in the package. The Introduction page links them.
- **Changelog page in Storybook:** **Getting Started → Changelog** renders `CHANGELOG.md`.
- **Patterns section in Storybook:** five recipes that sit between single-component stories and the Vitrea app: **Validated Form** (`RudiForm` error summary with field messages), **Filterable Table** (search and status filters over `RudiTable` with `RudiPagination`, a live result count and an empty state), **Data States** (one panel in its loading, empty, error and loaded states), **Confirm Dialog** (a destructive confirmation with a pending state and focus handling after the row is gone) and **Settings Page** (`RudiTabs` with an explicit-save form and immediate switches). Each docs page shows the whole recipe file, importing from `'rudiment-ui'`, so it can be copied into an app. Unit tests cover each recipe's behavior, and the gaps they turned up are logged in `DEPARTURES.md` Part 7. No component, token or published file changes.
- **`new` and `beta` sidebar badges:** components whose stories are tagged `new` or `beta` show a badge in the Storybook sidebar. `RudiDescriptionList` and `RudiSparkline` (added in 0.6.0) are tagged `new`.
- **`RudiAppShell` and `RudiTopBar` stories are back, with docs pages.** They were removed because they had no docs page. AppShell's docs preview renders in an iframe so the 900px drawer breakpoint follows the preview width, and a `MobileDrawer` story opens the drawer on a phone viewport. Full-bleed stories (`layout: 'fullscreen'`) no longer get the preview's 2rem padding.

### Changed

- **Vitrea replaces the Storybook examples:** the 26 `Examples/*` pages (CRM, Project Management, eCommerce and Biotech) are removed. A new **Getting Started → Vitrea** page features [Vitrea](https://vitrea-rudiment.netlify.app), a demo cold-chain shipping app built entirely with Rudiment UI, with soft-theme screenshots, a live demo link, code excerpts from the app, the components each screen relies on and how its brand is built from token overrides. The gap analysis moved from `src/stories/examples/DEPARTURES.md` to `DEPARTURES.md` at the repository root. No component, token or published file changes.
- **Storybook brand identity:** Storybook now has a Rudiment UI mark (a lowercase "r" built from a bar, an arc and a point), a favicon, light and dark chrome themes that follow the OS, Geist typography for docs prose, and a hero on the Introduction page. This is presentation only: no component, token or published file changes. See `.storybook/brand/BRAND.md`.

### Fixed

- **`RudiSelect` dropdown is anchored to the trigger's left edge:** the listbox opened centered under the trigger and only 8rem wide. It now opens from the trigger's start edge, 4px below it, and is at least as wide as the trigger, the same as `RudiComboBox`.
- **`RudiAlert` title is bold:** `--rudi-component-alert-title-font-weight` now aliases `--rudi-font-weight-bold` (700) instead of `medium` (500). `RudiToast` titles alias the alert token, so they are bold too.

## [0.7.0] - 2026-11-22

### Added

- **`RudiAvatar` `icon` and `tint`:** `icon` shows an Iconify icon instead of the initials when there is no loaded image, for entity tiles such as a page-title icon. The accessible name still comes from `alt`, then `name`. `tint` takes any CSS color (including `var(...)`) or `'auto'`: the background becomes a translucent wash of the tint (`--rudi-component-avatar-tint-bg-amount`, 16%) and the initials or icon take the tint mixed 55% toward the text color (`--rudi-component-avatar-tint-text-amount`, `--rudi-component-avatar-tint-text-base`), so initials clear 4.5:1 for light and saturated tints alike. `'auto'` picks one of the 8 dataviz series colors (`--rudi-component-avatar-auto-tint-1` to `-8`) from a stable hash of `name`. Without `tint` the avatar looks as before.
- **`RudiEmptyState` `illustration`:** an image URL rendered as a decorative `<img alt="">` above the title, in place of `icon`. Its width comes from `--rudi-component-empty-state-illustration-width-sm` (6rem) and `-md` (10rem).

## [0.6.2] - 2026-11-21

### Added

- **Display font token:** `--rudi-font-family-display` (default: the body sans) sets the family for every `RudiHeading`, including page and section header titles, through `--rudi-typography-heading-font-family`, and for `RudiStatCard` values through `--rudi-component-stat-card-value-font-family`. Point it at a display face to give headings and figures their own voice without touching body text.

## [0.6.1] - 2026-11-21

### Changed

- **`RudiText` props:** `RudiTextProps` now extends `AllHTMLAttributes`, so element-specific attributes type-check with `as`, such as `href` with `as="a"` and `htmlFor` with `as="label"`.

### Fixed

- **`RudiStepper` node icons:** the check on a complete step, and any custom `icon`, now take the node's color. Before, they used the icon token (`text-default`), so the check was dark on the filled brand circle and nearly invisible.
- **`RudiDialog` `isDismissable={false}`:** Escape no longer closes the dialog, as documented. Before, only the close button and outside click were disabled.
- JSDoc corrections on `RudiDatePicker`, `RudiDateRangePicker`, `RudiTable` header and row, `RudiSelect`, `RudiToastRegion`, `RudiAppShell`, `RudiKanbanCard`, `RudiCircularProgress`, `RudiCover`, `RudiLink` and `RudiNumberField`, where the docs described behavior the code doesn't have.

## [0.6.0] - 2026-11-21

### Added

- **`RudiDescriptionList`:** a semantic `<dl>` from an `items` array of `{ term, description, id? }`. `layout="stacked"` (term above description, with `columns` up to N auto-fitting responsively) or `layout="inline"` (two-column rows with a 12rem term column that collapse to stacked through a container query, not a viewport media query). `dividers` draws a hairline between rows.
- **`RudiSparkline`:** a small inline-SVG trend line. `label` is required and becomes the `role="img"` name. Optional `width`, `height`, `threshold` (dashed reference line, included in the y domain), `tone` (`neutral`, `brand`, `error`, `success`) and `showEndpoint`. Empty data and a single point render without error.
- **`RudiPageHeader` `eyebrow` and `meta`:** `eyebrow` renders in a `div` above the title (a breadcrumb or overline) and `meta` in a `div` below the subtitle (badges or key facts). Tokens `page-header-eyebrow-gap` and `page-header-meta-gap`.
- **`RudiAlert` `action`:** content at the inline-end of the alert, which wraps below the text in a narrow alert. Token `alert-action-gap`.
- Stack story "Nested".
- **Agent-readable API reference.** The package now ships `dist/llms.txt` (conventions and an index), `dist/llms-full.txt` (the full prop reference) and `dist/components.json`. They are generated from the TypeScript source on every build and exported under the same names. They list every component, compound part, prop, default, inherited React Aria prop and `ref` target, along with the library's conventions (`onPress`, value-based `onChange`, required `label`, Iconify icon names, theming). Point a coding agent at `node_modules/rudiment-ui/dist/llms.txt`.
- JSDoc on every exported component, prop and supporting type, so the `.d.ts` files and editor hovers carry descriptions, defaults and usage examples. A unit test fails on undocumented exports or `@default` tags that don't match the implementation.
- **MCP server, `rudiment-ui-mcp`.** A zero-dependency MCP server ships in the package and serves the installed version's API to coding agents. Its tools are `get_conventions`, `list_components`, `get_component` and `search`. Register it with `claude mcp add rudiment-ui -- npx --no rudiment-ui-mcp`; `mcp/README.md` has setup for Cursor, VS Code, Codex and Claude Desktop.
- **`RudiSelect` `name`:** the selected key now submits with a native form. `isRequired` shows the same asterisk as `RudiInput`, styled by the new token `select-required-color`, which aliases `input-required-color`.
- **`RudiTextarea` `name`, `onBlur`, `isReadOnly`, `maxLength`, `autoFocus`:** these bring it to parity with `RudiInput`.
- **`RudiCheckbox` `name`:** the prop is now declared. A standalone checked checkbox submits `name=value`.
- **`closeLabel` on `RudiDialog` and `RudiToastRegion`:** sets the close buttons' accessible name, for localisation. Defaults to `'Close'`.
- **`RudiStatCard` trend:** the trend is shown by an icon as well as colour, plus screen-reader text such as "Increased +12.5%". `trendLabel` overrides that text.
- **`RudiAvatar` `statusLabel`:** adds the status to the avatar's accessible name ("Ada Lovelace, Busy").
- **`RudiImage` `fallback` and `onError`:** a failed image shows a placeholder in the same frame, with `role="img"` and the `alt` text. The placeholder can be replaced, and it resets when `src` changes. Tokens: `image-fallback-color` and `image-fallback-min-size`.

### Changed

- **Getting Started docs:**
  - Introduction: package-first setup, the full export list, correct theme values (there is no `light`; `auto` is new), and an "AI coding agents" section.
  - Accessibility: keyboard support for Rating and KanbanBoard, color-independent status, and localizable labels.
  - Component Guidelines: the new props, plus DescriptionList and Sparkline.
  - Layout Primitives: Switcher `limit`.
- Storybook prop descriptions now come from the components' JSDoc. Duplicated `argTypes` descriptions were removed from 43 story files; inherited React Aria props keep theirs.

### Fixed

- **`RudiKanbanBoard` drag and drop:**
  - The dragged card stays under the pointer. The overlay is now rendered in `document.body`, so a transformed ancestor such as a Storybook docs block or an animated panel no longer offsets it.
  - During a drag, the card moves into the column it is over. Its original slot shows as a dashed placeholder at the exact drop position, and the target column is outlined.
  - `toIndex` is the card's final index once it has been removed from its source. A downward move within one column previously landed one slot short.
  - Token `kanban-placeholder-bg` added. `kanban-card-dragging-opacity` removed, since the placeholder replaced the faded card.
- **`RudiBadge` with `dot`:** the children are still announced, inside visually hidden text. A dot with no children is `aria-hidden`.
- **`RudiAvatar` with neither `alt` nor `name`:** it is now decorative (`aria-hidden`) instead of an unnamed `role="img"`.
- **`RudiTag`:** with `onPress` and `dismissible` together, the dismiss control is no longer nested inside the tag's button.
  - The root is now always a `span.rudi-tag`. The pressable is a sibling `button.rudi-tag__main`.
  - `isDisabled` now disables the dismiss button.
  - Both controls use React Aria `onPress`.
  - CSS that targeted `button.rudi-tag` should target `.rudi-tag__main` instead.
- **`RudiRating` (interactive):** it is a real radio group.
  - It has one tab stop.
  - Arrow keys move and select, and Home/End jump to the ends.
  - Each star is a native radio input.
- **`RudiCircularProgress`:** values outside `minValue`–`maxValue` are clamped. `minValue === maxValue` no longer produces `NaN` in the ring or in `aria-valuetext`.
- **`RudiSwitcher` `limit`:** this prop is now implemented. More children than `limit` stacks every child at full width, and `limit` is no longer written to the DOM as an attribute.
- **`RudiKanbanBoard`:** the drag overlay renders a presentational copy of the card. It no longer mounts a second `useSortable` with the same id or nests a card inside a card, and the copy is hidden from assistive technology.
- **`RudiPagination`:** the buttons use React Aria `onPress`. An out-of-range `page` is clamped, and `onPageChange` is never called with an out-of-range value.
- **`RudiAlert`:** the dismiss button uses React Aria `onPress`.
- `RudiStack` spaces its children with `gap` instead of `> * + *` margins. A nested `RudiStack` with its own `space` used its own value for its distance from the previous sibling; it now uses the parent's. `recursive` still uses margins.

## [0.5.0] - 2026-11-21

### Added

- **`--rudi-component-input-height`:** one height for single-line fields and medium buttons: 38px by default, 44px in roomy, 32px in compressed. `RudiInput`, `RudiSelect`, `RudiComboBox`, `RudiNumberField`, `RudiDatePicker` and `RudiButton size="md"` read it through their own tokens (`select-trigger-height`, `combo-box-height`, `number-field-field-height`, `date-picker-field-height`, `button-height-md`), so overriding it once resizes them all.

### Changed

- Fields and medium buttons now share a height in every theme. Fields were 35px, medium buttons 39px (26px compressed, 47px roomy). `--rudi-component-button-padding-y-md` drops from `spacing.2` to `spacing.1`, since the height now comes from `min-block-size`. Compressed fields use `0.25rem` vertical padding.
- The affected controls set `box-sizing: border-box`.

### Fixed

- A field in a grid row no longer stretches when a neighbouring field has a description or error. `RudiInput`, `RudiSelect`, `RudiComboBox`, `RudiNumberField`, `RudiDatePicker` and `RudiTextarea` set `align-content: start`.

## [0.4.0] - 2026-11-21

Built out while rebuilding the IVFCryo shipping app on Rudiment UI. See Part 6 of `src/stories/examples/DEPARTURES.md`.

### Added

- `RudiKanbanCard` `label` names the drag handle ("Move REF-1042"; was "Drag handle for card <id>"). `RudiKanbanBoard` `getCardLabel` names cards in announcements.
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

- Contrast (WCAG 1.4.3), from an axe pass over the IVFCryo app:
  - Destructive `RudiButton` / `RudiIconButton`: white on `red.500` was 3.76:1. They now use `red.600` with text fixed to white in every theme (4.83:1). Dark themes used `text.on-brand`, which is near-black.
  - Empty `RudiDatePicker` segments ("mm/dd/yyyy"): `text.disabled` was 2.52:1. They now use `text.subtle`.
- `RudiDot` contains its visually hidden label. The label was positioned against the page, so a dot inside a horizontally scrolling container (a `RudiKanbanBoard` on a phone) widened the whole page.
- `RudiForm` no longer grows wider than its container. Its grid column was `auto`, so a wide child (e.g. a `RudiTabs` list with five tabs) pushed a 375px page out to about 600px instead of scrolling within the form.
- `RudiKanbanBoard` columns are visible in dark themes. `column-bg` resolved to the page color there; dark themes now use `surface-raised`.
- `RudiStatCard` trends in dark themes are green and red again. They used `feedback.*-text`, which in dark is a near-white tint meant for alert surfaces. Dark themes now use the new `color.green.400` / `color.red.400` primitives, about 5.5:1 or better on the card.
- `RudiBadge` keeps its own width inside `RudiStack` and other stretching parents. It no longer becomes a full-width bar.
- `RudiKanbanBoard` columns share the board width equally, with `column-min-width` as the floor. Before, each column grew to its longest unwrapped line, so three columns with real card text overflowed a 1200px page.
- `RudiBarChart` `layout="horizontal"`: the category axis is sized to the longest label (up to 220px) instead of clipping at Recharts' 60px default. Grid lines now run across the value axis only in both layouts; before, they were inverted for horizontal bars.
- Chart legends (`RudiBarChart`, `RudiDonutChart`, `RudiLineChart`): label text now uses `component.chart.legend-color`. Only the swatch carries the series color; before, Recharts painted the text in series hues such as amber, which fall well under 4.5:1 contrast.
- `RudiKanbanBoard` announced every drag twice: once from its own live region and again from dnd-kit's default messages, which used raw ids. Announcements now go only through dnd-kit's `accessibility.announcements`, naming the card and its position ("REF-1042 is over Active, position 2 of 3"), and cancelling is announced.
- `RudiButton` and `RudiIconButton` with `isDisabled` now look disabled. The dimmed style and the hover guard only matched `aria-disabled` (set while loading), but `isDisabled` renders the native `disabled` attribute.
- Field hint and error text no longer carry the browser's paragraph margin. `RudiInput`, `RudiTextarea`, `RudiSelect`, `RudiComboBox`, `RudiRadioGroup`, `RudiCheckbox` and `RudiCheckboxGroup` sat their hints 12px further from the field than `RudiNumberField` did.
- `RudiTableCell`: a text field inside a cell keeps its arrow keys, Home/End and typing. Focusing it puts the grid in React Aria's edit mode, so the caret moves instead of focus jumping to another cell or a type-ahead row match. Tab still leaves the field.
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
