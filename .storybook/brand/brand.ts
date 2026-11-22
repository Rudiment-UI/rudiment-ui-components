// Rudiment UI brand: the single source for the Storybook presentation layer
// (manager chrome, docs theme, Introduction hero). Nothing here reaches the
// published package or the components; they style themselves from --rudi-*
// tokens only. See BRAND.md for the identity guidelines.

export const brand = {
  ink: '#141414',
  inkSoft: '#2B2B2B',
  canvas: '#F5F5F5',
  surface: '#FFFFFF',
  line: '#E5E5E5',
  hover: '#EBEBEB',
  muted: '#666666',
  // Signal: the "point" in the mark. Fills and marks only; 4.35:1 fails body text.
  red: '#E5322D',
  // Text-safe signal on light surfaces: 5.7:1 against white.
  redDeep: '#C8201B',
  // Text-safe signal on dark surfaces: 5.8:1 against nightRaised.
  redBright: '#FF5A4F',
  night: '#0E0E0E',
  nightRaised: '#171717',
  nightHover: '#1F1F1F',
  nightLine: '#2B2B2B',
  nightMuted: '#9A9A9A',
} as const

export const fonts = {
  sans: '"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const

/**
 * The mark: a bar, an arc and a point on a 32-unit grid, the three rudiments
 * the lowercase "r" is built from. Glyph spans 9–23 on both axes; the point's
 * right edge meets the arc's terminal and its base sits on the bar's baseline.
 */
export function markSvg({
  size = 32,
  tile = brand.ink,
  glyph = brand.canvas,
  point = brand.red,
}: { size?: number; tile?: string; glyph?: string; point?: string } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="8" fill="${tile}"/><path fill="${glyph}" d="M9 9h4v14H9zM13 9h4a6 6 0 0 1 6 6h-4a2 2 0 0 0-2-2h-4z"/><circle cx="20.5" cy="20.5" r="2.5" fill="${point}"/></svg>`
}

/** Sidebar lockup, rendered by Storybook as HTML (brandTitle with no brandImage). */
export function lockupHtml(mode: 'light' | 'dark') {
  const dark = mode === 'dark'
  const mark = dark
    ? markSvg({ size: 26, tile: brand.canvas, glyph: brand.ink })
    : markSvg({ size: 26 })
  const word = dark ? brand.canvas : brand.ink
  const sub = dark ? brand.nightMuted : brand.muted
  return `<span style="display:inline-flex;align-items:center;gap:10px;font-family:${fonts.sans.replace(/"/g, "'")};line-height:1">${mark}<span style="font-size:17px;font-weight:600;letter-spacing:-0.035em;color:${word}">rudiment</span><span style="margin-left:-6px;font-family:${fonts.mono.replace(/"/g, "'")};font-size:11px;font-weight:500;letter-spacing:0.02em;color:${sub};transform:translateY(1px)">/ui</span></span>`
}
