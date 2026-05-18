import { useState } from 'react'
import { ImagePlus, Star, X, Check, Search } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { CommunityAvatar, TopicChip } from '../components/CommunityBits'
import { TOPICS, TOPIC_ORDER, photoGradient, type TopicId, type Post } from '../community'
import { me, PROVIDERS, PROVIDER_BY_ID } from '../data'
import { useT } from '../i18n'
import { useToast } from '../components/Toast'

export function ComposePostScreen({
  initialProviderId,
  initialTopic,
  onBack,
  onSubmit,
}: {
  initialProviderId?: string
  initialTopic?: TopicId
  onBack: () => void
  onSubmit: (post: Post) => void
}) {
  const t = useT()
  const toast = useToast()
  const [topic, setTopic] = useState<TopicId>(initialTopic ?? 'tip')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [providerId, setProviderId] = useState<string | undefined>(initialProviderId)
  const [rating, setRating] = useState<number>(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [shopPicker, setShopPicker] = useState(false)

  const canPost = body.trim().length >= 5
  const taggedShop = providerId ? PROVIDER_BY_ID[providerId] : null
  const showRating = topic === 'recommend' || topic === 'experience'

  const submit = () => {
    if (!canPost) return
    const post: Post = {
      id: `cp-new-${Date.now()}`,
      author: { id: me.email, name: me.name, initial: me.name[0], verifiedVisitor: true, city: me.city },
      topic,
      title: title.trim() || undefined,
      body: body.trim(),
      photos: photos.length > 0 ? photos : undefined,
      providerId,
      rating: showRating && rating > 0 ? rating : undefined,
      when: 'just now',
      helpful: 0,
      comments: [],
      pinned: true,
    }
    onSubmit(post)
    toast.show(t('community.compose.posted'))
    onBack()
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader
        title={t('community.compose.title')}
        onBack={onBack}
        right={
          <button
            onClick={submit}
            disabled={!canPost}
            className={`h-9 px-4 rounded-full text-[12.5px] font-semibold leading-none transition
              ${canPost ? 'bg-ink text-canvas' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
          >
            {t('community.compose.cta')}
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-2 pb-6">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <CommunityAvatar author={{ id: me.email, name: me.name, initial: me.name[0] }} size={36} />
            <div>
              <div className="text-[13.5px] font-semibold tracking-tight">{me.name}</div>
              <div className="text-[11px] text-ink-dim">{me.city}</div>
            </div>
          </div>

          {/* Topic picker */}
          <section className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim mb-2">
              {t('community.compose.topic')}
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-5 px-5">
              {TOPIC_ORDER.map((id) => {
                const top = TOPICS[id]
                const isSel = topic === id
                return (
                  <button
                    key={id}
                    onClick={() => setTopic(id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[12px] font-semibold leading-none transition
                      ${isSel ? top.tone : 'bg-surface-elevated border border-line/60 text-ink-muted'}`}
                  >
                    <top.Icon size={12.5} strokeWidth={2.2} />
                    {t(top.labelKey)}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Title */}
          <section className="mt-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('community.compose.titlePlaceholder')}
              className="w-full text-[18px] font-display font-semibold tracking-tight bg-transparent outline-none placeholder:text-ink-muted"
            />
          </section>

          {/* Body */}
          <section className="mt-3">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('community.compose.bodyPlaceholder')}
              rows={6}
              className="w-full text-[14px] text-ink bg-transparent outline-none resize-none leading-relaxed placeholder:text-ink-muted"
            />
            <div className="text-[11px] text-ink-dim text-right">{body.length} / 800</div>
          </section>

          {/* Photos */}
          <section className="mt-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim mb-2">
              {t('community.compose.photos')}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {photos.map((p) => (
                <div key={p} className="relative aspect-square rounded-2xl overflow-hidden border border-line/60" style={{ background: photoGradient(p) }}>
                  <button
                    onClick={() => setPhotos((arr) => arr.filter((x) => x !== p))}
                    className="absolute top-1 right-1 grid place-items-center h-6 w-6 rounded-full bg-black/60 text-canvas"
                  >
                    <X size={12} strokeWidth={2.4} />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <button
                  onClick={() => setPhotos((arr) => [...arr, `ph-new-${arr.length}-${Date.now()}`])}
                  className="aspect-square rounded-2xl border-2 border-dashed border-line grid place-items-center text-ink-dim hover:border-line-strong hover:text-ink-muted transition"
                >
                  <div className="text-center">
                    <ImagePlus size={18} strokeWidth={2} className="mx-auto" />
                    <div className="text-[10px] mt-1 font-semibold">{t('community.compose.addPhoto')}</div>
                  </div>
                </button>
              )}
            </div>
          </section>

          {/* Shop tag */}
          <section className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim mb-2">
              {t('community.compose.tagShop')}
            </div>
            {taggedShop ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-line/60 bg-surface-elevated">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold tracking-tight truncate">{taggedShop.name}</div>
                  <div className="text-[11px] text-ink-muted truncate">{taggedShop.area} · {taggedShop.city}</div>
                </div>
                <button onClick={() => setProviderId(undefined)} className="shrink-0 h-8 w-8 grid place-items-center rounded-full border border-line/70">
                  <X size={13} strokeWidth={2.2} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShopPicker(true)}
                className="w-full flex items-center gap-2.5 p-3 rounded-2xl border border-line/70 bg-surface-elevated text-left hover:border-line-strong transition"
              >
                <span className="grid place-items-center h-8 w-8 rounded-full bg-surface-higher">
                  <Search size={14} strokeWidth={2} className="text-ink-muted" />
                </span>
                <span className="flex-1 text-[12.5px] text-ink-muted">{t('community.compose.tagShop.none')}</span>
              </button>
            )}
          </section>

          {/* Rating (only for recommend/experience) */}
          {showRating && (
            <section className="mt-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim mb-2">
                {t('community.compose.rating')}
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(rating === n ? 0 : n)}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      strokeWidth={0}
                      fill="currentColor"
                      className={n <= rating ? 'text-rust-50' : 'text-line'}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-ink-dim mt-1">{t('community.compose.ratingHint')}</p>
            </section>
          )}
        </div>
      </div>

      {/* Sticky submit */}
      <div className="shrink-0 bg-canvas border-t border-line/60 px-5 pt-3 pb-5">
        <button
          onClick={submit}
          disabled={!canPost}
          className={`w-full h-12 rounded-full text-[14px] font-semibold leading-none inline-flex items-center justify-center transition
            ${canPost ? 'bg-ink text-canvas' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {t('community.compose.submit')}
        </button>
      </div>

      {/* Shop picker sheet */}
      {shopPicker && (
        <ShopPickerSheet
          onPick={(id) => { setProviderId(id); setShopPicker(false) }}
          onClose={() => setShopPicker(false)}
        />
      )}
    </div>
  )
}

function ShopPickerSheet({ onPick, onClose }: { onPick: (id: string) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const matches = PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.area.toLowerCase().includes(q.toLowerCase()),
  ).slice(0, 30)
  return (
    <div className="absolute inset-0 z-50 bg-black/40 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-canvas border-t border-line/70 rounded-t-3xl pb-5 animate-slide-up max-h-[80%] flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-[16px] font-semibold tracking-tight">Tag a shop</h3>
          <div className="mt-3 flex items-center gap-2 h-11 px-3.5 rounded-full bg-surface-higher">
            <Search size={15} strokeWidth={2} className="text-ink-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search shops"
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-muted"
            />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto scrollbar-hide px-2">
          {matches.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onPick(p.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-surface-higher transition text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold tracking-tight truncate">{p.name}</div>
                  <div className="text-[11.5px] text-ink-muted truncate">{p.area} · {p.city}</div>
                </div>
                <Check size={15} className="text-ink-dim" />
              </button>
            </li>
          ))}
          {matches.length === 0 && (
            <li className="px-5 py-8 text-center text-[12.5px] text-ink-muted">No matches</li>
          )}
        </ul>
      </div>
    </div>
  )
}
