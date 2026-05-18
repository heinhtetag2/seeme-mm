import { useMemo, useState } from 'react'
import { Plus, ArrowUpDown, Check, Flame, Clock, ThumbsUp, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PostCard } from '../components/CommunityBits'
import { type Post, type SortMode, type TopicId, TOPICS, TOPIC_ORDER, sortPosts } from '../community'
import { useT } from '../i18n'
import type { View } from '../nav'

export function CommunityScreen({
  posts,
  helpfulIds,
  onToggleHelpful,
  go,
}: {
  posts: Post[]
  helpfulIds: Set<string>
  onToggleHelpful: (postId: string) => void
  go: (v: View) => void
}) {
  const t = useT()
  const [sort, setSort] = useState<SortMode>('trending')
  const [topic, setTopic] = useState<TopicId | 'all'>('all')
  const [sortSheet, setSortSheet] = useState(false)

  const sortMeta: Record<SortMode, { Icon: LucideIcon; tKey: string }> = {
    trending: { Icon: Flame,    tKey: 'community.sort.trending' },
    recent:   { Icon: Clock,    tKey: 'community.sort.recent' },
    helpful:  { Icon: ThumbsUp, tKey: 'community.sort.helpful' },
  }
  const currentSort = sortMeta[sort]

  const visible = useMemo(() => {
    const filtered = topic === 'all' ? posts : posts.filter((p) => p.topic === topic)
    return sortPosts(filtered, sort)
  }, [posts, topic, sort])

  return (
    <div className="pt-2 pb-6">
      {/* Header */}
      <header className="px-5 pt-3">
        <div className="kicker mb-1.5">{t('community.kicker')}</div>
        <h1 className="text-[26px] font-display font-semibold tracking-tight leading-[1.1]">
          {t('community.headline')}
        </h1>
        <p className="text-[12.5px] text-ink-muted mt-1.5">
          {t('community.subtitle')}
        </p>
      </header>

      {/* Search bar — tap to open the dedicated search screen */}
      <button
        onClick={() => go({ kind: 'community-search' })}
        className="mx-5 mt-5 w-[calc(100%-40px)] flex items-center gap-2.5 h-11 px-3.5 rounded-full bg-surface-higher text-left hover:bg-surface-elevated transition"
      >
        <Search size={15} strokeWidth={2} className="text-ink-muted" />
        <span className="text-[13px] text-ink-muted">{t('community.search.entry')}</span>
      </button>


      {/* Filter + sort row — sort sits as the first chip on the left,
          topic chips scroll horizontally after it. Single tidy row. */}
      <div className="mt-5 pb-3 pl-5 flex gap-1.5 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setSortSheet(true)}
          className="shrink-0 inline-flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full bg-ink text-canvas text-[11.5px] font-semibold leading-none transition"
        >
          <currentSort.Icon size={11.5} strokeWidth={2.2} />
          {t(currentSort.tKey)}
        </button>
        <span aria-hidden className="shrink-0 self-center h-4 w-px bg-line mx-0.5" />
        <FilterChip active={topic === 'all'} onClick={() => setTopic('all')}>
          {t('community.filter.all')}
        </FilterChip>
        {TOPIC_ORDER.map((id) => {
          const top = TOPICS[id]
          const isSel = topic === id
          return (
            <FilterChip key={id} active={isSel} onClick={() => setTopic(id)}>
              <top.Icon size={11.5} strokeWidth={2.2} />
              {t(top.labelKey)}
            </FilterChip>
          )
        })}
        <span className="shrink-0 w-3" aria-hidden />
      </div>

      {sortSheet && (
        <SortSheet
          value={sort}
          onPick={(s) => { setSort(s); setSortSheet(false) }}
          onClose={() => setSortSheet(false)}
          sortMeta={sortMeta}
        />
      )}

      {/* Feed */}
      {visible.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-surface-higher">
            <Plus size={18} className="text-ink-dim" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight mt-3">{t('community.empty.title')}</h3>
          <p className="text-[12px] text-ink-muted mt-1">{t('community.empty.sub')}</p>
        </div>
      ) : (
        <div>
          {visible.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              helpfulMarked={helpfulIds.has(p.id)}
              onToggleHelpful={() => onToggleHelpful(p.id)}
              onOpen={() => go({ kind: 'community-post', postId: p.id })}
              onOpenShop={(providerId) => go({ kind: 'provider', providerId })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11.5px] font-semibold leading-none transition
        ${active
          ? 'bg-ink text-canvas'
          : 'bg-surface-elevated border border-line/60 text-ink-muted hover:border-line-strong'}`}
    >
      {children}
    </button>
  )
}

function SortSheet({
  value, onPick, onClose, sortMeta,
}: {
  value: SortMode
  onPick: (v: SortMode) => void
  onClose: () => void
  sortMeta: Record<SortMode, { Icon: LucideIcon; tKey: string }>
}) {
  const t = useT()
  const options: SortMode[] = ['trending', 'recent', 'helpful']
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-canvas border-t border-line/70 rounded-t-3xl pb-5 animate-slide-up">
        <div className="px-5 pt-4 pb-2">
          <div className="mx-auto h-1 w-10 rounded-full bg-line/70 mb-3" />
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-dim">
            <ArrowUpDown size={12} strokeWidth={2.2} />
            Sort posts
          </div>
        </div>
        <ul className="px-2 pb-2">
          {options.map((s) => {
            const m = sortMeta[s]
            const isSel = value === s
            return (
              <li key={s}>
                <button
                  onClick={() => onPick(s)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-surface-higher transition text-left"
                >
                  <span className={`grid place-items-center h-9 w-9 rounded-full ${isSel ? 'bg-ink text-canvas' : 'bg-surface-higher text-ink-muted'}`}>
                    <m.Icon size={14.5} strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 text-[13.5px] font-semibold tracking-tight text-ink">{t(m.tKey)}</span>
                  {isSel && <Check size={16} strokeWidth={2.4} className="text-ink" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
