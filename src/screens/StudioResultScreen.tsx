import { ArrowUpRight, Heart, Share2, Download, Sparkles, Star, BadgeCheck } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { AIPreview } from '../components/AIPreview'
import { LOOK_BY_KIND, type GeneratedLook } from '../studio'
import { providersByCategory, formatMMK, type Provider } from '../data'
import { useToast } from '../components/Toast'
import { useT } from '../i18n'
import type { View } from '../nav'

export function StudioResultScreen({
  lookId,
  allLooks,
  savedIds,
  saveLook,
  unsaveLook,
  onBack,
  go,
}: {
  lookId: string
  allLooks: GeneratedLook[]
  savedIds: Set<string>
  saveLook: (l: GeneratedLook) => void
  unsaveLook: (id: string) => void
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const look = allLooks.find((l) => l.id === lookId)
  const { show: toast } = useToast()
  if (!look) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas animate-slide-up">
        <SubScreenHeader title={t('studio.result.title')} onBack={onBack} />
        <div className="px-5 pt-6 text-[13px] text-ink-muted">Look not found.</div>
      </div>
    )
  }
  const cat = LOOK_BY_KIND[look.kind]
  const style = cat.styles.find((s) => s.id === look.styleId)
  const color = cat.colors.find((c) => c.id === look.colorId)
  const isSaved = savedIds.has(look.id)

  // Match providers in the look's target category that mention the keyword
  // in name/title/tags. Falls back to the whole category if no match.
  const kw = cat.bookKeyword.toLowerCase()
  const all = providersByCategory(cat.bookCategory)
  const matching = all.filter((p) =>
    p.name.toLowerCase().includes(kw) ||
    p.title.toLowerCase().includes(kw) ||
    p.tags.some((t) => t.toLowerCase().includes(kw)),
  )
  const providers = (matching.length > 0 ? matching : all).slice(0, 3)

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader
        title={t('studio.result.look')}
        onBack={onBack}
        right={
          <button
            onClick={() => isSaved ? unsaveLook(look.id) : (saveLook(look), toast(t('toast.savedToFavourites')))}
            className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80 backdrop-blur"
          >
            <Heart
              size={16}
              strokeWidth={2.2}
              className={isSaved ? 'text-rust-50' : 'text-ink-muted'}
              fill={isSaved ? 'currentColor' : 'none'}
            />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        {/* Hero */}
        <div className="px-5 pt-2">
          <AIPreview look={look} className="aspect-[3/4]" />
        </div>

        {/* Meta */}
        <div className="px-5 pt-5">
          <div className="kicker mb-1 inline-flex items-center gap-1.5">
            <Sparkles size={11} strokeWidth={2.4} /> AI match · {look.match}%
          </div>
          <h1 className="font-serif text-[28px] leading-[1.05] tracking-tight font-semibold">
            {style?.name} <span className="italic text-ink-muted font-normal">in</span> {color?.name}
          </h1>
          <p className="text-[12.5px] text-ink-muted mt-2">{look.vibe}</p>
        </div>

        {/* Quick actions */}
        <div className="px-5 mt-5 flex gap-2">
          <button
            onClick={() => toast(t('toast.sharingSoon'))}
            className="flex-1 h-10 rounded-full border border-line/70 text-[12px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
          >
            <Share2 size={12} strokeWidth={2.2} /> {t('share.title')}
          </button>
          <button
            onClick={() => toast(t('toast.savedToCameraRoll'))}
            className="flex-1 h-10 rounded-full border border-line/70 text-[12px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
          >
            <Download size={12} strokeWidth={2.2} /> {t('studio.result.saveImage')}
          </button>
        </div>

        {/* Provider matches */}
        <div className="px-5 mt-9">
          <div className="kicker mb-1">{t('studio.result.bookKicker')}</div>
          <h2 className="font-serif text-[20px] leading-[1.1] tracking-tight font-semibold">
            {t('studio.result.studiosThatDoIt')}
          </h2>
          <p className="text-[12px] text-ink-muted mt-1">
            {t('studio.result.handPicked', { keyword: cat.bookKeyword })}
          </p>
          <div className="mt-4 space-y-3">
            {providers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line/70 bg-surface-elevated/40 px-4 py-6 text-center">
                <p className="text-[12.5px] text-ink-muted">{t('studio.result.noStudios')}</p>
              </div>
            ) : providers.map((p) => (
              <ProviderMini key={p.id} provider={p} onClick={() => go({ kind: 'book', providerId: p.id, lookId: look.id })} />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky book CTA */}
      <div className="absolute inset-x-0 bottom-0 z-40 bg-canvas/95 backdrop-blur border-t border-line/60 px-5 pt-3 pb-5">
        <button
          onClick={() => providers[0] && go({ kind: 'book', providerId: providers[0].id, lookId: look.id })}
          className="w-full h-12 rounded-full bg-brand text-white inline-flex items-center justify-center gap-2 text-[13px] font-semibold leading-none disabled:opacity-50"
          disabled={!providers[0]}
        >
          {t('studio.generate.bookLook')} <ArrowUpRight size={14} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}

function ProviderMini({ provider: p, onClick }: { provider: Provider; onClick: () => void }) {
  const cheapest = p.services.reduce((m, s) => (s.price < m ? s.price : m), p.services[0]?.price ?? 0)
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-2xl border border-line/70 bg-surface-elevated text-left">
      <div className="h-12 w-12 rounded-xl bg-brand/12 grid place-items-center text-brand font-serif font-semibold text-[15px]">
        {p.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="text-[13.5px] font-semibold tracking-tight text-ink truncate">{p.name}</div>
          {p.verified && <BadgeCheck size={12} strokeWidth={2.4} className="text-brand shrink-0" />}
        </div>
        <div className="text-[11.5px] text-ink-muted truncate mt-0.5">{p.title} · {p.area}</div>
        <div className="mt-1 text-[11px] text-ink-muted inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-0.5">
            <Star size={10} fill="currentColor" strokeWidth={0} className="text-ink" />
            <span className="text-ink font-semibold tabular-nums">{p.rating.toFixed(1)}</span>
          </span>
          <span>·</span>
          <span>from <span className="text-ink font-semibold">{formatMMK(cheapest)}</span></span>
        </div>
      </div>
    </button>
  )
}
