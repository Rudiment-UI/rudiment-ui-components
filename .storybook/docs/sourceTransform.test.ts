import { stripActionStubs } from './sourceTransform'

describe('stripActionStubs', () => {
  it('drops handler stubs on their own lines', () => {
    const code = [
      '<RudiButton',
      '  onPress={() => {}}',
      '  onPressEnd={() => {}}',
      '  variant="ghost"',
      '>',
      '  Save',
      '</RudiButton>',
    ].join('\n')
    expect(stripActionStubs(code)).toBe(
      ['<RudiButton', '  variant="ghost"', '>', '  Save', '</RudiButton>'].join(
        '\n',
      ),
    )
  })

  it('drops inline stubs', () => {
    expect(stripActionStubs('<RudiSwitch onChange={() => {}} label="A" />')).toBe(
      '<RudiSwitch label="A" />',
    )
  })

  it('closes a tag left with no props', () => {
    expect(
      stripActionStubs('<RudiButton\n  onPress={() => {}}\n>\n  Save\n</RudiButton>'),
    ).toBe('<RudiButton>\n  Save\n</RudiButton>')
    expect(stripActionStubs('<RudiDivider\n  onPress={() => {}}\n/>')).toBe(
      '<RudiDivider />',
    )
  })

  it('keeps real handlers', () => {
    const code = '<RudiButton onPress={() => save()}>Save</RudiButton>'
    expect(stripActionStubs(code)).toBe(code)
  })
})
