import { useState } from 'react'
import { Phone, X, RefreshCw, ChevronRight, RotateCcw, PencilLine } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { ProviderCover } from '../components/Cover'
import { LookAttachment } from '../components/LookAttachment'
import { StaffAvatar } from '../components/StaffCard'
import { MiniMap } from '../components/MiniMap'
import { CATEGORY_BY_ID, formatDuration, formatMMK, PAYMENT_LABEL, PROVIDER_BY_ID, STAFF_BY_ID, type Booking } from '../data'
import { type GeneratedLook } from '../studio'
import { useT } from '../i18n'
import { useToast } from '../components/Toast'
import type { View } from '../nav'

export function BookingDetailScreen({
  bookingId,
  onBack,
  go,
  bookings,
  cancelBooking,
  lookLookup,
}: {
  bookingId: string
  onBack: () => void
  go: (v: View) => void
  bookings: Booking[]
  cancelBooking: (id: string) => void
  lookLookup?: (id: string) => GeneratedLook | null
}) {
  const t = useT()
  const { show } = useToast()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const booking = bookings.find((b) => b.id === bookingId)
  const provider = booking ? PROVIDER_BY_ID[booking.providerId] : null

  if (!booking || !provider) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas">
        <SubScreenHeader title={t('bookings.detail.title')} onBack={onBack} />
        <div className="px-5 pt-10 text-center text-ink-muted text-[13px]">Booking not found.</div>
      </div>
    )
  }

  const cat = CATEGORY_BY_ID[provider.category]
  const service = provider.services.find((s) => s.id === booking.serviceId)
  const staff = booking.staffId ? STAFF_BY_ID[booking.staffId] : undefined
  const total = (service?.price ?? 0) * (booking.party ?? 1)

  const onCancel = () => {
    cancelBooking(booking.id)
    show(t('toast.bookingCancelled'))
    setConfirmCancel(false)
    onBack()
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title={t('bookings.detail.title')} onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-6 px-5">
        {/* Status & confirmation # */}
        <div className="flex items-baseline justify-between mb-5">
          <span className={`text-[11px] font-semibold
            ${booking.status === 'upcoming' ? 'text-evergreen-40'
              : booking.status === 'completed' ? 'text-ink-muted'
              : 'text-rust-50'}`}>
            • {t(`bookings.status.${booking.status}`)}
          </span>
          <span className="kicker text-[9.5px]">{formatBookingId(booking.id)}</span>
        </div>

        {/* Provider header */}
        <button
          onClick={() => go({ kind: 'provider', providerId: provider.id })}
          className="w-full text-left flex items-center gap-3 group"
        >
          <ProviderCover category={provider.category} providerId={provider.id} className="h-16 w-16 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="kicker text-[9.5px]">{cat.name}</div>
            <div className="font-serif text-[18px] font-semibold tracking-tight truncate leading-tight">{provider.name}</div>
            <div className="text-[11.5px] text-ink-muted truncate">{provider.area}, {provider.city}</div>
          </div>
          <ChevronRight size={16} className="text-ink-dim shrink-0" strokeWidth={2} />
        </button>

        {/* Attached AI Studio reference look — visible only if the booking
            was made from "Book this look" in the Studio. */}
        {(() => {
          const look = booking.lookId && lookLookup ? lookLookup(booking.lookId) : null
          if (!look) return null
          return (
            <div className="mt-6">
              <LookAttachment
                look={look}
                footer={`Shared with ${provider.name}`}
              />
            </div>
          )
        })()}

        {/* Specialist */}
        {staff && (
          <button
            onClick={() => go({ kind: 'staff', staffId: staff.id })}
            className="mt-6 w-full flex items-center gap-3 p-3 rounded-2xl border border-line/70 bg-surface-elevated text-left"
          >
            <StaffAvatar staff={staff} size={40} />
            <div className="flex-1 min-w-0">
              <div className="kicker text-[9.5px]">{t('book.label.specialist')}</div>
              <div className="text-[13.5px] font-semibold tracking-tight truncate">{staff.name}</div>
              <div className="text-[11px] text-ink-muted truncate">{staff.role}</div>
            </div>
            <ChevronRight size={16} className="text-ink-dim shrink-0" strokeWidth={2} />
          </button>
        )}

        {/* Receipt — Location is in the provider header above, no need to repeat.
            Single top rule; the Total row below provides the closing rule, so
            we don't double-line the boundary between them. */}
        <div className="mt-7 border-t border-line/60 divide-y divide-line/60">
          <Row label={t('receipt.service')} value={`${service?.name ?? provider.title}${service ? ` · ${formatDuration(service.duration)}` : ''}`} />
          {staff && <Row label={t('receipt.with')} value={staff.name} />}
          <Row label={t('receipt.when')} value={`${formatDate(booking.date)} · ${booking.time}`} />
          <Row label={t('receipt.people')} value={String(booking.party ?? 1)} />
          {booking.payment && <Row label={t('receipt.payment')} value={PAYMENT_LABEL[booking.payment]} />}
          {booking.note && <Row label={t('receipt.note')} value={booking.note} />}
        </div>

        {/* Inline map + directions */}
        {provider.coords && (
          <div className="mt-6">
            <MiniMap
              coords={provider.coords}
              address={provider.address ?? `${provider.area}, ${provider.city}`}
              label={t('minimap.tap')}
            />
          </div>
        )}

      </div>

      {/* Fixed footer — actions always visible without scrolling */}
      <div className="shrink-0 bg-canvas border-t border-line/60 px-5 pt-3.5 pb-5">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[12.5px] text-ink-muted">{t('book.total')}</span>
          <span className="font-serif text-[20px] font-semibold tabular-nums tracking-tight">{formatMMK(total)}</span>
        </div>

        {booking.status === 'upcoming' && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => go({
                  kind: 'book',
                  providerId: provider.id,
                  serviceId: booking.serviceId,
                  staffId: booking.staffId,
                  initialDate: booking.date,
                  initialTime: booking.time,
                  initialParty: booking.party,
                  initialPayment: booking.payment,
                  initialNote: booking.note,
                  rescheduleOf: booking.id,
                })}
                className="h-11 rounded-full border border-line/70 text-[12.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={13} strokeWidth={2} />
                {t('bookings.detail.reschedule')}
              </button>
              <a
                href="tel:+95912345678"
                onClick={() => show(t('toast.callingProvider'))}
                className="h-11 rounded-full bg-brand text-white text-[12.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
              >
                <Phone size={13} strokeWidth={2} />
                {t('bookings.detail.contactProvider')}
              </a>
            </div>
            <button
              onClick={() => setConfirmCancel(true)}
              className="w-full mt-2 h-10 rounded-full text-rust-50 text-[12px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
            >
              <X size={12} strokeWidth={2.4} />
              {t('bookings.detail.cancel')}
            </button>
          </>
        )}

        {booking.status === 'completed' && (
          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => go({ kind: 'write-review', providerId: provider.id, bookingId: booking.id, staffId: booking.staffId })}
              className="h-12 rounded-full bg-brand text-white text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
            >
              <PencilLine size={14} strokeWidth={2.2} />
              {t('bookings.leaveReview')}
            </button>
            <button
              onClick={() => go({ kind: 'book', providerId: provider.id, serviceId: booking.serviceId, staffId: booking.staffId })}
              className="h-11 rounded-full border border-line/70 text-[12.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={13} strokeWidth={2} />
              {t('bookings.bookAgain')}
            </button>
          </div>
        )}

        {booking.status === 'cancelled' && (
          <button
            onClick={() => go({ kind: 'book', providerId: provider.id, serviceId: booking.serviceId })}
            className="w-full h-12 rounded-full bg-brand text-white text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={14} strokeWidth={2.2} />
            {t('bookings.bookAgain')}
          </button>
        )}
      </div>

      {confirmCancel && (
        <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
          <button onClick={() => setConfirmCancel(false)} className="absolute inset-0" aria-hidden />
          <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-10 animate-slide-up">
            <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
            <div className="kicker mb-1.5">{t('bookings.detail.cancel')}</div>
            <h2 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold">{t('bookings.cancel.confirm.title')}</h2>
            <p className="text-[13px] text-ink-muted mt-2">{t('bookings.cancel.confirm.sub')}</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setConfirmCancel(false)}
                className="h-11 rounded-full border border-line/70 text-[13px] font-semibold leading-none inline-flex items-center justify-center"
              >
                {t('bookings.cancel.keep')}
              </button>
              <button
                onClick={onCancel}
                className="h-11 rounded-full bg-rust-50 text-white text-[13px] font-semibold leading-none inline-flex items-center justify-center"
              >
                {t('bookings.cancel.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4 py-3.5">
      <div className="kicker text-[9.5px] w-20 shrink-0">{label}</div>
      <div className="text-[13.5px] flex-1 break-words">{value}</div>
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  const dows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${dows[d.getDay()]}, ${mons[d.getMonth()]} ${d.getDate()}`
}

/**
 * "b_1762430927989" → "BKLY-7989". Stable per booking, easier to read aloud
 * than a raw timestamp tail.
 */
function formatBookingId(id: string): string {
  const tail = id.replace(/[^0-9]/g, '').slice(-4) || id.slice(-4)
  return `BKLY-${tail.toUpperCase()}`
}
