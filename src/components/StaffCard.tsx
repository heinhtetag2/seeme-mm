import { Star, BadgeCheck, ChevronRight, Check } from 'lucide-react'
import type { Staff } from '../data'

/** Small avatar disc with initials, tinted using the staff member's hue. */
export function StaffAvatar({ staff, size = 48 }: { staff: Staff; size?: number }) {
  const initial = staff.name.replace(/^(Dr\.|Saya|Sayama|Master|Coach|Team|Crew|Tech|Rider)\s+/i, '').charAt(0)
  return (
    <span
      className={`shrink-0 rounded-full bg-gradient-to-br ${staff.hue} text-white font-semibold grid place-items-center shadow-soft`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  )
}

/**
 * Horizontally-stackable card for picking a specialist.
 * - `mode="select"`: tap toggles selection (checkmark badge).
 * - `mode="view"`: tap navigates to the staff profile.
 */
export function StaffCard({
  staff,
  selected = false,
  mode = 'select',
  onClick,
}: {
  staff: Staff
  selected?: boolean
  mode?: 'select' | 'view'
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group shrink-0 w-[180px] text-left p-3 rounded-2xl border bg-surface-elevated transition active:scale-[0.98]
        ${selected
          ? 'border-ink shadow-[0_0_0_2px_rgb(var(--ink))_inset]'
          : 'border-line/70 hover:border-line-strong'}`}
    >
      <div className="flex items-start gap-2.5">
        <StaffAvatar staff={staff} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[12.5px] font-semibold tracking-tight truncate">{staff.name}</span>
            {staff.topPick && <BadgeCheck size={11.5} strokeWidth={2.4} className="text-data-yellow-30 shrink-0" />}
          </div>
          <div className="text-[10.5px] text-ink-muted truncate mt-0.5">{staff.role}</div>
        </div>
        {mode === 'select' && (
          <span className={`h-5 w-5 rounded-full grid place-items-center shrink-0 transition
            ${selected ? 'bg-ink text-canvas' : 'border border-line-strong'}`}>
            {selected && <Check size={11} strokeWidth={3.4} />}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 text-ink">
          <Star size={10.5} fill="currentColor" strokeWidth={0} />
          <span className="font-semibold tabular-nums">{staff.rating.toFixed(1)}</span>
          <span className="text-ink-dim font-normal">({staff.reviewCount})</span>
        </span>
        <span className="text-ink-dim">{staff.years}y</span>
      </div>
      <div className="mt-2 text-[10.5px] text-evergreen-50 font-medium truncate">
        Next · {staff.nextAvailable}
      </div>
      {mode === 'view' && (
        <div className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink-muted">
          View profile <ChevronRight size={11} strokeWidth={2.4} />
        </div>
      )}
    </button>
  )
}

/** "Any available" pseudo-staff card used as the first option in selectors. */
export function AnyStaffCard({
  selected,
  onClick,
}: {
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 w-[180px] text-left p-3 rounded-2xl border bg-surface-elevated transition active:scale-[0.98]
        ${selected
          ? 'border-ink shadow-[0_0_0_2px_rgb(var(--ink))_inset]'
          : 'border-line/70 hover:border-line-strong'}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 h-11 w-11 rounded-full border-2 border-dashed border-line-strong grid place-items-center text-[13px] font-semibold text-ink-muted">
          ?
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold tracking-tight truncate">Any available</div>
          <div className="text-[10.5px] text-ink-muted truncate mt-0.5">First open slot</div>
        </div>
        <span className={`h-5 w-5 rounded-full grid place-items-center shrink-0 transition
          ${selected ? 'bg-ink text-canvas' : 'border border-line-strong'}`}>
          {selected && <Check size={11} strokeWidth={3.4} />}
        </span>
      </div>
      <div className="mt-3 text-[11px] text-ink-muted">Fastest match</div>
      <div className="mt-2 text-[10.5px] text-evergreen-50 font-medium">Recommended</div>
    </button>
  )
}
