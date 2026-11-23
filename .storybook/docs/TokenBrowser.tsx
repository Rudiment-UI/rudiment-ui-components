import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Key } from 'react'
import {
  RudiCluster,
  RudiIcon,
  RudiIconButton,
  RudiInput,
  RudiOption,
  RudiSelect,
} from '../../src'
import { TOKENS, aliasOf, type TokenEntry, type TokenTier } from './tokenData'
import { THEMES, themeAttr, type ThemeName } from './themes'
import './docs-blocks.css'

export interface TokenBrowserProps {
  /** Which tiers to list. */
  tiers: TokenTier[]
  /** Only list tokens whose dotted path starts with one of these. */
  prefixes?: string[]
  /** Render each group as a closed disclosure (for the 800+ component tokens). */
  collapsed?: boolean
  /** Show the filter field. */
  searchable?: boolean
  /** Theme the browser opens with. */
  initialTheme?: ThemeName
}

/**
 * Lists `--rudi-*` tokens with their live value under a chosen theme, the
 * token each one aliases, a visual preview, and a copy button. Values are read
 * with getComputedStyle, so they always match the stylesheet that shipped.
 */
export function TokenBrowser({
  tiers,
  prefixes,
  collapsed = false,
  searchable = true,
  initialTheme = 'light',
}: TokenBrowserProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState<ThemeName>(initialTheme)
  const [query, setQuery] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const [announcement, setAnnouncement] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const scoped = useMemo(
    () =>
      TOKENS.filter(
        (t) =>
          tiers.includes(t.tier) &&
          (!prefixes ||
            prefixes.some((p) => t.path === p || t.path.startsWith(`${p}.`))),
      ),
    [tiers, prefixes],
  )

  // Read every scoped token's resolved value whenever the theme changes.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const style = getComputedStyle(el)
    const next: Record<string, string> = {}
    for (const t of scoped) next[t.name] = style.getPropertyValue(t.name).trim()
    setValues(next)
  }, [theme, scoped])

  const q = query.trim().toLowerCase()
  const groups = useMemo(() => {
    const map = new Map<string, TokenEntry[]>()
    for (const t of scoped) {
      if (
        q &&
        !t.name.includes(q) &&
        !t.path.toLowerCase().includes(q) &&
        !(values[t.name] ?? '').toLowerCase().includes(q)
      )
        continue
      const list = map.get(t.group) ?? []
      list.push(t)
      map.set(t.group, list)
    }
    return [...map.entries()]
  }, [scoped, q, values])

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(`var(${name})`)
      setCopied(name)
      setAnnouncement(`Copied var(${name})`)
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500)
    } catch {
      setAnnouncement(
        'Copy failed. Select the token name and copy it manually.',
      )
    }
  }

  // `auto` only applies its dark sheet when the OS prefers dark.
  const aliasTheme =
    theme === 'auto' &&
    !window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'light'
      : theme

  const count = groups.reduce((n, [, list]) => n + list.length, 0)

  return (
    // `sb-unstyled` opts out of Storybook's docs typography, which otherwise
    // forces dark ink and light row stripes onto the table when the block sits
    // directly on a docs page (the component "Customizing" section).
    <div
      ref={rootRef}
      className="sb-tokens sb-unstyled"
      data-theme={themeAttr(theme)}
    >
      <RudiCluster
        space="var(--rudi-spacing-4)"
        align="flex-end"
        className="sb-tokens__controls"
      >
        {searchable && (
          <RudiInput
            label="Filter tokens"
            type="search"
            placeholder="Name or value, e.g. brand or #171717"
            value={query}
            onChange={setQuery}
            className="sb-tokens__search"
          />
        )}
        <RudiSelect
          label="Preview theme"
          items={THEMES}
          selectedKey={theme}
          onSelectionChange={(key: Key | null) =>
            key && setTheme(key as ThemeName)
          }
          className="sb-tokens__theme"
        >
          {(t) => <RudiOption key={t.value}>{t.title}</RudiOption>}
        </RudiSelect>
        <span className="sb-tokens__count" aria-live="polite">
          {count} {count === 1 ? 'token' : 'tokens'}
        </span>
      </RudiCluster>

      {groups.map(([group, list]) => {
        const table = (
          <TokenTable
            tokens={list}
            values={values}
            aliasTheme={aliasTheme}
            copied={copied}
            onCopy={copy}
          />
        )
        if (!collapsed) {
          return (
            <section
              key={group}
              className="sb-tokens__group"
              aria-label={group}
            >
              <p className="sb-tokens__group-title">{group}</p>
              {table}
            </section>
          )
        }
        const open = q !== '' || openGroups.has(group)
        return (
          <details
            key={group}
            className="sb-tokens__group"
            open={open}
            onToggle={(e) => {
              const isOpen = e.currentTarget.open
              if (q) return
              setOpenGroups((prev) => {
                const next = new Set(prev)
                if (isOpen) next.add(group)
                else next.delete(group)
                return next
              })
            }}
          >
            <summary className="sb-tokens__group-title">
              {group}{' '}
              <span className="sb-tokens__group-count">({list.length})</span>
            </summary>
            {open && table}
          </details>
        )
      })}

      {count === 0 && (
        <p className="sb-tokens__empty">No tokens match “{query}”.</p>
      )}
      <span role="status" className="sb-tokens__sr-only">
        {announcement}
      </span>
    </div>
  )
}

