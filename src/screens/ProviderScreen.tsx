import { Star, BadgeCheck, Clock, Heart, Share2, CalendarCheck, PencilLine, X, ChevronRight, Copy, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { ProviderCover } from '../components/Cover'
import { ReviewCard, RatingSummary } from '../components/Reviews'
import { StaffCard, StaffAvatar } from '../components/StaffCard'
import { MiniMap } from '../components/MiniMap'
import { InstantConfirmBadge, PayInAppBadge } from '../components/PaymentPicker'
import {
  CATEGORY_BY_ID,
  formatDuration,
  formatMMK,
  PROVIDER_BY_ID,
  ratingLabel,
  staffByProvider,
  ratingDistribution,
  type Booking,
  type Provider,
  type Review,
  type Staff,
} from '../data'
import { useT } from '../i18n'
import { useToast } from '../components/Toast'
import type { View } from '../nav'

type ReviewFilter = 'all' | '5' | '4' | '3' | 'with-comment'

export function ProviderScreen({
  providerId,
  onBack,
  go,
  isFavorite,
  onToggleFavorite,
  bookings,
  reviews,
  helpfulIds,
  onToggleHelpful,
}: {
  providerId: string
  onBack: () => void
  go: (v: View) => void
  isFavorite: boolean
  onToggleFavorite: () => void
  bookings: Booking[]
  reviews: Review[]
  helpfulIds: Set<string>
  onToggleHelpful: (id: string) => void
}) {
  const t = useT()
  const { show } = useToast()
  const provider = PROVIDER_BY_ID[providerId]
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [sheetStaff, setSheetStaff] = useState<Staff | null>(null)
  const [filter, setFilter] = useState<ReviewFilter>('all')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [galleryExpanded, setGalleryExpanded] = useState(false)

  const staff = useMemo(() => (provider ? staffByProvider(provider.id) : []), [provider])
  const providerReviews = useMemo(
    () => reviews.filter((r) => r.providerId === providerId),
    [reviews, providerId],
  )

  if (!provider) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas">
        <SubScreenHeader onBack={onBack} />
      </div>
    )
  }

  const cat = CATEGORY_BY_ID[provider.category]
  const cheapest = provider.services.reduce((m, s) => (s.price < m ? s.price : m), provider.services[0]?.price ?? 0)
  const upcomingBooking = bookings.find((b) => b.providerId === provider.id && b.status === 'upcoming')
  const pastBookings = bookings.filter((b) => b.providerId === provider.id && b.status === 'completed')
  const dist = ratingDistribution(providerReviews)

  // Filter & visible-count for reviews list
  const filtered = providerReviews.filter((r) => {
    if (filter === '5') return r.rating === 5
    if (filter === '4') return r.rating === 4
    if (filter === '3') return r.rating <= 3
    if (filter === 'with-comment') return r.body.trim().length > 0
    return true
  })
  const visibleReviews = showAllReviews ? filtered : filtered.slice(0, 3)

  const canPayInApp = (provider.paymentMethods ?? []).some((m) => m !== 'cash')

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Cover */}
        <div className="relative">
          <ProviderCover category={provider.category} providerId={provider.id} className="h-80" />
          <div className="absolute inset-x-0 top-0">
            <SubScreenHeader
              onBack={onBack}
              variant="overlay"
              right={
                <>
                  <button onClick={() => setShareOpen(true)} className="h-10 w-10 grid place-items-center rounded-full bg-canvas border border-line/70" aria-label="Share">
                    <Share2 size={15} className="text-ink" strokeWidth={1.9} />
                  </button>
                  <button
                    onClick={() => { onToggleFavorite(); show(isFavorite ? t('toast.removed') : t('toast.saved')) }}
                    className="h-10 w-10 grid place-items-center rounded-full bg-canvas border border-line/70"
                    aria-label="Save"
                  >
                    <Heart
                      size={15}
                      strokeWidth={2}
                      className={isFavorite ? 'text-rust-50' : 'text-ink'}
                      fill={isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                </>
              }
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
            <div className="kicker text-white/70 mb-1.5">{cat.name}</div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-[28px] leading-[1.05] tracking-tight font-semibold text-white">
                {provider.name}
              </h1>
              {provider.verified && <BadgeCheck size={18} strokeWidth={2.4} className="text-white" />}
            </div>
            <p className="text-[13px] text-white/85 mt-1">{provider.title}</p>
          </div>
        </div>

        {/* Inline metadata + badges */}
        <div className="px-5 mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-ink-muted">
          <span className="inline-flex items-center gap-1 text-ink">
            <Star size={12.5} fill="currentColor" strokeWidth={0} />
            <span className="font-semibold tabular-nums">{provider.rating.toFixed(1)}</span>
            <span className="text-ink-dim font-normal">({provider.reviewCount + providerReviews.filter((r) => r.id.startsWith('rv_')).length})</span>
          </span>
          <span className="text-ink-dim">·</span>
          <span className="text-ink-muted">{ratingLabel(provider.rating)}</span>
          {provider.distanceKm > 0 && (
            <>
              <span className="text-ink-dim">·</span>
              <span className="text-ink-muted">{provider.distanceKm} km away</span>
            </>
          )}
        </div>

        {/* Trust badges */}
        <div className="px-5 mt-3 flex flex-wrap gap-1.5">
          {provider.instantConfirm && <InstantConfirmBadge />}
          {canPayInApp && <PayInAppBadge />}
        </div>

        {/* Upcoming-booking banner */}
        {upcomingBooking && (
          <button
            onClick={() => go({ kind: 'booking-detail', bookingId: upcomingBooking.id })}
            className="mx-5 mt-5 w-[calc(100%-40px)] flex items-center gap-3 px-4 py-3 rounded-2xl border border-alpha-evergreen-20 bg-alpha-evergreen-10 text-left"
          >
            <span className="h-9 w-9 shrink-0 rounded-full bg-alpha-evergreen-10 grid place-items-center">
              <CalendarCheck size={15} strokeWidth={2} className="text-evergreen-50" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-evergreen-60">{t('provider.hasBooking')}</div>
              <div className="text-[13px] font-semibold tracking-tight truncate mt-0.5">
                {formatBookingDate(upcomingBooking.date)} · {upcomingBooking.time}
              </div>
            </div>
            <span className="shrink-0 text-[12px] font-semibold text-evergreen-60">{t('provider.viewLink')}</span>
          </button>
        )}

        {/* About */}
        <Section kicker={t('provider.about.kicker')} title={t('provider.about.title')}>
          <p className="text-[13.5px] leading-[1.65] text-ink/90 font-serif">
            {provider.about}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {provider.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-surface-elevated border border-line/60 text-ink-muted">
                {tag}
              </span>
            ))}
          </div>
        </Section>

        <div className="divider mx-5 my-7" />

        {/* Gallery / Portfolio of the shop's work */}
        <section className="pt-2">
          <div className="px-5 flex items-baseline justify-between mb-4">
            <div>
              <div className="kicker mb-1.5">{t('provider.gallery.kicker')}</div>
              <h2 className="font-serif text-[20px] font-semibold tracking-tight leading-tight">{t('provider.gallery.title')}</h2>
            </div>
            <button
              onClick={() => setGalleryExpanded((v) => !v)}
              className="text-[12px] font-semibold text-ink-muted"
            >
              {galleryExpanded ? t('staff.showLess') : t('staff.seeAll')}
            </button>
          </div>

          {galleryExpanded ? (
            <div className="px-5 grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProviderCover
                  key={i}
                  category={provider.category}
                  providerId={`${provider.id}-g${i}`}
                  className="aspect-square rounded-xl"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pl-5 pr-5 pb-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProviderCover
                  key={i}
                  category={provider.category}
                  providerId={`${provider.id}-g${i}`}
                  className="shrink-0 h-32 w-32 rounded-xl"
                />
              ))}
            </div>
          )}
        </section>

        <div className="divider mx-5 my-7" />

        {/* Staff — informational, tap to open detail sheet */}
        {staff.length > 0 && (
          <>
            <section className="pt-2">
              <div className="px-5 flex items-baseline justify-between mb-3">
                <div>
                  <div className="kicker mb-1.5">{t('book.specialistsKicker')}</div>
                  <h2 className="font-serif text-[20px] font-semibold tracking-tight leading-tight">{t('provider.team.title')}</h2>
                </div>
                <span className="text-[11px] text-ink-dim">{t('provider.team.count', { count: staff.length })}</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto px-5 pb-3 scrollbar-hide">
                {staff.map((s) => (
                  <StaffCard
                    key={s.id}
                    staff={s}
                    mode="view"
                    onClick={() => setSheetStaff(s)}
                  />
                ))}
              </div>
              <p className="px-5 mt-1 text-[11.5px] text-ink-muted">
                Tap a specialist to see their details. You can pick one during booking.
              </p>
            </section>

            <div className="divider mx-5 my-7" />
          </>
        )}

        {/* Practical + map */}
        <Section kicker={t('provider.where.kicker')} title={t('provider.where.title')}>
          <div className="space-y-3.5 mb-4">
            <Practical Icon={Clock} label={t('provider.hours')} value={provider.hours} />
          </div>
          {provider.coords && (
            <MiniMap coords={provider.coords} address={provider.address ?? `${provider.area}, ${provider.city}`} label={provider.city} />
          )}
        </Section>

        <div className="divider mx-5 my-4" />

        {/* Services menu */}
        <Section kicker={t('provider.menu.kicker')} title={t('provider.menu.title')}>
          <div className="divide-y divide-line/60 border-y border-line/60">
            {provider.services.map((s) => {
              const isSel = selectedService === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(isSel ? null : s.id)}
                  className={`w-full flex items-baseline justify-between gap-3 py-4 text-left transition ${isSel ? 'bg-surface-elevated/60' : ''}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-serif font-semibold tracking-tight text-ink">{s.name}</div>
                    <div className="text-[11.5px] text-ink-muted mt-0.5">{formatDuration(s.duration)}</div>
                  </div>
                  <div className="text-[14px] font-semibold tabular-nums text-ink">{formatMMK(s.price)}</div>
                </button>
              )
            })}
          </div>
        </Section>

        <div className="divider mx-5 my-7" />

        {/* Reviews */}
        <section className="px-5 pt-2">
          <div className="kicker mb-1.5">{t('provider.reviewsKicker', { count: providerReviews.length || provider.reviewCount })}</div>
          <h2 className="font-serif text-[20px] font-semibold tracking-tight leading-tight mb-4">{t('provider.whatClientsSay')}</h2>

          <RatingSummary
            average={provider.rating}
            total={providerReviews.length || provider.reviewCount}
            distribution={dist}
          />

          {/* Filters */}
          <div className="mt-5 flex gap-1.5 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-hide">
            <FilterChip active={filter === 'all'}          onClick={() => setFilter('all')}>All</FilterChip>
            <FilterChip active={filter === '5'}            onClick={() => setFilter('5')}>5 stars</FilterChip>
            <FilterChip active={filter === '4'}            onClick={() => setFilter('4')}>4 stars</FilterChip>
            <FilterChip active={filter === '3'}            onClick={() => setFilter('3')}>3 & below</FilterChip>
            <FilterChip active={filter === 'with-comment'} onClick={() => setFilter('with-comment')}>With comment</FilterChip>
          </div>

          {/* List */}
          {visibleReviews.length > 0 ? (
            <div className="mt-3 divide-y divide-line/60">
              {visibleReviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  isHelpful={helpfulIds.has(r.id)}
                  onHelpful={() => onToggleHelpful(r.id)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 text-center text-[12.5px] text-ink-muted italic">
              No reviews match this filter.
            </div>
          )}

          {/* Show more */}
          {!showAllReviews && filtered.length > 3 && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="mt-4 w-full h-11 rounded-full border border-line/70 text-[12.5px] font-semibold leading-none"
            >
              Show all {filtered.length} reviews
            </button>
          )}

          {/* Write a review — only enabled if user has a booking with this provider */}
          <div className="mt-5">
            <button
              onClick={() => {
                if (pastBookings.length === 0 && !upcomingBooking) {
                  show(t('toast.bookFirstToReview'))
                  return
                }
                go({ kind: 'write-review', providerId: provider.id, staffId: undefined })
              }}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-full border border-line/70 text-[13px] font-semibold leading-none"
            >
              <PencilLine size={13} strokeWidth={2.2} />
              Write a review
            </button>
            {pastBookings.length === 0 && !upcomingBooking && (
              <p className="text-[11px] text-ink-dim mt-1.5 text-center">
                You can review after your first booking.
              </p>
            )}
          </div>
        </section>

        <div className="h-6" />
      </div>

      {sheetStaff && (
        <StaffSheet
          staff={sheetStaff}
          onClose={() => setSheetStaff(null)}
          onBook={() => {
            const s = sheetStaff
            setSheetStaff(null)
            go({ kind: 'book', providerId: provider.id, serviceId: selectedService ?? undefined, staffId: s.id })
          }}
          onViewProfile={() => {
            const s = sheetStaff
            setSheetStaff(null)
            go({ kind: 'staff', staffId: s.id })
          }}
        />
      )}

      {/* Fixed footer */}
      <div className="shrink-0 bg-canvas border-t border-line/60 px-5 pt-3.5 pb-5">
        {upcomingBooking ? (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => go({ kind: 'booking-detail', bookingId: upcomingBooking.id })}
              className="h-12 rounded-full border border-line/70 text-[13.5px] font-semibold leading-none text-ink"
            >
              {t('bookings.viewBooking')}
            </button>
            <button
              onClick={() => go({ kind: 'book', providerId: provider.id, serviceId: selectedService ?? undefined, staffId: undefined })}
              className="h-12 rounded-full bg-ink text-canvas text-[13.5px] font-semibold leading-none active:opacity-90"
            >
              {t('bookings.bookAgain')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[12.5px] text-ink-muted">{t('provider.from')}</span>
              <span className="text-[16px] font-semibold tabular-nums text-ink">{formatMMK(cheapest)}</span>
            </div>
            <button
              onClick={() => go({ kind: 'book', providerId: provider.id, serviceId: selectedService ?? undefined, staffId: undefined })}
              className="w-full h-12 rounded-full bg-ink text-canvas text-[14px] font-semibold leading-none active:opacity-90"
            >
              {t('provider.book')}
            </button>
          </>
        )}
      </div>

      {shareOpen && (
        <ShareSheet
          provider={provider}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  )
}

/* ─────────── Share bottom sheet ─────────── */

function ShareSheet({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  const t = useT()
  const { show } = useToast()
  const url = `https://bookly.mm/p/${provider.id}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      show(t('share.linkCopied'))
    } catch {
      show(t('toast.couldNotCopy'))
    }
    onClose()
  }
  const share = (label: string) => {
    show(t('toast.sharingTo', { channel: label }))
    onClose()
  }

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

        <div className="kicker mb-1.5">{t('share.kicker')}</div>
        <h2 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold">
          {t('share.title')}
        </h2>

        {/* Provider preview row */}
        <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl border border-line/70 bg-canvas">
          <ProviderCover category={provider.category} providerId={provider.id} className="h-12 w-12 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold tracking-tight truncate">{provider.name}</div>
            <div className="text-[11px] text-ink-muted truncate">{url.replace('https://', '')}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            onClick={copy}
            className="h-11 rounded-full border border-line/70 text-[12.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
          >
            <Copy size={13} strokeWidth={2} /> {t('share.copyLink')}
          </button>
          <button
            onClick={() => share('System')}
            className="h-11 rounded-full bg-ink text-canvas text-[12.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
          >
            <Share2 size={13} strokeWidth={2} /> {t('share.more')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="px-5 pt-7">
      <div className="kicker mb-1.5">{kicker}</div>
      <h2 className="font-serif text-[20px] font-semibold tracking-tight mb-4 leading-tight">{title}</h2>
      {children}
    </section>
  )
}

