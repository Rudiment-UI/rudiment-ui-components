import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { useChartTheme } from './useChartTheme'

const setToken = (value: string) =>
  document.documentElement.style.setProperty('--rudi-component-chart-axis-color', value)

afterEach(() => {
  document.documentElement.removeAttribute('style')
  document.documentElement.removeAttribute('data-theme')
  vi.unstubAllGlobals()
})

describe('useChartTheme', () => {
  it('re-resolves tokens when data-theme changes', async () => {
    setToken('red')
    const { result } = renderHook(() => useChartTheme())
    expect(result.current.axisColor).toBe('red')
    setToken('blue')
    await act(async () => {
      document.documentElement.setAttribute('data-theme', 'dark')
    })
    expect(result.current.axisColor).toBe('blue')
  })

  it('re-resolves tokens when the OS color scheme changes', () => {
    const listeners = new Set<() => void>()
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    }))
    setToken('red')
    const { result, unmount } = renderHook(() => useChartTheme())
    setToken('blue')
    act(() => listeners.forEach((fn) => fn()))
    expect(result.current.axisColor).toBe('blue')
    unmount()
    expect(listeners.size).toBe(0)
  })
})
