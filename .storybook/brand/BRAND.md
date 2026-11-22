# Rudiment UI brand

The brand applies to the Storybook presentation only: the manager chrome, the
docs theme, and the Introduction hero. Components never read it. They are
styled by `--rudi-*` tokens alone and render the same with or without it.

## Idea

A rudiment is a first principle, and in drumming it is a basic pattern that
bigger pieces are built from. The mark makes that literal: a lowercase **r**
built from three primitives on a 32-unit grid.

- **Bar:** the stem, 4 × 14 units.
- **Arc:** the shoulder, a quarter ring with outer radius 6 and inner radius 2.
- **Point:** the signal dot. Its right edge meets the end of the arc and its
  base sits on the stem's baseline.

The glyph sits in a 32-unit tile with an 8-unit corner radius. Together, the
mark and the point read as "r.", which echoes the headline "Build from the
rudiments."

## Files

| File | Use |
| ---- | --- |
| `brand.ts` | Colors, fonts, `markSvg()` and the sidebar lockup. This is the single source. |
| `../public/favicon.svg` | Favicon. It inverts for dark OS appearance. |
| `BrandHero.tsx`, `brand-hero.css` | Introduction hero and construction plate |
| `social-card.html` | Source for `../public/social-card.png`, the 1200×630 share image. Regenerate with `npm run build:social-card`. Tags are emitted by `managerHead` in `../main.ts`; set `STORYBOOK_SITE_URL` at build time so `og:image` is absolute. |
| `../manager.ts` | Light and dark chrome themes, which follow the OS setting |
| `../preview-head.html` | Typography for docs prose |

## Color

| Name | Hex | Use |
| ---- | --- | --- |
| Ink | `#141414` | Text, tile, primary button |
| Canvas | `#F5F5F5` | Chrome background, glyph on ink |
| Surface | `#FFFFFF` | Content panels, toolbar, inputs |
| Line | `#E5E5E5` | Hairlines and borders |
| Muted | `#666666` | Secondary text and labels |
| Red | `#E5322D` | The point and small accents. Fill only: 4.35:1 against white fails body text. |
| Red Deep | `#C8201B` | Selected states and link underlines on light. Text-safe: 5.7:1 against white. |
| Red Bright | `#FF5A4F` | Selected states on dark. Text-safe: 5.8:1 against Night Raised. |
| Night | `#0E0E0E` | Dark chrome background |
| Night Raised | `#171717` | Dark content panels and toolbar |

Greys are pure neutrals with no warm or cool cast, so the red is the only hue
in the chrome. Use it sparingly, as a single point in each view.

## Type

- **Geist** for UI, headings and body. Headings use weight 600 with tight
  tracking (−0.03 to −0.055em).
- **Geist Mono** for eyebrows, labels, table heads and code. Labels are set
  in uppercase at 10.5–11px with 0.08–0.16em tracking.

## Motion

Use the ease `cubic-bezier(0.32, 0.72, 0, 1)` for movement and
`cubic-bezier(0.34, 1.56, 0.64, 1)` for the point's spring. Animate only
transform and opacity, and gate all motion behind
`prefers-reduced-motion: no-preference`.

## Lockup

Pair the mark with **rudiment** set in Geist 600, followed by **/ui** in Geist
Mono in the muted color. On dark backgrounds, invert the tile to canvas and the
glyph to ink. The point stays red in every version.
