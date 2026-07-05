import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Props {
  dark: boolean
  onToggleDark: () => void
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthShell({ dark, onToggleDark, title, subtitle, children }: Props) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const toggleLang = () => i18n.changeLanguage(isAr ? 'en' : 'ar')

  return (
    <div className={`relative flex min-h-screen items-center justify-center px-6 py-12 ${isAr ? 'font-cairo' : 'font-inter'}`}>
      <div className="absolute end-6 top-6 flex items-center gap-2">
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
      </div>

      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <svg width="30" height="30" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
            <path d="M18 40 Q18 22 32 22 Q46 22 46 36" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="46" cy="36" r="4.5" fill="var(--accent-gold)" />
          </svg>
          <span className="text-lg font-bold">{t('brand')}</span>
        </Link>

        <div className="rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-7">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
