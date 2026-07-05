import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '../components/dashboard/Sidebar'
import { Topbar } from '../components/dashboard/Topbar'
import { CardsCarousel } from '../components/dashboard/CardsCarousel'
import { TransactionsList } from '../components/dashboard/TransactionsList'
import { SpendingChart } from '../components/dashboard/SpendingChart'
import { BudgetGoals } from '../components/dashboard/BudgetGoals'
import { StatCard } from '../components/dashboard/StatCard'
import { TransferModal } from '../components/dashboard/TransferModal'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { IconCoins, IconArrowDown, IconArrowUp } from '../components/icons'
import { useDashboardData } from '../hooks/useDashboardData'
import { currencySymbol } from '../lib/currency'

interface Props {
  dark: boolean
  onToggleDark: () => void
}

export function Dashboard({ dark, onToggleDark }: Props) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [active, setActive] = useState('overview')
  const [transferOpen, setTransferOpen] = useState(false)

  const { isLive, loading, error, accounts, transactions, goals, addGoal, transfer } = useDashboardData()

  const primaryAccount = accounts.find((a) => a.currency === 'SAR') ?? accounts[0]
  const income = useMemo(() => transactions.filter((t) => t.direction === 'in').reduce((s, t) => s + t.amount, 0), [transactions])
  const expense = useMemo(() => transactions.filter((t) => t.direction === 'out').reduce((s, t) => s + t.amount, 0), [transactions])

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar active={active} onNavigate={setActive} />

      <div className="flex flex-1 flex-col">
        <Topbar dark={dark} onToggleDark={onToggleDark} onNewTransfer={() => setTransferOpen(true)} />

        <main className={`flex-1 p-6 pb-24 md:p-8 md:pb-8 ${isAr ? 'font-cairo' : 'font-inter'}`}>
          {!isLive && (
            <div className="mx-auto mb-6 max-w-6xl rounded-card border border-[var(--border)] px-4 py-2.5 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              {t('dash_demo_notice')}
            </div>
          )}

          {error && (
            <div className="mx-auto mb-6 max-w-6xl rounded-card border border-red-300 bg-red-50 px-4 py-2.5 text-xs text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid place-items-center py-24 text-sm text-[var(--text-secondary)]">…</div>
          ) : (
            <>
              {active === 'overview' && (
                <div className="mx-auto flex max-w-6xl flex-col gap-8">
                  <div>
                    <h1 className="text-2xl font-bold">{t('dash_welcome')}</h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('dash_welcome_sub')}</p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <StatCard
                      label={t('dash_total_balance')}
                      value={primaryAccount ? `${primaryAccount.balance.toLocaleString()} ${currencySymbol(primaryAccount.currency)}` : '—'}
                      icon={<IconCoins />}
                    />
                    <StatCard label={t('dash_income')} value={`${income.toLocaleString()} SAR`} icon={<IconArrowDown />} />
                    <StatCard label={t('dash_expense')} value={`${expense.toLocaleString()} SAR`} icon={<IconArrowUp />} />
                  </div>

                  <CardsCarousel accounts={accounts} />

                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold">{t('dash_recent_transactions')}</p>
                        <button onClick={() => setActive('transactions')} className="text-sm" style={{ color: 'var(--accent)' }}>
                          {t('dash_view_all')}
                        </button>
                      </div>
                      <div className="mt-2">
                        <TransactionsList transactions={transactions} limit={5} />
                      </div>
                    </Card>

                    <Card>
                      <p className="font-bold">{t('dash_spending_by_category')}</p>
                      <div className="mt-4">
                        <SpendingChart transactions={transactions} />
                      </div>
                    </Card>
                  </div>

                  <Card>
                    <BudgetGoals goals={goals} onAddGoal={addGoal} />
                  </Card>
                </div>
              )}

              {active === 'transactions' && (
                <div className="mx-auto max-w-4xl">
                  <h1 className="text-2xl font-bold">{t('dash_transactions')}</h1>
                  <Card className="mt-6">
                    <TransactionsList transactions={transactions} />
                  </Card>
                </div>
              )}

              {active === 'transfer' && (
                <div className="mx-auto max-w-xl text-center">
                  <h1 className="text-2xl font-bold">{t('dash_transfer')}</h1>
                  <div className="mt-6">
                    <Button variant="gold" onClick={() => setTransferOpen(true)}>{t('dash_new_transfer')}</Button>
                  </div>
                </div>
              )}

              {active === 'analytics' && (
                <div className="mx-auto max-w-2xl">
                  <h1 className="text-2xl font-bold">{t('dash_analytics')}</h1>
                  <Card className="mt-6">
                    <p className="font-bold">{t('dash_spending_by_category')}</p>
                    <div className="mt-4">
                      <SpendingChart transactions={transactions} />
                    </div>
                  </Card>
                </div>
              )}

              {active === 'settings' && (
                <div className="mx-auto max-w-xl">
                  <h1 className="text-2xl font-bold">{t('dash_settings')}</h1>
                  <Card className="mt-6 text-sm text-[var(--text-secondary)]">
                    {isAr ? 'إعدادات الحساب واللغة والأمان قريبًا.' : 'Account, language, and security settings coming soon.'}
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} onConfirm={transfer} />
    </div>
  )
}
