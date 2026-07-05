import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconHome, IconList, IconSend, IconChart, IconSettings, IconLogout } from '../icons'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  active: string
  onNavigate: (key: string) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const items = [
    { key: 'overview', label: t('dash_overview'), icon: <IconHome /> },
    { key: 'transactions', label: t('dash_transactions'), icon: <IconList /> },
    { key: 'transfer', label: t('dash_transfer'), icon: <IconSend /> },
    { key: 'analytics', label: t('dash_analytics'), icon: <IconChart /> },
    { key: 'settings', label: t('dash_settings'), icon: <IconSettings /> },
  ]

  return (
    <>
      <aside
        className={`hidden w-60 shrink-0 flex-col border-[var(--border)] bg-[var(--bg-elevated)] p-5 md:flex ${isAr ? 'border-s font-cairo' : 'border-e font-inter'}`}
      >
        <div className="flex items-center gap-2 px-1 pb-8">
          <svg width="26" height="26" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
            <path d="M18 40 Q18 22 32 22 Q46 22 46 36" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="46" cy="36" r="4.5" fill="var(--accent-gold)" />
          </svg>
          <span className="text-lg font-bold">{t('brand')}</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)]"
              style={{
                background: active === item.key ? 'var(--bg-secondary)' : 'transparent',
                color: active === item.key ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: active === item.key ? 600 : 400,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => signOut().then(() => navigate('/'))}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)]"
        >
          <IconLogout />
          {t('dash_logout')}
        </button>
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[var(--border)] bg-[var(--bg-elevated)] py-2 md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            aria-label={item.label}
            className="flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-[10px]"
            style={{ color: active === item.key ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </>
  )
}
