import { Bell, MapPin } from 'lucide-react'
import { useT } from '../i18n'

export function TopBar({
  onBellClick,
  onCityClick,
  city = 'Yangon',
  hasUnread = true,
}: {
  onBellClick?: () => void
  onCityClick?: () => void
  city?: string
  hasUnread?: boolean
}) {
  const t = useT()
  return (
    <header className="relative z-30 flex items-center justify-between px-5 pt-12 pb-3">
      <div className="flex items-center gap-2.5">
        <BooklyMark />
        <div className="leading-tight">
          <div className="font-serif text-[19px] font-semibold tracking-tight text-ink">
            Bookly
          </div>
          <button
            onClick={onCityClick}
            className="flex items-center gap-1 text-[10.5px] text-ink-muted font-medium hover:text-ink transition"
          >
            <MapPin size={9.5} strokeWidth={2.2} />
            <span>{city}</span>
            <span className="text-ink-dim">·</span>
            <span>change</span>
          </button>
        </div>
      </div>
      <button
        onClick={onBellClick}
        className="relative h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/60 hover:border-brand/40 transition"
        aria-label={t('topbar.notifications')}
      >
        <Bell size={16} className="text-ink/90" strokeWidth={1.8} />
        {hasUnread && <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-brand ring-2 ring-canvas" />}
      </button>
    </header>
  )
}

function BooklyMark() {
  return (
    <div className="relative h-9 w-9 rounded-[10px] bg-ink grid place-items-center">
      <span className="font-serif font-bold text-[20px] -tracking-[0.04em] text-canvas leading-none">B</span>
      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-canvas" />
    </div>
  )
}
