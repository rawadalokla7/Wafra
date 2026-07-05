export interface Account {
  id?: string
  currency: string
  balance: number
}

export type TransactionCategory = 'food' | 'shopping' | 'transport' | 'bills' | 'other'

export interface Transaction {
  id: string
  name: string
  category: TransactionCategory
  amount: number
  date: string
  direction: 'in' | 'out'
}

export interface Goal {
  id: string
  name: string
  target: number
  saved: number
  currency: string
}
