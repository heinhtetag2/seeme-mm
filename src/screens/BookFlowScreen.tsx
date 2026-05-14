import { useMemo, useState } from 'react'
import { Check, Minus, Plus, Sun, CloudSun, Moon, CalendarDays, ChevronLeft, ChevronRight, Flame, type LucideIcon } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { ProviderCover } from '../components/Cover'
import { LookAttachment } from '../components/LookAttachment'
import { StaffCard, AnyStaffCard } from '../components/StaffCard'
import { PaymentPicker, InstantConfirmBadge } from '../components/PaymentPicker'
import { CATEGORY_BY_ID, formatDuration, formatMMK, PROVIDER_BY_ID, staffByProvider, type PaymentMethod } from '../data'
import { type GeneratedLook } from '../studio'
import { useT } from '../i18n'
import type { View } from '../nav'

export function BookFlowScreen({
  providerId,
  initialServiceId,
  initialStaffId,
  initialDate,
  initialTime,
  initialParty,
  initialPayment,
  initialNote,
  rescheduleOf,
  lookId,
  lookLookup,
  onBack,
  go,
}: {
  providerId: string
  initialServiceId?: string
  initialStaffId?: string
  initialDate?: string
  initialTime?: string
  initialParty?: number
  initialPayment?: PaymentMethod
  initialNote?: string
  rescheduleOf?: string
  lookId?: string
  lookLookup?: (id: string) => GeneratedLook | null
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const provider = PROVIDER_BY_ID[providerId]
  if (!provider) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas">
        <SubScreenHeader onBack={onBack} title={t('book.title')} />
      </div>
    )
  }

  const cat = CATEGORY_BY_ID[provider.category]
  const staff = useMemo(() => staffByProvider(provider.id), [provider.id])
  const paymentMethods = provider.paymentMethods ?? ['cash']
  const [serviceId, setServiceId] = useState<string>(initialServiceId ?? provider.services[0]?.id ?? '')
  const [staffId, setStaffId] = useState<string | undefined>(initialStaffId)
  const [payment, setPayment] = useState<PaymentMethod>(initialPayment ?? paymentMethods[0])
  const [date, setDate] = useState<string>(initialDate ?? todayISO())
  const [dateSheet, setDateSheet] = useState(false)
  const quickPicks = useMemo(() => buildQuickPicks(), [])
  const isQuickPick = quickPicks.some((p) => p.iso === date)
  const [time, setTime] = useState<string>(initialTime ?? '')
  const [party, setParty] = useState<number>(initialParty ?? 1)
  const [note, setNote] = useState<string>(initialNote ?? '')
  /** Local mirror so "Remove" can detach the look without leaving the screen. */
  const [activeLookId, setActiveLookId] = useState<string | undefined>(lookId)

  const service = provider.services.find((s) => s.id === serviceId) ?? provider.services[0]
  const slots = generateSlots(provider.hours)
  const canContinue = !!serviceId && !!date && !!time

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title={t('book.title')} onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
      {/* Provider summary card */}
      <div className="px-5">
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-line/70 bg-surface-elevated">
          <ProviderCover category={provider.category} providerId={provider.id} className="shrink-0 h-12 w-12 rounded-xl" />
          <div className="flex-1 min-w-0">
            <div className="kicker text-[9.5px]">{cat.name}</div>
            <div className="text-[14px] font-semibold tracking-tight truncate">{provider.name}</div>
          </div>
        </div>
      </div>

      {/* AI Studio look attached to this booking — shown if the user came from
          "Book this look" so they can see the look is travelling with them. */}
      <BookingLookAttachment
        lookId={activeLookId}
        lookLookup={lookLookup}
        onChange={(kind) => go({ kind: 'studio-generate', look: kind })}
        onRemove={() => setActiveLookId(undefined)}
      />

      {/* Provider perks strip */}
      {provider.instantConfirm && (
        <div className="px-5 mt-3">
          <InstantConfirmBadge size="md" />
        </div>
      )}

      {/* Step: service */}
      <Step kicker="Step 1" title={t('book.step.service')}>
        <div className="divide-y divide-line/60 border-y border-line/60">
          {provider.services.map((s, i) => {
            const isSel = serviceId === s.id
            // Heuristic: tag the middle option in a 3+ service list, or the
            // first one for a 2-item list. Real app would derive from analytics.
            const isPopular =
              provider.services.length >= 3 ? i === 1 : provider.services.length === 2 ? i === 0 : false
            return (
              <button
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className="w-full flex items-baseline justify-between gap-3 py-4 text-left"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className={`relative top-0.5 h-4 w-4 rounded-full grid place-items-center transition shrink-0
                    ${isSel ? 'bg-ink' : 'border border-line-strong'}`}>
                    {isSel && <Check size={9} strokeWidth={3.4} className="text-canvas" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="text-[14px] font-serif font-semibold tracking-tight">{s.name}</div>
                      {isPopular && (
                        <span className="inline-flex items-center gap-0.5 h-[18px] pl-1.5 pr-2 rounded-full bg-rust-50 text-white text-[9.5px] font-semibold uppercase tracking-[0.04em]">
                          <Flame size={9.5} strokeWidth={0} fill="currentColor" /> {t('book.mostPicked')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-ink-muted mt-0.5">{formatDuration(s.duration)}</div>
                  </div>
                </div>
                <div className="text-[13.5px] font-semibold tabular-nums">{formatMMK(s.price)}</div>
              </button>
            )
          })}
        </div>
      </Step>

      {/* Step: specialist */}
      {staff.length > 0 && (
        <Step kicker="Step 2" title={t('book.step.specialist')}>
          <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-hide">
            <AnyStaffCard selected={staffId === undefined} onClick={() => setStaffId(undefined)} />
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
            <div className="mt-2 text-[11.5px] text-ink-muted">
              Booking with{' '}
              <button
                onClick={() => go({ kind: 'staff', staffId })}
                className="text-ink font-semibold underline underline-offset-2 decoration-line-strong"
              >
                {staff.find((s) => s.id === staffId)?.name}
              </button>
            </div>
          )}
        </Step>
      )}

      {/* Step: date — quick-pick chips + "Pick date" opens a full calendar sheet */}
      <Step kicker={staff.length > 0 ? 'Step 3' : 'Step 2'} title={t('book.step.date')}>
        <div className="flex flex-wrap gap-2">
          {quickPicks.map((p) => (
            <DateChip
              key={p.iso}
              selected={date === p.iso}
              onClick={() => { setDate(p.iso); setTime('') }}
            >
              {p.label}
            </DateChip>
          ))}
          {/* Custom date pill — shows the picked date if it's not in the quick picks */}
          {!isQuickPick && (
            <DateChip selected onClick={() => setDateSheet(true)}>
              {formatChip(date)}
            </DateChip>
          )}
          <button
            onClick={() => setDateSheet(true)}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full border border-line/70 bg-surface-elevated text-[12.5px] font-semibold leading-none text-ink hover:border-line-strong transition"
          >
            <CalendarDays size={13} strokeWidth={2.2} />
            Pick date
          </button>
        </div>
      </Step>

      {/* Step: time — grouped by part of day */}
      <Step kicker={staff.length > 0 ? 'Step 4' : 'Step 3'} title={t('book.step.when')}>
        <TimeGroup Icon={Sun} label={t('book.label.morning')} slots={slots.morning} value={time} onPick={setTime} />
        <TimeGroup Icon={CloudSun} label={t('book.label.afternoon')} slots={slots.afternoon} value={time} onPick={setTime} />
        <TimeGroup Icon={Moon} label={t('book.label.evening')} slots={slots.evening} value={time} onPick={setTime} />
      </Step>

      {/* Step: payment */}
      <Step kicker={staff.length > 0 ? 'Step 5' : 'Step 4'} title={t('book.step.payment')}>
        <PaymentPicker methods={paymentMethods} value={payment} onChange={setPayment} />
        {payment !== 'cash' && (
          <p className="mt-2.5 text-[11.5px] text-ink-muted">
            You'll be redirected to {paymentLabel(payment)} after you confirm. Nothing is charged until the provider accepts.
          </p>
        )}
      </Step>

      {/* Step: details */}
      <Step kicker={staff.length > 0 ? 'Step 6' : 'Step 5'} title={t('book.step.details')}>
        <div className="flex items-center justify-between py-3 border-y border-line/60 mb-3">
          <div>
            <div className="text-[13.5px] font-semibold">{t('book.party')}</div>
            <div className="text-[11px] text-ink-muted mt-0.5">1–8 people</div>
          </div>
          <Stepper value={party} onChange={setParty} min={1} max={8} />
        </div>

        <div>
          <label className="text-[11.5px] text-ink-dim font-medium">{t('book.note')}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('book.note.placeholder')}
            rows={3}
            className="mt-1.5 w-full p-3.5 rounded-2xl border border-line/70 bg-surface-elevated text-[13px] outline-none placeholder:text-ink-muted resize-none focus:border-line-strong"
          />
        </div>
      </Step>

        <div className="h-6" />
      </div>

      {/* Date sheet — single month with nav arrows */}
      {dateSheet && (
        <DateSheet
          selected={date}
          onPick={(picked) => { setDate(picked); setTime(''); setDateSheet(false) }}
          onClose={() => setDateSheet(false)}
        />
      )}

      {/* Fixed footer — outside the scroll, pinned to the bottom of the frame */}
      <div className="shrink-0 bg-canvas border-t border-line/60 px-5 pt-3.5 pb-5">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[12.5px] text-ink-muted">{t('book.total')}</span>
          <span className="text-[16px] font-semibold tabular-nums text-ink">
            {formatMMK((service?.price ?? 0) * party)}
          </span>
        </div>
        <button
          onClick={() => canContinue && go({
            kind: 'book-review',
            providerId: provider.id,
            serviceId,
            staffId,
            payment,
            date,
            time,
            party,
            note: note.trim() || undefined,
            lookId: activeLookId,
            rescheduleOf,
          })}
          disabled={!canContinue}
          className={`w-full h-12 rounded-full text-[14px] font-semibold leading-none inline-flex items-center justify-center transition
            ${canContinue ? 'bg-ink text-canvas active:opacity-90' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {t('book.continue')}
        </button>
      </div>
    </div>
  )
}

/**
 * Compact reference card shown at the top of the booking flow when the user
 * arrived from the AI Studio. Makes it obvious that the generated look is
 * attached to this booking — provider sees it on confirmation.
 */
function BookingLookAttachment({
  lookId, lookLookup, onChange, onRemove,
}: {
  lookId?: string
  lookLookup?: (id: string) => GeneratedLook | null
  onChange?: (kind: GeneratedLook['kind']) => void
  onRemove?: () => void
}) {
  if (!lookId || !lookLookup) return null
  const look = lookLookup(lookId)
  if (!look) return null
  return (
    <div className="px-5 mt-3">
      <LookAttachment
        look={look}
        footer="Provider will see this image on confirmation"
        onChange={onChange ? () => onChange(look.kind) : undefined}
        onRemove={onRemove}
      />
    </div>
  )
}

function Step({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="px-5 pt-7">
      <div className="kicker mb-1.5">{kicker}</div>
      <h2 className="font-serif text-[19px] font-semibold tracking-tight mb-4 leading-tight">{title}</h2>
      {children}
    </section>
  )
}

function TimeGroup({
  Icon, label, slots, value, onPick,
}: {
  Icon: LucideIcon
  label: string
  slots: string[]
  value: string
  onPick: (v: string) => void
}) {
  if (slots.length === 0) return null
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 text-[11px] text-ink-dim font-medium mb-2">
        <Icon size={11.5} strokeWidth={2} />
        {label}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {slots.map((s) => {
          const isSel = value === s
          return (
            <button
              key={s}
              onClick={() => onPick(s)}
              className={`h-10 rounded-full border text-[12px] font-semibold leading-none tabular-nums inline-flex items-center justify-center transition
                ${isSel
                  ? 'bg-ink text-canvas border-ink'
                  : 'bg-surface-elevated border-line/70 text-ink-muted hover:border-line-strong hover:text-ink'}`}
            >
              {s}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Stepper({ value, onChange, min, max }: { value: number; onChange: (n: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-9 w-9 rounded-full border border-line/70 grid place-items-center disabled:opacity-40"
        disabled={value <= min}
      >
        <Minus size={13} strokeWidth={2.4} />
      </button>
      <span className="w-5 text-center text-[15px] font-bold tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="h-9 w-9 rounded-full border border-line/70 grid place-items-center disabled:opacity-40"
        disabled={value >= max}
      >
        <Plus size={13} strokeWidth={2.4} />
      </button>
    </div>
  )
}

function todayISO(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return iso(d)
}

function iso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

const DOW_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

type QuickPick = { iso: string; label: string }

function buildQuickPicks(): QuickPick[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  // Nearest upcoming Saturday and Sunday — if today is Sat/Sun we still show next one.
  const sat = nextDow(today, 6)
  const sun = nextDow(today, 0)
  return [
    { iso: iso(today),    label: 'Today' },
    { iso: iso(tomorrow), label: 'Tomorrow' },
    { iso: iso(sat),      label: `Sat ${sat.getDate()}` },
    { iso: iso(sun),      label: `Sun ${sun.getDate()}` },
  ]
}

function nextDow(from: Date, targetDow: number): Date {
  const d = new Date(from)
  const delta = (targetDow - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + delta)
  return d
}

/** "Wed, May 13" — used on the custom-date chip when picked from the sheet. */
function formatChip(isoStr: string): string {
  const d = new Date(isoStr + 'T00:00:00')
  return `${DOW[d.getDay()]} ${MON_FULL[d.getMonth()].slice(0, 3)} ${d.getDate()}`
}

function DateChip({
  selected, onClick, children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center justify-center h-10 px-4 rounded-full border text-[12.5px] font-semibold leading-none transition
        ${selected
          ? 'bg-ink text-canvas border-ink'
          : 'bg-surface-elevated text-ink border-line/70 hover:border-line-strong'}`}
    >
      {children}
    </button>
  )
}

