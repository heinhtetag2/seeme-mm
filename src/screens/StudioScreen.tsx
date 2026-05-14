import { Sparkles, ImagePlus, ArrowUpRight, Heart, Scissors, Hand, Brush, ChevronRight, Lock, Wand2, ArrowLeftRight, MousePointer2, CalendarCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { AIPreview } from '../components/AIPreview'
import { LOOK_CATEGORIES, LOOK_BY_KIND, type GeneratedLook, type LookKind } from '../studio'
import { useT } from '../i18n'
import type { View } from '../nav'

export function StudioScreen({
  saved,
  recent,
  go,
}: {
  saved: GeneratedLook[]
  recent: GeneratedLook[]
  go: (v: View) => void
}) {
  const t = useT()
  return (
    <div className="px-5 pt-2 pb-2 space-y-9 animate-fade-in">
      {/* Hero */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="kicker inline-flex items-center gap-1.5">
            <Sparkles size={11} strokeWidth={2.4} /> {t('studio.hero.aiStudio')}
          </div>
          <span className="px-1.5 py-0.5 rounded-md bg-brand/15 text-brand text-[10px] font-semibold">
            {t('studio.hero.beta')}
          </span>
        </div>
        <h1 className="font-serif text-[32px] leading-[1.05] tracking-tight font-semibold text-balance">
          {t('studio.hero.title1')}
          <span className="italic"> {t('studio.hero.title2')} </span>
          {t('studio.hero.title3')}
        </h1>
        <p className="text-[13px] text-ink-muted max-w-[280px]">
          {t('studio.hero.sub')}
        </p>
      </div>

      {/* Photo source — mock upload tile */}
      <PhotoSource />

      {/* How it works — 3 quick steps */}
      <HowItWorks />

      {/* Pick a look */}
      <section>
        <SectionHeader kicker={t('studio.start.kicker')} title={t('studio.start.title')} />
        <div className="space-y-3">
          {LOOK_CATEGORIES.map((c) => (
            <CategoryTile
              key={c.kind}
              kind={c.kind}
              name={c.name}
              tagline={c.tagline}
              onClick={() => go({ kind: 'studio-generate', look: c.kind })}
            />
          ))}
        </div>
      </section>

      {/* Saved */}
      {saved.length > 0 && (
        <section>
          <SectionHeader
            kicker="Favourites"
            title={t('studio.saved.title')}
            action={
              <span className="text-[11px] font-semibold text-ink-muted tabular-nums">
                {saved.length}
              </span>
            }
          />
          <div className="grid grid-cols-3 gap-2.5">
            {saved.slice(0, 6).map((l) => (
              <button
                key={l.id}
                onClick={() => go({ kind: 'studio-result', lookId: l.id })}
                className="text-left"
              >
                <AIPreview look={l} className="aspect-[3/4]" />
                <div className="mt-1.5 text-[10.5px] text-ink-muted truncate">
                  {LOOK_BY_KIND[l.kind].styles.find((s) => s.id === l.styleId)?.name}
                </div>
              </button>
            ))}
          </div>
          {saved.length >= 2 && (
            <button
              onClick={() => go({ kind: 'studio-compare', lookIds: saved.slice(0, 2).map((l) => l.id) })}
              className="mt-4 w-full h-11 rounded-full bg-ink text-canvas inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold leading-none"
            >
              Compare top 2 <ArrowUpRight size={13} strokeWidth={2.4} />
            </button>
          )}
        </section>
      )}

      {/* Recent generations */}
      {recent.length > 0 && (
        <section>
          <SectionHeader kicker={t('studio.history.kicker')} title={t('studio.history.title')} />
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {recent.slice(0, 8).map((l) => (
              <button
                key={l.id}
                onClick={() => go({ kind: 'studio-result', lookId: l.id })}
                className="shrink-0 w-[100px] text-left"
              >
                <AIPreview look={l} className="aspect-[3/4]" />
                <div className="mt-1.5 text-[10.5px] text-ink-muted truncate">
                  {LOOK_BY_KIND[l.kind].styles.find((s) => s.id === l.styleId)?.name}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {saved.length === 0 && recent.length === 0 && (
        <section className="relative overflow-hidden rounded-2xl border border-line/70 bg-surface-elevated p-6">
          <div className="kicker mb-2 inline-flex items-center gap-1.5"><Heart size={11} strokeWidth={2.4} /> WHY YOU'LL LIKE IT</div>
          <h3 className="font-serif text-[20px] leading-[1.15] tracking-tight font-semibold text-balance">
            Stop second-guessing the salon chair.
          </h3>
          <ul className="mt-3 space-y-2 text-[12.5px] text-ink-muted">
            <li>• See cuts & colors on your face before you commit.</li>
            <li>• Compare two variants side-by-side.</li>
            <li>• Save favorites and book a matching studio nearby.</li>
          </ul>
        </section>
      )}
    </div>
  )
}

function PhotoSource() {
  return (
    <div className="flex items-center gap-4">
      {/* Circular avatar — clearly a "photo", not a category card */}
      <div className="relative h-[72px] w-[72px] shrink-0">
        <div className="absolute -inset-1 rounded-full bg-brand/10 blur-md" />
        <div
          className="relative h-full w-full rounded-full overflow-hidden ring-[2.5px] ring-canvas shadow-[0_2px_10px_-4px_rgba(0,0,0,0.4)]"
          style={{
            background:
              'radial-gradient(at 30% 25%, #f3dcc8 0%, #d9a888 55%, #8b5a3a 100%)',
          }}
        >
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
            <ellipse cx="32" cy="28" rx="13" ry="15" fill="#e6c2a2" />
            <path d="M14 62 Q 14 46 32 44 Q 50 46 50 62 Z" fill="#e6c2a2" />
            <path d="M18 30 Q 16 16 32 14 Q 48 16 46 30 L 46 36 Q 42 28 32 28 Q 22 28 18 36 Z" fill="#3a241a" />
            <ellipse cx="27" cy="29" rx="1.2" ry="0.8" fill="#1c1815" />
            <ellipse cx="37" cy="29" rx="1.2" ry="0.8" fill="#1c1815" />
            <path d="M29 36 Q 32 38 35 36" stroke="#a35064" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
      </div>

      {/* Text + actions */}
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold tracking-tight text-ink">
          Demo portrait
        </div>
        <div className="text-[11px] text-ink-muted mt-0.5 inline-flex items-center gap-1">
          <Lock size={9.5} strokeWidth={2.4} className="text-ink-dim" />
          Stays on-device · never shared
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <button className="h-8 px-3 rounded-full bg-ink text-canvas text-[11px] font-semibold leading-none inline-flex items-center gap-1.5 active:scale-[0.97] transition">
            <ImagePlus size={11} strokeWidth={2.4} /> Upload photo
          </button>
          <button className="h-8 px-3 rounded-full border border-line/70 text-[11px] font-semibold text-ink inline-flex items-center gap-1.5 active:scale-[0.97] transition">
            <ArrowLeftRight size={11} strokeWidth={2.4} /> Swap
          </button>
        </div>
      </div>
    </div>
  )
}

/** Pick → Generate → Book — small flow indicator. */
function HowItWorks() {
  const steps: { Icon: typeof MousePointer2; label: string; sub: string }[] = [
    { Icon: MousePointer2, label: 'Pick',     sub: 'category' },
    { Icon: Wand2,         label: 'Generate', sub: '4 variants' },
    { Icon: CalendarCheck, label: 'Book',     sub: 'top studio' },
  ]
  return (
    <div className="grid grid-cols-3 rounded-2xl bg-surface-elevated/70 border border-line/60 divide-x divide-line/60 overflow-hidden">
      {steps.map((s, i) => (
        <div key={s.label} className="relative px-3 py-3 flex items-center gap-2.5">
          <span
            className={`h-7 w-7 rounded-full grid place-items-center shrink-0
              ${i === 0 ? 'bg-brand/15 text-brand' : 'bg-ink/5 text-ink-muted'}`}
          >
            <s.Icon size={13} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <div className="text-[11.5px] font-semibold tracking-tight text-ink leading-none">
              {s.label}
            </div>
            <div className="text-[10px] text-ink-muted mt-1 leading-none truncate">
              {s.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Editorial gradient + ornament + icon — feels designed, not generated. */
const TILE_THEME: Record<LookKind, {
  Icon: LucideIcon
  gradient: string
  fallback: string
  styleLabel: string
}> = {
  hair: {
    Icon: Scissors,
    gradient: [
      'radial-gradient(at 22% 18%, rgba(251,207,232,0.55) 0%, transparent 55%)',
      'radial-gradient(at 88% 28%, rgba(236,72,153,0.55) 0%, transparent 60%)',
      'radial-gradient(at 60% 95%, rgba(190,18,60,0.6) 0%, transparent 65%)',
      'linear-gradient(160deg, #4a1933 0%, #2c0e21 100%)',
    ].join(', '),
    fallback: '#4a1933',
    styleLabel: '6 cuts',
  },
  nails: {
    Icon: Hand,
    gradient: [
      'radial-gradient(at 18% 14%, rgba(254,215,170,0.6) 0%, transparent 55%)',
      'radial-gradient(at 88% 22%, rgba(245,158,11,0.55) 0%, transparent 60%)',
      'radial-gradient(at 55% 95%, rgba(180,83,9,0.65) 0%, transparent 65%)',
      'linear-gradient(160deg, #3a2110 0%, #221208 100%)',
    ].join(', '),
    fallback: '#3a2110',
    styleLabel: '6 shapes',
  },
  makeup: {
    Icon: Brush,
    gradient: [
      'radial-gradient(at 18% 14%, rgba(216,180,254,0.55) 0%, transparent 55%)',
      'radial-gradient(at 88% 28%, rgba(168,85,247,0.55) 0%, transparent 60%)',
      'radial-gradient(at 60% 95%, rgba(91,33,182,0.7) 0%, transparent 65%)',
      'linear-gradient(160deg, #2c1850 0%, #170c2a 100%)',
    ].join(', '),
    fallback: '#2c1850',
    styleLabel: '6 looks',
  },
}

function CategoryTile({
  kind, name, tagline, onClick,
}: {
  kind: LookKind
  name: string
  tagline: string
  onClick: () => void
}) {
  const cat = LOOK_BY_KIND[kind]
  const theme = TILE_THEME[kind]
  const Icon = theme.Icon
  const swatches = cat.colors.slice(0, 4)
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl text-left active:scale-[0.99] transition"
      style={{ backgroundColor: theme.fallback, backgroundImage: theme.gradient }}
    >
      {/* film grain — matches Cover.tsx aesthetic */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.18,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <Icon
        size={132}
        strokeWidth={1.2}
        className="absolute -right-4 -bottom-6 text-white/12 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/45 pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="kicker text-white/75 inline-flex items-center gap-1.5">
              <Icon size={11} strokeWidth={2.4} />
              {theme.styleLabel} · {cat.colors.length} colors
            </div>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/15 backdrop-blur text-white text-[10px] font-semibold">
              <Sparkles size={9} strokeWidth={2.6} /> AI
            </span>
          </div>
          <span className="h-9 w-9 rounded-full bg-white/15 backdrop-blur grid place-items-center group-active:bg-white/25 transition">
            <ChevronRight size={16} strokeWidth={2.4} className="text-white" />
          </span>
        </div>

        <h3 className="mt-3 font-serif text-[26px] leading-[1.05] tracking-tight font-semibold text-white">
          {name}
        </h3>
        <p className="text-[12px] text-white/80 mt-1 max-w-[220px]">{tagline}</p>

        <div className="mt-4 flex items-center gap-1.5">
          {swatches.map((c) => (
            <span
              key={c.id}
              className="h-[22px] w-[22px] rounded-full ring-[1.5px] ring-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
              style={{ background: c.hex }}
              title={c.name}
            />
          ))}
          <span className="ml-1 text-[11px] font-medium text-white/65">
            +{Math.max(0, cat.colors.length - swatches.length)} more
          </span>
        </div>
      </div>
    </button>
  )
}
