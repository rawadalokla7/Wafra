import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string
  trend?: string
  icon: ReactNode
}

export function StatCard({ label, value, trend, icon }: Props) {
  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <div className="grid h-8 w-8 place-items-center rounded-md" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {trend && <p className="mt-1 text-xs" style={{ color: 'var(--accent-gold)' }}>{trend}</p>}
    </div>
  )
}
