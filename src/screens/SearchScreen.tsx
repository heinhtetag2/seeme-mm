import { useMemo, useState } from 'react'
import { Search, X, ChevronLeft, ChevronDown, Check, Map as MapIcon, Star } from 'lucide-react'
import { ProviderRow } from '../components/ProviderCard'
import {
  CATEGORIES, CITIES, PROVIDERS, searchProviders,
  type CategoryId, type Provider, type LatLng,
} from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

type Sort = 'recommended' | 'rating' | 'distance'

const SORT_LABEL: Record<Sort, string> = {
  recommended: 'Recommended',
  rating: 'Top rated',
  distance: 'Nearest',
}

/**
 * Search sub-screen with a full-bleed map backdrop + draggable bottom sheet.
 * - Sheet has two snap positions: "peek" (most of the map visible) and "expanded".
 * - Tap the drag handle to toggle, or tap the visible map area to jump to the
 *   full Explore map view.
 */
export function SearchScreen({
  onBack,
  go,
  city: initialCity,
  onMap,
}: {
  onBack: () => void
  go: (v: View) => void
  city: string
  onMap: () => void
}) {
  const t = useT()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('recommended')
  /** Union of the hand-picked CITIES list + any city actually present in the
   *  provider data (Bago, Sittwe, …) + the city the user arrived with. */
  const cityOptions = useMemo<string[]>(() => {
    const set = new Set<string>(CITIES as readonly string[])
    PROVIDERS.forEach((p) => set.add(p.city))
    if (initialCity) set.add(initialCity)
    const all = Array.from(set)
    // Keep "All cities" first, then the rest alphabetically.
    return ['All cities', ...all.filter((c) => c !== 'All cities').sort()]
  }, [initialCity])
  const [city, setCity] = useState<string>(
    cityOptions.includes(initialCity) ? initialCity : 'All cities',
  )
  const [category, setCategory] = useState<'all' | CategoryId>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [filterSheet, setFilterSheet] = useState<null | 'sort' | 'city' | 'category'>(null)
  const [sheetState, setSheetState] = useState<'expanded' | 'peek'>('expanded')

  const list = useMemo<Provider[]>(() => {
    let base = q.trim() ? searchProviders(q) : PROVIDERS
    if (city !== 'All cities') base = base.filter((p) => p.city === city)
    if (category !== 'all') base = base.filter((p) => p.category === category)
    if (verifiedOnly) base = base.filter((p) => p.verified)
    if (sort === 'rating') base = [...base].sort((a, b) => b.rating - a.rating)
    else if (sort === 'distance') base = [...base].sort((a, b) => a.distanceKm - b.distanceKm)
    return base
  }, [q, sort, city, category, verifiedOnly])

  const filtersActive = sort !== 'recommended' || city !== 'All cities' || category !== 'all' || verifiedOnly

  const peek = sheetState === 'peek'

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-hidden animate-slide-up">
      {/* Map backdrop */}
      <div className="absolute inset-0 z-0">
        <MapBackdrop />
        <MapPins providers={list.slice(0, 12)} city={city} />
        {/* Tappable area — when sheet is in peek, this catches taps to open full map */}
        {peek && (
          <button
            onClick={onMap}
            className="absolute inset-0 z-10"
            aria-label="Open full map"
          />
        )}
      </div>

      {/* Floating header — back + search + map toggle */}
      <div className="absolute top-0 inset-x-0 z-30 px-3 pt-12 pb-3 flex items-center gap-2">
        <button
          onClick={onBack}
          className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-canvas shadow-soft shrink-0"
          aria-label="Back"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <div className="flex-1 flex items-center gap-2.5 h-10 px-3.5 rounded-full bg-canvas border border-line/70 shadow-soft">
          <Search size={14.5} className="text-ink-muted" strokeWidth={1.9} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('explore.search.placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-[13px] placeholder:text-ink-muted"
          />
          {q && (
            <button onClick={() => setQ('')} className="h-6 w-6 grid place-items-center rounded-full bg-surface-higher">
              <X size={11} className="text-ink-muted" strokeWidth={2.4} />
            </button>
          )}
        </div>
        <button
          onClick={onMap}
          className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-canvas shadow-soft shrink-0"
          aria-label="Open map"
        >
          <MapIcon size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Bottom sheet — results + filters */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-canvas border-t border-line/70 rounded-t-3xl shadow-[0_-12px_32px_-16px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out
          ${peek ? 'translate-y-[calc(100%-160px)]' : 'translate-y-0'}`}
        style={{ height: 'calc(100% - 92px)' }}
      >
        {/* Drag handle — tap to toggle peek */}
        <button
          onClick={() => setSheetState(peek ? 'expanded' : 'peek')}
          className="w-full pt-3 pb-2 grid place-items-center"
          aria-label={peek ? 'Expand results' : 'Show map'}
        >
          <span className="h-1 w-10 rounded-full bg-line-strong" />
        </button>

        {/* Filter chips */}
        <div className="px-1">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-1">
            <DropChip active={sort !== 'recommended'} onClick={() => setFilterSheet('sort')}>
              {sort === 'recommended' ? 'Sort' : SORT_LABEL[sort]}
            </DropChip>
            <DropChip active={category !== 'all'} onClick={() => setFilterSheet('category')}>
              {category === 'all' ? 'Category' : CATEGORIES.find((c) => c.id === category)?.name ?? 'Category'}
            </DropChip>
            <DropChip active={city !== 'All cities'} onClick={() => setFilterSheet('city')}>
              {city === 'All cities' ? 'City' : city}
            </DropChip>
            <ToggleChip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
              Verified
            </ToggleChip>
            {filtersActive && (
              <button
                onClick={() => {
                  setSort('recommended')
                  setCity('All cities')
                  setCategory('all')
                  setVerifiedOnly(false)
                }}
                className="shrink-0 inline-flex items-center gap-1 px-3 h-9 text-[12px] font-semibold leading-none text-ink-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results header — count + map link */}
        <div className="px-5 pt-2 pb-1 flex items-baseline justify-between">
          <div className="text-[11.5px] text-ink-dim font-medium">
            {list.length} {list.length === 1 ? 'result' : 'results'}
            {q.trim() && <> for "<span className="text-ink">{q.trim()}</span>"</>}
          </div>
          <button
            onClick={onMap}
            className="text-[11.5px] font-semibold text-ink inline-flex items-center gap-1"
          >
            <MapIcon size={11} strokeWidth={2.4} />
            Map view
          </button>
        </div>

        {/* Scrollable results */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-28" style={{ maxHeight: 'calc(100% - 128px)' }}>
          {list.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-5 pt-3">
              {list.map((p) => (
                <ProviderRow key={p.id} provider={p} onClick={() => go({ kind: 'provider', providerId: p.id })} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter sheets */}
      {filterSheet === 'sort' && (
        <Sheet title={t('sheet.sortBy')} onClose={() => setFilterSheet(null)}>
          {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
            <SheetRow key={s} label={SORT_LABEL[s]} selected={sort === s} onClick={() => { setSort(s); setFilterSheet(null) }} />
          ))}
        </Sheet>
      )}
      {filterSheet === 'city' && (
        <Sheet title={t('sheet.city')} onClose={() => setFilterSheet(null)}>
          {cityOptions.map((c) => (
            <SheetRow key={c} label={c} selected={city === c} onClick={() => { setCity(c); setFilterSheet(null) }} />
          ))}
        </Sheet>
      )}
      {filterSheet === 'category' && (
        <Sheet title={t('sheet.category')} onClose={() => setFilterSheet(null)}>
          <SheetRow label="All categories" selected={category === 'all'} onClick={() => { setCategory('all'); setFilterSheet(null) }} />
          {CATEGORIES.map((c) => (
            <SheetRow key={c.id} label={c.name} selected={category === c.id} onClick={() => { setCategory(c.id); setFilterSheet(null) }} />
          ))}
        </Sheet>
      )}
    </div>
  )
}

/* ────────── Map backdrop & pins ────────── */

function MapBackdrop() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-tropic-10 via-sand-10 to-pebble-10 dark:from-[#15171c] dark:via-[#0f1115] dark:to-[#191b21]">
      {/* Streets — bright on light, dim teal on dark. */}
      <div className="absolute h-[3px] left-[-10%] right-[-10%] bg-white/85 dark:bg-white/12 rounded-full -rotate-[6deg]" style={{ top: '24%' }} />
      <div className="absolute h-[2px] left-[-10%] right-[-10%] bg-white/70 dark:bg-white/10 rounded-full rotate-[10deg]" style={{ top: '46%' }} />
      <div className="absolute h-[2px] left-[-10%] right-[-10%] bg-white/65 dark:bg-white/8 rounded-full -rotate-[14deg]" style={{ top: '68%' }} />
      <div className="absolute w-[2.5px] top-[-10%] bottom-[-10%] bg-white/80 dark:bg-white/12 rounded-full" style={{ left: '30%' }} />
      <div className="absolute w-[2px] top-[-10%] bottom-[-10%] bg-white/70 dark:bg-white/10 rounded-full" style={{ left: '70%' }} />
      {/* Grid */}
      <div
        className="absolute inset-0 dark:opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Park blobs */}
      <div className="absolute h-16 w-20 rounded-[40%] bg-moss-20/80 dark:bg-moss-70/50" style={{ top: '8%', right: '6%' }} />
      <div className="absolute h-12 w-14 rounded-[45%] bg-moss-20/60 dark:bg-moss-70/40" style={{ bottom: '24%', left: '14%' }} />
      {/* Water */}
      <div className="absolute h-24 w-28 rounded-[55%] bg-ocean-20/40 dark:bg-ocean-70/40" style={{ top: '36%', left: '-8%' }} />
    </div>
  )
}

const CITY_CENTERS: Record<string, LatLng> = {
  Yangon: { lat: 16.84, lng: 96.16 },
  Mandalay: { lat: 21.97, lng: 96.08 },
  Naypyidaw: { lat: 19.76, lng: 96.10 },
}

function MapPins({ providers, city }: { providers: Provider[]; city: string }) {
  const center = CITY_CENTERS[city] ?? CITY_CENTERS.Yangon
  const points = providers.map((p) => ({ provider: p, coord: p.coords ?? center }))
  if (points.length === 0) return null

  const lats = points.map((pt) => pt.coord.lat)
  const lngs = points.map((pt) => pt.coord.lng)
  const padLat = 0.012
  const padLng = 0.018
  const minLat = Math.min(...lats) - padLat
  const maxLat = Math.max(...lats) + padLat
  const minLng = Math.min(...lngs) - padLng
  const maxLng = Math.max(...lngs) + padLng
  const spanLat = Math.max(maxLat - minLat, 0.001)
  const spanLng = Math.max(maxLng - minLng, 0.001)

  return (
    <>
      {points.map(({ provider, coord }) => {
        // Pins live in the top ~42% of screen (so they sit above the sheet's peek position).
        const x = ((coord.lng - minLng) / spanLng) * 100
        const y = (1 - (coord.lat - minLat) / spanLat) * 100
        return (
          <div
            key={provider.id}
            className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{ left: `${x}%`, top: `${20 + y * 0.35}%` }}
          >
            <div className="relative">
              <span className="relative inline-flex items-center justify-center gap-0.5 h-7 min-w-[40px] px-2 rounded-full bg-canvas text-ink border-2 border-rust-50 shadow-soft">
                <Star size={9} strokeWidth={0} fill="currentColor" />
                <span className="text-[10.5px] font-bold tabular-nums leading-none">{provider.rating.toFixed(1)}</span>
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-1.5 w-1.5 rotate-45 bg-canvas border-r-2 border-b-2 border-rust-50" />
            </div>
          </div>
        )
      })}
    </>
  )
}

/* ────────── Filter UI ────────── */

function DropChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
    </button>
  )
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[85%] overflow-y-auto">
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
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
    <div className="py-14 text-center px-6">
      <div className="mx-auto h-12 w-12 rounded-full border border-line grid place-items-center mb-4">
        <Search size={18} className="text-ink-muted" strokeWidth={1.8} />
      </div>
      <h2 className="font-serif text-[18px] font-semibold tracking-tight">{t('explore.empty.title')}</h2>
      <p className="text-[12.5px] text-ink-muted mt-1.5 max-w-[240px] mx-auto">{t('explore.empty.sub')}</p>
    </div>
  )
}
