// The themes offered by the Storybook toolbar and the docs blocks. `light` is
// the default theme on `:root`; it has no `data-theme` selector of its own.
export const THEMES = [
  { value: 'light', title: 'Default Light', icon: 'sun' },
  { value: 'dark', title: 'Default Dark', icon: 'moon' },
  { value: 'roomy', title: 'Roomy Light', icon: 'sun' },
  { value: 'roomy-dark', title: 'Roomy Dark', icon: 'moon' },
  { value: 'soft', title: 'Soft Light', icon: 'sun' },
  { value: 'soft-dark', title: 'Soft Dark', icon: 'moon' },
  { value: 'compressed', title: 'Compressed Light', icon: 'sun' },
  { value: 'compressed-dark', title: 'Compressed Dark', icon: 'moon' },
  { value: 'auto', title: 'Auto (follows OS)', icon: 'mirror' },
] as const

export type ThemeName = (typeof THEMES)[number]['value']

/** The `data-theme` attribute for a theme; the default theme sets none. */
export const themeAttr = (theme: ThemeName) =>
  theme === 'light' ? undefined : theme
