import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronRight, Search, MapPin, Sparkles, MessageSquareText, Gift, CalendarHeart, BadgeCheck, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { ProviderCard, ProviderRow } from '../components/ProviderCard'
import { CategoryCover } from '../components/Cover'
import {
  CATEGORIES, featuredProviders, PROVIDERS, me, providersByCategory,
  type Category,
} from '../data'
import { POSTS_SEED, TOPICS, sortPosts, type Post } from '../community'
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
  const communityPicks = sortPosts(POSTS_SEED, 'trending').slice(0, 5)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-5 pt-2 pb-2 space-y-9 animate-fade-in">
      {/* Editorial greeting */}
      <div className="space-y-1">
        <div className="kicker">{greeting}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold">
          {me.name.split(' ')[0]} — what shall we
          <span className="italic"> book </span>
          today?
        </h1>
      </div>

      {/* Search — jumps to the Explore tab where the real search lives. */}
      <button
        onClick={() => setTab('explore')}
        className="w-full flex items-center gap-2.5 h-12 px-4 rounded-full bg-surface-elevated border border-line/70 text-left hover:border-line-strong transition"
      >
        <Search size={16} className="text-ink-muted" strokeWidth={1.9} />
        <span className="text-[13px] text-ink-muted flex-1">{t('home.search.placeholder')}</span>
      </button>

      {/* Promo carousel */}
      <BannerCarousel setTab={setTab} go={go} />

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

      {/* Community — trending posts from people who've been there */}
      <section>
        <SectionHeader
          kicker="Community"
          title="From your neighbors"
          action={
            <button onClick={() => setTab('community')} className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-ink-muted hover:text-ink transition">
              See all <ChevronRight size={13} strokeWidth={2.2} />
            </button>
          }
        />
        <div className="-mx-5">
          {/* scroll-pl-5 tells snap-mandatory to leave 20px on the left when
              snapping (so the first card aligns with the section title, not
              flush with the screen edge). The leading spacer provides the same
              20px visually at the initial scroll position. */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 scroll-pl-5 scroll-pr-5">
            <div className="shrink-0 w-5" aria-hidden />
            {communityPicks.map((post) => (
              <CommunityHomeCard
                key={post.id}
                post={post}
                onClick={() => go({ kind: 'community-post', postId: post.id })}
              />
            ))}
            <div className="shrink-0 w-5" aria-hidden />
          </div>
        </div>
      </section>

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

    </div>
  )
}

function CommunityHomeCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const topic = TOPICS[post.topic]
  const body = post.title ?? post.body
  return (
    <button
      onClick={onClick}
      className="snap-start shrink-0 w-[260px] text-left rounded-2xl border border-line/70 bg-surface-elevated p-4 flex flex-col gap-3 active:scale-[0.99] transition"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 h-6 pl-2 pr-2.5 rounded-full text-[10.5px] font-semibold ${topic.toneSoft}`}>
          <topic.Icon size={11} strokeWidth={2.2} />
          {topic.label}
        </span>
        <span className="text-[10.5px] text-ink-dim tabular-nums">{post.when}</span>
      </div>
      <p className="text-[13px] leading-snug text-ink font-medium line-clamp-3 text-balance">
        {body}
      </p>
      <div className="mt-auto flex items-center gap-2 text-[11px] text-ink-muted">
        <span className="h-6 w-6 rounded-full bg-surface-higher grid place-items-center text-[10.5px] font-bold text-ink-muted">
          {post.author.initial}
        </span>
        <span className="truncate">{post.author.name}</span>
        <span className="text-ink-dim">·</span>
        <span className="inline-flex items-center gap-0.5">
          <MessageSquareText size={10} strokeWidth={2.2} className="text-ink-dim" />
          {post.helpful}
        </span>
      </div>
    </button>
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
  /** Linear gradient CSS — full-bleed cover behind the white type. */
  gradient: string
  /** Solid fallback in case the gradient fails to paint. */
  fallback: string
  onClick: () => void
}

function BannerCarousel({ setTab, go }: { setTab: (t: Tab) => void; go: (v: View) => void }) {
  const banners: Banner[] = [
    {
      id: 'welcome',
      kicker: 'WELCOME GIFT',
      title: <>5,000 MMK off your <span className="italic">first booking</span>.</>,
      sub: 'Auto-applied at checkout at any verified pro.',
      Icon: Gift,
      gradient: 'linear-gradient(135deg, #a06b9c 0%, #6d3f7a 100%)',
      fallback: '#7a4a85',
      onClick: () => setTab('explore'),
    },
    {
      id: 'studio',
      kicker: 'AI STUDIO · NEW',
      title: <>Try the look <span className="italic">before</span> you book.</>,
      sub: 'Generate a hairstyle or nail design with AI. Bring it to your stylist.',
      Icon: Sparkles,
      gradient: 'linear-gradient(135deg, #2b6f88 0%, #1d4a5e 100%)',
      fallback: '#235e76',
      onClick: () => go({ kind: 'studio-generate', look: 'hair' }),
    },
    {
      id: 'weekend',
      kicker: 'WEEKEND PICK',
      title: <>Top spas in Yangon, <span className="italic">this Saturday</span>.</>,
      sub: "Editor-picked salons with weekend openings still left.",
      Icon: CalendarHeart,
      gradient: 'linear-gradient(135deg, #c97a2e 0%, #8a4a18 100%)',
      fallback: '#c97a2e',
      onClick: () => setTab('explore'),
    },
    {
      id: 'verified',
      kicker: 'WHY SEEME',
      title: <>Every shop, <span className="italic">manually</span> verified.</>,
      sub: 'No bait listings. Real photos, real pricing, real reviews from visitors.',
      Icon: BadgeCheck,
      gradient: 'linear-gradient(135deg, #3a7a52 0%, #1d4a32 100%)',
      fallback: '#326e48',
      onClick: () => setTab('community'),
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

  // Scroll the carousel horizontally to a specific slide without touching the
  // page's vertical scroll position. (scrollIntoView with block:'nearest' would
  // pull the page up when the carousel has scrolled off-screen above.)
  const scrollToIndex = useCallback((i: number) => {
    const el = ref.current
    if (!el) return
    const slide = el.children[i] as HTMLElement | undefined
    if (!slide) return
    const targetLeft = slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2
    el.scrollTo({ left: targetLeft, behavior: 'smooth' })
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
      scrollToIndex(next)
    }, 4500)
    return () => clearInterval(interval)
  }, [findActiveIdx, scrollToIndex])

  const goTo = (i: number) => {
    lastInteractRef.current = Date.now()
    scrollToIndex(i)
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
  return (
    <button
      onClick={b.onClick}
      className="relative w-full overflow-hidden rounded-3xl text-left active:scale-[0.99] transition isolate"
      style={{ backgroundColor: b.fallback, backgroundImage: b.gradient }}
    >
      {/* Watermark icon — large, faded, sits behind the type */}
      <b.Icon
        size={180}
        strokeWidth={1.1}
        className="absolute -right-6 -bottom-10 text-white/10 pointer-events-none -z-10"
        aria-hidden
      />
      {/* Soft top-left highlight to add depth to the gradient */}
      <span
        className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none -z-10"
        aria-hidden
      />

      <div className="px-5 pt-5 pb-5 flex flex-col gap-2.5 min-h-[160px]">
        <div className="flex items-center justify-between">
          <div className="kicker text-white/75 tracking-[0.08em]">{b.kicker}</div>
          <span className="h-7 w-7 rounded-full bg-white/15 backdrop-blur grid place-items-center shrink-0">
            <ArrowUpRight size={13} strokeWidth={2.4} className="text-white" />
          </span>
        </div>
        <h3 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold text-white text-balance max-w-[88%]">
          {b.title}
        </h3>
        <p className="text-[11.5px] text-white/75 leading-relaxed max-w-[90%] mt-auto">
          {b.sub}
        </p>
      </div>
    </button>
  )
}
