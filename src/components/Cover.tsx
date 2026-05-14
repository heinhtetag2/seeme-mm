import type { CategoryId } from '../data'

/**
 * Layered radial-gradient backgrounds, keyed per category, applied via
 * inline style — bulletproof against CSS purging or stylesheet ordering
 * issues, and consistent across light/dark modes.
 */
const COVER_BG: Record<CategoryId, string> = {
  doctor: [
    'radial-gradient(at 18% 14%, rgba(94,234,212,0.45) 0%, transparent 55%)',
    'radial-gradient(at 88% 22%, rgba(45,212,191,0.65) 0%, transparent 60%)',
    'radial-gradient(at 55% 90%, rgba(15,118,110,0.75) 0%, transparent 65%)',
    'linear-gradient(160deg, #0d3a36 0%, #0a2522 100%)',
  ].join(', '),
  spa: [
    'radial-gradient(at 22% 12%, rgba(251,207,232,0.65) 0%, transparent 55%)',
    'radial-gradient(at 90% 30%, rgba(236,72,153,0.65) 0%, transparent 60%)',
    'radial-gradient(at 60% 95%, rgba(190,18,60,0.7) 0%, transparent 65%)',
    'linear-gradient(160deg, #4a1933 0%, #2c0e21 100%)',
  ].join(', '),
  home: [
    'radial-gradient(at 14% 18%, rgba(254,215,170,0.65) 0%, transparent 55%)',
    'radial-gradient(at 90% 25%, rgba(245,158,11,0.65) 0%, transparent 60%)',
    'radial-gradient(at 50% 95%, rgba(180,83,9,0.75) 0%, transparent 65%)',
    'linear-gradient(160deg, #3a2110 0%, #221208 100%)',
  ].join(', '),
  fitness: [
    'radial-gradient(at 18% 14%, rgba(125,211,252,0.55) 0%, transparent 55%)',
    'radial-gradient(at 86% 28%, rgba(56,189,248,0.65) 0%, transparent 60%)',
    'radial-gradient(at 55% 95%, rgba(7,89,133,0.8) 0%, transparent 65%)',
    'linear-gradient(160deg, #0a2a4a 0%, #061826 100%)',
  ].join(', '),
  tutor: [
    'radial-gradient(at 18% 12%, rgba(216,180,254,0.6) 0%, transparent 55%)',
    'radial-gradient(at 88% 28%, rgba(168,85,247,0.65) 0%, transparent 60%)',
    'radial-gradient(at 60% 95%, rgba(91,33,182,0.8) 0%, transparent 65%)',
    'linear-gradient(160deg, #2c1850 0%, #170c2a 100%)',
  ].join(', '),
  auto: [
    'radial-gradient(at 14% 18%, rgba(254,202,202,0.55) 0%, transparent 55%)',
    'radial-gradient(at 88% 30%, rgba(239,68,68,0.65) 0%, transparent 60%)',
    'radial-gradient(at 55% 95%, rgba(127,29,29,0.8) 0%, transparent 65%)',
    'linear-gradient(160deg, #3a1414 0%, #1f0a0a 100%)',
  ].join(', '),
}

const FALLBACK_BG: Record<CategoryId, string> = {
  doctor: '#0d3a36',
  spa: '#4a1933',
  home: '#3a2110',
  fitness: '#0a2a4a',
  tutor: '#2c1850',
  auto: '#3a1414',
}

/**
 * Photographic-feeling cover surface keyed to a category.
 * Layered radial gradients (looks like environmental light) + faint
 * grain to dodge "AI-poster" flatness. Always renders dark; pair with
 * white/near-white type for contrast.
 */
export function CategoryCover({
  category,
  className = '',
  children,
  ornament = true,
}: {
  category: CategoryId
  className?: string
  children?: React.ReactNode
  ornament?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: FALLBACK_BG[category],
        backgroundImage: COVER_BG[category],
      }}
    >
      {ornament && <Ornament category={category} />}
      <Grain />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/45" />
      {children && <div className="relative h-full w-full">{children}</div>}
    </div>
  )
}

