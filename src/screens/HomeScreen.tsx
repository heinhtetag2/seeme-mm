import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronRight, Search, MapPin } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { ProviderCard, ProviderRow } from '../components/ProviderCard'
import {
  CATEGORIES, CATEGORY_BY_ID, featuredProviders, PROVIDERS, me, providersByCategory,
  type Category, type CategoryId,
} from '../data'
import { useT } from '../i18n'
import type { Tab, View } from '../nav'

export function HomeScreen({
  go,
  setTab,
  city,
  firstName,
  onNearby,
  onPickCategory,
}: {
  go: (v: View) => void
  setTab: (t: Tab) => void
  city: string
  firstName?: string
  onNearby: () => void
  onPickCategory: (categoryId: CategoryId) => void
}) {
  const t = useT()
  const featured = featuredProviders()
  const editorial = featured[0]
  const featuredRest = featured.slice(1, 5)
  const popular = [...PROVIDERS].sort((a, b) => b.rating - a.rating).slice(0, 4)
  const nearbyCount = PROVIDERS.filter((p) => (city && city !== 'All cities' ? p.city === city : true)).length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('home.greeting.morning') : hour < 18 ? t('home.greeting.afternoon') : t('home.greeting.evening')
  const name = (firstName ?? me.name).split(' ')[0]

  return (
    <div className="px-5 pt-3 pb-2 space-y-7 animate-fade-in">
      {/* Header group — greeting + search read as one unit, so they sit close
          together. The wider space-y-7 only kicks in between sections below. */}
      <header className="space-y-4">
        <div className="space-y-1.5">
          <div className="kicker">{greeting}</div>
          <h1 className="font-serif text-[30px] leading-[1.05] tracking-tight font-semibold">
            {t('home.headline.prefix', { name })}
            <span className="italic"> {t('home.headline.verb')} </span>
            {t('home.headline.suffix')}
          </h1>
        </div>

        {/* Search — jump to the Explore tab where the full search UI lives. */}
        <button
          onClick={() => setTab('explore')}
          className="w-full flex items-center gap-2.5 h-11 px-4 rounded-full bg-surface-elevated border border-line/70 text-left hover:border-line-strong transition"
        >
          <Search size={16} className="text-ink-muted" strokeWidth={1.9} />
          <span className="text-[13px] text-ink-muted flex-1">{t('home.search.placeholder')}</span>
        </button>
      </header>

      {/* Promo carousel */}
      <BannerCarousel setTab={setTab} />

      {/* Categories — editorial 2-col mosaic with full gradient covers */}
      <section>
        <SectionHeader
          kicker="Browse"
          title={t('home.byCategory')}
          action={
            <button onClick={() => setTab('explore')} className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-ink-muted hover:text-ink transition">
              {t('home.cats.all')} <ChevronRight size={13} strokeWidth={2.2} />
            </button>
          }
        />
        <div className="grid grid-cols-3 gap-2.5">
          {CATEGORIES.map((c) => (
            <CategoryTile
              key={c.id}
              c={c}
              count={providersByCategory(c.id).length}
              onClick={() => onPickCategory(c.id)}
            />
          ))}
        </div>
      </section>

      {/* Nearby quick-link — opens Explore tab in map view */}
      <NearbyCard city={city} count={nearbyCount} onClick={onNearby} />

      {/* Editorial feature — one big card with copy */}
      {editorial && (
        <section>
          <SectionHeader kicker={t('home.weekKicker')} title={t('home.weekTitle')} />
          <button
            onClick={() => go({ kind: 'provider', providerId: editorial.id })}
            className="w-full text-left"
          >
            <ProviderCard provider={editorial} onClick={() => go({ kind: 'provider', providerId: editorial.id })} size="lg" />
          </button>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted text-balance">
            <span className="text-ink font-medium">{editorial.name}</span> {editorial.about.toLowerCase().split('.')[0]}.
          </p>
        </section>
      )}

      {/* Featured spread — 2x2 magazine */}
      {featuredRest.length > 0 && (
        <section>
          <SectionHeader kicker="Featured" title={t('home.featured.title')} action={
            <button onClick={() => setTab('explore')} className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink">
              {t('home.featured.seeAll')} <ArrowUpRight size={13} strokeWidth={2.2} />
            </button>
          } />
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {featuredRest.map((p) => (
              <ProviderCard key={p.id} provider={p} onClick={() => go({ kind: 'provider', providerId: p.id })} size="sm" />
            ))}
          </div>
        </section>
      )}

      <div className="divider" />

      {/* Popular */}
      <section>
        <SectionHeader kicker={t('home.popular.kicker', { city: me.city })} title={t('home.popular.title')} />
        <div className="space-y-4">
          {popular.map((p) => (
            <ProviderRow key={p.id} provider={p} onClick={() => go({ kind: 'provider', providerId: p.id })} />
          ))}
        </div>
      </section>

      {/* Editorial promo footer */}
      <section className="relative overflow-hidden rounded-2xl border border-line/70 bg-surface-elevated p-6">
        <div className="kicker mb-2">{t('home.bookly.kicker')}</div>
        <h3 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold text-balance">
          {t('home.pro.title')}
        </h3>
        <p className="text-[12.5px] text-ink-muted mt-2 max-w-[260px]">
          {t('home.pro.sub')}
        </p>
        <button className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-brand text-white text-[12.5px] font-semibold leading-none">
          {t('home.pro.cta')} <ArrowUpRight size={13} strokeWidth={2.2} />
        </button>
      </section>
    </div>
  )
}

