import { useState } from 'react'
import { Star, ShieldCheck, ThumbsUp, MessageSquareReply } from 'lucide-react'
import type { Review } from '../data'
import { useT } from '../i18n'

/* ───────── StarRating: read-only or interactive ─────────
 * size controls the icon size; when `onChange` is provided the row becomes
 * a touch target and shows a hover preview before commit.
 */
export function StarRating({
  value,
  onChange,
  size = 14,
  showNumber = false,
}: {
  value: number
  onChange?: (n: number) => void
  size?: number
  showNumber?: boolean
}) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value
  const interactive = !!onChange
  return (
    <span className={`inline-flex items-center gap-0.5 ${interactive ? 'cursor-pointer' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= shown
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => interactive && setHover(n)}
            onMouseLeave={() => interactive && setHover(null)}
            className={`p-0.5 ${interactive ? 'transition-transform active:scale-90' : ''}`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              strokeWidth={1.8}
              className={active ? 'text-data-yellow-30' : 'text-ink-dim/50'}
              fill={active ? 'currentColor' : 'none'}
            />
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-1.5 text-[12px] font-semibold tabular-nums text-ink">{value.toFixed(1)}</span>
      )}
    </span>
  )
}

/* ───────── ReviewCard: single review with helpful + reply ───────── */
export function ReviewCard({
  review,
  onHelpful,
  isHelpful,
}: {
  review: Review
  /** Toggle helpful — caller persists the up-vote into state. */
  onHelpful?: () => void
  /** Has the current user already marked it helpful? */
  isHelpful?: boolean
}) {
  const t = useT()
  return (
    <article className="py-4 first:pt-6">
      <header className="flex items-start gap-3">
        <span className="h-9 w-9 shrink-0 rounded-full bg-surface-higher text-ink font-semibold grid place-items-center text-[13px]">
          {review.authorInitial}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13.5px] font-semibold tracking-tight">{review.authorName}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-evergreen-50">
                <ShieldCheck size={10.5} strokeWidth={2.2} />
                {t('review.verified')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating value={review.rating} size={11.5} />
            <span className="text-[11px] text-ink-dim">·</span>
            <span className="text-[11px] text-ink-dim">{review.when}</span>
          </div>
        </div>
      </header>
      <p className="mt-2.5 text-[13.5px] leading-[1.55] text-ink/90">{review.body}</p>

      {review.reply && (
        <div className="mt-3 ml-12 p-3 rounded-2xl border border-line/60 bg-surface-elevated/60">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink mb-1">
            <MessageSquareReply size={11.5} strokeWidth={2.2} className="text-ink-dim" />
            {review.reply.author}
            <span className="text-ink-dim font-normal">· {review.reply.when}</span>
          </div>
          <p className="text-[12.5px] leading-[1.55] text-ink-muted">{review.reply.body}</p>
        </div>
      )}

      <div className="mt-3 ml-12">
        <button
          onClick={onHelpful}
          className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-[11.5px] font-semibold leading-none transition
            ${isHelpful
              ? 'border-alpha-evergreen-20 bg-alpha-evergreen-10 text-evergreen-50'
              : 'border-line/70 text-ink-muted hover:border-line-strong hover:text-ink'}`}
          aria-pressed={!!isHelpful}
        >
          <ThumbsUp size={11.5} strokeWidth={2.2} fill={isHelpful ? 'currentColor' : 'none'} />
          Helpful · {review.helpful + (isHelpful ? 1 : 0)}
        </button>
      </div>
    </article>
  )
}

/* ───────── RatingSummary: average + bar chart breakdown ───────── */
export function RatingSummary({
  average,
  total,
  distribution,
}: {
  average: number
  total: number
  /** 5,4,3,2,1 counts. */
  distribution: [number, number, number, number, number]
}) {
  const max = Math.max(1, ...distribution)
  return (
    <div className="flex items-center gap-5">
      <div className="text-center">
        <div className="font-serif text-[36px] leading-none font-semibold tabular-nums">
          {average.toFixed(1)}
        </div>
        <div className="mt-1.5"><StarRating value={Math.round(average)} size={12} /></div>
        <div className="text-[10.5px] text-ink-dim mt-1">{total} reviews</div>
      </div>
      <div className="flex-1 space-y-1">
        {distribution.map((count, i) => {
          const stars = 5 - i
          const pct = (count / max) * 100
          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="w-3 text-[10.5px] tabular-nums text-ink-dim text-right">{stars}</span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-higher overflow-hidden">
                <div
                  className="h-full bg-data-yellow-30 rounded-full transition-[width] duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-5 text-[10.5px] tabular-nums text-ink-dim">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