/**
 * Provider-specific cover: same colour story as its category but with an
 * ID-seeded directional sheen so two providers in the same category aren't
 * visually identical.
 */
export function ProviderCover({
  category,
  providerId,
  className = '',
  children,
}: {
  category: CategoryId
  providerId: string
  className?: string
  children?: React.ReactNode
}) {
  const seed = hash(providerId)
  const tilt = (seed % 7) - 3
  const offsetX = (seed * 17) % 40 - 20
  const offsetY = (seed * 31) % 30 - 15
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: FALLBACK_BG[category],
        backgroundImage: COVER_BG[category],
      }}
    >
      <div
        className="absolute -inset-10 opacity-25 pointer-events-none"
        style={{
          background: `linear-gradient(${100 + tilt * 8}deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)`,
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
      />
      <Grain />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/55" />
      {children && <div className="relative h-full w-full">{children}</div>}
    </div>
  )
}

/** Faint film grain — overlay only, never affects layout. */
function Grain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.18,
        mixBlendMode: 'overlay',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  )
}

/**
 * Per-category SVG ornament that hints at "environment" without
 * resorting to icon-in-a-box. Subtle, low-contrast, decorative.
 */
function Ornament({ category }: { category: CategoryId }) {
  switch (category) {
    case 'doctor':
      return (
        <svg className="absolute -right-6 -bottom-4 opacity-25 pointer-events-none" width="190" height="190" viewBox="0 0 200 200" fill="none">
          <path d="M0 110 Q 25 80, 50 110 T 100 110 T 150 110 T 200 110" stroke="white" strokeWidth="1.2" fill="none" strokeOpacity="0.5" />
          <path d="M0 130 Q 25 100, 50 130 T 100 130 T 150 130 T 200 130" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.35" />
          <circle cx="160" cy="50" r="42" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
          <circle cx="160" cy="50" r="22" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      )
    case 'spa':
      return (
        <svg className="absolute -right-10 top-2 opacity-30 pointer-events-none" width="220" height="220" viewBox="0 0 240 240" fill="none">
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx="160" cy="80" r={20 + i * 14} stroke="white" strokeWidth="0.9" strokeOpacity={0.45 - i * 0.05} />
          ))}
          <path d="M30 200 Q 80 160, 130 200 T 240 200" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.4" />
        </svg>
      )
    case 'home':
      return (
        <svg className="absolute -right-2 -bottom-4 opacity-25 pointer-events-none" width="220" height="180" viewBox="0 0 240 200" fill="none">
          <path d="M40 160 L 40 90 L 120 30 L 200 90 L 200 160 Z" stroke="white" strokeWidth="1" strokeOpacity="0.6" fill="none" />
          <path d="M0 160 H 240" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
          <path d="M0 175 H 240" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
          <rect x="100" y="105" width="40" height="55" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
        </svg>
      )
    case 'fitness':
      return (
        <svg className="absolute -right-4 top-4 opacity-30 pointer-events-none" width="220" height="200" viewBox="0 0 240 220" fill="none">
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={i}
              x1={i * 18} y1={0} x2={i * 18 + 60} y2={220}
              stroke="white" strokeWidth="0.8"
              strokeOpacity={0.18 + (i % 3) * 0.08}
            />
          ))}
        </svg>
      )
    case 'tutor':
      return (
        <svg className="absolute -right-6 -bottom-2 opacity-30 pointer-events-none" width="220" height="160" viewBox="0 0 240 180" fill="none">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={20} y1={20 + i * 16} x2={220} y2={20 + i * 16} stroke="white" strokeWidth="0.7" strokeOpacity={0.4 - i * 0.03} />
          ))}
          <line x1={120} y1={0} x2={120} y2={180} stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      )
    case 'auto':
      return (
        <svg className="absolute -right-2 -bottom-4 opacity-25 pointer-events-none" width="240" height="140" viewBox="0 0 240 140" fill="none">
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M${-30 + i * 36} 140 L${0 + i * 36} 60 L${30 + i * 36} 140`}
              stroke="white" strokeWidth="0.9"
              strokeOpacity={0.35 + (i % 2) * 0.1}
              fill="none"
            />
          ))}
        </svg>
      )
  }
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
