import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import * as api from '../lib/api'
import { accounts as mockAccounts, transactions as mockTransactions, goalSeeds } from '../data/mockData'
import type { Account, Transaction, Goal } from '../types'

export function useDashboardData() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const isLive = isSupabaseConfigured && !!user

  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDemo = useCallback(() => {
    setAccounts(mockAccounts)
    setTransactions(mockTransactions)
    setGoals(goalSeeds.map((g) => ({ id: g.id, name: t(g.key), target: g.target, saved: g.saved, currency: g.currency })))
    setError('')
    setLoading(false)
  }, [t])

  const loadLive = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [acc, tx, gl] = await Promise.all([api.fetchAccounts(), api.fetchTransactions(), api.fetchGoals()])
      setAccounts(acc)
      setTransactions(tx)
      setGoals(gl)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    if (isLive) loadLive()
    else loadDemo()
  }, [isLive, loadLive, loadDemo])

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, t])

  const addGoal = useCallback(
    async (name: string, target: number) => {
      if (isLive) {
        await api.addGoal(name, target)
        await loadLive()
      } else {
        setGoals((prev) => [...prev, { id: `local-${Date.now()}`, name, target, saved: 0, currency: 'SAR' }])
      }
    },
    [isLive, loadLive],
  )

  const transfer = useCallback(
    async (amount: number, recipient: string, note?: string) => {
      if (isLive) {
        await api.makeTransfer(amount, recipient, note)
        await loadLive()
      } else {
        setTransactions((prev) => [
          { id: `local-${Date.now()}`, name: recipient, category: 'other', amount, date: new Date().toISOString().slice(0, 10), direction: 'out' },
          ...prev,
        ])
        setAccounts((prev) => prev.map((a) => (a.currency === 'SAR' ? { ...a, balance: a.balance - amount } : a)))
      }
    },
    [isLive, loadLive],
  )

  return { isLive, loading, error, accounts, transactions, goals, addGoal, transfer, refresh }
}
