import type { Viewport } from 'storybook/viewport'

/**
 * Device presets for the toolbar's viewport tool. Each name says which
 * spacing breakpoint (tokens/responsive.json) applies at that width, so the
 * Responsive Spacing rules can be checked device by device. Widths sit on or
 * just past a breakpoint (sm 40rem, md 48rem, lg 64rem, xl 80rem at 16px).
 */
export const VIEWPORTS: Record<string, Viewport> = {
  phone: {
    name: 'Phone · 375 (base)',
    styles: { width: '375px', height: '812px' },
    type: 'mobile',
  },
  phoneLarge: {
    name: 'Large phone · 430 (base)',
    styles: { width: '430px', height: '932px' },
    type: 'mobile',
  },
  phoneLandscape: {
    name: 'Phone landscape · 667 (sm)',
    styles: { width: '667px', height: '375px' },
    type: 'mobile',
  },
  tablet: {
    name: 'Tablet · 768 (md)',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet',
  },
  tabletLandscape: {
    name: 'Tablet landscape · 1024 (lg)',
    styles: { width: '1024px', height: '768px' },
    type: 'tablet',
  },
  laptop: {
    name: 'Laptop · 1280 (xl)',
    styles: { width: '1280px', height: '800px' },
    type: 'desktop',
  },
  desktop: {
    name: 'Desktop · 1440 (xl)',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
}
