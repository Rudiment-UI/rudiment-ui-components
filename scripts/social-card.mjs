// Renders .storybook/brand/social-card.html to .storybook/public/social-card.png
// (1200×630, the Open Graph / Twitter / LinkedIn size). Run after editing the
// card: `npm run build:social-card`. Needs Playwright Chromium and network
// access for the Geist webfonts.
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'

const src = new URL('../.storybook/brand/social-card.html', import.meta.url)
const out = fileURLToPath(new URL('../.storybook/public/social-card.png', import.meta.url))

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(src.href, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const families = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
  )
  if (!families.some((f) => f.includes('Geist'))) {
    throw new Error('Geist did not load; refusing to write a card with fallback fonts.')
  }
  await page.screenshot({ path: out, type: 'png' })
  console.log(`Wrote ${out}`)
} finally {
  await browser.close()
}
