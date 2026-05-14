import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, RefreshCw, Heart, Check, ArrowUpRight, GitCompare, Wand2 } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { AIPreview } from '../components/AIPreview'
import { LOOK_BY_KIND, generateLooks, type GeneratedLook, type LookKind } from '../studio'
import { useToast } from '../components/Toast'
import { useT } from '../i18n'
import type { View } from '../nav'

type Phase = 'pick' | 'generating' | 'results'

export function StudioGenerateScreen({
  look,
  onBack,
  go,
  savedIds,
  saveLook,
  unsaveLook,
  pushRecent,
}: {
  look: LookKind
  onBack: () => void
  go: (v: View) => void
  savedIds: Set<string>
  saveLook: (l: GeneratedLook) => void
  unsaveLook: (id: string) => void
  pushRecent: (l: GeneratedLook[]) => void
}) {
  const cat = LOOK_BY_KIND[look]
  const [styleId, setStyleId] = useState<string>(cat.styles[0].id)
  const [colorId, setColorId] = useState<string>(cat.colors[0].id)
  const [phase, setPhase] = useState<Phase>('pick')
  const [variants, setVariants] = useState<GeneratedLook[]>([])
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const timer = useRef<number | null>(null)
  const t = useT()
  const { show: toast } = useToast()

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const startGeneration = () => {
    setPhase('generating')
    setPicked(new Set())
    timer.current = window.setTimeout(() => {
      const next = generateLooks(look, styleId, colorId, 4)
      setVariants(next)
      pushRecent(next)
      setPhase('results')
    }, 1500)
  }

  const top = useMemo(() =>
    [...variants].sort((a, b) => b.match - a.match)[0],
  [variants])

  const togglePick = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 2) next.add(id)
      else {
        toast('Pick up to 2 to compare')
        return next
      }
      return next
    })
  }

  const goCompare = () => {
    const ids = Array.from(picked)
    if (ids.length !== 2) {
      toast('Pick 2 variants to compare')
      return
    }
    go({ kind: 'studio-compare', lookIds: ids })
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title={`${cat.name} studio`} onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        {/* Picker */}
        <section className="px-5 pt-2 space-y-7">
          <div>
            <div className="kicker mb-1.5">{t('studio.generate.style')}</div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
              {cat.styles.map((s) => {
                const active = s.id === styleId
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyleId(s.id)}
                    className={`shrink-0 px-3.5 h-9 rounded-full border text-[12px] font-semibold leading-none tracking-tight transition
                      ${active
                        ? 'bg-ink text-canvas border-ink'
                        : 'bg-surface-elevated text-ink border-line/70 hover:border-line-strong'}`}
                  >
                    {s.name}
                    <span className={`ml-1.5 text-[10px] font-normal ${active ? 'text-canvas/70' : 'text-ink-dim'}`}>
                      · {s.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="kicker mb-1.5">{t('studio.generate.color')}</div>
            <div className="grid grid-cols-4 gap-2.5">
              {cat.colors.map((c) => {
                const active = c.id === colorId
                return (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition
                      ${active
                        ? 'border-ink bg-active'
                        : 'border-line/70 hover:border-line-strong bg-surface-elevated'}`}
                  >
                    <span
                      className="relative h-9 w-9 rounded-full ring-1 ring-line/40"
                      style={{ background: c.hex }}
                    >
                      {active && (
                        <span className="absolute inset-0 grid place-items-center text-white drop-shadow">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                    </span>
                    <span className="text-[10.5px] text-ink-muted leading-tight text-center truncate w-full">
                      {c.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Generate CTA */}
        {phase === 'pick' && (
          <div className="px-5 mt-8">
            <button
              onClick={startGeneration}
              className="w-full h-14 rounded-2xl bg-brand text-canvas font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.99] transition"
            >
              <Wand2 size={16} strokeWidth={2.2} />
              <span className="text-[14px]">{t('studio.generate.cta')}</span>
            </button>
            <div className="text-center text-[10.5px] text-ink-dim mt-3">
              {t('studio.generate.poweredBy')}
            </div>
          </div>
        )}

        {/* Loading state */}
        {phase === 'generating' && (
          <div className="px-5 mt-8 space-y-3">
            <div className="rounded-2xl border border-line/70 bg-surface-elevated px-4 py-5">
              <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                <span className="relative grid place-items-center h-5 w-5">
                  <Sparkles size={14} strokeWidth={2.2} className="text-brand animate-pulse" />
                </span>
                {t('studio.generate.generating')}
              </div>
              <div className="mt-2 text-[11.5px] text-ink-muted">
                {t('studio.generate.generatingSub')}
              </div>
              <div className="mt-3 h-1 w-full rounded-full bg-line/60 overflow-hidden">
                <div className="h-full w-1/3 bg-brand animate-[loadbar_1.4s_ease-in-out_infinite]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-surface animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {phase === 'results' && (
          <div className="px-5 mt-8 space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="kicker mb-1">{t('studio.generate.results')}</div>
                <h2 className="font-serif text-[22px] leading-[1.05] tracking-tight font-semibold">
                  Which one is <span className="italic">you</span>?
                </h2>
              </div>
              <button
                onClick={startGeneration}
                className="shrink-0 h-9 px-3 rounded-full border border-line/70 text-[11.5px] font-semibold leading-none inline-flex items-center gap-1.5"
              >
                <RefreshCw size={12} strokeWidth={2.2} /> Regenerate
              </button>
            </div>

            {top && (
              <div className="text-[12px] text-ink-muted">
                Top match —
                <span className="text-ink font-semibold"> {top.match}% </span>
                · {top.vibe}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {variants.map((v, i) => (
                <VariantCard
                  key={v.id}
                  look={v}
                  index={i + 1}
                  isSaved={savedIds.has(v.id)}
                  isPicked={picked.has(v.id)}
                  onTogglePick={() => togglePick(v.id)}
                  onToggleSave={() => savedIds.has(v.id) ? unsaveLook(v.id) : saveLook(v)}
                  onView={() => go({ kind: 'studio-result', lookId: v.id })}
                />
              ))}
            </div>

            <div className="text-[11.5px] text-ink-muted">
              Tap to select 2 variants and compare them side-by-side. The heart saves a look to favourites.
            </div>
          </div>
        )}
      </div>

      {/* Sticky action bar after results */}
      {phase === 'results' && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-canvas/95 backdrop-blur border-t border-line/60 px-5 pt-3 pb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={goCompare}
              disabled={picked.size !== 2}
              className={`flex-1 h-12 rounded-full inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold leading-none transition
                ${picked.size === 2
                  ? 'bg-ink text-canvas'
                  : 'bg-surface-elevated text-ink-muted border border-line/70'}`}
            >
              <GitCompare size={14} strokeWidth={2.2} />
              Compare {picked.size === 0 ? '(pick 2)' : `${picked.size}/2`}
            </button>
            {top && (
              <button
                onClick={() => go({ kind: 'studio-result', lookId: top.id })}
                className="h-12 px-4 rounded-full bg-brand text-canvas inline-flex items-center gap-1.5 text-[13px] font-semibold leading-none"
              >
                Book top <ArrowUpRight size={13} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Inline keyframe so the loading bar animates without touching tailwind config */}
      <style>{`
        @keyframes loadbar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

function VariantCard({
  look, index, isSaved, isPicked, onTogglePick, onToggleSave, onView,
}: {
  look: GeneratedLook
  index: number
  isSaved: boolean
  isPicked: boolean
  onTogglePick: () => void
  onToggleSave: () => void
  onView: () => void
}) {
  return (
    <div
      className={`relative rounded-2xl border transition cursor-pointer
        ${isPicked ? 'border-brand ring-2 ring-brand/30' : 'border-line/70'}`}
      onClick={onTogglePick}
    >
      <AIPreview look={look} className="aspect-[3/4] rounded-2xl" />

      {/* Top-right save heart */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave() }}
        className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-canvas/85 backdrop-blur"
      >
        <Heart
          size={14}
          strokeWidth={2.2}
          className={isSaved ? 'text-rust-50' : 'text-ink-muted'}
          fill={isSaved ? 'currentColor' : 'none'}
        />
      </button>

      {/* Top-left index */}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-canvas/85 backdrop-blur text-[11px] font-semibold text-ink">
        #{index}
      </div>

      {/* Bottom info strip */}
      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/65 via-black/35 to-transparent rounded-b-2xl">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10.5px] text-white/80 font-medium">Match</div>
            <div className="text-[15px] font-serif font-semibold text-white tabular-nums leading-none">
              {look.match}%
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onView() }}
            className="h-7 px-2.5 rounded-full bg-white/95 text-ink text-[10.5px] font-semibold inline-flex items-center gap-1"
          >
            View <ArrowUpRight size={11} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* picked checkmark */}
      {isPicked && (
        <div className="absolute -top-1.5 -right-1.5 h-6 w-6 grid place-items-center rounded-full bg-brand text-canvas ring-2 ring-canvas">
          <Check size={12} strokeWidth={3} />
        </div>
      )}
    </div>
  )
}
