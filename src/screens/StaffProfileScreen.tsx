import { useState } from 'react'
import { Star, BadgeCheck, Calendar } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { StaffAvatar } from '../components/StaffCard'
import { ProviderCover } from '../components/Cover'
import { ReviewCard, RatingSummary } from '../components/Reviews'
import { PROVIDER_BY_ID, STAFF_BY_ID, ratingDistribution, type Review } from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

export function StaffProfileScreen({
  staffId,
  reviews,
  helpfulIds,
  onToggleHelpful,
  onBack,
  go,
}: {
  staffId: string
  reviews: Review[]
  helpfulIds: Set<string>
  onToggleHelpful: (id: string) => void
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const [worksExpanded, setWorksExpanded] = useState(false)
  const staff = STAFF_BY_ID[staffId]
  if (!staff) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas">
        <SubScreenHeader onBack={onBack} title={t('staff.title')} />
        <div className="px-5 pt-10 text-center text-ink-muted text-[13px]">Profile not found.</div>
      </div>
    )
  }
  const provider = PROVIDER_BY_ID[staff.providerId]
  const staffReviews = reviews.filter((r) => r.staffId === staff.id)
  const dist = ratingDistribution(staffReviews.length ? staffReviews : [
    { id: '_', providerId: '', authorName: '', authorInitial: '', rating: staff.rating, body: '', when: '', helpful: 0 } as Review,
  ])

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title={t('staff.title')} onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Hero */}
        <section className="px-5 pt-2 pb-5 text-center">
          <div className="inline-block">
            <StaffAvatar staff={staff} size={96} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <h1 className="font-serif text-[24px] leading-tight tracking-tight font-semibold">{staff.name}</h1>
            {staff.topPick && <BadgeCheck size={16} strokeWidth={2.4} className="text-data-yellow-30" />}
          </div>
          <div className="text-[12.5px] text-ink-muted mt-0.5">{staff.role}</div>
          {provider && (
            <button
              onClick={() => go({ kind: 'provider', providerId: provider.id })}
              className="text-[12px] mt-1.5 text-ink underline underline-offset-2 decoration-line-strong"
            >
              {provider.name}
            </button>
          )}

          {/* Stat strip */}
          <div className="mt-4 mx-auto max-w-[280px] grid grid-cols-3 divide-x divide-line/60 border-y border-line/60 py-3">
            <Stat label={t('staff.statRating')} value={staff.rating.toFixed(1)} icon={<Star size={11.5} fill="currentColor" strokeWidth={0} className="text-data-yellow-30" />} />
            <Stat label={t('staff.statReviews')} value={String(staff.reviewCount)} />
            <Stat label={t('staff.statExperience')} value={`${staff.years}y`} />
          </div>
        </section>

        {/* About */}
        <Section kicker={t('staff.about.kicker')} title={t('staff.about.title')}>
          <p className="text-[13.5px] leading-[1.65] text-ink/90 font-serif">{staff.bio}</p>
        </Section>

        <div className="divider mx-5 my-7" />

        {/* Specialties */}
        <Section kicker={t('staff.specialtiesKicker')} title={t('staff.knownFor')}>
          <div className="flex flex-wrap gap-1.5">
            {staff.specialties.map((s) => (
              <span key={s} className="inline-flex items-center px-2.5 h-7 text-[11px] font-medium rounded-full bg-surface-higher text-ink">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <div className="divider mx-5 my-7" />

        {/* Works / Portfolio */}
        {provider && (
          <>
            <section className="pt-7">
              <div className="px-5 flex items-baseline justify-between mb-4">
                <div>
                  <div className="kicker mb-1.5">{t('staff.portfolio')}</div>
                  <h2 className="font-serif text-[19px] font-semibold tracking-tight leading-tight">{t('staff.selectedWork')}</h2>
                </div>
                <button
                  onClick={() => setWorksExpanded((v) => !v)}
                  className="text-[12px] font-semibold text-ink-muted"
                >
                  {worksExpanded ? t('staff.showLess') : t('staff.seeAll')}
                </button>
              </div>

              {worksExpanded ? (
                <div className="px-5 grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProviderCover
                      key={i}
                      category={provider.category}
                      providerId={`${staff.id}-w${i}`}
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
                      providerId={`${staff.id}-w${i}`}
                      className="shrink-0 h-28 w-28 rounded-xl"
                    />
                  ))}
                </div>
              )}
            </section>

            <div className="divider mx-5 my-7" />
          </>
        )}

        {/* Reviews */}
        <Section kicker={t('staff.reviewsCount', { count: staffReviews.length || staff.reviewCount })} title={t('provider.whatClientsSay')}>
          <div className="mb-4">
            <RatingSummary
              average={staff.rating}
              total={staffReviews.length || staff.reviewCount}
              distribution={dist}
            />
          </div>
          {staffReviews.length > 0 ? (
            <div className="divide-y divide-line/60">
              {staffReviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  isHelpful={helpfulIds.has(r.id)}
                  onHelpful={() => onToggleHelpful(r.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-[12.5px] text-ink-muted italic">
              {t('staff.noReviews', { provider: provider?.name ?? 'the venue' })}
            </div>
          )}
        </Section>

        <div className="h-6" />
      </div>

      {/* Footer CTA */}
      {provider && (
        <div className="shrink-0 bg-canvas border-t border-line/60 px-5 pt-3.5 pb-5">
          <div className="flex items-center gap-2 mb-3 text-[12px] text-ink-muted">
            <Calendar size={12} strokeWidth={2} />
            <span>{t('staff.nextAvailable')} · <span className="text-evergreen-50 font-semibold">{staff.nextAvailable}</span></span>
          </div>
          <button
            onClick={() => go({ kind: 'book', providerId: provider.id, staffId: staff.id })}
            className="w-full h-12 rounded-full bg-ink text-canvas text-[14px] font-semibold leading-none active:opacity-90"
          >
            {t('staff.bookWith', { name: staff.name.split(' ')[0] })}
          </button>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="text-[15px] font-semibold tabular-nums inline-flex items-center gap-1 justify-center">
        {icon}{value}
      </div>
      <div className="text-[10.5px] text-ink-dim mt-0.5">{label}</div>
    </div>
  )
}

function Section({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="px-5 pt-7">
      <div className="kicker mb-1.5">{kicker}</div>
      <h2 className="font-serif text-[19px] font-semibold tracking-tight mb-4 leading-tight">{title}</h2>
      {children}
    </section>
  )
}
