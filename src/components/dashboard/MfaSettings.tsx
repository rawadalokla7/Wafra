import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { IconShield } from '../icons'

export function MfaSettings() {
  const { t } = useTranslation()
  const [enrolled, setEnrolled] = useState(false)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.mfa.listFactors().then(({ data }) => {
      const totp = data?.totp?.[0]
      if (totp) {
        setEnrolled(true)
        setFactorId(totp.id)
      }
    })
  }, [])

  const startEnroll = async () => {
    setError('')
    setMessage('')
    if (!isSupabaseConfigured) {
      setError(t('mfa_setup_notice'))
      return
    }
    setLoading(true)
    const { data, error: err } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setFactorId(data.id)
    setQrCode(data.totp.qr_code)
    setEnrolling(true)
  }

  const confirmEnroll = async () => {
    if (!factorId) return
    setError('')
    setLoading(true)
    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeErr) {
      setLoading(false)
      setError(challengeErr.message)
      return
    }
    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })
    setLoading(false)
    if (verifyErr) {
      setError(verifyErr.message)
      return
    }
    setEnrolled(true)
    setEnrolling(false)
    setQrCode(null)
    setCode('')
    setMessage(t('mfa_success'))
  }

  const disable = async () => {
    if (!factorId) return
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.mfa.unenroll({ factorId })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setEnrolled(false)
    setFactorId(null)
    setMessage(t('mfa_disabled_success'))
  }

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
          <IconShield />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-bold">{t('mfa_title')}</p>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: 'var(--bg-secondary)',
                color: enrolled ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {enrolled ? t('mfa_status_enabled') : t('mfa_status_disabled')}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{t('mfa_desc')}</p>

          {!isSupabaseConfigured && (
            <p className="mt-3 rounded-md p-2.5 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}>
              {t('mfa_setup_notice')}
            </p>
          )}

          {message && <p className="mt-3 text-xs" style={{ color: 'var(--accent)' }}>{message}</p>}
          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

          {!enrolling && !enrolled && (
            <div className="mt-4">
              <Button variant="gold" disabled={loading} onClick={startEnroll}>
                {t('mfa_enable_button')}
              </Button>
            </div>
          )}

          {enrolling && qrCode && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm">{t('mfa_scan_qr')}</p>
              <img src={qrCode} alt="TOTP QR code" className="h-40 w-40 rounded-md border border-[var(--border)] bg-white p-2" />
              <Input label={t('mfa_code_label')} value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" maxLength={6} />
              <div className="flex gap-3">
                <Button variant="gold" disabled={code.length < 6 || loading} onClick={confirmEnroll}>
                  {t('mfa_confirm_button')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEnrolling(false)
                    setQrCode(null)
                    setCode('')
                  }}
                >
                  {t('mfa_cancel')}
                </Button>
              </div>
            </div>
          )}

          {enrolled && (
            <div className="mt-4">
              <Button variant="ghost" disabled={loading} onClick={disable}>
                {t('mfa_disable_button')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
