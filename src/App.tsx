import { useEffect, useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { StaticPage } from './pages/StaticPage'
import { AuthProvider } from './context/AuthContext'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/ResetPassword').then((m) => ({ default: m.ResetPassword })))

function PageFallback() {
  return <div className="grid min-h-screen place-items-center text-sm text-[var(--text-secondary)]">Loading…</div>
}

function App() {
  const { t, i18n } = useTranslation()
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
  )

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggleDark = () => setDark((d) => !d)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing dark={dark} onToggleDark={toggleDark} />} />
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageFallback />}>
                <Login dark={dark} onToggleDark={toggleDark} />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<PageFallback />}>
                <Signup dark={dark} onToggleDark={toggleDark} />
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<PageFallback />}>
                <ForgotPassword dark={dark} onToggleDark={toggleDark} />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<PageFallback />}>
                <ResetPassword dark={dark} onToggleDark={toggleDark} />
              </Suspense>
            }
          />
        <Route
          path="/about"
          element={<StaticPage dark={dark} onToggleDark={toggleDark} title={t('page_about_title')}><p>{t('page_about_body')}</p></StaticPage>}
        />
        <Route
          path="/careers"
          element={<StaticPage dark={dark} onToggleDark={toggleDark} title={t('page_careers_title')}><p>{t('page_careers_body')}</p></StaticPage>}
        />
        <Route
          path="/contact"
          element={<StaticPage dark={dark} onToggleDark={toggleDark} title={t('page_contact_title')}><p>{t('page_contact_body')}</p></StaticPage>}
        />
        <Route
          path="/privacy"
          element={<StaticPage dark={dark} onToggleDark={toggleDark} title={t('page_privacy_title')}><p>{t('page_privacy_body')}</p></StaticPage>}
        />
        <Route
          path="/terms"
          element={<StaticPage dark={dark} onToggleDark={toggleDark} title={t('page_terms_title')}><p>{t('page_terms_body')}</p></StaticPage>}
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageFallback />}>
              <Dashboard dark={dark} onToggleDark={toggleDark} />
            </Suspense>
          }
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
