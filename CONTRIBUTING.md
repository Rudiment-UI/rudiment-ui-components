# Contributing to Rudiment UI

Thank you for contributing! This guide covers how to add components, update tokens, and submit changes.

## Adding a New Component

### Required Files

Every component needs these files in its directory:

```
src/components/ComponentName/
├── ComponentName.tsx           # Component implementation
├── ComponentName.stories.tsx   # Storybook stories and documentation
└── ComponentName.test.tsx      # Unit and accessibility tests
```

### Naming Conventions

- **Component files**: PascalCase (`Button.tsx`, `RadioGroup.tsx`)
- **Directory names**: PascalCase matching the component (`Button/`, `RadioGroup/`)
- **Props interface**: `RudiComponentNameProps` (e.g., `RudiButtonProps`, `RudiRadioGroupProps`). Every export carries the `Rudi` prefix
- **Story title**: `Components/<Category>/ComponentName` for UI, `Typography/ComponentName` for text, `Layouts/ComponentName` for layout primitives. The categories are Elements, Forms, Data (charts under `Data/Charts`), Feedback, Navigation, Overlays, and App Layout. Also add the component to its category in `src/docs/ComponentsOverview.mdx`. `.storybook/docs/docLinks.test.ts` fails if a component has no category, is missing from the overview, or if any `?path=` link points at a page that doesn't exist.

### Component Requirements

