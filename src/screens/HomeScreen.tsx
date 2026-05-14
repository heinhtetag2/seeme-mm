import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronRight, Crown, BadgePercent, Search, MapPin, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { ProviderCard, ProviderRow } from '../components/ProviderCard'
import { CategoryCover } from '../components/Cover'
import {
  CATEGORIES, featuredProviders, PROVIDERS, me, providersByCategory,
  type Category,
} from '../data'
import { useT } from '../i18n'
import type { Tab, View } from '../nav'

export function HomeScreen({
  go,
  setTab,
  city,
  onNearby,
}: {
  go: (v: View) => void
  setTab: (t: Tab) => void
  city: string
  onNearby: () => void
}) {
  const t = useT()
  const featured = featuredProviders()
  const editorial = featured[0]
  const featuredRest = featured.slice(1, 5)
  const popular = [...PROVIDERS].sort((a, b) => b.rating - a.rating).slice(0, 4)
  const nearbyCount = PROVIDERS.filter((p) => (city && city !== 'All cities' ? p.city === city : true)).length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-5 pt-2 pb-2 space-y-9 animate-fade-in">
      {/* Editorial greeting */}
      <div className="space-y-1">
        <div className="kicker">{greeting}</div>
        <h1 className="font-serif text-[32px] leading-[1.05] tracking-tight font-semibold">
          {me.name.split(' ')[0]} — what shall we
          <span className="italic"> book </span>
          today?
        </h1>
      </div>

      {/* Search — opens the dedicated search sub-screen (not the Explore tab),
          so tapping feels like "opening search" instead of switching tabs. */}
      <button
        onClick={() => go({ kind: 'search' })}
        className="w-full flex items-center gap-2.5 h-12 px-4 rounded-full bg-surface-elevated border border-line/70 text-left hover:border-line-strong transition"
      >
        <Search size={16} className="text-ink-muted" strokeWidth={1.9} />
        <span className="text-[13px] text-ink-muted flex-1">{t('home.search.placeholder')}</span>
      </button>

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
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((c) => (
            <CategoryTile
              key={c.id}
              c={c}
              count={providersByCategory(c.id).length}
              onClick={() => go({ kind: 'category', categoryId: c.id })}
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
        <button className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-ink text-canvas text-[12.5px] font-semibold leading-none">
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
      <div className="relative h-28 w-full bg-gradient-to-br from-tropic-10 via-sand-10 to-pebble-10">
        {/* Streets */}
        <div className="absolute h-[3px] left-[-10%] right-[-10%] bg-white/85 rounded-full -rotate-[6deg]" style={{ top: '38%' }} />
        <div className="absolute h-[2px] left-[-10%] right-[-10%] bg-white/70 rounded-full rotate-[12deg]" style={{ top: '70%' }} />
        <div className="absolute w-[2px] top-[-10%] bottom-[-10%] bg-white/80 rounded-full" style={{ left: '32%' }} />
        <div className="absolute w-[2px] top-[-10%] bottom-[-10%] bg-white/70 rounded-full" style={{ left: '72%' }} />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        {/* Park blob */}
        <div className="absolute h-10 w-12 rounded-[40%] bg-moss-20/80" style={{ top: '12%', right: '10%' }} />
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

function CategoryTile({ c, count, onClick }: { c: Category; count: number; onClick: () => void }) {
  const Icon = c.Icon
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl text-left active:scale-[0.98] transition"
    >
      <CategoryCover category={c.id} className="h-[124px]" ornament={false}>
        {/* Big watermark icon — soft white, low opacity */}
        <Icon
          size={104}
          strokeWidth={1.2}
          className="absolute -right-3 -bottom-4 text-white/15 pointer-events-none"
        />
        {/* Top-right chevron */}
        <span className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-white/15 backdrop-blur grid place-items-center group-active:bg-white/25 transition">
          <ChevronRight size={13} strokeWidth={2.4} className="text-white" />
        </span>
        {/* Bottom-left content */}
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <div className="font-serif text-[18px] leading-[1.0] tracking-tight font-semibold text-white truncate">
            {c.name}
          </div>
          <div className="text-[10.5px] text-white/75 mt-1 tabular-nums">
            {count} {count === 1 ? 'provider' : 'providers'}
          </div>
        </div>
      </CategoryCover>
    </button>
  )
}

type Banner = {
  id: string
  kicker: string
  title: React.ReactNode
  sub: string
  Icon: LucideIcon
  /** 'filled' → full-bleed gradient card with white type.
   *  'outlined' → soft tinted card with brand-coloured kicker on canvas. */
  variant: 'filled' | 'outlined'
  /** For filled: layered radial gradients (looks like an editorial cover). */
  gradient?: string
  /** For filled: fallback solid colour. */
  fallback?: string
  /** For outlined: border + soft surface classes. */
  surface?: string
  /** For outlined: bubble background + icon color. */
  bubble?: string
  /** Accent colour token for kicker + arrow (Tailwind text-… class). */
  accent: string
  onClick: () => void
}

function BannerCarousel({ setTab }: { setTab: (t: Tab) => void }) {
  const banners: Banner[] = [
    {
      id: 'pro',
      kicker: 'Bookly Pro',
      title: <>Priority slots, <span className="italic">members-only</span> rates.</>,
      sub: 'Skip the waitlist at top providers and unlock up to 20% off.',
      Icon: Crown,
      variant: 'filled',
      gradient: 'linear-gradient(135deg, #c97a2e 0%, #8a4a18 100%)',
      fallback: '#c97a2e',
      bubble: 'bg-white/20 text-white',
      accent: 'text-white/85',
      onClick: () => setTab('me'),
    },
    {
      id: 'weekend',
      kicker: 'Weekend offer',
      title: <>20% off at top spas <span className="italic">this Saturday</span>.</>,
      sub: 'Members-only rate at award-winning spas in Yangon. Book before Sunday.',
      Icon: BadgePercent,
      variant: 'outlined',
      surface: 'border-alpha-rust-20 bg-alpha-rust-10',
      bubble: 'bg-rust-50 text-canvas',
      accent: 'text-rust-50',
      onClick: () => setTab('explore'),
    },
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
      ;(slides[next] as HTMLElement).scrollIntoView({
        behavior: 'smooth', block: 'nearest', inline: 'center',
      })
    }, 4500)
    return () => clearInterval(interval)
  }, [findActiveIdx])

  const goTo = (i: number) => {
    lastInteractRef.current = Date.now()
    const el = ref.current
    if (!el) return
    const slide = el.children[i] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div>
      <div
        ref={ref}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
              ${i === idx ? 'w-6 bg-ink' : 'w-1.5 bg-line-strong'}`}
          />
        ))}
      </div>
    </div>
  )
}

function BannerCard({ banner: b }: { banner: Banner }) {
  const isFilled = b.variant === 'filled'

  // Container: identical padding + flex layout for both variants so heights match.
  // Only the surface (border+tint vs solid gradient) and text colors differ.
  return (
    <button
      onClick={b.onClick}
      className={`relative w-full overflow-hidden rounded-2xl px-5 py-4 text-left active:scale-[0.99] transition
        ${isFilled ? '' : `border ${b.surface}`}`}
      style={isFilled ? { backgroundColor: b.fallback, backgroundImage: b.gradient } : undefined}
    >
      <div className="flex items-center gap-4">
        <div className={`h-11 w-11 rounded-2xl ${b.bubble} grid place-items-center shrink-0`}>
          <b.Icon size={18} strokeWidth={2.2} fill="currentColor" fillOpacity={0.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`kicker mb-0.5 ${b.accent}`}>{b.kicker}</div>
          <div className={`font-serif text-[17px] leading-tight font-semibold tracking-tight ${isFilled ? 'text-white' : ''}`}>
            {b.title}
          </div>
          <div className={`text-[11.5px] mt-1 ${isFilled ? 'text-white/75' : 'text-ink-muted'}`}>
            {b.sub}
          </div>
        </div>
        <ArrowUpRight size={16} strokeWidth={2.2} className={`${isFilled ? 'text-white' : b.accent} shrink-0`} />
      </div>
    </button>
  )
}
