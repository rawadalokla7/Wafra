import { Navbar } from '../components/landing/Navbar'
import { Hero } from '../components/landing/Hero'
import { Features } from '../components/landing/Features'
import { Security } from '../components/landing/Security'
import { Pricing } from '../components/landing/Pricing'
import { CTA } from '../components/landing/CTA'
import { Footer } from '../components/landing/Footer'

interface Props {
  dark: boolean
  onToggleDark: () => void
}

export function Landing({ dark, onToggleDark }: Props) {
  return (
    <div className="min-h-screen">
      <Navbar dark={dark} onToggleDark={onToggleDark} />
      <Hero />
      <Features />
      <Security />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
