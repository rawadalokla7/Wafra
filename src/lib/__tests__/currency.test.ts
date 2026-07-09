import { describe, it, expect } from 'vitest'
import { currencySymbol } from '../currency'

describe('currencySymbol', () => {
  it('returns the correct symbol for known Gulf currencies', () => {
    expect(currencySymbol('SAR')).toBe('ر.س')
    expect(currencySymbol('AED')).toBe('د.إ')
    expect(currencySymbol('USD')).toBe('$')
    expect(currencySymbol('KWD')).toBe('د.ك')
  })

  it('falls back to the currency code itself when unknown', () => {
    expect(currencySymbol('XYZ')).toBe('XYZ')
  })
})
