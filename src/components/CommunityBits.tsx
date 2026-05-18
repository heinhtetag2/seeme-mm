import { useState } from 'react'
import { ThumbsUp, MessageCircle, Share2, Star, MapPin, Crown, Award, Link2, X, Bookmark, BellOff, EyeOff, Flag, MoreHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { type Author, type Post, TOPICS, photoGradient } from '../community'
import { PROVIDER_BY_ID } from '../data'
import { useT } from '../i18n'
import { useToast } from './Toast'

/* ───────── Avatar bubble ───────── */

export function CommunityAvatar({ author, size = 36 }: { author: Author; size?: number }) {
  // Stable color per author so an avatar always looks the same.
  const palette = ['from-iris-30 to-iris-50', 'from-tropic-30 to-tropic-60', 'from-ember-30 to-ember-50', 'from-sakura-30 to-sakura-50', 'from-ocean-30 to-ocean-60', 'from-moss-30 to-moss-60']
  const idx = author.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length
  return (
    <span
      className={`shrink-0 inline-grid place-items-center rounded-full bg-gradient-to-br ${palette[idx]} text-canvas font-semibold tracking-tight`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {author.initial}
    </span>
  )
}

/* ───────── Author row ───────── */

export function AuthorRow({ author, when, compact = false }: { author: Author; when: string; compact?: boolean }) {
  const t = useT()
  return (
    <div className="flex items-center gap-2.5">
      <CommunityAvatar author={author} size={compact ? 30 : 36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] font-semibold tracking-tight text-ink truncate">{author.name}</span>
          {author.flair === 'local-expert' && (
            <span className="inline-flex items-center gap-0.5 shrink-0 px-1.5 h-4 rounded-full bg-alpha-iris-10 text-iris-60 text-[9.5px] font-semibold uppercase tracking-wider">
              <Crown size={9} strokeWidth={2.4} />
              {t('community.flair.localExpert')}
            </span>
          )}
          {author.flair === 'top-contributor' && (
            <span className="inline-flex items-center gap-0.5 shrink-0 px-1.5 h-4 rounded-full bg-alpha-sunbeam-10 text-rust-60 text-[9.5px] font-semibold uppercase tracking-wider">
              <Award size={9} strokeWidth={2.4} />
              {t('community.flair.topContributor')}
            </span>
          )}
        </div>
        <div className="text-[11px] text-ink-dim mt-0.5 flex items-center gap-1">
          <span>{when}</span>
          {author.city && (
            <>
              <span>·</span>
              <MapPin size={9.5} strokeWidth={2.2} />
              <span>{author.city}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────── Topic chip ───────── */

export function TopicChip({ topicId, soft = true, size = 'md' }: { topicId: keyof typeof TOPICS; soft?: boolean; size?: 'sm' | 'md' }) {
  const t = useT()
  const topic = TOPICS[topicId]
  const cls = size === 'sm' ? 'h-5 text-[10.5px] px-2' : 'h-6 text-[11px] px-2.5'
  const tone = soft ? topic.toneSoft : topic.tone
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${cls} ${tone}`}>
      <topic.Icon size={size === 'sm' ? 10 : 11.5} strokeWidth={2.2} />
      {t(topic.labelKey)}
    </span>
  )
}

/* ───────── Photo grid ───────── */

export function PhotoGrid({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null
  // Layouts: 1 = wide, 2 = side-by-side, 3 = 1 big + 2 stacked, 4+ = 2x2 with +N
  if (photos.length === 1) {
    return (
      <div className="rounded-2xl overflow-hidden border border-line/60">
        <div className="aspect-[16/10]" style={{ background: photoGradient(photos[0]) }} />
      </div>
    )
  }
  if (photos.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {photos.map((p) => (
          <div key={p} className="rounded-2xl overflow-hidden border border-line/60 aspect-square" style={{ background: photoGradient(p) }} />
        ))}
      </div>
    )
  }
  // 3+
  const [first, ...rest] = photos
  const extra = rest.length > 2 ? rest.length - 2 : 0
  const visibleRest = rest.slice(0, 2)
  return (
    <div className="grid grid-cols-2 gap-1.5 h-44">
      <div className="rounded-2xl overflow-hidden border border-line/60 h-full" style={{ background: photoGradient(first) }} />
      <div className="grid grid-rows-2 gap-1.5">
        {visibleRest.map((p, i) => (
          <div key={p} className="relative rounded-2xl overflow-hidden border border-line/60" style={{ background: photoGradient(p) }}>
            {i === visibleRest.length - 1 && extra > 0 && (
              <div className="absolute inset-0 grid place-items-center bg-black/40 text-canvas text-[14px] font-semibold">
                +{extra}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────── Shop tag chip ───────── */

export function ShopTagChip({ providerId, onClick }: { providerId: string; onClick?: () => void }) {
  const provider = PROVIDER_BY_ID[providerId]
  if (!provider) return null
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-7 pl-1 pr-2.5 rounded-full bg-surface-higher border border-line/60 hover:border-line-strong transition"
    >
      <span className="grid place-items-center h-5 w-5 rounded-full bg-ink text-canvas text-[9px] font-bold">
        @
      </span>
      <span className="text-[11.5px] font-semibold text-ink truncate max-w-[140px]">{provider.name}</span>
    </button>
  )
}

/* ───────── Inline stars (read-only) ───────── */

function StarRow({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={11.5}
          strokeWidth={0}
          fill="currentColor"
          className={n <= value ? 'text-rust-50' : 'text-line'}
        />
      ))}
    </span>
  )
}

/* ───────── PostCard (feed item) ───────── */

/** Threshold above which the body gets a "more" expander on the feed. */
const BODY_PREVIEW_CHARS = 140

export function PostCard({
  post,
  helpfulMarked,
  onToggleHelpful,
  onOpen,
  onOpenShop,
}: {
  post: Post
  helpfulMarked: boolean
  onToggleHelpful: () => void
  onOpen: () => void
  onOpenShop?: (providerId: string) => void
}) {
  const t = useT()
  const helpfulCount = post.helpful + (helpfulMarked ? 1 : 0)
  const isLong = post.body.length > BODY_PREVIEW_CHARS
  const preview = isLong ? post.body.slice(0, BODY_PREVIEW_CHARS).trimEnd() + '…' : post.body
  const [shareOpen, setShareOpen] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)

  return (
    <article className="px-5 py-3.5 bg-canvas border-b border-line/60">
      {/* One-line author row — name + time inline, … menu on the right */}
      <div className="flex items-center gap-2">
        <CommunityAvatar author={post.author} size={28} />
        <span className="text-[12.5px] font-semibold tracking-tight text-ink truncate">{post.author.name}</span>
        <span className="text-[11px] text-ink-dim">· {post.when}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setActionsOpen(true) }}
          aria-label="More actions"
          className="ml-auto -mr-1 h-7 w-7 grid place-items-center rounded-full text-ink-muted hover:bg-surface-higher transition"
        >
          <MoreHorizontal size={15} strokeWidth={2} />
        </button>
      </div>

      <button onClick={onOpen} className="block w-full text-left mt-2.5">
        {post.title && (
          <h3 className="text-[14.5px] font-semibold tracking-tight text-ink leading-snug">{post.title}</h3>
        )}
        <p className={`text-[12.5px] text-ink-muted leading-relaxed ${post.title ? 'mt-1' : ''}`}>
          {preview}
          {isLong && <span className="text-ink font-semibold ml-1">more</span>}
        </p>
        {post.rating != null && (
          <div className="mt-1.5"><StarRow value={post.rating} /></div>
        )}
      </button>

      {post.photos && post.photos.length > 0 && (
        <button onClick={onOpen} className="block w-full mt-2.5">
          <PhotoGrid photos={post.photos} />
        </button>
      )}

      {post.providerId && (
        <div className="mt-2.5">
          <ShopTagChip providerId={post.providerId} onClick={() => onOpenShop?.(post.providerId!)} />
        </div>
      )}

      {/* Action row */}
      <div className="mt-3 flex items-center justify-between text-ink-dim">
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleHelpful}
            className={`inline-flex items-center gap-1.5 h-8 pl-2 pr-3 rounded-full text-[12px] font-semibold transition
              ${helpfulMarked
                ? 'bg-alpha-evergreen-10 text-evergreen-60'
                : 'text-ink-muted hover:bg-surface-higher'}`}
          >
            <ThumbsUp
              size={13}
              strokeWidth={helpfulMarked ? 0 : 2}
              fill={helpfulMarked ? 'currentColor' : 'none'}
            />
            <span className="tabular-nums">{helpfulCount}</span>
          </button>
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 h-8 pl-2 pr-3 rounded-full text-[12px] font-semibold text-ink-muted hover:bg-surface-higher"
          >
            <MessageCircle size={13} strokeWidth={2} />
            <span className="tabular-nums">{post.comments.length}</span>
          </button>
        </div>
        <button
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold text-ink-muted hover:bg-surface-higher"
        >
          <Share2 size={13} strokeWidth={2} />
          {t('community.share')}
        </button>
      </div>

      {shareOpen && <SharePostSheet post={post} onClose={() => setShareOpen(false)} />}
      {actionsOpen && <PostActionsSheet post={post} onClose={() => setActionsOpen(false)} />}
    </article>
  )
}

/* ───────── Share sheet ─ minimal: preview + copy / more ───────── */

export function SharePostSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const t = useT()
  const toast = useToast()
  const provider = post.providerId ? PROVIDER_BY_ID[post.providerId] : null

  // What we share looks more useful when it's the tagged shop; fall back to author.
  const headline = provider?.name ?? post.author.name
  const slug = provider ? `seeme.app/p/${provider.id}` : `seeme.app/c/${post.id}`
  // Square thumbnail uses the shop's category-cover gradient or the author avatar.
  const thumbBg = post.photos?.[0]
    ? photoGradient(post.photos[0])
    : 'linear-gradient(135deg, #d6b18a 0%, #6b4a2f 100%)'

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(slug) } catch {}
    toast.show(t('community.share.copied'))
    onClose()
  }
  const moreShare = async () => {
    const data = { title: post.title ?? headline, text: post.body.slice(0, 140), url: slug }
    type Navigatorish = Navigator & { share?: (d: ShareData) => Promise<void> }
    const nav = navigator as Navigatorish
    try {
      if (typeof nav !== 'undefined' && nav.share) await nav.share(data)
      else { await navigator.clipboard.writeText(slug); toast.show(t('community.share.copied')) }
    } catch {}
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 bg-black/35 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-canvas border-t border-line/70 rounded-t-3xl pb-6 animate-slide-up">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line/70" />

        {/* Header */}
        <div className="relative px-5 pt-4">
          <div className="kicker text-[10px]">{t('community.share.kicker')}</div>
          <h2 className="mt-1 font-display text-[22px] font-semibold tracking-tight leading-tight">
            {t('community.share.headline')}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-5 h-9 w-9 grid place-items-center rounded-full bg-surface-higher text-ink-muted"
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>

        {/* Preview row */}
        <div className="mx-5 mt-4 p-3 rounded-2xl bg-surface-elevated border border-line/60 flex items-center gap-3">
          <div
            className="shrink-0 h-12 w-12 rounded-xl"
            style={{ background: thumbBg }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold tracking-tight text-ink truncate">{headline}</div>
            <div className="text-[11.5px] text-ink-muted truncate mt-0.5">{slug}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mx-5 mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={copyLink}
            className="h-12 inline-flex items-center justify-center gap-2 rounded-full border border-line/70 bg-canvas text-[13px] font-semibold text-ink"
          >
            <Link2 size={14.5} strokeWidth={2.2} />
            {t('community.share.copy')}
          </button>
          <button
            onClick={moreShare}
            className="h-12 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-canvas text-[13px] font-semibold"
          >
            <Share2 size={14} strokeWidth={2.2} />
            {t('community.share.more')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────── Post actions sheet (the "…" menu) ───────── */

export function PostActionsSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const t = useT()
  const toast = useToast()
  const [saved, setSaved] = useState(false)

  const actions: { id: string; Icon: LucideIcon; label: string; danger?: boolean; onClick: () => void }[] = [
    {
      id: 'save',
      Icon: Bookmark,
      label: saved ? t('community.actions.unsave') : t('community.actions.save'),
      onClick: () => {
        setSaved((s) => {
          toast.show(s ? t('community.share.unsaved') : t('community.share.saved'))
          return !s
        })
        onClose()
      },
    },
    {
      id: 'mute',
      Icon: BellOff,
      label: t('community.actions.mute', { name: post.author.name }),
      onClick: () => { toast.show(t('community.actions.muted', { name: post.author.name })); onClose() },
    },
    {
      id: 'hide',
      Icon: EyeOff,
      label: t('community.actions.hide'),
      onClick: () => { toast.show(t('community.actions.hidden')); onClose() },
    },
    {
      id: 'report',
      Icon: Flag,
      label: t('community.actions.report'),
      danger: true,
      onClick: () => { toast.show(t('community.share.reported')); onClose() },
    },
  ]

  return (
    <div className="absolute inset-0 z-50 bg-black/35 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-canvas border-t border-line/70 rounded-t-3xl pb-5 animate-slide-up">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line/70" />

        <ul className="pt-3 px-3">
          {actions.map((a) => (
            <li key={a.id}>
              <button
                onClick={a.onClick}
                className="w-full flex items-center gap-3 h-12 px-3 rounded-2xl hover:bg-surface-higher transition text-left"
              >
                <a.Icon
                  size={17}
                  strokeWidth={2}
                  className={a.danger ? 'text-rust-60' : 'text-ink-muted'}
                />
                <span className={`flex-1 text-[13.5px] font-semibold tracking-tight ${a.danger ? 'text-rust-60' : 'text-ink'}`}>
                  {a.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="px-3 mt-2">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-full bg-surface-higher text-[13px] font-semibold text-ink-muted"
          >
            {t('community.share.cancel') || 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}
