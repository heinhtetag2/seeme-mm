import { useState } from 'react'
import { ArrowUpRight, Check, Heart, Trophy } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { AIPreview } from '../components/AIPreview'
import { LOOK_BY_KIND, type GeneratedLook } from '../studio'
import { useT } from '../i18n'
import type { View } from '../nav'

export function StudioCompareScreen({
  lookIds,
  allLooks,
  savedIds,
  saveLook,
  unsaveLook,
  onBack,
  go,
}: {
  lookIds: string[]
  allLooks: GeneratedLook[]
  savedIds: Set<string>
  saveLook: (l: GeneratedLook) => void
  unsaveLook: (id: string) => void
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const looks = lookIds
    .map((id) => allLooks.find((l) => l.id === id))
    .filter((l): l is GeneratedLook => !!l)
  const [winner, setWinner] = useState<string | null>(null)

  if (looks.length < 2) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas animate-slide-up">
        <SubScreenHeader title={t('studio.compare.title')} onBack={onBack} />
        <div className="px-5 pt-6 text-[13px] text-ink-muted">
          Couldn't load both variants — go back and pick two again.
        </div>
      </div>
    )
  }

  const winnerLook = looks.find((l) => l.id === winner) ?? null

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title={t('studio.compare.sideBySide')} onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 px-5 pt-2">
        <div className="kicker mb-1">{t('studio.compare.kicker')}</div>
        <h2 className="font-serif text-[22px] leading-[1.05] tracking-tight font-semibold mb-5">
          Which one wins?
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {looks.map((look, i) => (
            <CompareCard
              key={look.id}
              look={look}
              label={String.fromCharCode(65 + i)}
              isWinner={winner === look.id}
              isSaved={savedIds.has(look.id)}
              onPick={() => setWinner(look.id)}
              onToggleSave={() => savedIds.has(look.id) ? unsaveLook(look.id) : saveLook(look)}
            />
          ))}
        </div>

        {/* Specs row */}
        <div className="mt-6 rounded-2xl border border-line/70 bg-surface-elevated overflow-hidden">
          <SpecRow label="Style" values={looks.map(specStyle)} />
          <SpecRow label="Color" values={looks.map(specColor)} />
          <SpecRow label="Match" values={looks.map((l) => `${l.match}%`)} />
          <SpecRow label="Vibe" values={looks.map((l) => l.vibe)} />
        </div>

        {winnerLook && (
          <div className="mt-6 p-4 rounded-2xl border border-brand/30 bg-brand/8">
            <div className="kicker text-brand inline-flex items-center gap-1.5 mb-1">
              <Trophy size={11} strokeWidth={2.4} /> Your pick
            </div>
            <div className="text-[14px] font-semibold tracking-tight text-ink">
              {specStyle(winnerLook)} · {specColor(winnerLook)}
            </div>
            <div className="text-[11.5px] text-ink-muted mt-0.5">
              Save it, or jump straight to booking a {LOOK_BY_KIND[winnerLook.kind].bookKeyword} studio.
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      {winnerLook && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-canvas/95 backdrop-blur border-t border-line/60 px-5 pt-3 pb-5">
          <button
            onClick={() => go({ kind: 'studio-result', lookId: winnerLook.id })}
            className="w-full h-12 rounded-full bg-ink text-canvas inline-flex items-center justify-center gap-2 text-[13px] font-semibold"
          >
            Book this look <ArrowUpRight size={14} strokeWidth={2.4} />
          </button>
        </div>
      )}
    </div>
  )
}

function CompareCard({
  look, label, isWinner, isSaved, onPick, onToggleSave,
}: {
  look: GeneratedLook
  label: string
  isWinner: boolean
  isSaved: boolean
  onPick: () => void
  onToggleSave: () => void
}) {
  return (
    <button
      onClick={onPick}
      className={`relative text-left rounded-2xl border transition
        ${isWinner ? 'border-brand ring-2 ring-brand/30' : 'border-line/70'}`}
    >
      <AIPreview look={look} className="aspect-[3/4] rounded-2xl" />
      <div className="absolute top-2 left-2 h-7 w-7 grid place-items-center rounded-full bg-canvas/85 backdrop-blur text-[11.5px] font-bold">
        {label}
      </div>
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
      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/65 to-transparent rounded-b-2xl">
        <div className="text-[10.5px] text-white/80 font-medium">Match</div>
        <div className="text-[16px] font-serif font-semibold text-white tabular-nums leading-none">
          {look.match}%
        </div>
      </div>
      {isWinner && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-brand text-canvas text-[11px] font-semibold inline-flex items-center gap-1">
          <Check size={11} strokeWidth={3} /> Pick
        </div>
      )}
    </button>
  )
}

function SpecRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid grid-cols-[80px_1fr_1fr] divide-x divide-line/60 border-b border-line/60 last:border-b-0">
      <div className="px-3 py-3 text-[11.5px] font-medium text-ink-muted self-center">
        {label}
      </div>
      {values.map((v, i) => (
        <div key={i} className="px-3 py-3 text-[12.5px] text-ink truncate">{v}</div>
      ))}
    </div>
  )
}

function specStyle(l: GeneratedLook): string {
  return LOOK_BY_KIND[l.kind].styles.find((s) => s.id === l.styleId)?.name ?? l.styleId
}
function specColor(l: GeneratedLook): string {
  return LOOK_BY_KIND[l.kind].colors.find((c) => c.id === l.colorId)?.name ?? l.colorId
}
