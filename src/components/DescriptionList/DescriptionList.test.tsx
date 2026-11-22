import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiDescriptionList } from './DescriptionList'

const items = [
  { term: 'Carrier', description: 'FedEx' },
  { term: 'Status', description: 'In transit', id: 'status' },
  { term: 'Origin', description: 'Denver, CO' },
]

describe('DescriptionList', () => {
  it('renders a dl with a dt and dd per item', () => {
    const { container } = render(<RudiDescriptionList items={items} />)
    const dl = container.querySelector('dl')
    expect(dl).toHaveClass('rudi-description-list', 'rudi-description-list--stacked')
    expect(container.querySelectorAll('dt')).toHaveLength(3)
    expect(container.querySelectorAll('dd')).toHaveLength(3)
    expect(screen.getByText('Carrier').tagName).toBe('DT')
    expect(screen.getByText('FedEx').tagName).toBe('DD')
  })

  it('applies the inline layout and dividers modifiers', () => {
    const { container } = render(
      <RudiDescriptionList items={items} layout="inline" dividers />,
    )
    expect(container.firstChild).toHaveClass(
      'rudi-description-list--inline',
      'rudi-description-list--dividers',
    )
  })

  it('passes columns as a custom property for the stacked layout', () => {
    const { container } = render(
      <RudiDescriptionList items={items} columns={3} />,
    )
    expect(
      (container.firstChild as HTMLElement).style.getPropertyValue(
        '--description-list-columns',
      ),
    ).toBe('3')
  })

  it('renders an empty list without items', () => {
    const { container } = render(<RudiDescriptionList items={[]} />)
    expect(container.querySelector('dl')).toBeEmptyDOMElement()
  })

  it('sets the item id on the row wrapper and merges className', () => {
    const { container } = render(
      <RudiDescriptionList items={items} className="mine" />,
    )
    expect(container.firstChild).toHaveClass('rudi-description-list', 'mine')
    expect(container.querySelector('#status')).toHaveClass(
      'rudi-description-list__item',
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RudiDescriptionList items={items} layout="inline" dividers />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
