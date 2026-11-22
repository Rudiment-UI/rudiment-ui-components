import { useCallback, useEffect, useState } from 'react'

interface ChartTheme {
  colors: string[]
  axisColor: string
  gridColor: string
  labelColor: string
  legendColor: string
  tooltipBg: string
  tooltipText: string
  tooltipBorder: string
  chartBg: string
  /** Feedback colors for reference lines and thresholds. */
  tones: Record<'default' | 'success' | 'warning' | 'error' | 'info', string>
}

const TOKEN_MAP = {
  axisColor: '--rudi-component-chart-axis-color',
  gridColor: '--rudi-component-chart-grid-color',
  labelColor: '--rudi-component-chart-label-color',
  legendColor: '--rudi-component-chart-legend-color',
  tooltipBg: '--rudi-component-chart-tooltip-bg',
  tooltipText: '--rudi-component-chart-tooltip-text',
  tooltipBorder: '--rudi-component-chart-tooltip-border',
  chartBg: '--rudi-component-chart-bg',
} as const

const SERIES_TOKENS = Array.from({ length: 8 }, (_, i) =>
  `--rudi-color-dataviz-series-${i + 1}`,
)

const FALLBACK_COLORS = [
  '#2563eb', '#d946ef', '#f59e0b', '#10b981',
  '#ef4444', '#8b5cf6', '#06b6d4', '#f97316',
]

function resolveTokens(): ChartTheme {
  if (typeof window === 'undefined') {
    return {
      colors: FALLBACK_COLORS,
      axisColor: '#6b7280',
      gridColor: '#e5e7eb',
      labelColor: '#111827',
      legendColor: '#6b7280',
      tooltipBg: '#ffffff',
      tooltipText: '#111827',
      tooltipBorder: '#e5e7eb',
      chartBg: '#ffffff',
      tones: { default: '#6b7280', success: '#16a34a', warning: '#d97706', error: '#dc2626', info: '#2563eb' },
    }
  }

  const styles = getComputedStyle(document.documentElement)
  const resolve = (token: string) => styles.getPropertyValue(token).trim()

  const colors = SERIES_TOKENS.map((token, i) => resolve(token) || FALLBACK_COLORS[i])

  const theme: Record<string, string> = {}
  for (const [key, token] of Object.entries(TOKEN_MAP)) {
    theme[key] = resolve(token) || ''
  }

  return {
    colors,
    axisColor: theme.axisColor,
    gridColor: theme.gridColor,
    labelColor: theme.labelColor,
    legendColor: theme.legendColor,
    tooltipBg: theme.tooltipBg,
    tooltipText: theme.tooltipText,
    tooltipBorder: theme.tooltipBorder,
    chartBg: theme.chartBg,
    tones: {
      default: resolve('--rudi-color-text-subtle') || '#6b7280',
      success: resolve('--rudi-color-feedback-success') || '#16a34a',
      warning: resolve('--rudi-color-feedback-warning') || '#d97706',
      error: resolve('--rudi-color-feedback-error') || '#dc2626',
      info: resolve('--rudi-color-feedback-info') || '#2563eb',
    },
  }
}

/**
 * Reads the active theme's chart colors (series, axes, grid, tooltip and feedback tones) from the
 * `--rudi-*` CSS custom properties, for chart libraries that need color values in JS. Re-resolves
 * when `data-theme` on `<html>` changes or the OS color scheme flips. Returns light fallback
 * colors on the server. Only the `data-theme` attribute on the document element is observed.
 *
 * @example
 * const theme = useChartTheme()
 * <Line dataKey="value" stroke={theme.colors[0]} />
 */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(resolveTokens)

  const updateTheme = useCallback(() => {
    setTheme(resolveTokens())
  }, [])

  useEffect(() => {
    updateTheme()

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          updateTheme()
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // data-theme="auto" follows the OS without any attribute change, so
    // also re-resolve when the color-scheme preference flips.
    const scheme = window.matchMedia?.('(prefers-color-scheme: dark)')
    scheme?.addEventListener('change', updateTheme)

    return () => {
      observer.disconnect()
      scheme?.removeEventListener('change', updateTheme)
    }
  }, [updateTheme])

  return theme
}
