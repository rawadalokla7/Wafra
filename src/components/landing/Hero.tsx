import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Button } from '../ui/Button'
import { prefersReducedMotion } from '../../lib/motion'
import { useAuth } from '../../context/useAuth'

export function Hero() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.6 })
        .from('.hero-line', { opacity: 0, y: 28, duration: 0.7, stagger: 0.12 }, '-=0.3')
        .from('.hero-sub', { opacity: 0, y: 16, duration: 0.6 }, '-=0.35')
        .from('.hero-actions', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
        .from('.hero-stat', { opacity: 0, y: 12, duration: 0.5, stagger: 0.1 }, '-=0.35')
        .from('.hero-card', { opacity: 0, scale: 0.94, duration: 0.7 }, '-=0.7')

      if (pathRef.current) {
        const len = pathRef.current.getTotalLength()
        gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len })
        tl.to(pathRef.current, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, '-=0.4')
      }

      tl.from('.hero-chip', { opacity: 0, y: 10, duration: 0.5, stagger: 0.1 }, '-=0.6')
    }, rootRef)

    return () => ctx.revert()
  }, [i18n.language])

  return (
    <section ref={rootRef} className={`mx-auto max-w-6xl px-6 pb-20 pt-16 md:px-10 md:pt-24 ${isAr ? 'font-cairo' : 'font-inter'}`}>
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent-gold)' }} />
            {t('hero_eyebrow')}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] md:text-5xl">
            <span className="hero-line block">{t('hero_title_1')}</span>
            <span className="hero-line block" style={{ color: 'var(--accent-gold)' }}>{t('hero_title_2')}</span>
          </h1>

          <p className="hero-sub mt-6 max-w-md text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            {t('hero_subtitle')}
          </p>

          <div className="hero-actions mt-8 flex flex-wrap gap-4">
            <Button variant="gold" onClick={() => navigate(user ? '/dashboard' : '/signup')}>
              {user ? t('nav_go_dashboard') : t('hero_cta_primary')}
            </Button>
            <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('hero_cta_secondary')}
            </Button>
          </div>

          <div className="mt-12 flex gap-10">
            <div className="hero-stat">
              <p className="text-2xl font-bold">+250K</p>
              <p className="text-sm text-[var(--text-secondary)]">{t('hero_stat_users')}</p>
            </div>
            <div className="hero-stat">
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-[var(--text-secondary)]">{t('hero_stat_countries')}</p>
            </div>
            <div className="hero-stat flex items-center gap-1">
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-[var(--text-secondary)]">{t('hero_stat_rating')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-card relative mx-auto w-full max-w-sm rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">{isAr ? 'الرصيد الإجمالي' : 'Total balance'}</span>
            <span className="hero-chip rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}>+12.4%</span>
          </div>
          <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--accent-gold)' }}>48,920.00</p>

          <svg viewBox="0 0 280 90" className="mt-6 w-full">
            <path
              ref={pathRef}
              d="M4 70 Q40 20 76 48 T148 30 T220 52 T276 12"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <div className="mt-6 flex gap-2">
            <span className="hero-chip rounded-md border border-[var(--border)] px-2.5 py-1 text-xs">SAR</span>
            <span className="hero-chip rounded-md border border-[var(--border)] px-2.5 py-1 text-xs">AED</span>
            <span className="hero-chip rounded-md border border-[var(--border)] px-2.5 py-1 text-xs">USD</span>
            <span className="hero-chip rounded-md border border-[var(--border)] px-2.5 py-1 text-xs">KWD</span>
          </div>
        </div>
      </div>
    </section>
  )
}
