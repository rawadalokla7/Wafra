import { supabase } from './supabase'
import type { Account, Transaction, Goal } from '../types'

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase.from('accounts').select('id, currency, balance').order('currency')
  if (error) throw error
  return data ?? []
}

export async function fetchTransactions(limit?: number): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select('id, name, category, amount, direction, occurred_at')
    .order('occurred_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    amount: Number(row.amount),
    direction: row.direction,
    date: row.occurred_at,
  }))
}

export async function fetchGoals(): Promise<Goal[]> {
  const { data, error } = await supabase.from('goals').select('id, name, target, saved, currency').order('created_at')
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    target: Number(row.target),
    saved: Number(row.saved),
    currency: row.currency,
  }))
}

export async function addGoal(name: string, target: number, currency = 'SAR'): Promise<void> {
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const user = userData.user
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('goals').insert({ user_id: user.id, name, target, saved: 0, currency })
  if (error) throw error
}

export async function makeTransfer(amount: number, recipient: string, note?: string): Promise<void> {
  const { error } = await supabase.rpc('make_transfer', {
    p_amount: amount,
    p_recipient: recipient,
    p_note: note ?? null,
  })
  if (error) throw error
}
