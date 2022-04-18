import { expect } from 'chai'
import { kebabize } from './utils'

describe('kebabize', () => {
  it('does not change an empty string', () => {
    expect(kebabize('')).to.eq('')
  })

  it('does not change a correct string', () => {
    expect(kebabize('abc')).to.eq('abc')
  })

  it('replaces a single whitespace with a dash', () => {
    expect(kebabize('ab c')).to.eq('ab-c')
  })

  it('replaces multiple whitespaces with dashes', () => {
    expect(kebabize('a b c')).to.eq('a-b-c')
  })

  it('replaces multiple consecutive whitespaces with a single dash', () => {
    expect(kebabize('ab    c')).to.eq('ab-c')
  })

  it('lowercases the letters', () => {
    expect(kebabize('A b C')).to.eq('a-b-c')
  })

  it('handles umlauts', () => {
    expect(kebabize('Ä ö Ü')).to.eq('ä-ö-ü')
  })
})
