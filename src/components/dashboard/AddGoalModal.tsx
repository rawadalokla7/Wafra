import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (name: string, target: number) => Promise<void> | void
}

export function AddGoalModal({ open, onClose, onAdd }: Props) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const close = () => {
    setName('')
    setTarget('')
    setError('')
    onClose()
  }

  const submit = async () => {
    if (!name || !target) return
    setLoading(true)
    setError('')
    try {
      await onAdd(name, Number(target))
      close()
    } catch (e) {
      setError(e instanceof Error ? e.message : t('auth_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={close}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-6 ${isAr ? 'font-cairo' : 'font-inter'}`}
      >
        <h3 className="text-lg font-bold">{t('dash_add_goal')}</h3>
        <div className="mt-5 flex flex-col gap-4">
          <Input
            label={isAr ? 'اسم الهدف' : 'Goal name'}
            placeholder={isAr ? 'مثال: سيارة جديدة' : 'e.g. New car'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label={isAr ? 'المبلغ المستهدف (ر.س)' : 'Target amount (SAR)'}
            type="number"
            placeholder="0"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <Button variant="ghost" onClick={close} disabled={loading}>{t('transfer_back')}</Button>
          <Button variant="gold" disabled={!name || !target || loading} onClick={submit}>
            {t('dash_add_goal')}
          </Button>
        </div>
      </div>
    </div>
  )
}
