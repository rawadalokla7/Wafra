import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { isValidEmail } from '../lib/validation'
import { useAuth } from '../context/useAuth'

interface Props {
  dark: boolean
  onToggleDark: () => void
}

export function Login({ dark, onToggleDark }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<'password' | 'otp'>('password')

  useEffect(() => {
    if (!authLoading && user) navigate('/dashboard', { replace: true })
  }, [authLoading, user, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePasswordLogin = async () => {
    setError('')
    if (!isValidEmail(email)) {
      setError(t('auth_invalid_email'))
      return
    }
    if (!isSupabaseConfigured) {
      setError(t('auth_setup_notice'))
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) setError(err.message || t('auth_error_generic'))
    else navigate('/dashboard')
  }

  const handleSendOtp = async () => {
    setError('')
    if (!isValidEmail(email)) {
      setError(t('auth_invalid_email'))
      return
    }
    if (!isSupabaseConfigured) {
      setError(t('auth_setup_notice'))
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    setLoading(false)
    if (err) setError(err.message || t('auth_error_generic'))
    else setOtpSent(true)
  }

  const handleVerifyOtp = async () => {
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'email' })
    setLoading(false)
    if (err) setError(err.message || t('auth_error_generic'))
    else navigate('/dashboard')
  }

  if (authLoading || user) return null

  return (
    <AuthShell dark={dark} onToggleDark={onToggleDark} title={t('auth_login_title')} subtitle={t('auth_login_sub')}>
      <div className="mb-5 flex rounded-md p-1" style={{ background: 'var(--bg-secondary)' }}>
        {(['password', 'otp'] as const).map((key) => (
          <button
            key={key}
            onClick={() => {
              setTab(key)
              setError('')
            }}
            className="flex-1 rounded-md py-2 text-sm font-medium transition-colors"
            style={{
              background: tab === key ? 'var(--bg-elevated)' : 'transparent',
              color: tab === key ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {key === 'password' ? t('auth_tab_password') : t('auth_tab_otp')}
          </button>
        ))}
      </div>

      {!isSupabaseConfigured && (
        <p className="mb-4 rounded-md p-3 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}>
          {t('auth_setup_notice')}
        </p>
      )}

      {tab === 'password' && (
        <div className="flex flex-col gap-4">
          <Input label={t('auth_email_label')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label={t('auth_password_label')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              {t('auth_forgot_password')}
            </Link>
          </div>
          <Button variant="gold" disabled={!email || !password || loading} onClick={handlePasswordLogin}>
            {t('auth_login_button')}
          </Button>
        </div>
      )}

      {tab === 'otp' && (
        <div className="flex flex-col gap-4">
          <Input label={t('auth_email_label')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={otpSent} />
          {!otpSent ? (
            <Button variant="gold" disabled={!email || loading} onClick={handleSendOtp}>
              {t('auth_send_otp')}
            </Button>
          ) : (
            <>
              <p className="text-xs" style={{ color: 'var(--accent)' }}>{t('auth_otp_sent')}</p>
              <Input label={t('auth_otp_label')} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="123456" maxLength={6} />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button variant="gold" disabled={otpCode.length < 6 || loading} onClick={handleVerifyOtp}>
                {t('auth_verify_otp')}
              </Button>
              <button onClick={handleSendOtp} className="text-xs text-[var(--text-secondary)] underline">
                {t('auth_resend_otp')}
              </button>
            </>
          )}
          {error && !otpSent && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        {t('auth_no_account')}{' '}
        <Link to="/signup" className="font-medium" style={{ color: 'var(--accent)' }}>
          {t('auth_create_one')}
        </Link>
      </p>
    </AuthShell>
  )
}
