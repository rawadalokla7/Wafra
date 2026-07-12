import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { isValidEmail, isValidPassword } from '../lib/validation'
import { useAuth } from '../context/useAuth'

interface Props {
  dark: boolean
  onToggleDark: () => void
}

export function Signup({ dark, onToggleDark }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && user && !success) navigate('/dashboard', { replace: true })
  }, [authLoading, user, success, navigate])

  const handleSignup = async () => {
    setError('')
    if (!isValidEmail(email)) {
      setError(t('auth_invalid_email'))
      return
    }
    if (!isValidPassword(password)) {
      setError(t('auth_weak_password'))
      return
    }
    if (password !== confirm) {
      setError(t('auth_password_mismatch'))
      return
    }
    if (!isSupabaseConfigured) {
      setError(t('auth_setup_notice'))
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (err) setError(err.message || t('auth_error_generic'))
    else setSuccess(true)
  }

  if (authLoading || (user && !success)) return null

  return (
    <AuthShell dark={dark} onToggleDark={onToggleDark} title={t('auth_signup_title')} subtitle={t('auth_signup_sub')}>
      {!isSupabaseConfigured && (
        <p className="mb-4 rounded-md p-3 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}>
          {t('auth_setup_notice')}
        </p>
      )}

      {success ? (
        <p className="rounded-md p-3 text-sm" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
          {t('auth_signup_success')}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <Input label={t('auth_email_label')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <div>
            <Input label={t('auth_password_label')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <p className="mt-1 text-xs text-[var(--text-muted)]">{t('auth_weak_password')}</p>
          </div>
          <Input label={t('auth_confirm_password_label')} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button variant="gold" disabled={!email || !password || !confirm || loading} onClick={handleSignup}>
            {t('auth_signup_button')}
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        {t('auth_have_account')}{' '}
        <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>
          {t('auth_login_instead')}
        </Link>
      </p>
    </AuthShell>
  )
}
