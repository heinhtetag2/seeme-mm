import { useState } from 'react'
import {
  Bell, CalendarCheck, MessageSquare, Star, Sparkles, BellOff, Settings2,
  type LucideIcon,
} from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import {
  SAMPLE_NOTIFICATIONS, PROVIDER_BY_ID,
  type AppNotification, type NotificationKind,
} from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

const ICON_BY_KIND: Record<NotificationKind, LucideIcon> = {
  'booking-confirmed': CalendarCheck,
  'booking-reminder': Bell,
  'provider-message': MessageSquare,
  'review-request': Star,
  'promo': Sparkles,
}

export function NotificationsScreen({ onBack, go }: { onBack: () => void; go: (v: View) => void }) {
  const t = useT()
  const [items, setItems] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS)

  const unreadCount = items.filter((n) => n.unread).length
  const today = items.filter((n) => /^\d+ h$/.test(n.when))
  const earlier = items.filter((n) => !/^\d+ h$/.test(n.when))

  const markAllRead = () => setItems((arr) => arr.map((n) => ({ ...n, unread: false })))
  const tap = (n: AppNotification) => {
    setItems((arr) => arr.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))
    if (n.bookingId) go({ kind: 'booking-detail', bookingId: n.bookingId })
    else if (n.providerId) go({ kind: 'provider', providerId: n.providerId })
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader
        onBack={onBack}
        right={
          <>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="inline-flex items-center justify-center text-[12px] font-semibold leading-none text-ink px-3 h-9 rounded-full border border-line/70">
                Mark all read
              </button>
            )}
            <button
              onClick={() => go({ kind: 'notif-prefs' })}
              className="h-9 w-9 grid place-items-center rounded-full border border-line/70"
              aria-label="Notification preferences"
            >
              <Settings2 size={14} strokeWidth={2} className="text-ink" />
            </button>
          </>
        }
      />

      <div className="px-5">
        <div className="kicker mb-1.5">INBOX</div>
        <h1 className="font-serif text-[28px] leading-[1.05] tracking-tight font-semibold">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-brand text-white text-[11px] font-semibold tabular-nums align-middle">
              {unreadCount} new
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <Empty />
        ) : (
          <div className="mt-7">
            {today.length > 0 && (
              <Group label="TODAY" items={today} onTap={tap} />
            )}
            {earlier.length > 0 && (
              <Group label="EARLIER" items={earlier} onTap={tap} />
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function Group({ label, items, onTap }: { label: string; items: AppNotification[]; onTap: (n: AppNotification) => void }) {
  return (
    <div className="mb-6">
      <div className="kicker mb-3">{label}</div>
      <div className="divide-y divide-line/60 border-y border-line/60">
        {items.map((n) => (
          <Row key={n.id} n={n} onTap={() => onTap(n)} />
        ))}
      </div>
    </div>
  )
}

function Row({ n, onTap }: { n: AppNotification; onTap: () => void }) {
  const Icon = ICON_BY_KIND[n.kind]
  const provider = n.providerId ? PROVIDER_BY_ID[n.providerId] : undefined
  const meta = provider
    ? `${provider.area}, ${provider.city}`
    : n.kind === 'promo' ? 'Bookly' : null

  return (
    <button onClick={onTap} className="w-full flex items-start gap-3 py-4 text-left">
      <span className={`relative shrink-0 h-9 w-9 rounded-full grid place-items-center
        ${n.unread ? 'bg-brand/22 text-brand' : 'bg-surface-higher text-ink-muted'}`}>
        <Icon size={15} strokeWidth={1.9} />
        {n.unread && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-canvas" />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <div className={`text-[13.5px] tracking-tight truncate ${n.unread ? 'font-semibold text-ink' : 'text-ink-muted font-medium'}`}>
            {n.title}
          </div>
          <span className="text-[10.5px] text-ink-dim shrink-0 tabular-nums">{n.when}</span>
        </div>
        <p className={`text-[12px] mt-0.5 leading-relaxed ${n.unread ? 'text-ink-muted' : 'text-ink-dim'}`}>
          {n.body}
        </p>
        {meta && (
          <div className="text-[11px] text-ink-dim font-medium mt-1.5">
            {meta}
          </div>
        )}
      </div>
    </button>
  )
}

function Empty() {
  const t = useT()
  return (
    <div className="py-16 text-center px-6">
      <div className="mx-auto h-12 w-12 rounded-full border border-line grid place-items-center mb-4">
        <BellOff size={18} className="text-ink-muted" strokeWidth={1.7} />
      </div>
      <h2 className="font-serif text-[18px] font-semibold tracking-tight">{t('notifs.allCaughtUp.title')}</h2>
      <p className="text-[12.5px] text-ink-muted mt-1.5 max-w-[260px] mx-auto">
        {t('notifs.allCaughtUp.sub')}
      </p>
    </div>
  )
}
