import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/landing/Navbar'
import { Footer } from '../components/landing/Footer'

interface Props {
  dark: boolean
  onToggleDark: () => void
  title: string
  children: ReactNode
}

export function StaticPage({ dark, onToggleDark, title, children }: Props) {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <div className="min-h-screen">
      <Navbar dark={dark} onToggleDark={onToggleDark} />
      <main className={`mx-auto max-w-3xl px-6 py-16 md:px-10 ${isAr ? 'font-cairo' : 'font-inter'}`}>
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        <div className="mt-6 flex flex-col gap-4 leading-relaxed text-[var(--text-secondary)]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
