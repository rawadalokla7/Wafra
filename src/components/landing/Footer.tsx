import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Footer() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <footer className={`border-t border-[var(--border)] ${isAr ? 'font-cairo' : 'font-inter'}`}>
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
                <path d="M18 40 Q18 22 32 22 Q46 22 46 36" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
                <circle cx="46" cy="36" r="4.5" fill="var(--accent-gold)" />
              </svg>
              <span className="text-base font-bold">{t('brand')}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{t('footer_tagline')}</p>
          </div>

          <div>
            <p className="text-sm font-medium">{t('footer_product')}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#features" className="hover:text-[var(--text-primary)]">{t('nav_features')}</a></li>
              <li><a href="#security" className="hover:text-[var(--text-primary)]">{t('nav_security')}</a></li>
              <li><a href="#pricing" className="hover:text-[var(--text-primary)]">{t('nav_pricing')}</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium">{t('footer_company')}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <li><Link to="/about" className="hover:text-[var(--text-primary)]">{t('footer_about')}</Link></li>
              <li><Link to="/careers" className="hover:text-[var(--text-primary)]">{t('footer_careers')}</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--text-primary)]">{t('footer_contact')}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium">{t('footer_legal')}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <li><Link to="/privacy" className="hover:text-[var(--text-primary)]">{t('footer_privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--text-primary)]">{t('footer_terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {t('brand')}. {t('footer_rights')}.
        </div>
      </div>
    </footer>
  )
}
