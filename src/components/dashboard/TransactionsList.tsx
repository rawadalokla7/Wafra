import { useTranslation } from 'react-i18next'
import type { Transaction } from '../../types'
import { IconArrowDown, IconArrowUp } from '../icons'

const catKey: Record<string, string> = {
  food: 'cat_food',
  shopping: 'cat_shopping',
  transport: 'cat_transport',
  bills: 'cat_bills',
  other: 'cat_other',
}

interface Props {
  transactions: Transaction[]
  limit?: number
}

export function TransactionsList({ transactions, limit }: Props) {
  const { t } = useTranslation()
  const list = limit ? transactions.slice(0, limit) : transactions

  if (list.length === 0) {
    return <p className="py-6 text-center text-sm text-[var(--text-secondary)]">—</p>
  }

  return (
    <div className="flex flex-col divide-y divide-[var(--border)]">
      {list.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{
                background: 'var(--bg-secondary)',
                color: tx.direction === 'in' ? 'var(--accent)' : 'var(--accent-gold)',
              }}
            >
              {tx.direction === 'in' ? <IconArrowDown /> : <IconArrowUp />}
            </div>
            <div>
              <p className="text-sm font-medium">{tx.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{t(catKey[tx.category])} · {tx.date}</p>
            </div>
          </div>
          <p
            className="text-sm font-bold"
            style={{ color: tx.direction === 'in' ? 'var(--accent)' : 'var(--text-primary)' }}
          >
            {tx.direction === 'in' ? '+' : '-'}{tx.amount.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
