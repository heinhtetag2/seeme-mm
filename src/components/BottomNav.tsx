import { Home, Compass, Sparkles, CalendarCheck, User } from 'lucide-react'
import { useT } from '../i18n'

export type Tab = 'home' | 'explore' | 'studio' | 'bookings' | 'me'

const items: { key: Tab; tKey: string; Icon: typeof Home; emphasis?: boolean }[] = [
  { key: 'home',     tKey: 'tab.home',     Icon: Home },
  { key: 'explore',  tKey: 'tab.explore',  Icon: Compass },
  { key: 'bookings', tKey: 'tab.bookings', Icon: CalendarCheck },
  { key: 'me',       tKey: 'tab.me',       Icon: User },
]

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const t = useT()
  return (
    <nav className="absolute bottom-0 inset-x-0 z-40 bg-canvas border-t border-line/60 px-2 pt-1.5 pb-5">
      <div className="grid grid-cols-4">
        {items.map(({ key, tKey, Icon, emphasis }) => {
          const label = t(tKey)
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="relative flex flex-col items-center justify-center gap-1 py-2"
            >
              {isActive && (
                <span className="absolute top-0 h-[2px] w-7 rounded-full bg-ink" />
              )}
              {emphasis ? (
                <span
                  className={`grid place-items-center h-7 w-7 rounded-full transition
                    ${isActive
                      ? 'bg-brand text-canvas'
                      : 'bg-brand/12 text-brand'}`}
                >
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2.4 : 2}
                    fill={isActive ? 'currentColor' : 'none'}
                    fillOpacity={isActive ? 0.25 : 0}
                  />
                </span>
              ) : (
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.1 : 1.7}
                  className={isActive ? 'text-ink' : 'text-ink-dim'}
                  fill={isActive ? 'currentColor' : 'none'}
                  fillOpacity={isActive ? 0.08 : 0}
                />
              )}
              <span className={`text-[10.5px] leading-none ${isActive ? 'text-ink font-semibold' : 'text-ink-dim font-medium'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
