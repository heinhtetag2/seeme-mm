import { useT } from '../i18n'
import type { View } from '../nav'

export function BookSuccessScreen({
  bookingId,
  onDone,
  go,
}: {
  bookingId: string
  onDone: () => void
  go: (v: View) => void
}) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-40 bg-canvas flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="kicker mb-3">CONFIRMED</div>
        <h1 className="font-serif text-[34px] leading-[1.05] tracking-tight font-semibold text-balance">
          You're all<br />
          <span className="italic">booked.</span>
        </h1>
        <p className="text-[13px] leading-relaxed text-ink-muted mt-4 text-balance max-w-[300px]">
          {t('book.success.sub')}
        </p>

        {/* Decorative receipt */}
        <div className="mt-10 w-full max-w-[280px] relative">
          <div className="absolute inset-x-0 -top-1 flex justify-between">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-canvas" />
            ))}
          </div>
          <div className="rounded-2xl border border-line/70 bg-surface-elevated px-5 py-6 text-left">
            <div className="kicker mb-1">CONFIRMATION</div>
            <div className="font-serif text-[15px] font-semibold tracking-tight">
              #{bookingId.slice(-8).toUpperCase()}
            </div>
            <div className="divider my-4" />
            <div className="text-[11.5px] text-ink-muted leading-relaxed">
              We've sent the details to your phone. Reschedule or cancel anytime from My Bookings.
            </div>
          </div>
          <div className="absolute inset-x-0 -bottom-1 flex justify-between">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-canvas" />
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-10 space-y-3">
        <button
          onClick={() => go({ kind: 'booking-detail', bookingId })}
          className="w-full h-12 rounded-full bg-ink text-canvas text-[14px] font-semibold leading-none inline-flex items-center justify-center"
        >
          {t('book.success.viewBooking')}
        </button>
        <button
          onClick={onDone}
          className="w-full h-12 rounded-full text-[13.5px] font-semibold leading-none text-ink-muted inline-flex items-center justify-center"
        >
          {t('book.success.done')}
        </button>
      </div>
    </div>
  )
}
