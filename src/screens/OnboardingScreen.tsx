import { useEffect } from 'react'

/**
 * Splash screen — animated Seeme logo, then auto-advances to the auth flow.
 * Replaces the previous multi-step onboarding carousel.
 */
export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="relative h-full w-full bg-canvas flex flex-col items-center justify-center">
      <div className="flex items-center gap-3.5">
        {/* Logo chip — scales in, brand dot pulses */}
        <div className="relative h-16 w-16 rounded-2xl bg-ink grid place-items-center shadow-soft animate-scale-in">
          <span className="font-serif font-bold text-[40px] -tracking-[0.04em] text-canvas leading-none">S</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand ring-2 ring-canvas animate-soft-pulse" />
        </div>
        {/* Wordmark — slides up with a tiny delay so the chip lands first */}
        <span
          className="font-serif text-[34px] font-semibold tracking-tight animate-slide-up"
          style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}
        >
          Seeme
        </span>
      </div>

      <p
        className="mt-6 text-[11px] text-ink-muted uppercase tracking-[0.18em] font-semibold animate-fade-in"
        style={{ animationDelay: '420ms', animationFillMode: 'backwards' }}
      >
        Book trusted places in Myanmar
      </p>
    </div>
  )
}
