import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconBell } from '../icons'

export function NotificationsMenu() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const items = isAr
    ? [
        { title: 'تحويل وارد', desc: 'استلمت 3,200 ر.س من Freelance payment', time: 'قبل ساعتين' },
        { title: 'فاتورة قادمة', desc: 'فاتورة STC مستحقة خلال 3 أيام', time: 'أمس' },
        { title: 'هدف قريب من الاكتمال', desc: 'وصلت 65% من هدف رحلة إسطنبول', time: 'قبل يومين' },
      ]
    : [
        { title: 'Incoming transfer', desc: 'You received SAR 3,200 from a freelance payment', time: '2h ago' },
        { title: 'Upcoming bill', desc: 'Your STC bill is due in 3 days', time: 'Yesterday' },
        { title: 'Goal almost there', desc: "You're 65% toward your Istanbul trip goal", time: '2d ago' },
      ]

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="notifications"
        className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] transition-colors hover:bg-[var(--bg-secondary)]"
      >
        <IconBell />
      </button>

      {open && (
        <div
          className="absolute end-0 top-11 z-50 w-72 rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-lg"
        >
          {items.map((item, i) => (
            <div key={i} className="rounded-md p-3 hover:bg-[var(--bg-secondary)]">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.desc}</p>
              <p className="mt-1 text-[10px] text-[var(--text-muted)]">{item.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
