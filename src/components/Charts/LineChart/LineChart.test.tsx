import { cloneElement } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { RudiLineChart } from './LineChart'

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...actual,
    // Give the chart a real size so Recharts renders its SVG in jsdom.
    ResponsiveContainer: ({ children }: { children: React.ReactElement<{ width?: number; height?: number }> }) => (
      <div style={{ width: 500, height: 300 }}>
        {cloneElement(children, { width: 500, height: 300 })}
      </div>
    ),
  }
})

const sampleData = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 5000, profit: 3200 },
]

describe('LineChart', () => {
  it('renders with accessible label', () => {
    render(
      <RudiLineChart
        data={sampleData}
        dataKeys={['revenue']}
        indexKey="month"
        label="Revenue trend"
      />,
    )
    expect(screen.getByRole('img', { name: 'Revenue trend' })).toBeInTheDocument()
  })

  it('applies rudi-chart class', () => {
    const { container } = render(
      <RudiLineChart
        data={sampleData}
        dataKeys={['revenue']}
        indexKey="month"
        label="Revenue"
      />,
    )
    expect(container.firstChild).toHaveClass('rudi-chart')
  })

  it('merges custom className', () => {
    const { container } = render(
      <RudiLineChart
        data={sampleData}
        dataKeys={['revenue']}
        indexKey="month"
        label="Revenue"
        className="my-chart"
      />,
    )
    expect(container.firstChild).toHaveClass('rudi-chart')
    expect(container.firstChild).toHaveClass('my-chart')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiLineChart
        data={sampleData}
        dataKeys={['revenue']}
        indexKey="month"
        label="Revenue trend"
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('draws labelled reference lines', () => {
    const { container } = render(
      <RudiLineChart
        data={[
          { t: '00:00', probe: -191 },
          { t: '01:00', probe: -190 },
        ]}
        dataKeys={['probe']}
        indexKey="t"
        label="Probe temperature"
        unit="°C"
        yDomain={[-200, -100]}
        referenceLines={[{ y: -150, label: 'Set-point', tone: 'error' }]}
      />,
    )
    expect(container.querySelector('.recharts-reference-line')).toBeInTheDocument()
    expect(screen.getByText('Set-point')).toBeInTheDocument()
    expect(screen.getByText('-150°C')).toBeInTheDocument()
  })
})
