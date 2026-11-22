import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'
import { brand, fonts, lockupHtml } from './brand/brand'

const light = create({
  base: 'light',
  brandTitle: lockupHtml('light'),
  brandUrl: './',
  brandTarget: '_self',
  fontBase: fonts.sans,
  fontCode: fonts.mono,
  colorPrimary: brand.ink,
  colorSecondary: brand.redDeep,
  appBg: brand.canvas,
  appContentBg: brand.surface,
  appPreviewBg: brand.surface,
  appHoverBg: brand.hover,
  appBorderColor: brand.line,
  appBorderRadius: 10,
  textColor: brand.ink,
  textMutedColor: brand.muted,
  textInverseColor: brand.canvas,
  barBg: brand.surface,
  barTextColor: brand.muted,
  barHoverColor: brand.ink,
  barSelectedColor: brand.redDeep,
  inputBg: brand.surface,
  inputBorder: brand.line,
  inputTextColor: brand.ink,
  inputBorderRadius: 8,
  buttonBg: brand.canvas,
  buttonBorder: brand.line,
  booleanBg: brand.hover,
  booleanSelectedBg: brand.surface,
})

const dark = create({
  base: 'dark',
  brandTitle: lockupHtml('dark'),
  brandUrl: './',
  brandTarget: '_self',
  fontBase: fonts.sans,
  fontCode: fonts.mono,
  colorPrimary: brand.canvas,
  colorSecondary: brand.redDeep,
  appBg: brand.night,
  appContentBg: brand.nightRaised,
  appPreviewBg: brand.nightRaised,
  appHoverBg: brand.nightHover,
  appBorderColor: brand.nightLine,
  appBorderRadius: 10,
  textColor: brand.canvas,
  textMutedColor: brand.nightMuted,
  textInverseColor: brand.ink,
  barBg: brand.nightRaised,
  barTextColor: brand.nightMuted,
  barHoverColor: brand.canvas,
  barSelectedColor: brand.redBright,
  inputBg: brand.night,
  inputBorder: brand.nightLine,
  inputTextColor: brand.canvas,
  inputBorderRadius: 8,
  buttonBg: brand.nightRaised,
  buttonBorder: brand.nightLine,
  booleanBg: brand.night,
  booleanSelectedBg: brand.nightLine,
})

// Storybook chrome follows the OS appearance. The component theme is chosen
// separately from the toolbar and is unaffected by this.
const query = window.matchMedia('(prefers-color-scheme: dark)')
const apply = () => addons.setConfig({ theme: query.matches ? dark : light })
apply()
query.addEventListener('change', apply)
