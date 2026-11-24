import { useContext, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { DocsContext } from '@storybook/addon-docs/blocks'
import { NAVIGATE_URL } from 'storybook/internal/core-events'
import pkg from '../../package.json'
import './brand-hero.css'

/**
 * Storybook-only hero for the Introduction page. Lives under .storybook so it
 * never reaches the library build or its type declarations.
 */
/** Entrance order for the staggered rise animation. */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties

export function BrandHero() {
  return (
    <section className="sbb-hero sb-unstyled" aria-labelledby="sbb-title">
      <div className="sbb-copy">
        <p className="sbb-eyebrow" style={stagger(0)}>
          <span className="sbb-eyebrow-dot" aria-hidden="true" />
          Rudiment UI · v{pkg.version}
        </p>
        <h1 id="sbb-title" className="sbb-title" style={stagger(1)}>
          Build from
          <br />
          the rudiments<span className="sbb-title-point">.</span>
        </h1>
        <p className="sbb-lede" style={stagger(2)}>
          Accessible React components on React Aria, themed entirely by design
          tokens, with an API reference your coding agents can read.
        </p>
        <div className="sbb-actions" style={stagger(3)}>
          <HeroLink href="#use-it-as-a-package" primary>
            Get started
          </HeroLink>
          <HeroLink href="?path=/docs/components-elements-button--docs">Browse components</HeroLink>
        </div>
        <dl className="sbb-facts" style={stagger(4)}>
          <div>
            <dt>Themes</dt>
            <dd>8</dd>
          </div>
          <div>
            <dt>Global resets</dt>
            <dd>0</dd>
          </div>
          <div>
            <dt>Stories a11y-audited</dt>
            <dd>All</dd>
          </div>
        </dl>
      </div>

      <figure className="sbb-plate" style={stagger(2)}>
        <div className="sbb-plate-core">
          <ConstructionMark />
        </div>
        <figcaption className="sbb-caption">
          A bar, an arc and a point: the three rudiments of the mark.
        </figcaption>
      </figure>
    </section>
  )
}

function HeroLink({
  href,
  primary,
  children,
}: {
  href: string
  primary?: boolean
  children: ReactNode
}) {
  const context = useContext(DocsContext) as unknown as {
    channel: { emit: (event: string, url: string) => void }
  }
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      context.channel.emit(NAVIGATE_URL, href)
    }
  }
  return (
    <a href={href} onClick={onClick} className={primary ? 'sbb-btn sbb-btn--primary' : 'sbb-btn'}>
      <span>{children}</span>
      <span className="sbb-btn-icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          {href.startsWith('#') ? <path d="M8 3v10M4 9l4 4 4-4" /> : <path d="M5 11 11 5M6 5h5v5" />}
        </svg>
      </span>
    </a>
  )
}

/** The mark on its 32-unit construction grid, drawn at plate scale. */
function ConstructionMark() {
  const grid = []
  for (let n = 1; n < 32; n++) {
    const major = n % 8 === 0
    grid.push(
      <line key={`v${n}`} x1={n} y1={0} x2={n} y2={32} className={major ? 'sbb-grid sbb-grid--major' : 'sbb-grid'} />,
      <line key={`h${n}`} x1={0} y1={n} x2={32} y2={n} className={major ? 'sbb-grid sbb-grid--major' : 'sbb-grid'} />,
    )
  }
  return (
    <svg className="sbb-mark" viewBox="-2 -2 36 36" role="img" aria-label="Rudiment UI mark">
      <g aria-hidden="true">{grid}</g>
      <circle cx="17" cy="15" r="6" className="sbb-guide" />
      <circle cx="17" cy="15" r="2" className="sbb-guide" />
      <line x1="9" y1="23" x2="27" y2="23" className="sbb-guide" />
      <rect x="9" y="9" width="4" height="14" className="sbb-glyph sbb-bar" />
      <path d="M13 9h4a6 6 0 0 1 6 6h-4a2 2 0 0 0-2-2h-4z" className="sbb-glyph sbb-arc" />
      <circle cx="20.5" cy="20.5" r="2.5" className="sbb-point" />
      <g className="sbb-labels" aria-hidden="true">
        <text x="5.6" y="16.4" textAnchor="end">bar</text>
        <text x="24.4" y="8">arc</text>
        <text x="25.2" y="21.2">point</text>
      </g>
    </svg>
  )
}
