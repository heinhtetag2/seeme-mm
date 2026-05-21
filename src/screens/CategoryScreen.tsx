import { useState, useMemo } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { ProviderRow } from '../components/ProviderCard'
import { CategoryCover } from '../components/Cover'
import { CATEGORY_BY_ID, providersByCategory, CITIES, type CategoryId, type City } from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

type Sort = 'recommended' | 'rating' | 'distance'

const SORT_LABEL: Record<Sort, string> = {
  recommended: 'Recommended',
  rating: 'Top rated',
  distance: 'Nearest',
}

export function CategoryScreen({ categoryId, onBack, go }: { categoryId: CategoryId; onBack: () => void; go: (v: View) => void }) {
  const t = useT()
  const cat = CATEGORY_BY_ID[categoryId]
  const [sort, setSort] = useState<Sort>('recommended')
  const [city, setCity] = useState<City>('All cities')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [topRatedOnly, setTopRatedOnly] = useState(false)
  const [sheet, setSheet] = useState<null | 'city' | 'sort'>(null)

  const list = useMemo(() => {
    let arr = providersByCategory(categoryId)
    if (city !== 'All cities') arr = arr.filter((p) => p.city === city)
    if (verifiedOnly) arr = arr.filter((p) => p.verified)
    if (topRatedOnly) arr = arr.filter((p) => p.rating >= 4.7)
    if (sort === 'rating') arr = [...arr].sort((a, b) => b.rating - a.rating)
    if (sort === 'distance') arr = [...arr].sort((a, b) => a.distanceKm - b.distanceKm)
    return arr
  }, [categoryId, city, sort, verifiedOnly, topRatedOnly])

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-24 animate-slide-up">
      {/* Full-bleed editorial cover */}
      <div className="relative">
        <CategoryCover category={categoryId} className="h-72" />
        <div className="absolute inset-x-0 top-0">
          <SubScreenHeader onBack={onBack} variant="overlay" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
          <div className="kicker text-white/70 mb-1.5">Category</div>
          <h1 className="font-serif text-[36px] leading-[1.0] tracking-tight font-semibold text-white">
            {cat.name}
          </h1>
          <p className="text-[13px] text-white/85 mt-2 max-w-[260px]">{cat.tagline}</p>
        </div>
      </div>

      {/* Sticky filter row — horizontal scrollable chips (Uber Eats / Maps pattern) */}
      <div className="sticky top-0 z-10 bg-canvas/95 backdrop-blur border-b border-line/60">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5 py-3">
          {/* Dropdown chip */}
          <DropChip active={city !== 'All cities'} onClick={() => setSheet('city')}>
            {city === 'All cities' ? 'City' : city}
          </DropChip>
          {/* Toggle chips */}
          <ToggleChip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
            Verified
          </ToggleChip>
          <ToggleChip active={topRatedOnly} onClick={() => setTopRatedOnly((v) => !v)}>
            Top rated
          </ToggleChip>
        </div>
      </div>

      {/* Result count + sort — sort is a quiet text dropdown, not a button */}
      <div className="px-5 pt-5 pb-1 flex items-baseline justify-between">
        <div className="kicker">
          {list.length} {list.length === 1 ? 'PROVIDER' : 'PROVIDERS'}
        </div>
        <button
          onClick={() => setSheet('sort')}
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink"
        >
          {SORT_LABEL[sort]}
          <ChevronDown size={12} strokeWidth={2.4} className="text-ink-muted" />
        </button>
      </div>

      {/* List */}
      <div className="px-5 pt-5">
        {list.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-5">
            {list.map((p) => (
              <ProviderRow key={p.id} provider={p} onClick={() => go({ kind: 'provider', providerId: p.id })} />
            ))}
          </div>
        )}
      </div>

      {/* City sheet */}
      {sheet === 'city' && (
        <Sheet title={t('sheet.city')} onClose={() => setSheet(null)}>
          {CITIES.map((c) => (
            <SheetRow
              key={c}
              label={c}
              selected={city === c}
              onClick={() => { setCity(c); setSheet(null) }}
            />
          ))}
        </Sheet>
      )}

      {/* Sort sheet */}
      {sheet === 'sort' && (
        <Sheet title={t('sheet.sortBy')} onClose={() => setSheet(null)}>
          {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
            <SheetRow
              key={s}
              label={SORT_LABEL[s]}
              selected={sort === s}
              onClick={() => { setSort(s); setSheet(null) }}
            />
          ))}
        </Sheet>
      )}
    </div>
  )
}

/** Dropdown chip — opens a sheet, can be cleared when active. */
function DropChip({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full border text-[12.5px] font-semibold leading-none whitespace-nowrap transition
        ${active
          ? 'bg-brand text-white border-brand'
          : 'bg-surface-elevated text-ink border-line/70 hover:border-line-strong'}`}
    >
      {children}
      <ChevronDown size={11} strokeWidth={2.4} className={active ? 'opacity-70' : 'text-ink-muted'} />
    </button>
  )
}

/** Toggle chip — instantly toggles a boolean filter. */
function ToggleChip({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full border text-[12.5px] font-semibold leading-none whitespace-nowrap transition
        ${active
          ? 'bg-brand text-white border-brand'
          : 'bg-surface-elevated text-ink border-line/70 hover:border-line-strong'}`}
    >
      {active && <Check size={11} strokeWidth={2.6} />}
      {children}
      {active && <X size={10} strokeWidth={2.6} className="opacity-60 -mr-1 ml-0.5" />}
    </button>
  )
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[85%] overflow-y-auto">
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
        <div className="kicker mb-1">{title}</div>
        <h2 className="font-serif text-[22px] font-semibold tracking-tight mb-4">{title}</h2>
        <div className="divide-y divide-line/60 border-y border-line/60">{children}</div>
      </div>
    </div>
  )
}

function SheetRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between gap-3 py-3.5 text-left">
      <span className="text-[14px] font-semibold tracking-tight">{label}</span>
      {selected && (
        <span className="h-5 w-5 rounded-full bg-brand text-white grid place-items-center">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

function Empty() {
  const t = useT()
  return (
    <div className="py-16 text-center px-6">
      <h2 className="font-serif text-[18px] font-semibold tracking-tight">{t('category.empty.title')}</h2>
      <p className="text-[12.5px] text-ink-muted mt-1.5 max-w-[260px] mx-auto">
        {t('category.empty.sub')}
      </p>
    </div>
  )
}
