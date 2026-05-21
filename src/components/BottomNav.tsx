import { Home, Compass, CalendarCheck, User } from 'lucide-react'
import { useT } from '../i18n'

export type Tab = 'home' | 'explore' | 'community' | 'studio' | 'bookings' | 'me'

/** Three-person group icon — lucide's Users/Users2/UsersRound all show only
 *  one figure with a partial second, which doesn't read as "community". */
function GroupOfThree({
  size = 24,
  strokeWidth = 2,
  className,
  fill = 'none',
  fillOpacity,
}: {
  size?: number
  strokeWidth?: number
  className?: string
  fill?: string
  fillOpacity?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      fillOpacity={fillOpacity}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left person */}
      <circle cx="5" cy="8.5" r="2.2" />
      <path d="M1.5 19v-0.8a3.2 3.2 0 0 1 6.4 0V19" />
      {/* Right person */}
      <circle cx="19" cy="8.5" r="2.2" />
      <path d="M16.1 19v-0.8a3.2 3.2 0 0 1 6.4 0V19" />
      {/* Center (foreground) person */}
      <circle cx="12" cy="7" r="2.8" />
      <path d="M6.6 21v-1a5.4 5.4 0 0 1 10.8 0v1" />
    </svg>
  )
}

const items: { key: Tab; tKey: string; Icon: typeof Home; emphasis?: boolean }[] = [
  { key: 'home',      tKey: 'tab.home',      Icon: Home },
  { key: 'explore',   tKey: 'tab.explore',   Icon: Compass },
  { key: 'community', tKey: 'tab.community', Icon: GroupOfThree as unknown as typeof Home },
  { key: 'bookings',  tKey: 'tab.bookings',  Icon: CalendarCheck },
  { key: 'me',        tKey: 'tab.me',        Icon: User },
]

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const t = useT()
  return (
    <nav className="absolute bottom-0 inset-x-0 z-40 bg-canvas border-t border-line/60 px-5 pt-1.5 pb-5">
      <div className="flex items-stretch justify-between">
        {items.map(({ key, tKey, Icon, emphasis }) => {
          const label = t(tKey)
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              {isActive && (
                <span className="absolute top-0 h-[2px] w-7 rounded-full bg-brand" />
              )}
              {emphasis ? (
                <span
                  className={`grid place-items-center h-7 w-7 rounded-full transition
                    ${isActive
                      ? 'bg-brand text-white'
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
