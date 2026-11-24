import { useEffect, useRef, useState } from 'react'
import { VIEWPORTS } from '../viewports'
import './docs-blocks.css'

const DEVICE_KEYS = Object.keys(VIEWPORTS)
const px = (value: string) => Number.parseFloat(value)

/** Follows the theme the docs page is showing (the preview decorator sets it on `<html>`). */
function usePageTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? 'light')
  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setTheme(root.dataset.theme ?? 'light'))
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return theme
}

/**
 * Docs-page stand-in for the toolbar's viewport tool, which Storybook only shows
 * in story view. Renders a story in an iframe at a device preset's width, so its
 * media queries (the responsive spacing breakpoints) respond to that width. A
 * device wider than the docs column is scaled down to fit.
 */
export function DevicePreview({
  storyId,
  initialDevice = 'phone',
  height: fixedHeight,
}: {
  /** Story to render, e.g. `patterns-product-landing--default`. */
  storyId: string
  /** Key of a preset in `.storybook/viewports.ts`. */
  initialDevice?: string
  /** Frame height in px, in place of the device's own height. For short demos. */
  height?: number
}) {
  const [device, setDevice] = useState(initialDevice)
  const [available, setAvailable] = useState(0)
  const frameRef = useRef<HTMLDivElement>(null)
  const theme = usePageTheme()

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { name, styles } = VIEWPORTS[device]
  const width = px(styles.width)
  const height = fixedHeight ?? px(styles.height)
  const scale = available ? Math.min(1, available / width) : 1

  return (
    <div className="sb-device">
      <div className="sb-device__bar" role="group" aria-label="Device">
        {DEVICE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="sb-device__option"
            aria-pressed={key === device}
            onClick={() => setDevice(key)}
          >
            {VIEWPORTS[key].name}
          </button>
        ))}
      </div>
      <div ref={frameRef} className="sb-device__stage" style={{ height: height * scale }}>
        <iframe
          key={`${storyId}-${theme}`}
          title={`${name} preview`}
          src={`iframe.html?id=${storyId}&viewMode=story&globals=theme:${theme}`}
          className="sb-device__frame"
          style={{ width, height, transform: `scale(${scale})` }}
        />
      </div>
      <p className="sb-device__caption">
        {name}
        {scale < 1 && ` · scaled to ${Math.round(scale * 100)}% to fit`}
      </p>
    </div>
  )
}
