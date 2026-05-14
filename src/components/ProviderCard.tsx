import { Star, ShieldCheck, Sparkles } from 'lucide-react'
import { CATEGORY_BY_ID, formatMMK, formatDuration, type Provider } from '../data'
import { ProviderCover } from './Cover'
import { useT } from '../i18n'

/** Big editorial provider card (used in lists, featured spreads). */
export function ProviderCard({
  provider,
  onClick,
  size = 'md',
}: {
  provider: Provider
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const cat = CATEGORY_BY_ID[provider.category]
  const cheapest = provider.services.reduce(
    (m, s) => (s.price < m ? s.price : m),
    provider.services[0]?.price ?? 0,
  )
  const heights = { sm: 'h-32', md: 'h-44', lg: 'h-60' }

  return (
    <button onClick={onClick} className="group w-full text-left">
      <ProviderCover category={provider.category} providerId={provider.id} className={`${heights[size]} rounded-2xl`}>
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-ink">
            {cat.name}
          </span>
        </div>
      </ProviderCover>

      <div className="pt-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold tracking-tight text-ink truncate">{provider.name}</div>
            <div className="text-[11.5px] text-ink-muted truncate mt-0.5">
              {provider.title} · {provider.area}
            </div>
          </div>
          <div className="inline-flex items-center gap-1 shrink-0 mt-0.5">
            <Star size={11.5} fill="currentColor" strokeWidth={0} className="text-ink" />
            <span className="text-[12px] font-semibold tabular-nums text-ink">{provider.rating.toFixed(1)}</span>
            <span className="text-[11px] text-ink-dim">({provider.reviewCount})</span>
          </div>
        </div>
        <div className="mt-1.5 text-[12px] text-ink-muted">
          <span className="font-semibold text-ink">{formatMMK(cheapest)}</span>
          <span className="text-ink-dim"> · from</span>
        </div>
      </div>
    </button>
  )
}

/** Image-forward, borderless provider card.
    Inspired by Fork-style restaurant cards: full-bleed hero image with rounded
    corners, then bare content underneath — no card outline. Used in Explore. */
export function ProviderRow({ provider, onClick }: { provider: Provider; onClick: () => void }) {
  const t = useT()
  const cat = CATEGORY_BY_ID[provider.category]
  // Pick the cheapest service to surface in the meta row instead of repeating the category.
  const cheapestService = provider.services.reduce(
    (best, s) => (s.price < best.price ? s : best),
    provider.services[0] ?? { name: '', duration: 0, price: 0 },
  )

  return (
    <button onClick={onClick} className="w-full text-left group">
      {/* Hero image — fully rounded, no card border around the whole thing */}
      <div className="relative">
        <ProviderCover
          category={provider.category}
          providerId={provider.id}
          className="h-52 w-full rounded-2xl"
        >
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 h-6 rounded-full bg-canvas/95 backdrop-blur text-[10.5px] font-semibold text-ink">
            {cat.name}
          </span>
        </ProviderCover>
      </div>

      {/* Content gets a tiny inset so it doesn't touch the image edge */}
      <div className="px-1">
        {/* Title + score (right-aligned) */}
        <div className="pt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold tracking-tight text-ink leading-tight truncate">
              {provider.name}
            </h3>
            <div className="text-[12px] text-ink-muted mt-0.5 truncate">
              {provider.area} · {provider.city}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1 text-[15px] font-semibold tabular-nums text-ink leading-none">
              <Star size={12} fill="currentColor" strokeWidth={0} className="text-rust-50" />
              {provider.rating.toFixed(1)}
            </div>
            <div className="text-[11px] text-ink-dim mt-0.5">({provider.reviewCount})</div>
          </div>
        </div>

        {/* Service info — not the category (already on the image chip) */}
        <div className="text-[12px] text-ink-muted mt-1 truncate">
          {cheapestService.name}
          {cheapestService.duration > 0 && (
            <> · {formatDuration(cheapestService.duration)}</>
          )}
          {' · '}
          <span className="text-ink font-semibold">{formatMMK(cheapestService.price)}</span>
        </div>

        {/* Soft tinted pills — booking perks */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <span className="inline-flex items-center gap-1 h-6 pl-1.5 pr-2.5 rounded-full bg-alpha-evergreen-10 text-evergreen-60 text-[11px] font-semibold">
            <ShieldCheck size={11.5} strokeWidth={2.2} />
            {t('card.freeCancellation')}
          </span>
          <span className="inline-flex items-center gap-1 h-6 pl-1.5 pr-2.5 rounded-full bg-alpha-iris-10 text-iris-60 text-[11px] font-semibold">
            <Sparkles size={11.5} strokeWidth={2.2} />
            {t('card.earnRewards')}
          </span>
        </div>
      </div>
    </button>
  )
}
