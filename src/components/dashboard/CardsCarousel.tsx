import { useTranslation } from 'react-i18next'
import type { Account } from '../../types'
import { currencySymbol } from '../../lib/currency'

interface Props {
  accounts: Account[]
}

export function CardsCarousel({ accounts }: Props) {
  const { t } = useTranslation()

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-[var(--text-secondary)]">{t('dash_your_cards')}</p>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {accounts.map((card) => (
          <div
            key={card.id ?? card.currency}
            className="w-56 shrink-0 rounded-card p-5"
            style={{ background: 'var(--accent)', color: '#F8F6F0' }}
          >
            <div className="flex items-center justify-between text-xs opacity-80">
              <span>Wafra</span>
              <span>{card.currency}</span>
            </div>
            <p className="mt-6 text-xl font-bold">
              {card.balance.toLocaleString()} <span className="text-sm font-normal opacity-80">{currencySymbol(card.currency)}</span>
            </p>
            <p className="mt-4 text-xs tracking-widest opacity-70">•••• •••• •••• 4821</p>
          </div>
        ))}
      </div>
    </div>
  )
}
