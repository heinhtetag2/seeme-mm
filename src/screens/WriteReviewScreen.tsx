import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { StarRating } from '../components/Reviews'
import { StaffCard } from '../components/StaffCard'
import { PROVIDER_BY_ID, staffByProvider, STAFF_BY_ID, type Review } from '../data'
import { useToast } from '../components/Toast'
import { useT } from '../i18n'

// Resolved via t() inside the component so it switches with language.
const RATING_KEYS = ['review.rate.0', 'review.rate.1', 'review.rate.2', 'review.rate.3', 'review.rate.4', 'review.rate.5'] as const

const PROMPTS = [
  'On time?',
  'Clean & comfortable',
  'Friendly staff',
  'Good value',
  'Skilled work',
  'Would book again',
]

/** A blank, fully interactive review form. */
export function WriteReviewScreen({
  providerId,
  initialStaffId,
  onBack,
  onSubmit,
}: {
  providerId: string
  initialStaffId?: string
  onBack: () => void
  onSubmit: (r: Review) => void
}) {
  const t = useT()
  const { show } = useToast()
  const provider = PROVIDER_BY_ID[providerId]
  const staff = useMemo(() => staffByProvider(providerId), [providerId])

  const [rating, setRating] = useState<number>(0)
  const [staffId, setStaffId] = useState<string | undefined>(initialStaffId ?? undefined)
  const [body, setBody] = useState<string>('')
  const [tags, setTags] = useState<Set<string>>(new Set())

  if (!provider) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas">
        <SubScreenHeader onBack={onBack} title={t('review.kicker.title')} />
      </div>
    )
  }

  const toggleTag = (t: string) => {
    setTags((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t); else next.add(t)
      return next
    })
  }

  const canSubmit = rating > 0 && body.trim().length >= 6

  const submit = () => {
    if (!canSubmit) return
    const initial = (() => {
      const raw = 'You'
      return raw.charAt(0)
    })()
    const enriched = body.trim() + (tags.size ? `\n\n— ${[...tags].join(' · ')}` : '')
    const review: Review = {
      id: `rv_${Date.now()}`,
      providerId,
      staffId,
      authorName: 'You',
      authorInitial: initial,
      rating,
      body: enriched,
      when: 'Just now',
      helpful: 0,
      verified: true,
    }
    onSubmit(review)
    show(t('toast.thanksReview'))
    onBack()
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title={t('review.kicker.title')} onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Provider line */}
        <div className="px-5">
          <div className="kicker mb-1.5">{t('review.kicker.reviewing')}</div>
          <h1 className="font-serif text-[24px] font-semibold tracking-tight leading-tight">{provider.name}</h1>
          <div className="text-[12.5px] text-ink-muted mt-0.5">{provider.area}, {provider.city}</div>
        </div>

        {/* Star input */}
        <section className="px-5 pt-7 text-center">
          <div className="kicker mb-1.5">{t('review.kicker.rating')}</div>
          <div className="flex justify-center">
            <StarRating value={rating} onChange={setRating} size={36} />
          </div>
          <div className="mt-2 text-[13px] font-semibold text-ink-muted">
            {t(RATING_KEYS[rating])}
          </div>
        </section>

        {/* Quick tags */}
        <section className="px-5 pt-7">
          <div className="kicker mb-1.5">{t('review.kicker.highlights')}</div>
          <p className="text-[12px] text-ink-muted mb-3">{t('review.tagsHint')}</p>
          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((p) => {
              const active = tags.has(p)
              return (
                <button
                  key={p}
                  onClick={() => toggleTag(p)}
                  className={`inline-flex items-center gap-1 h-8 px-3 rounded-full text-[12px] font-semibold leading-none transition
                    ${active
                      ? 'bg-ink text-canvas border border-ink'
                      : 'bg-surface-elevated border border-line/70 text-ink-muted hover:border-line-strong'}`}
                >
                  {active && <Check size={11} strokeWidth={3} />}
                  {p}
                </button>
              )
            })}
          </div>
        </section>

        {/* Body */}
        <section className="px-5 pt-7">
          <div className="kicker mb-1.5">{t('review.kicker.comment')}</div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t('review.body.placeholder')}
            rows={5}
            className="w-full p-3.5 rounded-2xl border border-line/70 bg-surface-elevated text-[13px] outline-none placeholder:text-ink-muted resize-none focus:border-line-strong"
          />
          <div className="text-right text-[10.5px] text-ink-dim mt-1 tabular-nums">{body.length} / 500</div>
        </section>

        {/* Optional staff attribution */}
        {staff.length > 0 && (
          <section className="px-5 pt-3">
            <div className="kicker mb-1.5">{t('review.kicker.staff')}</div>
            <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-hide">
              <button
                onClick={() => setStaffId(undefined)}
                className={`shrink-0 h-10 px-4 inline-flex items-center justify-center rounded-full text-[12px] font-semibold border
                  ${staffId === undefined
                    ? 'bg-ink text-canvas border-ink'
                    : 'bg-surface-elevated border-line/70 text-ink-muted'}`}
              >
                No specific person
              </button>
              {staff.map((s) => (
                <StaffCard
                  key={s.id}
                  staff={s}
                  selected={staffId === s.id}
                  onClick={() => setStaffId(staffId === s.id ? undefined : s.id)}
                />
              ))}
            </div>
            {staffId && (
              <div className="text-[11.5px] text-ink-muted mt-2">
                Tagged · <span className="text-ink font-semibold">{STAFF_BY_ID[staffId]?.name}</span>
              </div>
            )}
          </section>
        )}

        <div className="h-6" />
      </div>

      <div className="shrink-0 bg-canvas border-t border-line/60 px-5 pt-3.5 pb-5">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className={`w-full h-12 rounded-full text-[14px] font-semibold leading-none inline-flex items-center justify-center transition
            ${canSubmit ? 'bg-ink text-canvas active:opacity-90' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          Post review
        </button>
      </div>
    </div>
  )
}
