import { AnchorMdx, Source } from '@storybook/addon-docs/blocks'
import { TokenBrowser } from './TokenBrowser'
import { overrideSnippet, tokensFor } from './componentTokenGroups'

/**
 * The "Customizing" section of a component's docs page: its component tokens
 * with live values per theme, and a snippet showing how to override them from
 * an app stylesheet.
 */
export function ComponentTokens({
  name,
  prefixes,
}: {
  /** Component name for the prose, e.g. "Button". */
  name: string
  /** Token paths, e.g. `['component.button']`. */
  prefixes: string[]
}) {
  const count = tokensFor(prefixes).length
  return (
    <>
      <p>
        {name} reads its colors, spacing and sizes from {count} component
        tokens. Override one in your own stylesheet to restyle every {name}{' '}
        without touching other components. Pick a theme to see what each token
        resolves to there.
      </p>
      <TokenBrowser
        tiers={['component']}
        prefixes={prefixes}
        searchable={count > 12}
      />
      <p>
        Put overrides in a stylesheet that loads after{' '}
        <code>rudiment-ui/styles</code>. Target <code>[data-theme]</code> as
        well as <code>:root</code>: a theme block has the same specificity as{' '}
        <code>:root</code> and loads later, so a bare <code>:root</code> rule
        loses inside any themed subtree. See{' '}
        <AnchorMdx href="?path=/docs/getting-started-theming--docs">Theming</AnchorMdx> for
        brand-wide changes.
      </p>
      <Source code={overrideSnippet(prefixes)} language="css" dark={false} />
    </>
  )
}
