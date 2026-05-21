import { useState } from 'react'
import { MapPin, Navigation, Copy, X } from 'lucide-react'
import type { LatLng } from '../data'
import { useToast } from './Toast'
import { useT } from '../i18n'

/**
 * Lightweight stylised map used inline on the provider page.
 * Renders a paper-mapped grid + concentric pin marker. Tapping opens a
 * "Get directions" sheet that surfaces the address and external map apps.
 */
export function MiniMap({
  coords,
  address,
  label,
  className = '',
}: {
  coords: LatLng
  address: string
  label?: string
  className?: string
}) {
  const [sheet, setSheet] = useState(false)
  return (
    <>
      <button
        onClick={() => setSheet(true)}
        className={`group relative w-full overflow-hidden rounded-2xl border border-line/70 bg-surface-elevated text-left ${className}`}
        aria-label="Open directions"
      >
        <MapCanvas coords={coords} />
        <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-canvas/95 via-canvas/80 to-transparent">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              {label && <div className="kicker text-[9.5px] mb-0.5">{label}</div>}
              <div className="text-[12.5px] font-semibold tracking-tight truncate">{address}</div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-ink text-canvas text-[11.5px] font-semibold">
              <Navigation size={11} strokeWidth={2.4} />
              Directions
            </span>
          </div>
        </div>
      </button>

      {sheet && <DirectionsSheet coords={coords} address={address} onClose={() => setSheet(false)} />}
    </>
  )
}

/** Renders the stylised "map" — paper grid + a pulsing pin centered on the canvas. */
function MapCanvas({ coords }: { coords: LatLng }) {
  // Deterministic offset for two background roads from the coords so each
  // provider's map looks subtly distinct without us shipping real tiles.
  const seed = Math.abs(Math.round((coords.lat + coords.lng) * 1000))
  const road1 = (seed % 60) + 20
  const road2 = ((seed * 7) % 60) + 20
  return (
    <div className="relative h-44 w-full bg-gradient-to-br from-tropic-10 via-sand-10 to-pebble-10 dark:from-[#15171c] dark:via-[#0f1115] dark:to-[#191b21]">
      {/* Streets */}
      <div className="absolute inset-0 opacity-90 dark:opacity-100">
        <div className="absolute h-[3px] left-[-10%] right-[-10%] bg-white/85 dark:bg-white/12 rounded-full -rotate-[8deg]"
             style={{ top: `${road1}%` }} />
        <div className="absolute h-[2px] left-[-10%] right-[-10%] bg-white/70 dark:bg-white/10 rounded-full rotate-[14deg]"
             style={{ top: `${road2}%` }} />
        <div className="absolute w-[2.5px] top-[-10%] bottom-[-10%] bg-white/80 dark:bg-white/12 rounded-full"
             style={{ left: '38%' }} />
      </div>
      {/* Grid texture */}
      <div className="absolute inset-0 dark:opacity-50"
           style={{
             backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
             backgroundSize: '18px 18px',
           }} />
      {/* "Park" blob */}
      <div className="absolute h-12 w-16 rounded-[40%] bg-moss-20/80 dark:bg-moss-70/50"
           style={{ top: '14%', right: '10%' }} />
      {/* Pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <div className="relative">
          <span className="absolute inset-0 -m-3 rounded-full bg-rust-50/30 animate-soft-pulse" />
          <span className="relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-rust-50 text-white shadow-soft">
            <MapPin size={16} strokeWidth={2.4} fill="currentColor" />
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-2 w-2 rotate-45 bg-rust-50" />
        </div>
      </div>
    </div>
  )
}

/** Bottom sheet with address copy + deep-links into Google / Apple Maps. */
function DirectionsSheet({
  coords,
  address,
  onClose,
}: {
  coords: LatLng
  address: string
  onClose: () => void
}) {
  const t = useT()
  const { show } = useToast()
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
  const amaps = `https://maps.apple.com/?daddr=${coords.lat},${coords.lng}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      show(t('toast.addressCopied'))
    } catch {
      show(t('toast.couldNotCopy'))
    }
  }
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-8 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full border border-line/70"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
        <div className="kicker mb-1.5">{t('directions.kicker')}</div>
        <h2 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold">{address}</h2>
        <div className="text-[11.5px] text-ink-dim mt-1.5 tabular-nums">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>

        <div className="mt-5 grid gap-2">
          <a
            href={gmaps}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-full bg-brand text-white text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-2 active:opacity-90"
          >
            <Navigation size={14} strokeWidth={2.2} />
            Open in Google Maps
          </a>
          <a
            href={amaps}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-full border border-line/70 text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-2"
          >
            <Navigation size={14} strokeWidth={2.2} />
            Open in Apple Maps
          </a>
          <button
            onClick={copy}
            className="h-12 rounded-full border border-line/70 text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-2"
          >
            <Copy size={14} strokeWidth={2.2} />
            Copy address
          </button>
        </div>
      </div>
    </div>
  )
}
