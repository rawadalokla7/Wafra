import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { isValidEmail } from '../lib/validation'

interface Props {
  dark: boolean
  onToggleDark: () => void
}

export function ForgotPassword({ dark, onToggleDark }: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
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
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    // Always show the same success state, whether or not the email exists,
    // to avoid leaking which emails are registered.
    if (err && err.status && err.status >= 500) setError(t('auth_error_generic'))
    else setSent(true)
  }

  return (
    <AuthShell dark={dark} onToggleDark={onToggleDark} title={t('auth_forgot_title')} subtitle={t('auth_forgot_sub')}>
      {!isSupabaseConfigured && (
        <p className="mb-4 rounded-md p-3 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}>
          {t('auth_setup_notice')}
        </p>
      )}

      {sent ? (
        <p className="rounded-md p-3 text-sm" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
          {t('auth_reset_sent')}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <Input label={t('auth_email_label')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button variant="gold" disabled={!email || loading} onClick={handleSubmit}>
            {t('auth_send_reset_link')}
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>
          {t('auth_back_to_login')}
        </Link>
      </p>
    </AuthShell>
  )
}
