import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '../ui/Button'
import { IconCheck } from '../icons'
import { prefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

export function Pricing() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const plans = [
    { name: t('plan_basic_name'), price: t('plan_basic_price'), desc: t('plan_basic_desc'), popular: false },
    { name: t('plan_plus_name'), price: t('plan_plus_price'), desc: t('plan_plus_desc'), popular: true },
    { name: t('plan_business_name'), price: t('plan_business_price'), desc: t('plan_business_desc'), popular: false },
  ]

  const perks = isAr
    ? ['بطاقة افتراضية', 'تحويلات محلية', 'دعم على مدار الساعة']
    : ['Virtual card', 'Local transfers', '24/7 support']

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [i18n.language])

  return (
    <section id="pricing" ref={rootRef} className={`mx-auto max-w-6xl px-6 py-20 md:px-10 ${isAr ? 'font-cairo' : 'font-inter'}`}>
      <div className="max-w-xl text-center mx-auto">
        <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>{t('pricing_eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t('pricing_title')}</h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <div
            key={i}
            className="pricing-card relative rounded-card border p-7"
            style={{
              borderColor: plan.popular ? 'var(--accent-gold)' : 'var(--border)',
              borderWidth: plan.popular ? '2px' : '1px',
              background: 'var(--bg-elevated)',
            }}
          >
            {plan.popular && (
              <span
                className="absolute -top-3 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: 'var(--accent-gold)', color: 'var(--bg-elevated)', insetInlineStart: '1.75rem' }}
              >
                {t('plan_popular')}
              </span>
            )}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className="mt-2 text-2xl font-extrabold">{plan.price}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{plan.desc}</p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {perks.map((perk, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <span style={{ color: 'var(--accent)' }}><IconCheck /></span>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Button variant={plan.popular ? 'gold' : 'ghost'} className="w-full" onClick={() => navigate('/signup')}>
                {t('plan_cta')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
