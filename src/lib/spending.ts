import type { Transaction, TransactionCategory } from '../types'

export const categoryMeta: Record<TransactionCategory, { key: string; color: string }> = {
  food: { key: 'cat_food', color: '#0F5C4B' },
  shopping: { key: 'cat_shopping', color: '#1D7A5C' },
  transport: { key: 'cat_transport', color: '#C9A24B' },
  bills: { key: 'cat_bills', color: '#8AA69D' },
  other: { key: 'cat_other', color: '#5F7A72' },
}

export interface CategoryBreakdown {
  category: TransactionCategory
  value: number
  key: string
  color: string
}

/** Aggregates outgoing transactions by category, dropping empty categories. */
export function computeSpendingBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
  const totals: Partial<Record<TransactionCategory, number>> = {}

  for (const tx of transactions) {
    if (tx.direction !== 'out') continue
    totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount
  }

  return (Object.keys(categoryMeta) as TransactionCategory[])
    .map((cat) => ({ category: cat, value: totals[cat] ?? 0, ...categoryMeta[cat] }))
    .filter((c) => c.value > 0)
}
