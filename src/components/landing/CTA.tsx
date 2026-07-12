import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/useAuth'

export function CTA() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <section className={`px-6 py-8 md:px-10 ${isAr ? 'font-cairo' : 'font-inter'}`}>
      <div className="mx-auto max-w-6xl rounded-card text-center" style={{ background: 'var(--accent)', color: '#F8F6F0' }}>
        <div className="mx-auto max-w-lg px-6 py-10">
          <h2 className="text-3xl font-extrabold md:text-4xl">{t('cta_title')}</h2>
          <p className="mt-3 opacity-85">{t('cta_subtitle')}</p>
          <div className="mt-8 flex justify-center">
            <Button variant="gold" onClick={() => navigate(user ? '/dashboard' : '/signup')}>
              {user ? t('nav_go_dashboard') : t('cta_button')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
