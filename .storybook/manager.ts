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
  colorSecondary: brand.persimmonDeep,
  appBg: brand.paper,
  appContentBg: brand.paperRaised,
  appPreviewBg: brand.paperRaised,
  appHoverBg: '#EFECE4',
  appBorderColor: brand.stone,
  appBorderRadius: 10,
  textColor: brand.ink,
  textMutedColor: brand.muted,
  textInverseColor: brand.paper,
  barBg: brand.paperRaised,
  barTextColor: brand.muted,
  barHoverColor: brand.ink,
  barSelectedColor: brand.persimmonDeep,
  inputBg: brand.paperRaised,
  inputBorder: brand.stone,
  inputTextColor: brand.ink,
  inputBorderRadius: 8,
  buttonBg: brand.paper,
  buttonBorder: brand.stone,
  booleanBg: '#EFECE4',
  booleanSelectedBg: brand.paperRaised,
})

const dark = create({
  base: 'dark',
  brandTitle: lockupHtml('dark'),
  brandUrl: './',
  brandTarget: '_self',
  fontBase: fonts.sans,
  fontCode: fonts.mono,
  colorPrimary: brand.paper,
  colorSecondary: brand.persimmonDeep,
  appBg: brand.night,
  appContentBg: brand.nightRaised,
  appPreviewBg: brand.nightRaised,
  appHoverBg: '#1F1E1C',
  appBorderColor: brand.nightLine,
  appBorderRadius: 10,
  textColor: brand.paper,
  textMutedColor: brand.nightMuted,
  textInverseColor: brand.ink,
  barBg: brand.nightRaised,
  barTextColor: brand.nightMuted,
  barHoverColor: brand.paper,
  barSelectedColor: brand.persimmon,
  inputBg: brand.night,
  inputBorder: brand.nightLine,
  inputTextColor: brand.paper,
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
