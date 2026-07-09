import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Transaction } from '../../types'
import { computeSpendingBreakdown } from '../../lib/spending'

interface Props {
  transactions: Transaction[]
}

export function SpendingChart({ transactions }: Props) {
  const { t } = useTranslation()
  const breakdown = useMemo(() => computeSpendingBreakdown(transactions), [transactions])
  const total = breakdown.reduce((sum, c) => sum + c.value, 0)

  if (total === 0) {
    return <p className="py-6 text-center text-sm text-[var(--text-secondary)]">—</p>
  }

  return (
    <div className="flex items-center gap-6">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={breakdown} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="none">
              {breakdown.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : value)}
              contentStyle={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {breakdown.map((entry, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
              <span className="text-[var(--text-secondary)]">{t(entry.key)}</span>
            </div>
            <span className="font-medium">{Math.round((entry.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
