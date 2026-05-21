import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { ProviderCover } from '../components/Cover'
import { CATEGORY_BY_ID, formatMMK, PROVIDER_BY_ID, type Booking } from '../data'
import { useT } from '../i18n'
import type { Tab, View } from '../nav'

export function MyBookingsScreen({
  bookings,
  go,
  setTab,
}: {
  bookings: Booking[]
  go: (v: View) => void
  setTab: (t: Tab) => void
}) {
  const t = useT()
  const [pane, setPane] = useState<'upcoming' | 'past'>('upcoming')

  const upcoming = bookings.filter((b) => b.status === 'upcoming')
  const past = bookings.filter((b) => b.status !== 'upcoming')
  const list = pane === 'upcoming' ? upcoming : past

  return (
    <div className="px-5 pt-2 pb-2 animate-fade-in">
      <div className="kicker mb-1.5">{t('bookings.kicker')}</div>
      <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-5">
        {t('bookings.headline')}
      </h1>

      {/* Tabs as quiet underlines (not pill-stuffed) */}
      <div className="flex items-center gap-6 border-b border-line/60 mb-6">
        <UnderlineTab active={pane === 'upcoming'} onClick={() => setPane('upcoming')} count={upcoming.length}>
          {t('bookings.tab.upcoming')}
        </UnderlineTab>
        <UnderlineTab active={pane === 'past'} onClick={() => setPane('past')} count={past.length}>
          {t('bookings.tab.past')}
        </UnderlineTab>
      </div>

      {list.length === 0 ? (
        <Empty pane={pane} onCTA={() => setTab('home')} />
      ) : (
        <div className="space-y-5">
          {list.map((b) => (
            <TripCard key={b.id} booking={b} onClick={() => go({ kind: 'booking-detail', bookingId: b.id })} />
          ))}
        </div>
      )}
    </div>
  )
}

function UnderlineTab({ active, onClick, count, children }: { active: boolean; onClick: () => void; count: number; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-3 text-[13.5px] font-semibold transition
        ${active ? 'text-ink' : 'text-ink-muted'}`}
    >
      {children}
      {count > 0 && (
        <span className={`ml-1.5 text-[10.5px] tabular-nums font-semibold ${active ? 'text-ink-muted' : 'text-ink-dim'}`}>
          {count}
        </span>
      )}
      {active && <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-brand rounded-full" />}
    </button>
  )
}

/**
 * Magazine-style trip card: cover left, copy right with inline meta.
 */
function TripCard({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  const t = useT()
  const provider = PROVIDER_BY_ID[booking.providerId]
  if (!provider) return null
  const cat = CATEGORY_BY_ID[provider.category]
  const service = provider.services.find((s) => s.id === booking.serviceId)
  const total = (service?.price ?? 0) * (booking.party ?? 1)

  return (
    <button onClick={onClick} className="w-full text-left">
      <div className="flex gap-3.5">
        <ProviderCover category={provider.category} providerId={provider.id} className="shrink-0 h-28 w-28 rounded-2xl">
          <div className="absolute inset-x-0 bottom-0 px-2 pb-2">
            <div className="text-[18px] font-serif font-semibold tabular-nums text-white leading-none">
              {dayOnly(booking.date)}
            </div>
            <div className="text-[11px] font-medium text-white/85">
              {monthOnly(booking.date)}
            </div>
          </div>
        </ProviderCover>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-baseline gap-2">
            <div className="kicker text-[9.5px] flex-1">{cat.name}</div>
            <StatusPill status={booking.status} />
          </div>
          <div className="font-serif text-[16px] font-semibold tracking-tight leading-tight mt-0.5 truncate">
            {provider.name}
          </div>
          <div className="text-[12px] text-ink-muted truncate">{service?.name ?? provider.title}</div>
          <div className="mt-2 flex items-center gap-2 text-[11.5px] text-ink-muted">
            <span>{booking.time}</span>
            <span className="text-ink-dim">·</span>
            <span>{t((booking.party ?? 1) === 1 ? 'bookings.partyPerson' : 'bookings.partyPeople', { count: booking.party ?? 1 })}</span>
            <span className="text-ink-dim">·</span>
            <span className="font-semibold text-ink tabular-nums">{formatMMK(total)}</span>
          </div>
          {booking.status === 'upcoming' && (
            <div className="text-[11px] text-ink-dim mt-1.5 font-medium">
              {t('bookings.detail.title')} →
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

function StatusPill({ status }: { status: Booking['status'] }) {
  const t = useT()
  const tone =
    status === 'upcoming' ? 'text-evergreen-40' :
    status === 'completed' ? 'text-ink-muted' :
    'text-rust-50'
  return (
    <span className={`text-[11px] font-semibold ${tone}`}>
      • {t(`bookings.status.${status}`)}
    </span>
  )
}

function Empty({ pane, onCTA }: { pane: 'upcoming' | 'past'; onCTA: () => void }) {
  const t = useT()
  return (
    <div className="py-16 text-center px-6">
      <div className="mx-auto h-12 w-12 rounded-full border border-line grid place-items-center mb-4">
        <Calendar size={18} className="text-ink-muted" strokeWidth={1.7} />
      </div>
      <h2 className="font-serif text-[18px] font-semibold tracking-tight">
        {t(pane === 'upcoming' ? 'bookings.empty.upcoming.title' : 'bookings.empty.past.title')}
      </h2>
      <p className="text-[12.5px] text-ink-muted mt-1.5 max-w-[260px] mx-auto">
        {t(pane === 'upcoming' ? 'bookings.empty.upcoming.sub' : 'bookings.empty.past.sub')}
      </p>
      <button
        onClick={onCTA}
        className="mt-5 h-10 px-5 rounded-full bg-brand text-white text-[12.5px] font-semibold"
      >
        {t('bookings.findProvider')}
      </button>
    </div>
  )
}

function dayOnly(iso: string): string {
  return String(new Date(iso + 'T00:00:00').getDate())
}
function monthOnly(iso: string): string {
  const mons = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return mons[new Date(iso + 'T00:00:00').getMonth()]
}
