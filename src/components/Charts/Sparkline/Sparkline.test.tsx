import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiSparkline } from './Sparkline'

describe('RudiSparkline', () => {
  it('renders an svg image with the accessible label', () => {
    render(<RudiSparkline data={[1, 3, 2, 5]} label="Temperature trend" />)
    expect(screen.getByRole('img', { name: 'Temperature trend' })).toBeInTheDocument()
  })

  it('draws a line path with one segment per point', () => {
    const { container } = render(
      <RudiSparkline data={[1, 3, 2, 5]} label="Trend" />,
    )
    const d = container.querySelector('.rudi-sparkline__line')!.getAttribute('d')!
    expect(d.match(/[ML]/g)).toHaveLength(4)
  })

  it('handles empty data', () => {
    const { container } = render(<RudiSparkline data={[]} label="No data" />)
    expect(container.querySelector('.rudi-sparkline__line')).toBeNull()
    expect(container.querySelector('.rudi-sparkline__endpoint')).toBeNull()
    expect(screen.getByRole('img', { name: 'No data' })).toBeInTheDocument()
  })

  it('handles a single point by drawing a dot', () => {
    const { container } = render(<RudiSparkline data={[4]} label="One" />)
    expect(container.querySelector('.rudi-sparkline__line')).toBeNull()
    expect(container.querySelector('.rudi-sparkline__endpoint')).not.toBeNull()
  })

  it('draws a threshold line and keeps it inside the domain', () => {
    const { container } = render(
      <RudiSparkline data={[1, 2, 3]} threshold={10} label="Trend" />,
    )
    const line = container.querySelector('.rudi-sparkline__threshold')!
    const y = Number(line.getAttribute('y1'))
    expect(y).toBeGreaterThanOrEqual(0)
    expect(y).toBeLessThanOrEqual(100)
    // The threshold is the max, so it sits above the data (smaller y).
    const d = container.querySelector('.rudi-sparkline__line')!.getAttribute('d')!
    const ys = [...d.matchAll(/[ML][\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]))
    expect(Math.min(...ys)).toBeGreaterThan(y)
  })

  it('shows an endpoint only when asked', () => {
    const { container, rerender } = render(
      <RudiSparkline data={[1, 2, 3]} label="Trend" />,
    )
    expect(container.querySelector('.rudi-sparkline__endpoint')).toBeNull()
    rerender(<RudiSparkline data={[1, 2, 3]} label="Trend" showEndpoint />)
    expect(container.querySelector('.rudi-sparkline__endpoint')).not.toBeNull()
  })

  it('applies the tone class and size', () => {
    render(
      <RudiSparkline data={[1, 2]} label="Trend" tone="error" width={120} height={32} />,
    )
    const svg = screen.getByRole('img')
    expect(svg).toHaveClass('rudi-sparkline--error')
    expect(svg).toHaveStyle({ width: '120px' })
  })

  it('ignores non-finite values', () => {
    const { container } = render(
      <RudiSparkline data={[1, NaN, 3]} label="Trend" />,
    )
    expect(container.querySelector('.rudi-sparkline__line')!.getAttribute('d')).not.toContain('NaN')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiSparkline data={[1, 3, 2]} label="Trend" threshold={2} showEndpoint />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
