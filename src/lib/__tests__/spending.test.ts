import { describe, it, expect } from 'vitest'
import { computeSpendingBreakdown } from '../spending'
import type { Transaction } from '../../types'

const tx = (overrides: Partial<Transaction>): Transaction => ({
  id: Math.random().toString(),
  name: 'Test',
  category: 'other',
  amount: 100,
  date: '2026-01-01',
  direction: 'out',
  ...overrides,
})

describe('computeSpendingBreakdown', () => {
  it('sums outgoing amounts per category', () => {
    const result = computeSpendingBreakdown([
      tx({ category: 'food', amount: 50 }),
      tx({ category: 'food', amount: 30 }),
      tx({ category: 'shopping', amount: 20 }),
    ])

    const food = result.find((c) => c.category === 'food')
    const shopping = result.find((c) => c.category === 'shopping')
    expect(food?.value).toBe(80)
    expect(shopping?.value).toBe(20)
  })

  it('ignores incoming transactions', () => {
    const result = computeSpendingBreakdown([tx({ category: 'other', amount: 5000, direction: 'in' })])
    expect(result).toHaveLength(0)
  })

  it('omits categories with zero spending', () => {
    const result = computeSpendingBreakdown([tx({ category: 'food', amount: 10 })])
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe('food')
  })

  it('returns an empty array for no transactions', () => {
    expect(computeSpendingBreakdown([])).toEqual([])
  })
})
