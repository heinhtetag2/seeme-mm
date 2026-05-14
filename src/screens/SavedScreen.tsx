import { Heart } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { ProviderRow } from '../components/ProviderCard'
import { PROVIDERS } from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

export function SavedScreen({
  favorites,
  onBack,
  go,
}: {
  favorites: Set<string>
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const list = PROVIDERS.filter((p) => favorites.has(p.id))

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />

      <div className="px-5">
        <div className="kicker mb-1.5">{t('saved.title')}</div>
        <h1 className="font-serif text-[28px] leading-[1.05] tracking-tight font-semibold">
          {t('saved.headline')}
        </h1>
        {list.length > 0 && (
          <div className="text-[12px] text-ink-muted mt-2">
            {t('saved.subtitle', { count: list.length })}
          </div>
        )}

        {list.length === 0 ? (
          <Empty />
        ) : (
          <div className="mt-6 space-y-5">
            {list.map((p) => (
              <ProviderRow key={p.id} provider={p} onClick={() => go({ kind: 'provider', providerId: p.id })} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Empty() {
  const t = useT()
  return (
    <div className="mt-16 px-3 text-center">
      <div className="mx-auto h-12 w-12 rounded-full border border-line grid place-items-center mb-4">
        <Heart size={18} strokeWidth={1.8} className="text-ink-muted" />
      </div>
      <h2 className="font-serif text-[18px] font-semibold tracking-tight">{t('saved.empty.title')}</h2>
      <p className="text-[12.5px] text-ink-muted mt-1.5 max-w-[240px] mx-auto">
        {t('saved.empty.sub')}
      </p>
    </div>
  )
}