function NearbyCard({ city, count, onClick }: { city: string; count: number; onClick: () => void }) {
  const t = useT()
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl border border-line/70 bg-surface-elevated text-left active:scale-[0.99] transition"
    >
      {/* Map backdrop */}
      <div className="relative h-28 w-full bg-gradient-to-br from-tropic-10 via-sand-10 to-pebble-10 dark:from-[#15171c] dark:via-[#0f1115] dark:to-[#191b21]">
        {/* Streets */}
        <div className="absolute h-[3px] left-[-10%] right-[-10%] bg-white/85 dark:bg-white/12 rounded-full -rotate-[6deg]" style={{ top: '38%' }} />
        <div className="absolute h-[2px] left-[-10%] right-[-10%] bg-white/70 dark:bg-white/10 rounded-full rotate-[12deg]" style={{ top: '70%' }} />
        <div className="absolute w-[2px] top-[-10%] bottom-[-10%] bg-white/80 dark:bg-white/12 rounded-full" style={{ left: '32%' }} />
        <div className="absolute w-[2px] top-[-10%] bottom-[-10%] bg-white/70 dark:bg-white/10 rounded-full" style={{ left: '72%' }} />
        {/* Grid */}
        <div
          className="absolute inset-0 dark:opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        {/* Park blob */}
        <div className="absolute h-10 w-12 rounded-[40%] bg-moss-20/80 dark:bg-moss-70/50" style={{ top: '12%', right: '10%' }} />
        {/* Pins */}
        <span className="absolute h-6 px-2 rounded-full bg-canvas border-2 border-rust-50 text-ink text-[10px] font-bold tabular-nums inline-flex items-center gap-0.5 shadow-soft" style={{ top: '24%', left: '22%' }}>
          4.9
        </span>
        <span className="absolute h-7 px-2.5 rounded-full bg-rust-50 text-white border-2 border-white text-[10.5px] font-bold tabular-nums inline-flex items-center gap-0.5 shadow-soft" style={{ top: '48%', left: '48%' }}>
          5.0
        </span>
        <span className="absolute h-6 px-2 rounded-full bg-canvas border-2 border-rust-50 text-ink text-[10px] font-bold tabular-nums inline-flex items-center gap-0.5 shadow-soft" style={{ top: '32%', right: '18%' }}>
          4.8
        </span>
        <span className="absolute h-6 px-2 rounded-full bg-canvas border-2 border-rust-50 text-ink text-[10px] font-bold tabular-nums inline-flex items-center gap-0.5 shadow-soft" style={{ bottom: '14%', left: '36%' }}>
          4.7
        </span>
      </div>
      {/* Content */}
      <div className="p-4 flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-rust-50 grid place-items-center shrink-0 text-white">
          <MapPin size={18} strokeWidth={2.2} fill="currentColor" fillOpacity={0.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="kicker mb-0.5">{t('home.nearby.kicker')}</div>
          <div className="font-serif text-[16px] leading-tight font-semibold tracking-tight truncate">
            {t('home.nearby.places', { count, city })}
          </div>
          <div className="text-[11.5px] text-ink-muted mt-0.5">
            {t('home.nearby.sub')}
          </div>
        </div>
        <ArrowUpRight size={16} strokeWidth={2.2} className="text-ink shrink-0" />
      </div>
    </button>
  )
}

/** Per-category chip palette — alpha tint behind a saturated icon, plus a
 *  thin ring so the chip reads on darker theme surfaces too. */
const CATEGORY_CHIP: Record<CategoryId, { bg: string; icon: string; ring: string }> = {
  doctor:  { bg: 'bg-alpha-tropic-10',   icon: 'text-tropic-60',    ring: 'ring-alpha-tropic-20' },
  spa:     { bg: 'bg-alpha-sakura-10',   icon: 'text-sakura-60',    ring: 'ring-alpha-sakura-20' },
  home:    { bg: 'bg-alpha-ember-10',    icon: 'text-ember-60',     ring: 'ring-alpha-ember-20' },
  fitness: { bg: 'bg-alpha-ocean-10',    icon: 'text-ocean-60',     ring: 'ring-alpha-ocean-20' },
  tutor:   { bg: 'bg-alpha-iris-10',     icon: 'text-iris-60',      ring: 'ring-alpha-iris-20' },
  auto:    { bg: 'bg-alpha-rust-10',     icon: 'text-rust-60',      ring: 'ring-alpha-rust-20' },
}

