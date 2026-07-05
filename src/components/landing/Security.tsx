import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IconShield, IconLock, IconMoon, IconRadar } from '../icons'
import { prefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

export function Security() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const rootRef = useRef<HTMLDivElement>(null)

  const items = [
    { icon: <IconShield />, text: t('security_1') },
    { icon: <IconLock />, text: t('security_2') },
    { icon: <IconMoon />, text: t('security_3') },
    { icon: <IconRadar />, text: t('security_4') },
  ]

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.security-item', {
        opacity: 0,
        x: isAr ? 20 : -20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [i18n.language, isAr])

  return (
    <section
      id="security"
      ref={rootRef}
      className={isAr ? 'font-cairo' : 'font-inter'}
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:px-10">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>{t('security_eyebrow')}</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t('security_title')}</h2>
          <p className="mt-4 max-w-md leading-relaxed text-[var(--text-secondary)]">{t('security_desc')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="security-item flex items-start gap-3 rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
            >
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md"
                style={{ background: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}
              >
                {item.icon}
              </div>
              <p className="pt-1.5 text-sm font-medium leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
