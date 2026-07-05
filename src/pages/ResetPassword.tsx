import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { isValidPassword } from '../lib/validation'

interface Props {
  dark: boolean
  onToggleDark: () => void
}

export function ResetPassword({ dark, onToggleDark }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError('')
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
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) setError(err.message || t('auth_error_generic'))
    else setSuccess(true)
  }

  return (
    <AuthShell dark={dark} onToggleDark={onToggleDark} title={t('auth_reset_title')} subtitle={t('auth_reset_sub')}>
      {!isSupabaseConfigured && (
        <p className="mb-4 rounded-md p-3 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}>
          {t('auth_setup_notice')}
        </p>
      )}

      {success ? (
        <div className="flex flex-col gap-4">
          <p className="rounded-md p-3 text-sm" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
            {t('auth_reset_success')}
          </p>
          <Button variant="gold" onClick={() => navigate('/login')}>{t('auth_back_to_login')}</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input label={t('auth_new_password_label')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <Input label={t('auth_confirm_password_label')} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button variant="gold" disabled={!password || !confirm || loading} onClick={handleSubmit}>
            {t('auth_reset_button')}
          </Button>
        </div>
      )}

      {!success && (
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>
            {t('auth_back_to_login')}
          </Link>
        </p>
      )}
    </AuthShell>
  )
}