function CategoryTile({ c, count: _count, onClick }: { c: Category; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full h-[112px] overflow-hidden rounded-[18px] bg-surface-elevated active:scale-[0.97] transition"
    >
      {/* Illustration centered in the upper area — Square Go composition */}
      <div className="absolute inset-x-0 top-3 grid place-items-center">
        <CategoryScene id={c.id} />
      </div>
      {/* Label inside at bottom-left, dark semibold sans */}
      <div className="absolute left-3 right-3 bottom-2.5">
        <div className="text-[12px] font-semibold tracking-tight text-ink leading-tight truncate">
          {c.name}
        </div>
      </div>
    </button>
  )
}

/** Category icon — uploaded PNG (1024² transparent), centered in the tile. */
function CategoryScene({ id }: { id: CategoryId }) {
  return (
    <img
      src={CATEGORY_BY_ID[id].image}
      alt=""
      className="h-[54px] w-[54px] object-contain"
    />
  )
}

type Banner = {
  id: string
  image: string
  onClick: () => void
}

function BannerCarousel({ setTab }: { setTab: (t: Tab) => void }) {
  const banners: Banner[] = [
    { id: 'bann1', image: '/images/banner/bann1.jpg', onClick: () => setTab('explore') },
    { id: 'bann3', image: '/images/banner/bann3.jpg', onClick: () => setTab('explore') },
  ]

  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  /** Timestamp of the user's most recent scroll interaction; auto-advance is
   *  suppressed for a few seconds after this to avoid fighting their gesture. */
  const lastInteractRef = useRef(0)
  /** Auto-advance direction (+1 / -1) so the carousel ping-pongs between
   *  ends instead of jumping from the last banner back to the first. */
  const directionRef = useRef(1)

  /** Find the slide currently closest to the carousel's visible centre. */
  const findActiveIdx = useCallback(() => {
    const el = ref.current
    if (!el) return 0
    const slides = el.children
    if (slides.length === 0) return 0
    const containerCenter = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i] as HTMLElement
      const sc = s.offsetLeft + s.offsetWidth / 2
      const d = Math.abs(sc - containerCenter)
      if (d < bestDist) { bestDist = d; best = i }
    }
    return best
  }, [])

  // Update active dot as the user swipes. Throttled via rAF.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      lastInteractRef.current = Date.now()
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setIdx(findActiveIdx())
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [findActiveIdx])

  /** Scroll the carousel horizontally to a slide. Uses `el.scrollTo` rather
   *  than `scrollIntoView` so only the carousel moves — `scrollIntoView` also
   *  walks ancestor scrollables and yanks the whole page back to the top on
   *  every auto-advance. */
  const scrollToSlide = useCallback((i: number) => {
    const el = ref.current
    if (!el) return
    const slide = el.children[i] as HTMLElement | undefined
    if (!slide) return
    const target = slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2
    el.scrollTo({ left: target, behavior: 'smooth' })
  }, [])

  // Auto-advance every 4.5s. Skipped while the user is mid-interaction.
  // Ping-pongs at the ends so we never jump from the last card back to the first.
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteractRef.current < 4000) return
      const el = ref.current
      if (!el) return
      const slides = el.children
      if (slides.length === 0) return
      const current = findActiveIdx()
      let next = current + directionRef.current
      if (next >= slides.length) {
        directionRef.current = -1
        next = current - 1
      } else if (next < 0) {
        directionRef.current = 1
        next = current + 1
      }
      scrollToSlide(next)
    }, 4500)
    return () => clearInterval(interval)
  }, [findActiveIdx, scrollToSlide])

  const goTo = (i: number) => {
    lastInteractRef.current = Date.now()
    scrollToSlide(i)
  }

  return (
    <div>
      <div
        ref={ref}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2"
      >
        {banners.map((b) => (
          <div key={b.id} className="snap-center shrink-0 w-full">
            <BannerCard banner={b} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Banner ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === idx ? 'w-6 bg-brand' : 'w-1.5 bg-line-strong'}`}
          />
        ))}
      </div>
    </div>
  )
}

function BannerCard({ banner: b }: { banner: Banner }) {
  return (
    <button
      onClick={b.onClick}
      className="relative block w-full h-[148px] overflow-hidden rounded-[20px] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.16)] active:scale-[0.99] transition"
    >
      <img src={b.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
    </button>
  )
}

