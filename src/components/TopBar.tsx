import { Bell, MapPin } from 'lucide-react'
import { useT } from '../i18n'

export function TopBar({
  onBellClick,
  onCityClick,
  city = 'Yangon',
  hasUnread = true,
  name,
  avatar,
}: {
  onBellClick?: () => void
  onCityClick?: () => void
  city?: string
  hasUnread?: boolean
  /** Display name shown in place of the brand. */
  name: string
  /** Optional avatar image URL — falls back to an initial bubble. */
  avatar?: string
}) {
  const t = useT()
  return (
    <header className="relative z-30 flex items-center justify-between px-5 pt-12 pb-3">
      <div className="flex items-center gap-2.5">
        <UserMark name={name} avatar={avatar} />
        <div className="leading-tight min-w-0">
          <div className="font-serif text-[19px] font-semibold tracking-tight text-ink truncate max-w-[180px]">
            {name}
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
        className="relative h-11 w-11 grid place-items-center rounded-full border border-line/70 bg-surface/60 hover:border-brand/40 transition"
        aria-label={t('topbar.notifications')}
      >
        <Bell size={16} className="text-ink/90" strokeWidth={1.8} />
        {hasUnread && <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-brand ring-2 ring-canvas" />}
      </button>
    </header>
  )
}

/** Profile avatar at the top-left — either the uploaded photo or an
 *  initial bubble using the community-avatar palette so it feels consistent. */
function UserMark({ name, avatar }: { name: string; avatar?: string }) {
  const initial = name.trim()[0]?.toUpperCase() ?? '?'
  // Stable color per person.
  const palette = [
    'from-iris-30 to-iris-50',
    'from-tropic-30 to-tropic-60',
    'from-ember-30 to-ember-50',
    'from-sakura-30 to-sakura-50',
    'from-ocean-30 to-ocean-60',
    'from-moss-30 to-moss-60',
  ]
  const gradient = palette[initial.charCodeAt(0) % palette.length]
  return (
    <div className="relative h-9 w-9 rounded-full overflow-hidden">
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className={`h-full w-full grid place-items-center bg-gradient-to-br ${gradient} text-canvas`}>
          <span className="font-serif font-bold text-[16px] -tracking-[0.04em] leading-none">{initial}</span>
        </div>
      )}
      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-canvas" />
    </div>
  )
}
