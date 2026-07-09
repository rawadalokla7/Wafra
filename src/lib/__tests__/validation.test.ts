import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPassword } from '../validation'

describe('isValidEmail', () => {
  it('accepts well-formed emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('rawad.alokla+test@gmail.com')).toBe(true)
  })

  it('rejects malformed emails', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })

  it('trims whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true)
  })
})

describe('isValidPassword', () => {
  it('accepts passwords of 8 characters or more', () => {
    expect(isValidPassword('12345678')).toBe(true)
    expect(isValidPassword('a-very-long-password')).toBe(true)
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(isValidPassword('1234567')).toBe(false)
    expect(isValidPassword('')).toBe(false)
  })
})
