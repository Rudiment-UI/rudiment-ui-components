// Top-level token categories owned by style-dictionary.config.responsive.mjs.
// Every other config sources tokens/responsive.json so component tokens can reference
// `{space.group}`, but must not emit these: a flat `--rudi-space-*` declaration under
// `:root` or `[data-theme="…"]` would override the breakpoint rules.
export const RESPONSIVE_CATEGORIES = new Set(['space', 'breakpoint'])

/** Wraps a config's filter so it never emits the responsive categories. */
export const withoutResponsive =
  (filter = () => true) =>
  (token) =>
    !RESPONSIVE_CATEGORIES.has(token.path[0]) && filter(token)
