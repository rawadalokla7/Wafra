import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { IconCheck } from '../icons'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (amount: number, recipient: string, note?: string) => Promise<void> | void
  availableBalance?: number
}

export function TransferModal({ open, onClose, onConfirm, availableBalance }: Props) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const reset = () => {
    setStep(1)
    setAmount('')
    setRecipient('')
    setNote('')
    setError('')
    onClose()
  }

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      await onConfirm(Number(amount), recipient, note || undefined)
      setStep(4)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('auth_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={reset}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-6 ${isAr ? 'font-cairo' : 'font-inter'}`}
      >
        {step < 4 && (
          <div className="mb-6 flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-1 flex-1 rounded-full" style={{ background: s <= step ? 'var(--accent-gold)' : 'var(--bg-secondary)' }} />
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-lg font-bold">{t('transfer_step1_title')}</h3>
            {typeof availableBalance === 'number' && (
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {t('transfer_available_balance')}: <span className="font-medium" style={{ color: 'var(--accent-gold)' }}>{availableBalance.toLocaleString()} SAR</span>
              </p>
            )}
            <div className="mt-5">
              <Input label={t('transfer_amount_label')} type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              {typeof availableBalance === 'number' && Number(amount) > availableBalance && (
                <p className="mt-1.5 text-xs text-red-500">{t('transfer_insufficient_balance')}</p>
              )}
            </div>
            <div className="mt-7 flex justify-end">
              <Button
                variant="gold"
                disabled={!amount || Number(amount) <= 0 || (typeof availableBalance === 'number' && Number(amount) > availableBalance)}
                onClick={() => setStep(2)}
              >
                {t('transfer_continue')}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-bold">{t('transfer_step2_title')}</h3>
            <div className="mt-5 flex flex-col gap-4">
              <Input
                label={t('transfer_recipient_label')}
                placeholder={isAr ? 'مثال: سارة أحمد' : 'e.g. Sara Ahmed'}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <Input label={t('transfer_note_label')} placeholder={isAr ? 'اختياري' : 'Optional'} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="mt-7 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>{t('transfer_back')}</Button>
              <Button variant="gold" disabled={!recipient} onClick={() => setStep(3)}>
                {t('transfer_continue')}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-bold">{t('transfer_step3_title')}</h3>
            <div className="mt-5 flex flex-col gap-3 rounded-md p-4 text-sm" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('transfer_from')}</span>
                <span className="font-medium">Wafra · SAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('transfer_to')}</span>
                <span className="font-medium">{recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('transfer_amount')}</span>
                <span className="font-bold" style={{ color: 'var(--accent-gold)' }}>{amount} SAR</span>
              </div>
            </div>
            {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
            <div className="mt-7 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} disabled={loading}>{t('transfer_back')}</Button>
              <Button variant="primary" onClick={submit} disabled={loading}>{t('transfer_confirm')}</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
              <IconCheck />
            </div>
            <h3 className="mt-4 text-lg font-bold">{t('transfer_success_title')}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('transfer_success_sub')}</p>
            <div className="mt-6">
              <Button variant="gold" onClick={reset}>{t('transfer_done')}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