function TokenTable({
  tokens,
  values,
  aliasTheme,
  copied,
  onCopy,
}: {
  tokens: TokenEntry[]
  values: Record<string, string>
  aliasTheme: string
  copied: string | null
  onCopy: (name: string) => void
}) {
  return (
    <table className="sb-tokens__table">
      <thead>
        <tr>
          <th scope="col" className="sb-tokens__preview-col">
            <span className="sb-tokens__sr-only">Preview</span>
          </th>
          <th scope="col">Token</th>
          <th scope="col">Value</th>
          <th scope="col">Aliases</th>
          <th scope="col">
            <span className="sb-tokens__sr-only">Copy</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => {
          const ref = aliasOf(t.name, aliasTheme)
          return (
            <tr key={t.name}>
              <td>
                <Preview name={t.name} value={values[t.name] ?? ''} />
              </td>
              <td>
                <code>{t.name}</code>
              </td>
              <td>
                <code className="sb-tokens__value">{values[t.name]}</code>
              </td>
              <td>
                {ref ? <code className="sb-tokens__ref">{ref}</code> : null}
              </td>
              <td>
                <RudiIconButton
                  aria-label={`Copy var(${t.name})`}
                  variant="ghost"
                  size="sm"
                  onPress={() => onCopy(t.name)}
                >
                  <RudiIcon
                    icon={copied === t.name ? 'lucide:check' : 'lucide:copy'}
                  />
                </RudiIconButton>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const LENGTH = /^-?[\d.]+(rem|px|em|ch|vw|vh|%)$/
const NON_COLORS = new Set([
  'inherit',
  'initial',
  'unset',
  'currentcolor',
  'none',
])

/** A visual sample chosen from the token's name and resolved value. */
function Preview({ name, value }: { name: string; value: string }) {
  const v = value.toLowerCase()
  const ref = `var(${name})`
  if (!v) return null
  if (name.includes('shadow')) {
    return (
      <span aria-hidden className="sb-tokens__box" style={{ boxShadow: ref }} />
    )
  }
  if (!NON_COLORS.has(v) && !/^[\d.]+$/.test(v) && CSS.supports('color', v)) {
    return (
      <span
        aria-hidden
        className="sb-tokens__swatch"
        style={{ background: ref }}
      />
    )
  }
  if (name.includes('radius') && LENGTH.test(v)) {
    return (
      <span
        aria-hidden
        className="sb-tokens__box"
        style={{ borderRadius: ref }}
      />
    )
  }
  if (name.includes('font-family') || name.endsWith('-family')) {
    return (
      <span aria-hidden className="sb-tokens__type" style={{ fontFamily: ref }}>
        Aa
      </span>
    )
  }
  if (name.includes('weight')) {
    return (
      <span aria-hidden className="sb-tokens__type" style={{ fontWeight: ref }}>
        Aa
      </span>
    )
  }
  if (/font-size|^--rudi-typography-.*-size$/.test(name) && LENGTH.test(v)) {
    return (
      <span aria-hidden className="sb-tokens__type" style={{ fontSize: ref }}>
        Aa
      </span>
    )
  }
  if (LENGTH.test(v)) {
    return (
      <span
        aria-hidden
        className="sb-tokens__bar"
        style={{ inlineSize: ref }}
      />
    )
  }
  return null
}
