import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Goal } from '../../types'
import { Button } from '../ui/Button'
import { AddGoalModal } from './AddGoalModal'

interface Props {
  goals: Goal[]
  onAddGoal: (name: string, target: number) => Promise<void> | void
}

export function BudgetGoals({ goals, onAddGoal }: Props) {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-bold">{t('dash_budget_goals')}</p>
        <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => setModalOpen(true)}>
          {t('dash_add_goal')}
        </Button>
      </div>

      {goals.length === 0 ? (
        <p className="mt-5 text-sm text-[var(--text-secondary)]">—</p>
      ) : (
        <div className="mt-5 flex flex-col gap-5">
          {goals.map((goal) => {
            const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0
            return (
              <div key={goal.id}>
                <div className="flex items-baseline justify-between text-sm">
                  <p className="font-medium">{goal.name}</p>
                  <p className="text-[var(--text-secondary)]">
                    {goal.saved.toLocaleString()} {t('dash_of')} {goal.target.toLocaleString()} {goal.currency}
                  </p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent-gold)' }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddGoalModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={onAddGoal} />
    </div>
  )
}
