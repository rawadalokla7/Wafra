import { useTranslation } from 'react-i18next'
import { IconSearch } from '../icons'
import { Button } from '../ui/Button'
import { NotificationsMenu } from './NotificationsMenu'
import { useAuth } from '../../context/useAuth'

interface TopbarProps {
  dark: boolean
  onToggleDark: () => void
  onNewTransfer: () => void
}

export function Topbar({ dark, onToggleDark, onNewTransfer }: TopbarProps) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const toggleLang = () => i18n.changeLanguage(isAr ? 'en' : 'ar')
  const { user } = useAuth()
  const initial = user?.email?.[0]?.toUpperCase() ?? (isAr ? 'ض' : 'G')

  return (
    <div className={`flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-4 ${isAr ? 'font-cairo' : 'font-inter'}`}>
      <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)] sm:flex">
        <IconSearch />
        <input
          placeholder={t('dash_search')}
          className="w-full bg-transparent outline-none placeholder:text-[var(--text-muted)]"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          aria-label="toggle theme"
          className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-sm transition-colors hover:bg-[var(--bg-secondary)]"
        >
          {dark ? '☀' : '☾'}
        </button>
        <button
          onClick={toggleLang}
          className="h-9 rounded-md border border-[var(--border)] px-3 text-sm transition-colors hover:bg-[var(--bg-secondary)]"
        >
          {isAr ? 'EN' : 'عربي'}
        </button>
        <NotificationsMenu />
        <Button variant="gold" className="!px-4 !py-2 text-sm" onClick={onNewTransfer}>
          {t('dash_new_transfer')}
        </Button>
        <div
          className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold"
          style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}
          title={user?.email ?? undefined}
        >
          {initial}
        </div>
      </div>
    </div>
  )
}
