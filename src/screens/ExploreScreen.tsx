import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X, Star, List as ListIcon, Map as MapIcon, SlidersHorizontal, ChevronDown, Navigation, RefreshCw } from 'lucide-react'
import { ProviderRow } from '../components/ProviderCard'
import { ProviderCover } from '../components/Cover'
import { CATEGORIES, PROVIDERS, CATEGORY_BY_ID, formatMMK, searchProviders, type CategoryId, type Provider, type LatLng } from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

type Mode = 'list' | 'map'
type SheetState = 'hidden' | 'mid' | 'full'

export function ExploreScreen({
  city,
  mode,
  setMode,
  go,
}: {
  city: string
  mode: Mode
  setMode: (m: Mode) => void
  go: (v: View) => void
}) {
  const t = useT()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | CategoryId>('all')

  // Inline filter state
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance')
  const [distanceMax, setDistanceMax] = useState<number | null>(null) // km, null = any
  const [availability, setAvailability] = useState<'any' | 'today' | 'week'>('any')
  const [priceMax, setPriceMax] = useState<number | null>(null) // MMK, null = any
  // Behind ⚙ Filter modal
  const [minRating, setMinRating] = useState<number | null>(null)
  const [openNowOnly, setOpenNowOnly] = useState(false)
  const [instantOnly, setInstantOnly] = useState(false)
  const [freeCancelOnly, setFreeCancelOnly] = useState(false)
  const [duration, setDuration] = useState<'any' | 'short' | 'mid' | 'long' | 'xlong'>('any')
  const [language, setLanguage] = useState<'any' | 'en' | 'mm'>('any')
  const [walkInOnly, setWalkInOnly] = useState(false)
  const [parkingOnly, setParkingOnly] = useState(false)
  // Which picker / modal is open
  const [pickerOpen, setPickerOpen] = useState<null | 'sort' | 'distance' | 'availability' | 'price' | 'category' | 'all'>(null)

  const activeFilterCount =
    (minRating != null ? 1 : 0) +
    (openNowOnly ? 1 : 0) +
    (instantOnly ? 1 : 0) +
    (freeCancelOnly ? 1 : 0) +
    (duration !== 'any' ? 1 : 0) +
    (language !== 'any' ? 1 : 0) +
    (walkInOnly ? 1 : 0) +
    (parkingOnly ? 1 : 0)

  const anyChipActive =
    sortBy !== 'distance' ||
    distanceMax != null ||
    availability !== 'any' ||
    priceMax != null ||
    filter !== 'all' ||
    activeFilterCount > 0

  const clearAllFilters = () => {
    setFilter('all')
    setSortBy('distance')
    setDistanceMax(null)
    setAvailability('any')
    setPriceMax(null)
    setMinRating(null)
    setOpenNowOnly(false)
    setInstantOnly(false)
    setFreeCancelOnly(false)
    setDuration('any')
    setLanguage('any')
    setWalkInOnly(false)
    setParkingOnly(false)
  }

  /** City + search + category + chip filters, then sorted by chosen order. */
  const list = useMemo(() => {
    let base: Provider[] = PROVIDERS
    if (city && city !== 'All cities') {
      base = base.filter((p) => p.city === city)
    }
    if (q.trim()) {
      const searched = new Set(searchProviders(q).map((p) => p.id))
      base = base.filter((p) => searched.has(p.id))
    } else if (filter !== 'all') {
      base = base.filter((p) => p.category === filter)
    }
    if (distanceMax != null) {
      base = base.filter((p) => p.distanceKm <= distanceMax)
    }
    if (priceMax != null) {
      base = base.filter((p) => Math.min(...p.services.map((s) => s.price)) <= priceMax)
    }
    if (minRating != null) {
      base = base.filter((p) => p.rating >= minRating)
    }
    if (instantOnly) {
      base = base.filter((p) => p.instantConfirm)
    }
    if (duration !== 'any') {
      const fits = (m: number) => {
        if (duration === 'short') return m < 30
        if (duration === 'mid') return m >= 30 && m <= 60
        if (duration === 'long') return m > 60 && m <= 120
        return m > 120 // xlong
      }
      base = base.filter((p) => p.services.some((s) => fits(s.duration)))
    }
    // openNow / freeCancel / availability / language / walkIn / parking
    // — mock pass-through (no rich data), kept as toggles for the design.

    return [...base].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price') {
        const ap = Math.min(...a.services.map((s) => s.price))
        const bp = Math.min(...b.services.map((s) => s.price))
        return ap - bp
      }
      return a.distanceKm - b.distanceKm
    })
  }, [q, filter, city, distanceMax, priceMax, minRating, instantOnly, duration, sortBy])

  /* ───── Sheet drag state ───── */

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerH, setContainerH] = useState(0)
  const [sheet, setSheet] = useState<SheetState>(mode === 'list' ? 'full' : 'mid')
  const [dragDelta, setDragDelta] = useState<number | null>(null)
  const dragStart = useRef<{ y: number; base: number } | null>(null)

  // Sync external mode → internal sheet state.
  useEffect(() => {
    if (mode === 'list') setSheet('full')
    else if (mode === 'map') setSheet('hidden')
  }, [mode])

  // Mirror sheet → external mode so the TopBar / nav stay in sync.
  useEffect(() => {
    if (sheet === 'full' && mode !== 'list') setMode('list')
    if (sheet !== 'full' && mode !== 'map') setMode('map')
  }, [sheet]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track container height for snap-point math.
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const update = () => setContainerH(el.clientHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Sheet sits flush at bottom: 0 and tucks behind the BottomNav (solid bg).
  // PEEK reveals the drag handle + filter-chip row above the nav (no list).
  const NAV_H = 78
  const CHIPS_VISIBLE = 74 // drag handle (~22) + filter chips (~52)
  const PEEK = NAV_H + CHIPS_VISIBLE
  const HEADER_SPACE = 132 // search pill + safe-area top padding
  const fullH = Math.max(containerH - HEADER_SPACE, PEEK)
  const midH = Math.max(containerH * 0.5, PEEK)
  const hiddenH = PEEK

  const baseH = sheet === 'full' ? fullH : sheet === 'mid' ? midH : hiddenH
  const liveH = dragDelta == null
    ? baseH
    : Math.max(hiddenH, Math.min(fullH, baseH - dragDelta))

  function onPointerDown(e: React.PointerEvent) {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    dragStart.current = { y: e.clientY, base: baseH }
    setDragDelta(0)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragStart.current) return
    setDragDelta(e.clientY - dragStart.current.y)
  }
  function onPointerUp() {
    if (dragStart.current == null) return
    const final = liveH
    const points: Array<[SheetState, number]> = [
      ['hidden', hiddenH],
      ['mid', midH],
      ['full', fullH],
    ]
    let nearest: SheetState = 'mid'
    let min = Infinity
    for (const [s, h] of points) {
      const d = Math.abs(h - final)
      if (d < min) { min = d; nearest = s }
    }
    dragStart.current = null
    setDragDelta(null)
    setSheet(nearest)
  }

  const sheetTransition = dragDelta == null ? 'height 260ms cubic-bezier(.22,.61,.36,1)' : 'none'

  const [anyPinVisible, setAnyPinVisible] = useState(true)
  const [recenterTick, setRecenterTick] = useState(0)
  const recenter = () => setRecenterTick((t) => t + 1)
  // Mini card actually visible? = sheet not full AND list non-empty AND a pin is on screen.
  const miniCardShown = sheet !== 'full' && list.length > 0 && anyPinVisible
  // No-pin pill shown? = sheet not full AND list non-empty AND no pin visible.
  const noPinPillShown = sheet !== 'full' && list.length > 0 && !anyPinVisible

  return (
    <div ref={containerRef} className="relative h-full overflow-hidden animate-fade-in">
      {/* ── Map (full-bleed background) ── */}
      <div className="absolute inset-0">
        <MapCanvas
          city={city}
          list={list}
          go={go}
          sheetH={liveH}
          showMiniCard={sheet !== 'full' && list.length > 0}
          onPinVisibilityChange={setAnyPinVisible}
          recenterTick={recenterTick}
        />
      </div>

      {/* Current-location button — stacks above whatever pill is showing */}
      {sheet !== 'full' && (
        <button
          onClick={recenter}
          className="absolute right-3 z-20 h-11 w-11 rounded-full bg-canvas border border-line/70 shadow-soft grid place-items-center"
          style={{
            bottom: liveH + 28 + (miniCardShown ? 84 : noPinPillShown ? 56 : 0),
            transition: sheetTransition.replace('height', 'bottom'),
          }}
          aria-label="My location"
        >
          <Navigation size={16} strokeWidth={2} className="text-ink" />
        </button>
      )}

      {/* No-results floating pill over the map */}
      {q && list.length === 0 && sheet !== 'full' && (
        <div className="absolute inset-x-0 top-[140px] z-30 flex justify-center pointer-events-none">
          <button
            onClick={() => setQ('')}
            className="pointer-events-auto inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-canvas/95 backdrop-blur border border-line/70 shadow-soft text-[12px]"
          >
            <span className="text-ink font-medium">{t('explore.zeroResults')}</span>
            <span className="text-ink-dim">·</span>
            <span className="text-brand font-semibold">{t('explore.clearSearch')}</span>
          </button>
        </div>
      )}

      {/* ── Top: combined search pill with view-toggle ── */}
      <div className="absolute top-0 inset-x-0 z-40 px-4 pt-12 pb-2 bg-gradient-to-b from-canvas/90 via-canvas/55 to-transparent">
        <div
          className={`flex items-center gap-2 pl-2 pr-2 rounded-full bg-canvas/95 backdrop-blur border border-line/70 shadow-soft transition-[padding] duration-300 ease-out ${
            sheet === 'full' ? 'py-1.5' : 'py-2'
          }`}
        >
          <div
            className={`grid place-items-center rounded-full bg-surface-elevated shrink-0 transition-[height,width] duration-300 ease-out ${
              sheet === 'full' ? 'h-9 w-9' : 'h-10 w-10'
            }`}
          >
            <Search size={sheet === 'full' ? 16 : 18} className="text-ink transition-all duration-300" strokeWidth={2.1} />
          </div>

          <div className="flex-1 min-w-0">
            {sheet === 'full' ? (
              <div className="flex items-baseline gap-1 min-w-0">
                <label className="relative inline-block leading-tight">
                  <span className="invisible whitespace-pre text-[13.5px] font-semibold">
                    {q || t('explore.search.placeholder')}
                  </span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t('explore.search.placeholder')}
                    className="absolute inset-0 w-full bg-transparent border-none outline-none p-0 text-[13.5px] font-semibold text-ink placeholder:text-ink placeholder:font-semibold"
                  />
                </label>
                <span className="text-[13.5px] text-ink-muted leading-tight truncate">· Current location</span>
              </div>
            ) : (
              <>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('explore.search.placeholder')}
                  className="w-full bg-transparent border-none outline-none text-[13.5px] font-semibold text-ink leading-tight placeholder:text-ink placeholder:font-semibold"
                />
                <div className="text-[11.5px] text-ink-muted leading-tight mt-0.5 truncate">{t('explore.mapArea')}</div>
              </>
            )}
          </div>

          {q ? (
            <button
              onClick={() => setQ('')}
              className={`grid place-items-center rounded-full border border-line/70 shrink-0 transition-[height,width] duration-300 ease-out ${
                sheet === 'full' ? 'h-8 w-8' : 'h-9 w-9'
              }`}
              aria-label="Clear search"
            >
              <X size={13} className="text-ink-muted" strokeWidth={2.2} />
            </button>
          ) : (
            <button
              onClick={() => setSheet(sheet === 'full' ? 'hidden' : 'full')}
              className={`grid place-items-center rounded-full border border-line/70 shrink-0 transition-[height,width] duration-300 ease-out ${
                sheet === 'full' ? 'h-8 w-8' : 'h-9 w-9'
              }`}
              aria-label={sheet === 'full' ? 'Show map' : 'Show list'}
            >
              {sheet === 'full' ? (
                <MapIcon size={14} className="text-ink" strokeWidth={1.9} />
              ) : (
                <ListIcon size={14} className="text-ink" strokeWidth={1.9} />
              )}
            </button>
          )}
        </div>

        {/* Category filter row — hidden in list view to avoid stacking with
            the sheet header. Map view keeps them as a quick top filter.
            Negative margins let the row bleed to screen edges; inner padding
            gives the chips breathing room from those edges. */}
        {sheet !== 'full' && (
          <div className="relative mt-2.5 -mx-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 px-4">
              <CategoryFilterChip
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                label={t('explore.filter.all')}
              />
              {CATEGORIES.map((c) => (
                <CategoryFilterChip
                  key={c.id}
                  active={filter === c.id}
                  onClick={() => setFilter(c.id)}
                  Icon={c.Icon}
                  label={c.name}
                />
              ))}
              <span className="shrink-0 w-2" aria-hidden />
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-canvas to-transparent" />
          </div>
        )}

      </div>

      {/* ── Draggable bottom sheet ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 bg-canvas rounded-t-3xl border-t border-line/70 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.18)] flex flex-col"
        style={{ height: liveH, transition: sheetTransition }}
      >
        <div
          className="shrink-0 pt-2 pb-2 px-5 flex flex-col items-center gap-3 select-none touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="h-[3px] w-10 rounded-full bg-line/80" />
          {sheet !== 'hidden' && (
            <div className="w-full text-center">
              <div className="text-[12.5px] font-semibold text-ink">
                {t('explore.venuesNearby', { count: list.length })}
              </div>
            </div>
          )}
        </div>

        {/* Filter row — sliders + Sort / Distance / Availability / Price chips */}
        <div className="shrink-0 px-5 pt-1 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setPickerOpen('all')}
            aria-label="All filters"
            className={`shrink-0 inline-flex items-center gap-1.5 h-8 rounded-full transition
              ${activeFilterCount > 0
                ? 'bg-ink text-canvas pl-2.5 pr-1'
                : 'bg-canvas text-ink border border-line/70 w-8 justify-center'}`}
          >
            <SlidersHorizontal size={13} strokeWidth={2.1} />
            {activeFilterCount > 0 && (
              <span className="h-5 min-w-5 px-1.5 grid place-items-center rounded-full bg-canvas text-ink text-[11px] font-bold tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>
          {anyChipActive && (
            <button
              onClick={clearAllFilters}
              className="shrink-0 h-8 w-8 grid place-items-center rounded-full border border-line/70 bg-canvas"
              aria-label="Clear all filters"
            >
              <X size={12} strokeWidth={2.4} className="text-ink" />
            </button>
          )}
          <FilterChip
            label={sortBy === 'distance' ? 'Nearest' : sortBy === 'rating' ? 'Top rated' : 'Lowest price'}
            active={sortBy !== 'distance'}
            onClick={() => setPickerOpen('sort')}
          />
          <FilterChip
            label={filter === 'all' ? 'Category' : (CATEGORIES.find((c) => c.id === filter)?.name ?? 'Category')}
            active={filter !== 'all'}
            Icon={filter === 'all' ? undefined : CATEGORIES.find((c) => c.id === filter)?.Icon}
            onClick={() => setPickerOpen('category')}
          />
          <FilterChip
            label={distanceMax == null ? 'Distance' : `≤ ${distanceMax} km`}
            active={distanceMax != null}
            onClick={() => setPickerOpen('distance')}
          />
          <FilterChip
            label={availability === 'any' ? 'Availability' : availability === 'today' ? 'Today' : 'This week'}
            active={availability !== 'any'}
            onClick={() => setPickerOpen('availability')}
          />
          <FilterChip
            label={priceMax == null ? 'Price' : `≤ ${formatMMK(priceMax)}`}
            active={priceMax != null}
            onClick={() => setPickerOpen('price')}
          />
        </div>

        {sheet !== 'hidden' && (
          <div className="flex-1 overflow-y-auto scrollbar-hide px-5" style={{ paddingBottom: NAV_H + 24 }}>
            {list.length === 0 ? (
              <NoMatch hasQuery={!!q} onClear={() => setQ('')} />
            ) : (
              <div className="space-y-5 pt-1">
                {list.map((p) => (
                  <ProviderRow key={p.id} provider={p} onClick={() => go({ kind: 'provider', providerId: p.id })} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter picker sheets */}
      {pickerOpen === 'sort' && (
        <PickerSheet title="Sort by" onClose={() => setPickerOpen(null)}>
          <PickerOption label="Nearest" selected={sortBy === 'distance'} onClick={() => { setSortBy('distance'); setPickerOpen(null) }} />
          <PickerOption label="Top rated" selected={sortBy === 'rating'} onClick={() => { setSortBy('rating'); setPickerOpen(null) }} />
          <PickerOption label="Lowest price" selected={sortBy === 'price'} onClick={() => { setSortBy('price'); setPickerOpen(null) }} />
        </PickerSheet>
      )}
      {pickerOpen === 'distance' && (
        <PickerSheet title="Distance" onClose={() => setPickerOpen(null)}>
          <PickerOption label="Any distance" selected={distanceMax == null} onClick={() => { setDistanceMax(null); setPickerOpen(null) }} />
          <PickerOption label="Within 1 km" selected={distanceMax === 1} onClick={() => { setDistanceMax(1); setPickerOpen(null) }} />
          <PickerOption label="Within 2 km" selected={distanceMax === 2} onClick={() => { setDistanceMax(2); setPickerOpen(null) }} />
          <PickerOption label="Within 5 km" selected={distanceMax === 5} onClick={() => { setDistanceMax(5); setPickerOpen(null) }} />
          <PickerOption label="Within 10 km" selected={distanceMax === 10} onClick={() => { setDistanceMax(10); setPickerOpen(null) }} />
        </PickerSheet>
      )}
      {pickerOpen === 'availability' && (
        <PickerSheet title="Availability" onClose={() => setPickerOpen(null)}>
          <PickerOption label="Anytime" selected={availability === 'any'} onClick={() => { setAvailability('any'); setPickerOpen(null) }} />
          <PickerOption label="Today" selected={availability === 'today'} onClick={() => { setAvailability('today'); setPickerOpen(null) }} />
          <PickerOption label="This week" selected={availability === 'week'} onClick={() => { setAvailability('week'); setPickerOpen(null) }} />
        </PickerSheet>
      )}
      {pickerOpen === 'category' && (
        <PickerSheet title="Category" onClose={() => setPickerOpen(null)}>
          <PickerOption label={t('explore.filter.all')} selected={filter === 'all'} onClick={() => { setFilter('all'); setPickerOpen(null) }} />
          {CATEGORIES.map((c) => (
            <PickerOption
              key={c.id}
              label={c.name}
              selected={filter === c.id}
              onClick={() => { setFilter(c.id); setPickerOpen(null) }}
            />
          ))}
        </PickerSheet>
      )}
      {pickerOpen === 'price' && (
        <PickerSheet title="Price" onClose={() => setPickerOpen(null)}>
          <PickerOption label="Any price" selected={priceMax == null} onClick={() => { setPriceMax(null); setPickerOpen(null) }} />
          <PickerOption label="Under 20,000 MMK" selected={priceMax === 20000} onClick={() => { setPriceMax(20000); setPickerOpen(null) }} />
          <PickerOption label="Under 50,000 MMK" selected={priceMax === 50000} onClick={() => { setPriceMax(50000); setPickerOpen(null) }} />
          <PickerOption label="Under 100,000 MMK" selected={priceMax === 100000} onClick={() => { setPriceMax(100000); setPickerOpen(null) }} />
          <PickerOption label="Under 200,000 MMK" selected={priceMax === 200000} onClick={() => { setPriceMax(200000); setPickerOpen(null) }} />
        </PickerSheet>
      )}
      {pickerOpen === 'all' && (
        <AllFiltersSheet
          onClose={() => setPickerOpen(null)}
          minRating={minRating}
          setMinRating={setMinRating}
          openNowOnly={openNowOnly}
          setOpenNowOnly={setOpenNowOnly}
          instantOnly={instantOnly}
          setInstantOnly={setInstantOnly}
          freeCancelOnly={freeCancelOnly}
          setFreeCancelOnly={setFreeCancelOnly}
          duration={duration}
          setDuration={setDuration}
          language={language}
          setLanguage={setLanguage}
          walkInOnly={walkInOnly}
          setWalkInOnly={setWalkInOnly}
          parkingOnly={parkingOnly}
          setParkingOnly={setParkingOnly}
          onClear={() => {
            setMinRating(null); setOpenNowOnly(false); setInstantOnly(false); setFreeCancelOnly(false)
            setDuration('any'); setLanguage('any'); setWalkInOnly(false); setParkingOnly(false)
          }}
        />
      )}
    </div>
  )
}

/* ─────────── Filter picker sheets ─────────── */

function PickerSheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-8 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full border border-line/70"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
        <div className="kicker mb-1">Filter</div>
        <h2 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold mb-4">{title}</h2>
        <div className="divide-y divide-line/60 border-y border-line/60">
          {children}
        </div>
      </div>
    </div>
  )
}

function PickerOption({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <span className={`text-[14px] ${selected ? 'font-semibold text-ink' : 'text-ink-muted'}`}>
        {label}
      </span>
      {selected && (
        <span className="h-5 w-5 rounded-full bg-ink grid place-items-center">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5L4.5 8L9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-canvas" />
          </svg>
        </span>
      )}
    </button>
  )
}

type Duration = 'any' | 'short' | 'mid' | 'long' | 'xlong'
type Lang = 'any' | 'en' | 'mm'

function AllFiltersSheet({
  onClose,
  minRating, setMinRating,
  openNowOnly, setOpenNowOnly,
  instantOnly, setInstantOnly,
  freeCancelOnly, setFreeCancelOnly,
  duration, setDuration,
  language, setLanguage,
  walkInOnly, setWalkInOnly,
  parkingOnly, setParkingOnly,
  onClear,
}: {
  onClose: () => void
  minRating: number | null
  setMinRating: (v: number | null) => void
  openNowOnly: boolean
  setOpenNowOnly: (v: boolean) => void
  instantOnly: boolean
  setInstantOnly: (v: boolean) => void
  freeCancelOnly: boolean
  setFreeCancelOnly: (v: boolean) => void
  duration: Duration
  setDuration: (v: Duration) => void
  language: Lang
  setLanguage: (v: Lang) => void
  walkInOnly: boolean
  setWalkInOnly: (v: boolean) => void
  parkingOnly: boolean
  setParkingOnly: (v: boolean) => void
  onClear: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-6 animate-slide-up max-h-[80%] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full border border-line/70"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
        <div className="kicker mb-1">Filters</div>
        <h2 className="font-serif text-[24px] leading-[1.05] tracking-tight font-semibold mb-5">All filters</h2>

        {/* Minimum rating */}
        <section className="mb-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-muted mb-2.5">Minimum rating</div>
          <div className="flex gap-2 flex-wrap">
            {[null, 3, 4, 4.5].map((r) => (
              <button
                key={String(r)}
                onClick={() => setMinRating(r)}
                className={`inline-flex items-center gap-1 h-8 px-3 rounded-full text-[11.5px] font-semibold transition
                  ${minRating === r
                    ? 'bg-ink text-canvas'
                    : 'bg-canvas border border-line/70 text-ink'}`}
              >
                {r == null ? 'Any' : (
                  <>
                    <Star size={11} strokeWidth={0} fill="currentColor" className={minRating === r ? 'text-canvas' : 'text-rust-50'} />
                    {r}+
                  </>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Service duration */}
        <section className="mb-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-muted mb-2.5">Service duration</div>
          <div className="flex gap-2 flex-wrap">
            {([
              ['any', 'Any'],
              ['short', 'Under 30 min'],
              ['mid', '30–60 min'],
              ['long', '1–2 hr'],
              ['xlong', 'Over 2 hr'],
            ] as [Duration, string][]).map(([v, lbl]) => (
              <button
                key={v}
                onClick={() => setDuration(v)}
                className={`inline-flex items-center h-8 px-3 rounded-full bg-canvas text-ink text-[11.5px] font-semibold transition
                  ${duration === v ? 'border-[1.5px] border-ink' : 'border border-line/70'}`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="mb-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-muted mb-2.5">Languages spoken</div>
          <div className="flex gap-2">
            {([
              ['any', 'Any'],
              ['en', 'English'],
              ['mm', 'Burmese'],
            ] as [Lang, string][]).map(([v, lbl]) => (
              <button
                key={v}
                onClick={() => setLanguage(v)}
                className={`inline-flex items-center h-8 px-3 rounded-full bg-canvas text-ink text-[11.5px] font-semibold transition
                  ${language === v ? 'border-[1.5px] border-ink' : 'border border-line/70'}`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </section>

        {/* Toggle filters */}
        <section className="mb-6 divide-y divide-line/60 border-y border-line/60">
          <ToggleRow label="Open now" sub="Only places open right now" value={openNowOnly} onChange={setOpenNowOnly} />
          <ToggleRow label="Instant booking" sub="Confirms immediately" value={instantOnly} onChange={setInstantOnly} />
          <ToggleRow label="Free cancellation" sub="Cancel up to 2h before with no fee" value={freeCancelOnly} onChange={setFreeCancelOnly} />
          <ToggleRow label="Walk-in welcome" sub="No appointment needed" value={walkInOnly} onChange={setWalkInOnly} />
          <ToggleRow label="Parking available" sub="On-site or nearby parking" value={parkingOnly} onChange={setParkingOnly} />
        </section>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onClear}
            className="h-12 rounded-full border border-line/70 text-[13px] font-semibold leading-none inline-flex items-center justify-center"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="h-12 rounded-full bg-ink text-canvas text-[13px] font-semibold leading-none inline-flex items-center justify-center"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  label, sub, value, onChange,
}: {
  label: string
  sub: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center gap-3 py-4 text-left"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold tracking-tight">{label}</div>
        <div className="text-[11.5px] text-ink-muted mt-0.5 truncate">{sub}</div>
      </div>
      <span className={`shrink-0 h-6 w-10 rounded-full p-0.5 transition ${value ? 'bg-ink' : 'bg-surface-higher'}`}>
        <span className={`block h-5 w-5 rounded-full bg-canvas transition-transform shadow-soft ${value ? 'translate-x-4' : 'translate-x-0'}`} />
      </span>
    </button>
  )
}

/* ────────── Map canvas ────────── */

/** Default city centers used when no providers anchor the bounding box. */
const CITY_CENTERS: Record<string, LatLng> = {
  Yangon: { lat: 16.84, lng: 96.16 },
  Mandalay: { lat: 21.97, lng: 96.08 },
  Naypyidaw: { lat: 19.76, lng: 96.10 },
}

function MapCanvas({
  city,
  list,
  go,
  sheetH,
  showMiniCard,
  onPinVisibilityChange,
  recenterTick,
}: {
  city: string
  list: Provider[]
  go: (v: View) => void
  sheetH: number
  showMiniCard: boolean
  onPinVisibilityChange?: (visible: boolean) => void
  recenterTick?: number
}) {
  const t = useT()
  const center = CITY_CENTERS[city] ?? CITY_CENTERS.Yangon
  const points = list.map((p) => ({ provider: p, coord: p.coords ?? center }))

  const lats = points.map((pt) => pt.coord.lat)
  const lngs = points.map((pt) => pt.coord.lng)
  // Generous padding so pins spread across the canvas instead of crowding a diagonal.
  const padLat = 0.025
  const padLng = 0.03
  const minLat = (lats.length ? Math.min(...lats) : center.lat) - padLat
  const maxLat = (lats.length ? Math.max(...lats) : center.lat) + padLat
  const minLng = (lngs.length ? Math.min(...lngs) : center.lng) - padLng
  const maxLng = (lngs.length ? Math.max(...lngs) : center.lng) + padLng
  const spanLat = Math.max(maxLat - minLat, 0.001)
  const spanLng = Math.max(maxLng - minLng, 0.001)

  // Deterministic small jitter per provider so identical-coord pins don't stack.
  const jitter = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
    const jx = ((h % 1000) / 1000 - 0.5) * 14 // ±7%
    const jy = (((h >> 10) % 1000) / 1000 - 0.5) * 14
    return { jx, jy }
  }

  const [activeId, setActiveId] = useState<string | null>(points[0]?.provider.id ?? null)
  useEffect(() => {
    if (!points.find((pt) => pt.provider.id === activeId)) {
      setActiveId(points[0]?.provider.id ?? null)
    }
  }, [list]) // eslint-disable-line react-hooks/exhaustive-deps

  const active = points.find((pt) => pt.provider.id === activeId)?.provider ?? null

  // Pan/drag state for the map canvas.
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number; moved: boolean } | null>(null)
  const panEndTimer = useRef<number | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!mapRef.current) return
    const el = mapRef.current
    const update = () => setMapSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Compute which pins are currently inside the visible viewport given the pan offset.
  const visibleArea = mapSize.h - sheetH
  const anyPinVisible = mapSize.w > 0 && points.some(({ provider, coord }) => {
    const { jx, jy } = jitter(provider.id)
    const rawY = (1 - (coord.lat - minLat) / spanLat) * 48 + 12
    const rawX = ((coord.lng - minLng) / spanLng) * 80 + 10
    const xPct = Math.max(8, Math.min(92, rawX + jx))
    const yPct = Math.max(12, Math.min(60, rawY + jy * 0.6))
    const px = (xPct / 100) * mapSize.w + pan.x
    const py = (yPct / 100) * mapSize.h + pan.y
    return px > 0 && px < mapSize.w && py > 0 && py < visibleArea
  })

  function recenter() {
    setPan({ x: 0, y: 0 })
  }

  useEffect(() => {
    onPinVisibilityChange?.(anyPinVisible)
  }, [anyPinVisible, onPinVisibilityChange])

  // Parent can request a recenter by bumping `recenterTick`.
  useEffect(() => {
    if (recenterTick === undefined || recenterTick === 0) return
    setPan({ x: 0, y: 0 })
  }, [recenterTick])

  function onMapPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('[data-pin]')) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    panRef.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y, moved: false }
  }
  function onMapPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!panRef.current) return
    const dx = e.clientX - panRef.current.startX
    const dy = e.clientY - panRef.current.startY
    if (!panRef.current.moved && Math.abs(dx) + Math.abs(dy) > 4) {
      panRef.current.moved = true
      setIsPanning(true)
      if (panEndTimer.current) { window.clearTimeout(panEndTimer.current); panEndTimer.current = null }
    }
    if (panRef.current.moved) setPan({ x: panRef.current.baseX + dx, y: panRef.current.baseY + dy })
  }
  function onMapPointerUp() {
    panRef.current = null
    // Linger briefly so the loader doesn't flicker on quick taps.
    if (panEndTimer.current) window.clearTimeout(panEndTimer.current)
    panEndTimer.current = window.setTimeout(() => setIsPanning(false), 350)
  }

  return (
    <div
      ref={mapRef}
      className="relative h-full w-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ background: '#EFE6D2' }}
      onPointerDown={onMapPointerDown}
      onPointerMove={onMapPointerMove}
      onPointerUp={onMapPointerUp}
      onPointerCancel={onMapPointerUp}
    >
      {/* Pan layer — backdrop + pins translate together */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`, willChange: 'transform' }}
      >
        <AppleStyleMap />

        {/* Pins — constrained to the upper portion so they're always visible
            above the sheet + mini-card, regardless of sheet height. */}
        <div className="absolute inset-0">
          {points.map(({ provider, coord }, i) => {
            const { jx, jy } = jitter(provider.id)
            // Compress lat span into top 12%–60% of canvas; X uses 10%–90%.
            const rawY = (1 - (coord.lat - minLat) / spanLat) * 48 + 12
            const rawX = ((coord.lng - minLng) / spanLng) * 80 + 10
            const x = Math.max(8, Math.min(92, rawX + jx))
            const y = Math.max(12, Math.min(60, rawY + jy * 0.6))
            const isActive = provider.id === activeId
            return (
              <button
                key={provider.id}
                data-pin
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setActiveId(provider.id)}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${x}%`, top: `${y}%`, zIndex: isActive ? 30 : 10 + (points.length - i) }}
                aria-label={provider.name}
              >
                <PinMarker rating={provider.rating} active={isActive} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Panning loader — bare three dots, positioned just below the
          category chip row at the top of the map. */}
      {isPanning && (
        <div className="absolute top-[158px] inset-x-0 z-30 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" style={{ animationDelay: '160ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong animate-pulse" style={{ animationDelay: '320ms' }} />
          </div>
        </div>
      )}

      {/* Active-pin mini card — fixed, doesn't pan, only shown while sheet isn't full
          AND there's at least one pin visible in the current map viewport. */}
      {active && showMiniCard && anyPinVisible && (
        <div
          className="absolute inset-x-3 z-20 transition-[bottom]"
          style={{ bottom: sheetH + 12 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ProviderMiniCard provider={active} onOpen={() => go({ kind: 'provider', providerId: active.id })} />
        </div>
      )}

      {/* No-pins-in-view pill — appears when the user has panned away from every place. */}
      {showMiniCard && !anyPinVisible && points.length > 0 && (
        <div
          className="absolute inset-x-0 z-20 flex justify-center transition-[bottom] pointer-events-none"
          style={{ bottom: sheetH + 16 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); recenter() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="pointer-events-auto inline-flex items-center gap-1.5 h-10 pl-3.5 pr-4 rounded-full bg-canvas border border-line/70 shadow-soft text-[12px] font-semibold"
          >
            <span className="text-ink">{t('explore.noPlacesInArea')}</span>
            <span className="text-ink-dim">·</span>
            <span className="inline-flex items-center gap-1 text-brand">
              <RefreshCw size={11} strokeWidth={2.2} />
              {t('explore.recenter')}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

/* Apple Maps-flavored backdrop: tileable city pattern + featured water/parks/labels.
   Sized at -inset-[150%] so the user can pan far in any direction and still see streets. */
function AppleStyleMap() {
  return (
    <svg
      className="absolute -inset-[150%] w-[400%] h-[400%]"
      viewBox="0 0 1200 1800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="map-tile" x="0" y="0" width="200" height="280" patternUnits="userSpaceOnUse">
          <rect width="200" height="280" fill="#EFE6D2" />

          {/* Building blocks */}
          <g fill="#E5DCC4">
            <rect x="14" y="14" width="60" height="42" rx="2" />
            <rect x="84" y="14" width="44" height="32" rx="2" />
            <rect x="140" y="14" width="48" height="42" rx="2" />
            <rect x="14" y="62" width="44" height="22" rx="2" />
            <rect x="68" y="56" width="60" height="28" rx="2" />
            <rect x="140" y="62" width="48" height="22" rx="2" />
            <rect x="14" y="196" width="56" height="36" rx="2" />
            <rect x="82" y="200" width="44" height="32" rx="2" />
            <rect x="138" y="196" width="50" height="38" rx="2" />
            <rect x="14" y="240" width="44" height="22" rx="2" />
            <rect x="68" y="240" width="60" height="22" rx="2" />
            <rect x="140" y="240" width="48" height="22" rx="2" />
          </g>

          {/* Small park */}
          <ellipse cx="36" cy="148" rx="22" ry="16" fill="#CCE4B7" />
          <ellipse cx="172" cy="156" rx="20" ry="14" fill="#CCE4B7" />

          {/* Roads — tileable: pass cleanly through edges */}
          <g strokeLinecap="square" fill="none">
            {/* Major horizontal */}
            <line x1="0" y1="110" x2="200" y2="110" stroke="#D9CFB4" strokeWidth="14" />
            <line x1="0" y1="110" x2="200" y2="110" stroke="#FBF7EE" strokeWidth="10" />
            {/* Major vertical */}
            <line x1="100" y1="0" x2="100" y2="280" stroke="#D9CFB4" strokeWidth="13" />
            <line x1="100" y1="0" x2="100" y2="280" stroke="#FBF7EE" strokeWidth="9.5" />
            {/* Secondary horizontal */}
            <line x1="0" y1="180" x2="200" y2="180" stroke="#E6DCBE" strokeWidth="8" />
            <line x1="0" y1="180" x2="200" y2="180" stroke="#FFFFFF" strokeWidth="5" />
            {/* Minor streets */}
            <line x1="0" y1="40" x2="200" y2="40" stroke="#F2EBD6" strokeWidth="3" />
            <line x1="0" y1="252" x2="200" y2="252" stroke="#F2EBD6" strokeWidth="3" />
            <line x1="40" y1="0" x2="40" y2="280" stroke="#F2EBD6" strokeWidth="3" />
            <line x1="160" y1="0" x2="160" y2="280" stroke="#F2EBD6" strokeWidth="3" />
          </g>
        </pattern>
      </defs>

      {/* Tile fills the whole canvas */}
      <rect width="1200" height="1800" fill="url(#map-tile)" />

      {/* Featured geography sitting over the tile */}
      <g>
        {/* Big river snaking through */}
        <path
          d="M 760 -20 Q 820 200 780 420 Q 720 640 820 880 Q 900 1100 820 1340 Q 780 1560 880 1820"
          stroke="#B6D8E8" strokeWidth="120" strokeLinecap="round" fill="none"
        />
        {/* Lakes */}
        <ellipse cx="220" cy="780" rx="110" ry="70" fill="#B6D8E8" />
        <ellipse cx="1020" cy="320" rx="80" ry="60" fill="#B6D8E8" />
        <ellipse cx="380" cy="1380" rx="95" ry="58" fill="#B6D8E8" />

        {/* Big parks */}
        <path d="M 480 240 Q 600 220 660 300 Q 650 380 560 400 Q 460 380 450 320 Z" fill="#CCE4B7" />
        <path d="M 80 1080 Q 200 1060 260 1140 Q 250 1220 160 1240 Q 60 1220 60 1160 Z" fill="#CCE4B7" />
        <path d="M 980 1480 Q 1120 1470 1160 1560 Q 1130 1640 1020 1640 Q 930 1620 940 1550 Z" fill="#CCE4B7" />
        <ellipse cx="1100" cy="900" rx="60" ry="48" fill="#CCE4B7" />
        <ellipse cx="540" cy="980" rx="50" ry="40" fill="#CCE4B7" />

        {/* Labels */}
        <g fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500">
          <text x="560" y="320" fontSize="13" fill="#8C8472" textAnchor="middle">Hlaing Park</text>
          <text x="160" y="1180" fontSize="13" fill="#8C8472" textAnchor="middle">People's Sq</text>
          <text x="1060" y="1580" fontSize="12" fill="#8C8472" textAnchor="middle">Botataung Park</text>
          <text x="800" y="700" fontSize="14" fill="#6E9BB5" fontStyle="italic" textAnchor="middle">Yangon River</text>
          <text x="220" y="780" fontSize="12" fill="#6E9BB5" fontStyle="italic" textAnchor="middle">Inya Lake</text>
          <text x="380" y="1380" fontSize="11" fill="#6E9BB5" fontStyle="italic" textAnchor="middle">Kandawgyi</text>
          <text x="540" y="990" fontSize="10" fill="#8C8472" textAnchor="middle">Sule</text>
        </g>
      </g>
    </svg>
  )
}

function PinMarker({ rating, active }: { rating: number; active: boolean }) {
  return (
    <div className="relative">
      {active && <span className="absolute inset-0 -m-3 rounded-full bg-rust-50/30 animate-soft-pulse" />}
      <span
        className={`relative inline-flex items-center justify-center gap-0.5 h-8 min-w-[44px] px-2.5 rounded-full shadow-soft border-2 ${
          active ? 'bg-rust-50 text-white border-white' : 'bg-canvas text-ink border-rust-50'
        }`}
      >
        <Star size={10} strokeWidth={0} fill="currentColor" />
        <span className="text-[11px] font-bold tabular-nums leading-none">{rating.toFixed(1)}</span>
      </span>
      <span
        className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-2 w-2 rotate-45 ${
          active ? 'bg-rust-50' : 'bg-canvas border-r-2 border-b-2 border-rust-50'
        }`}
      />
    </div>
  )
}

function ProviderMiniCard({ provider, onOpen }: { provider: Provider; onOpen: () => void }) {
  const cat = CATEGORY_BY_ID[provider.category]
  const cheapest = provider.services.reduce(
    (m, s) => (s.price < m ? s.price : m),
    provider.services[0]?.price ?? 0,
  )
  const rounded = Math.round(provider.rating)
  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-2xl bg-canvas border border-line/70 p-2.5 pr-3.5 flex items-center gap-3 animate-slide-up"
    >
      <ProviderCover
        category={provider.category}
        providerId={provider.id}
        className="shrink-0 h-16 w-16 rounded-xl"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="text-[14px] font-semibold tracking-tight text-ink truncate leading-tight">
            {provider.name}
          </div>
          <span className="shrink-0 inline-flex items-center px-2 h-[18px] rounded-full bg-surface-higher text-[9.5px] font-semibold text-ink-muted">
            {cat.name}
          </span>
        </div>
        <div className="text-[11px] text-ink-muted truncate mt-0.5">
          {provider.area} · {provider.city}
        </div>
        <div className="flex items-center gap-1 mt-1 text-[11px]">
          <div className="inline-flex items-center gap-[1px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={9}
                strokeWidth={0}
                fill="currentColor"
                className={i <= rounded ? 'text-rust-50' : 'text-line-strong/70'}
              />
            ))}
          </div>
          <span className="font-semibold tabular-nums text-ink ml-0.5">{provider.rating.toFixed(1)}</span>
          <span className="text-ink-dim">·</span>
          <span className="text-ink-muted">{provider.reviewCount} reviews</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[9.5px] text-ink-dim leading-tight">from</div>
        <div className="text-[12.5px] font-bold tabular-nums text-ink leading-tight">{formatMMK(cheapest)}</div>
      </div>
    </button>
  )
}

function CategoryFilterChip({
  active,
  onClick,
  Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon?: any
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[12px] font-semibold leading-none whitespace-nowrap transition
        ${active
          ? 'bg-ink text-canvas'
          : 'bg-canvas/95 backdrop-blur text-ink border border-line/70'}`}
    >
      {Icon && <Icon size={13} strokeWidth={2.1} />}
      {label}
    </button>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center justify-center px-3.5 h-8 rounded-full border text-[11.5px] font-semibold leading-none whitespace-nowrap transition shadow-soft
        ${active
          ? 'bg-ink text-canvas border-ink'
          : 'bg-canvas/95 backdrop-blur text-ink-muted border-line/70 hover:border-line-strong'}`}
    >
      {children}
    </button>
  )
}

function FilterChip({
  label,
  active = false,
  Icon,
  onClick,
}: {
  label: string
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon?: any
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1 h-8 pl-3 pr-2 rounded-full bg-canvas text-ink text-[11.5px] font-semibold transition
        ${active
          ? 'border-[1.5px] border-ink'
          : 'border border-line/70'}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.1} className="text-ink" />}
      {label}
      <ChevronDown size={13} strokeWidth={2.2} className={active ? 'text-ink' : 'text-ink-muted'} />
    </button>
  )
}

function NoMatch({ hasQuery, onClear }: { hasQuery: boolean; onClear: () => void }) {
  const t = useT()
  return (
    <div className="py-16 text-center px-6">
      <div className="mx-auto h-12 w-12 rounded-full border border-line grid place-items-center mb-4">
        <Search size={18} className="text-ink-muted" strokeWidth={1.7} />
      </div>
      <h2 className="font-serif text-[18px] font-semibold tracking-tight">
        {hasQuery ? "We didn't find a match" : t('explore.empty.title')}
      </h2>
      <p className="text-[12.5px] text-ink-muted mt-1.5 max-w-[260px] mx-auto">
        {hasQuery ? 'Try a new search' : t('explore.empty.sub')}
      </p>
      {hasQuery && (
        <button
          onClick={onClear}
          className="mt-5 h-10 px-5 rounded-full bg-ink text-canvas text-[12.5px] font-semibold"
        >
          Clear search
        </button>
      )}
    </div>
  )
}
