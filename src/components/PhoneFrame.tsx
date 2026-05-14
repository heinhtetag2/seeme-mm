import type { ReactNode } from 'react'

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-[420px] aspect-[390/844] md:my-8 rounded-[48px] md:border md:border-line/60 md:shadow-soft overflow-hidden md:p-[6px] md:bg-line">
      <div className="relative h-full w-full rounded-[42px] overflow-hidden bg-canvas isolate">
        {/* iOS status bar mock */}
        <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-7 pt-3 pb-1 text-[13px] font-semibold tracking-tight text-ink">
          <span>9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-2 h-[26px] w-[110px] bg-black rounded-full hidden md:block" />
          <div className="flex items-center gap-1.5">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>
        {children}
        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[5px] w-[134px] bg-ink/80 rounded-full" />
      </div>
    </div>
  )
}

function SignalIcon() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
      <rect x="0" y="6" width="3" height="4" rx="0.5" fill="white" />
      <rect x="5" y="4" width="3" height="6" rx="0.5" fill="white" />
      <rect x="10" y="2" width="3" height="8" rx="0.5" fill="white" />
      <rect x="15" y="0" width="3" height="10" rx="0.5" fill="white" />
    </svg>
  )
}
function WifiIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path d="M8 10.5l1.5-1.5a2 2 0 00-3 0L8 10.5zM8 7l3-3a5 5 0 00-6 0l3 3zM8 3.5l5-5a8 8 0 00-10 0l5 5z" fill="white" />
    </svg>
  )
}
function BatteryIcon() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="white" strokeOpacity="0.6" />
      <rect x="2" y="2" width="17" height="8" rx="1.5" fill="white" />
      <rect x="23.5" y="4" width="2" height="4" rx="1" fill="white" fillOpacity="0.6" />
    </svg>
  )
}
