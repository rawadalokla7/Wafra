import type { Account, Transaction } from '../types'

export const transactions: Transaction[] = [
  { id: 't1', name: 'Careem', category: 'transport', amount: 42, date: '2026-07-03', direction: 'out' },
  { id: 't2', name: 'Salary', category: 'other', amount: 12500, date: '2026-07-01', direction: 'in' },
  { id: 't3', name: 'Noon.com', category: 'shopping', amount: 310, date: '2026-06-29', direction: 'out' },
  { id: 't4', name: 'STC Bill', category: 'bills', amount: 180, date: '2026-06-28', direction: 'out' },
  { id: 't5', name: 'Shake Shack', category: 'food', amount: 96, date: '2026-06-27', direction: 'out' },
  { id: 't6', name: 'Freelance payment', category: 'other', amount: 3200, date: '2026-06-25', direction: 'in' },
  { id: 't7', name: 'Carrefour', category: 'shopping', amount: 245, date: '2026-06-24', direction: 'out' },
  { id: 't8', name: 'Electricity', category: 'bills', amount: 220, date: '2026-06-20', direction: 'out' },
]

export interface MockGoalSeed {
  id: string
  key: string
  target: number
  saved: number
  currency: string
}

export const goalSeeds: MockGoalSeed[] = [
  { id: 'g1', key: 'goal_travel', target: 8000, saved: 5200, currency: 'SAR' },
  { id: 'g2', key: 'goal_laptop', target: 9000, saved: 3100, currency: 'SAR' },
  { id: 'g3', key: 'goal_emergency', target: 20000, saved: 14500, currency: 'SAR' },
]

export const accounts: Account[] = [
  { currency: 'SAR', balance: 48920 },
  { currency: 'AED', balance: 6120 },
  { currency: 'USD', balance: 2340 },
]
