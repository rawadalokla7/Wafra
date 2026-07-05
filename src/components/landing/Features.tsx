import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '../ui/Card'
import { IconCoins, IconBolt, IconChart, IconTarget } from '../icons'
import { prefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

export function Features() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const rootRef = useRef<HTMLDivElement>(null)

  const items = [
    { icon: <IconCoins />, title: t('feature_1_title'), desc: t('feature_1_desc') },
    { icon: <IconBolt />, title: t('feature_2_title'), desc: t('feature_2_desc') },
    { icon: <IconChart />, title: t('feature_3_title'), desc: t('feature_3_desc') },
    { icon: <IconTarget />, title: t('feature_4_title'), desc: t('feature_4_desc') },
  ]

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
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
    <section id="features" ref={rootRef} className={`mx-auto max-w-6xl px-6 py-20 md:px-10 ${isAr ? 'font-cairo' : 'font-inter'}`}>
      <div className="max-w-xl">
        <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>{t('features_eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t('features_title')}</h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <Card key={i} className="feature-card">
            <div
              className="grid h-11 w-11 place-items-center rounded-md"
              style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}
            >
              {item.icon}
            </div>
            <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
