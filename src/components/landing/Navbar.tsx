import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/useAuth'

interface NavbarProps {
  dark: boolean
  onToggleDark: () => void
}

export function Navbar({ dark, onToggleDark }: NavbarProps) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const toggleLang = () => i18n.changeLanguage(isAr ? 'en' : 'ar')
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  const links = [
    { href: '#features', label: t('nav_features') },
    { href: '#security', label: t('nav_security') },
    { href: '#pricing', label: t('nav_pricing') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 ${isAr ? 'font-cairo' : 'font-inter'}`}>
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
            <path d="M18 40 Q18 22 32 22 Q46 22 46 36" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="46" cy="36" r="4.5" fill="var(--accent-gold)" />
          </svg>
          <span className="text-lg font-bold">{t('brand')}</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-[var(--text-primary)]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            aria-label="toggle theme"
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-sm transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)]"
          >
            {dark ? '☀' : '☾'}
          </button>
          <button
            onClick={toggleLang}
            className="h-9 rounded-md border border-[var(--border)] px-3 text-sm transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)]"
          >
            {isAr ? 'EN' : 'عربي'}
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <>
                <span className="max-w-[9rem] truncate text-sm text-[var(--text-secondary)]">
                  {t('nav_logged_in_as')} {user.email}
                </span>
                <Button variant="ghost" className="!px-4 !py-2 text-sm" onClick={() => signOut().then(() => navigate('/'))}>
                  {t('dash_logout')}
                </Button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="px-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                  {t('nav_login')}
                </button>
                <Button variant="gold" className="!px-4 !py-2 text-sm" onClick={() => navigate('/signup')}>
                  {t('nav_cta')}
                </Button>
              </>
            )}
          </div>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="menu"
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] transition-colors hover:bg-[var(--bg-secondary)] md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={`border-t border-[var(--border)] px-6 py-4 md:hidden ${isAr ? 'font-cairo' : 'font-inter'}`}>
          <nav className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-1">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4">
            <Button variant="gold" className="w-full" onClick={() => navigate('/signup')}>
              {t('nav_cta')}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