/**
 * Bottom-sheet calendar — single month at a time with chevron navigation.
 * Past dates are disabled. Tapping a day commits and closes the sheet.
 */
function DateSheet({
  selected, onPick, onClose,
}: {
  selected: string
  onPick: (iso: string) => void
  onClose: () => void
}) {
  const todayStr = todayISO()
  const initial = new Date(selected + 'T00:00:00')
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() })
  const now = new Date()
  const todayYM = { y: now.getFullYear(), m: now.getMonth() }
  const canGoBack = view.y > todayYM.y || (view.y === todayYM.y && view.m > todayYM.m)
  const cells = buildMonth(view.y, view.m)
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[85%] overflow-y-auto">
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => canGoBack && setView((v) => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })}
            disabled={!canGoBack}
            className="h-9 w-9 grid place-items-center rounded-full border border-line/70 disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} strokeWidth={2.2} />
          </button>
          <div className="font-serif text-[18px] font-semibold tracking-tight">
            {MON_FULL[view.m]} {view.y}
          </div>
          <button
            onClick={() => setView((v) => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })}
            className="h-9 w-9 grid place-items-center rounded-full border border-line/70"
            aria-label="Next month"
          >
            <ChevronRight size={16} strokeWidth={2.2} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[11px] text-ink-dim font-medium mb-1">
          {DOW_SHORT.map((d, i) => (
            <div key={i} className="h-6 grid place-items-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={i} className="h-10" />
            const isSel = selected === cell.iso
            const isPast = cell.iso < todayStr
            return (
              <button
                key={cell.iso}
                disabled={isPast}
                onClick={() => onPick(cell.iso)}
                className={`h-10 rounded-full text-[13px] font-semibold leading-none tabular-nums inline-flex items-center justify-center transition
                  ${isSel
                    ? 'bg-ink text-canvas'
                    : isPast
                      ? 'text-ink-dim cursor-not-allowed'
                      : 'text-ink hover:bg-surface-higher'}`}
              >
                {cell.day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

type CalCell = { iso: string; day: number } | null

function buildMonth(year: number, month: number): CalCell[] {
  const startDow = new Date(year, month, 1).getDay()
  const daysIn = new Date(year, month + 1, 0).getDate()
  const cells: CalCell[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysIn; d++) cells.push({ iso: `${year}-${pad(month + 1)}-${pad(d)}`, day: d })
  return cells
}

function paymentLabel(m: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    cash: 'cash',
    kbz: 'KBZPay',
    wave: 'Wave',
    aya: 'AYA Pay',
    card: 'your card',
  }
  return map[m]
}

function generateSlots(hours: string): { morning: string[]; afternoon: string[]; evening: string[] } {
  const m = hours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
  let start = 9, end = 18
  if (m) { start = parseInt(m[1], 10); end = parseInt(m[3], 10) }
  const all: string[] = []
  for (let h = start; h < end; h++) {
    all.push(`${pad(h)}:00`)
    all.push(`${pad(h)}:30`)
  }
  return {
    morning: all.filter((s) => parseInt(s, 10) < 12),
    afternoon: all.filter((s) => parseInt(s, 10) >= 12 && parseInt(s, 10) < 17),
    evening: all.filter((s) => parseInt(s, 10) >= 17),
  }
}
