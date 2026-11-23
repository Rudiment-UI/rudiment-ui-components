// The themes offered by the Storybook toolbar and the docs blocks. `light` is
// the default theme on `:root`; the package gives it no `data-theme` selector,
// so docs blocks get one from lightScope.ts.
import './lightScope'
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

/**
 * The `data-theme` attribute a docs block sets for a theme. `light` gets one
 * too (scoped by lightScope.ts) so it overrides a dark toolbar theme.
 */
export const themeAttr = (theme: ThemeName) => theme
