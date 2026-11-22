import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { RudiSelect } from './Select'
import { RudiOption } from './Option'

const items = [
  { id: 'a', name: 'Apple' },
  { id: 'b', name: 'Banana' },
]

const field = (props: Record<string, unknown> = {}) => (
  <RudiSelect label="Fruit" items={items} {...props}>
    {(i) => <RudiOption key={i.id}>{i.name}</RudiOption>}
  </RudiSelect>
)

describe('Select', () => {
  it('submits the selected key under name in a native form', () => {
    const { container } = render(<form>{field({ name: 'fruit', defaultSelectedKey: 'b' })}</form>)
    expect(new FormData(container.querySelector('form')!).get('fruit')).toBe('b')
  })

  it('shows a required indicator like RudiInput', () => {
    const { container } = render(field({ isRequired: true }))
    const star = container.querySelector('.rudi-select__required')
    expect(star).toBeInTheDocument()
    expect(star).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows no indicator when not required', () => {
    const { container } = render(field())
    expect(container.querySelector('.rudi-select__required')).not.toBeInTheDocument()
  })

  it('has no axe violations when required', async () => {
    const { container } = render(field({ isRequired: true, name: 'fruit' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
