// The default theme lives on `:root` and has no selector of its own, so a docs
// block can't switch a subtree back to it: under a dark toolbar theme, a
// "Default Light" token table would inherit dark values from <html>. This
// Storybook-only sheet re-declares the base tokens for `data-theme="light"`
// (and for `auto`, whose dark sheet still wins when the OS prefers dark, since
// `:where()` adds no specificity). Nothing here ships in the package.
import base from '../../tokens/build/tokens.css?raw'

const ID = 'sb-light-scope'

if (typeof document !== 'undefined' && !document.getElementById(ID)) {
  const style = document.createElement('style')
  style.id = ID
  style.textContent = base.replace(
    /:root\s*\{/,
    ":where([data-theme='light'], [data-theme='auto']) {",
  )
  document.head.append(style)
}