function Practical({
  Icon, label, value,
}: {
  Icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-baseline gap-3">
      <Icon size={14} strokeWidth={1.9} className="text-ink-dim shrink-0" />
      <div>
        <div className="text-[11px] text-ink-dim font-medium">{label}</div>
        <div className="text-[13.5px] mt-0.5">{value}</div>
      </div>
    </div>
  )
}

function FilterChip({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 h-9 px-4 inline-flex items-center justify-center rounded-full text-[12px] font-semibold leading-none border transition
        ${active
          ? 'bg-ink text-canvas border-ink'
          : 'bg-surface-elevated border-line/70 text-ink-muted hover:border-line-strong'}`}
    >
      {children}
    </button>
  )
}

function formatBookingDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${dows[d.getDay()]} ${mons[d.getMonth()]} ${d.getDate()}`
}

function StaffSheet({
  staff,
  onClose,
  onBook,
  onViewProfile,
}: {
  staff: Staff
  onClose: () => void
  onBook: () => void
  onViewProfile: () => void
}) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-6 animate-slide-up max-h-[80%] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full border border-line/70 bg-canvas"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />

        <div className="flex items-start gap-3.5">
          <StaffAvatar staff={staff} size={64} />
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold truncate">{staff.name}</h3>
              {staff.topPick && <BadgeCheck size={14} strokeWidth={2.4} className="text-data-yellow-30 shrink-0" />}
            </div>
            <div className="text-[12.5px] text-ink-muted truncate mt-0.5">{staff.role}</div>
            <div className="mt-2 flex items-center gap-2 text-[11.5px]">
              <span className="inline-flex items-center gap-1 text-ink">
                <Star size={11} fill="currentColor" strokeWidth={0} />
                <span className="font-semibold tabular-nums">{staff.rating.toFixed(1)}</span>
                <span className="text-ink-dim">({staff.reviewCount})</span>
              </span>
              <span className="text-ink-dim">·</span>
              <span className="text-ink-muted">{t('staff.years', { years: staff.years })}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{staff.bio}</p>

        {staff.specialties.length > 0 && (
          <div className="mt-4">
            <div className="kicker mb-2">{t('provider.specialties')}</div>
            <div className="flex flex-wrap gap-1.5">
              {staff.specialties.map((t) => (
                <span key={t} className="inline-flex items-center px-2.5 h-7 rounded-full border border-line/70 text-[11.5px] text-ink">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-[12px] text-evergreen-50 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-evergreen-50" />
          {t('staff.nextAvailable')} · {staff.nextAvailable}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2">
          <button
            onClick={onBook}
            className="h-12 rounded-full bg-ink text-canvas text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 active:opacity-90"
          >
            <CalendarCheck size={14} strokeWidth={2.2} />
            {t('staff.bookWith', { name: staff.name.split(' ').slice(-1)[0] })}
          </button>
          <button
            onClick={onViewProfile}
            className="h-12 rounded-full border border-line/70 text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
          >
            {t('staff.viewProfile')}
            <ChevronRight size={13} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  )
}
