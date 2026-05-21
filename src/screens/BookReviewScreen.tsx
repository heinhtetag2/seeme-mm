import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Zap, RotateCcw } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { ProviderCover } from '../components/Cover'
import { LookAttachment } from '../components/LookAttachment'
import { StaffAvatar } from '../components/StaffCard'
import { CATEGORY_BY_ID, formatDuration, formatMMK, PAYMENT_LABEL, PROVIDER_BY_ID, STAFF_BY_ID, type Booking, type PaymentMethod } from '../data'
import { type GeneratedLook } from '../studio'
import { useT } from '../i18n'
import { useToast } from '../components/Toast'
import type { View } from '../nav'

export function BookReviewScreen({
  providerId,
  serviceId,
  staffId,
  payment,
  date,
  time,
  party,
  note,
  lookId,
  lookLookup,
  onBack,
  go,
  addBooking,
  rescheduleOf,
  cancelBooking,
}: {
  providerId: string
  serviceId: string
  staffId?: string
  payment: PaymentMethod
  date: string
  time: string
  party: number
  note?: string
  lookId?: string
  lookLookup?: (id: string) => GeneratedLook | null
  onBack: () => void
  go: (v: View) => void
  addBooking: (b: Booking) => void
  rescheduleOf?: string
  cancelBooking?: (id: string) => void
}) {
  const t = useT()
  const { show } = useToast()
  const provider = PROVIDER_BY_ID[providerId]
  // Sticky-Total visibility: hide footer Total when the inline one is on screen.
  const inlineTotalRef = useRef<HTMLDivElement>(null)
  const [totalInView, setTotalInView] = useState(false)

  useEffect(() => {
    const el = inlineTotalRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setTotalInView(entry.isIntersecting),
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  if (!provider) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas">
        <SubScreenHeader onBack={onBack} title={t('book.review')} />
      </div>
    )
  }
  const cat = CATEGORY_BY_ID[provider.category]
  const service = provider.services.find((s) => s.id === serviceId) ?? provider.services[0]
  const staff = staffId ? STAFF_BY_ID[staffId] : undefined
  const total = (service?.price ?? 0) * party

  const onConfirm = () => {
    const id = `b_${Date.now()}`
    const booking: Booking = {
      id, providerId, serviceId, staffId, payment, date, time, party, note,
      lookId,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    }
    if (rescheduleOf && cancelBooking) cancelBooking(rescheduleOf)
    addBooking(booking)
    show(rescheduleOf ? t('toast.bookingRescheduled') : t('toast.bookingConfirmed'))
    go({ kind: 'book-success', bookingId: id })
  }

  const attachedLook = lookId && lookLookup ? lookLookup(lookId) : null

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title={t('book.review')} onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
      <div className="px-5 space-y-6">
        {/* Editorial title */}
        <div>
          <div className="kicker mb-1.5">{t('book.label.review')}</div>
          <h1 className="font-serif text-[26px] leading-[1.1] tracking-tight font-semibold">
            One last look before<br />we confirm.
          </h1>
        </div>

        {/* Provider */}
        <div className="flex items-center gap-3">
          <ProviderCover category={provider.category} providerId={provider.id} className="h-16 w-16 rounded-xl" />
          <div className="min-w-0">
            <div className="kicker text-[9.5px]">{cat.name}</div>
            <div className="text-[15px] font-semibold tracking-tight truncate">{provider.name}</div>
            <div className="text-[11.5px] text-ink-muted truncate">{provider.area}, {provider.city}</div>
          </div>
        </div>

        {/* Confirmation + cancellation badges — surfaced early so they're hard to miss. */}
        <div className="flex flex-wrap gap-1.5 text-[11.5px]">
          {provider.instantConfirm ? (
            <span className="inline-flex items-center gap-1 h-7 pl-2 pr-3 rounded-full bg-alpha-evergreen-10 text-evergreen-60 font-semibold">
              <Zap size={12} strokeWidth={2.4} fill="currentColor" /> {t('badge.instantBooking')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 h-7 pl-2 pr-3 rounded-full bg-surface-higher text-ink font-semibold">
              <ShieldCheck size={12} strokeWidth={2.2} /> {t('badge.providerConfirms')}
            </span>
          )}
          <span className="inline-flex items-center gap-1 h-7 pl-2 pr-3 rounded-full bg-surface-higher text-ink-muted">
            <RotateCcw size={11.5} strokeWidth={2.2} /> {t('badge.freeCancel2h')}
          </span>
        </div>

        {/* Attached AI Studio look — appears only if user came from "Book this look" */}
        {attachedLook && (
          <LookAttachment
            look={attachedLook}
            footer={`Sent to ${provider.name} with your booking`}
          />
        )}

        {/* Staff strip */}
        {staff && (
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-line/70 bg-surface-elevated">
            <StaffAvatar staff={staff} size={40} />
            <div className="flex-1 min-w-0">
              <div className="kicker text-[9.5px]">{t('book.label.specialist')}</div>
              <div className="text-[13.5px] font-semibold tracking-tight truncate">{staff.name}</div>
              <div className="text-[11px] text-ink-muted truncate">{staff.role}</div>
            </div>
          </div>
        )}

        {/* Receipt — Location is in the provider header above. */}
        <div className="border-y border-line/60 divide-y divide-line/60">
          <ReceiptRow label={t('receipt.service')} value={`${service?.name}${service ? ` · ${formatDuration(service.duration)}` : ''}`} />
          <ReceiptRow label={t('receipt.with')} value={staff ? staff.name : t('receipt.anyAvailable')} />
          <ReceiptRow label={t('receipt.when')} value={`${formatDate(date)} · ${time}`} />
          <ReceiptRow label={t('receipt.people')} value={String(party)} />
          <ReceiptRow label={t('receipt.payment')} value={PAYMENT_LABEL[payment]} />
          {note && <ReceiptRow label={t('receipt.note')} value={note} />}
        </div>

        {/* Total */}
        <div>
          <div className="flex items-baseline justify-between text-[12.5px]">
            <span className="text-ink-muted">{service?.name} × {party}</span>
            <span className="tabular-nums">{formatMMK((service?.price ?? 0) * party)}</span>
          </div>
          <div className="flex items-baseline justify-between text-[12.5px] mt-1.5">
            <span className="text-ink-muted">{t('receipt.serviceFee')}</span>
            <span className="tabular-nums text-ink-muted">{t('receipt.free')}</span>
          </div>
          <div
            ref={inlineTotalRef}
            className="border-t border-line/60 mt-3 pt-3 flex items-baseline justify-between"
          >
            <span className="font-serif text-[16px] font-semibold tracking-tight">{t('book.total')}</span>
            <span className="font-serif text-[22px] font-semibold tabular-nums tracking-tight">{formatMMK(total)}</span>
          </div>
        </div>
      </div>

        <div className="h-6" />
      </div>

      {/* Fixed footer — Total label collapses smoothly when the inline Total
          becomes visible, so users never see two prices at once. */}
      <div className="shrink-0 bg-canvas border-t border-line/60 px-5 pt-3.5 pb-5">
        <div
          className={`flex items-baseline justify-between overflow-hidden transition-all duration-200 ease-out ${
            totalInView ? 'h-0 mb-0 opacity-0' : 'h-5 mb-3 opacity-100'
          }`}
        >
          <span className="text-[12.5px] text-ink-muted">{t('book.total')}</span>
          <span className="text-[16px] font-semibold tabular-nums text-ink">{formatMMK(total)}</span>
        </div>
        <button
          onClick={onConfirm}
          className="w-full h-12 rounded-full bg-brand text-white text-[14px] font-semibold leading-none inline-flex items-center justify-center active:opacity-90"
        >
          {t('book.confirm')}
        </button>
      </div>
    </div>
  )
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4 py-3.5">
      <div className="kicker text-[9.5px] w-20 shrink-0">{label}</div>
      <div className="text-[13.5px] flex-1 break-words">{value}</div>
    </div>
  )
}

function formatDate(isoStr: string): string {
  const d = new Date(isoStr + 'T00:00:00')
  const dows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${dows[d.getDay()]}, ${mons[d.getMonth()]} ${d.getDate()}`
}