1. **TypeScript**: All components must be fully typed with exported Props interfaces
2. **JSDoc**: Every exported component gets a summary and an `@example`. Every prop it declares gets a description, plus a `@default` that matches the destructured default exactly. This JSDoc ships in the `.d.ts` files and generates `dist/llms.txt` and `dist/components.json`. `scripts/component-docs.test.mjs` fails on gaps. See [Documenting the Public API](#documenting-the-public-api)
3. **Accessibility**: Use React Aria hooks for all interactive components
4. **Tokens**: Reference design tokens for all visual values — no hardcoded colors, spacing, or sizes
5. **Styling**: BEM classes (`rudi-button`, `rudi-button--primary`, `rudi-button__icon`) in the component's own stylesheet, imported from the component (`import './button.css'`). Merge `className` with `cn()`, never replace it. Don't use Tailwind utilities in components, because the published CSS ships without Tailwind
6. **Ref forwarding**: Forward refs using `React.forwardRef` where applicable

### Story Requirements

Every story file must include:

1. **Meta description**: A human-readable description in `parameters.docs.description.component`
2. **Prop descriptions come from JSDoc.** Storybook's docgen reads the component's Props interface, so don't repeat a prop's description in `argTypes`. Add `description` only for args docgen can't see: props inherited from React Aria (`isDisabled`, `onPress`, …) and story-only args
3. **Default args**: Set sensible defaults in the meta `args` object
4. **Event grouping**: Group argTypes using `table.category`:
   - `Events` for callbacks (onChange, onPress, onClose)
   - `Appearance` for visual props (variant, size, orientation)
   - `State` for state props (isDisabled, isRequired, isLoading)
   - `Content` for content props (label, children, placeholder)
5. **No JSON controls**: Complex props should use `control: false`
6. **Autodocs**: Include `tags: ['autodocs']` in the meta
7. **Sidebar badges**: Add `'new'` to `tags` for a component added in the latest minor release that added components, and remove it when the next such release ships. Add `'beta'` when the component's API may still change.

### Writing Component Docs

Each docs page is built from the story file by `.storybook/docs/AutodocsPage.tsx`, in this order: summary, the first story with its description, the API reference (its controls drive that first story), Customizing (the component's tokens), usage guidelines, a section for each remaining story under "Examples", then previous/next links. Make the first story the plain, args-driven one. The remaining stories are the page's sections, so write them for a reader with a task in mind, not as a prop-by-prop listing.

1. **Name stories after tasks**: "Variants", "Sizes", "With icons", "Loading state", "Controlled", "Responsive". Avoid names that only echo a prop value, such as "Small" or "Large".
2. **Describe every story**: set `parameters.docs.description.story` to 1–2 sentences saying when and why to use the example, not what the prop is called. `.storybook/docs/storyDocs.test.ts` fails on a story without one.
3. **Compare side by side**: show the related options in one story (all four button variants in a row) rather than one story each. The storybook test project still renders every story with an a11y check, so a combined story must be valid markup and give each control an accessible name.
4. **Put guidance next to its example**: when a do/don't from `src/docs/guidelines/<Name>.mdx` applies to one example, move it into that story's description. Leave only page-wide guidance in the guidelines file.
5. **Keep the shown code clean**: code is shown by default, so leave empty-string defaults (`className: ''`) out of `meta.args`, and when a story sets `source.code` by hand, use the `Rudi`-prefixed names.
6. **Make responsive examples previewable**: the docs page has no viewport tool, so a story whose behavior depends on screen width sets `parameters.devicePreview` (`{ height: 360 }`). On the docs page it then renders in a device-width frame with preset buttons, so its media queries respond (`.storybook/docs/withDevicePreview.tsx`). Story view renders it as usual.

### Documenting the Public API

JSDoc on exported components, Props interfaces and supporting types is the single source for editor hovers, the shipped `.d.ts` files, and the generated agent reference (`dist/llms.txt`, `dist/llms-full.txt`, `dist/components.json`, built by `scripts/component-docs.mjs`). `scripts/component-docs.test.mjs` fails on any gap.

1. **Component summary**: on the exported declaration. Write 1–3 sentences covering what it is, when to use it (and what to use instead when people often mix them up), and any non-obvious contract such as a required `label`, controlled vs uncontrolled, a required parent, or mount-once. Follow it with one `@example` of 1–8 lines of correct TSX.
2. **Compound parts**: a JSDoc comment above each property in the `Object.assign` literal (`/** Top section. */ Header: CardHeader,`).
3. **Props**: one sentence per prop the interface declares, saying what it controls. Include units, ranges, interactions ("Ignored when `href` is set") and the accessibility purpose where relevant. Don't restate the type. Inherited React Aria props are documented upstream.
4. **`@default`**: the exact source text of the destructured default (`size = 'md'` → `@default 'md'`). The test checks that they match.
5. **Supporting types**: a summary, plus a description for every field.
6. **Re-exports** (`export { Item as RudiOption } from 'react-stately'`): put the JSDoc on the export statement. The generator reads it from there.
7. **Style**: plain present-tense prose. No marketing words or filler.

Library-wide conventions (`onPress`, value-based `onChange`, theming, tokens) live in `scripts/llms-intro.md`. Update that file when a convention changes.

### Test Requirements

Every test file must include:

1. **Rendering test**: Verify the component renders without errors
2. **Accessibility test**: Use vitest-axe to check for WCAG violations
3. **Interaction tests**: Test keyboard and mouse interactions
4. **State tests**: Verify disabled, loading, error, and other states

Example test structure:

```tsx
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders without errors', () => {
    render(<ComponentName />)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ComponentName />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

## Updating Design Tokens

1. Edit token values in `tokens/tokens.json` (primitives) or `tokens/semantic.json` (semantic/component)
2. Run `npm run build:tokens` to regenerate CSS
3. Check affected components in Storybook: `npm run dev`
4. Update any affected tests

### Token Naming Rules

- Use intent-based names, not value-based (e.g., `color.brand.primary` not `color.blue`)
- Follow the pattern: `{category}.{group}.{name}`
- Semantic tokens must reference primitive tokens, never raw values

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the guidelines above
3. Run tests: `npm run test`
4. Build the library: `npm run build`
5. Build Storybook: `npm run build-storybook`
6. Update CHANGELOG.md with your changes under an `[Unreleased]` section
7. Submit your pull request with a clear description

### PR Checklist

- [ ] Component has TypeScript types and exported Props interface
- [ ] Component uses React Aria for accessibility (if interactive)
- [ ] All visual values reference design tokens
- [ ] Story includes meta description, prop descriptions, default args, and event grouping
- [ ] Tests pass including accessibility checks
- [ ] Library builds without errors
- [ ] Storybook builds without errors
- [ ] CHANGELOG.md updated

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **Patch** (0.1.x): Bug fixes, documentation updates
- **Minor** (0.x.0): New components, new features, non-breaking changes
- **Major** (x.0.0): Breaking API changes, removed components

Every release must have a corresponding entry in CHANGELOG.md following the [Keep a Changelog](https://keepachangelog.com/) format.
