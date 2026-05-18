import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X, ArrowLeft, Clock } from 'lucide-react'
import { PostCard } from '../components/CommunityBits'
import { TOPICS, TOPIC_ORDER, type Post, type TopicId, popularShops } from '../community'
import { PROVIDERS, PROVIDER_BY_ID, type Provider } from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

const RECENT_KEY = 'community.search.recent'

function loadRecent(): string[] {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch { return [] }
}

function saveRecent(arr: string[]) {
  try { sessionStorage.setItem(RECENT_KEY, JSON.stringify(arr.slice(0, 8))) } catch {}
}

export function CommunitySearchScreen({
  posts,
  helpfulIds,
  onToggleHelpful,
  onBack,
  go,
}: {
  posts: Post[]
  helpfulIds: Set<string>
  onToggleHelpful: (postId: string) => void
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const [q, setQ] = useState('')
  /** Topic filter is an explicit dimension — kept separate from the text query
   *  so users can refine *within* a topic without losing their place. */
  const [topicFilter, setTopicFilter] = useState<TopicId | null>(null)
  const [recent, setRecent] = useState<string[]>(loadRecent())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const shopRank = useMemo(() => popularShops(posts).slice(0, 5), [posts])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    // Nothing to show when neither a query nor a topic filter is active.
    if (!needle && !topicFilter) return { posts: [] as Post[], shops: [] as Provider[] }

    // 1) Topic filter narrows the pool first.
    const pool = topicFilter ? posts.filter((p) => p.topic === topicFilter) : posts

    // 2) Then text query refines within that pool. If no query, return all of the pool.
    const postMatches = needle
      ? pool.filter((p) => {
          const provider = p.providerId ? PROVIDER_BY_ID[p.providerId] : null
          const hay = [
            p.title ?? '',
            p.body,
            p.author.name,
            provider?.name ?? '',
            provider?.area ?? '',
          ].join(' ').toLowerCase()
          return hay.includes(needle)
        })
      : pool

    // Shops are only surfaced when there's an actual text query; topic alone
    // doesn't imply a shop search.
    const shopMatches = needle
      ? PROVIDERS.filter((p) =>
          p.name.toLowerCase().includes(needle) || p.area.toLowerCase().includes(needle) || p.city.toLowerCase().includes(needle),
        ).slice(0, 5)
      : []

    return { posts: postMatches, shops: shopMatches }
  }, [posts, q, topicFilter])

  const commitRecent = (term: string) => {
    const v = term.trim()
    if (!v) return
    setRecent((prev) => {
      const next = [v, ...prev.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 8)
      saveRecent(next)
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    commitRecent(q)
  }

  const hasResults = results.posts.length > 0 || results.shops.length > 0
  const isSearching = q.trim() !== '' || topicFilter !== null
  const activeTopic = topicFilter ? TOPICS[topicFilter] : null

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      {/* Sticky search header */}
      <header className="relative z-30 px-3 pt-12 pb-3 bg-canvas/95 backdrop-blur border-b border-line/60">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="shrink-0 h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80"
            aria-label="Back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 h-10 px-3.5 rounded-full bg-surface-higher">
            <Search size={15} strokeWidth={2} className="text-ink-muted shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                activeTopic
                  ? t('community.search.placeholderWithin', { topic: t(activeTopic.labelKey) })
                  : t('community.search.placeholder')
              }
              className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-ink-muted"
            />
            {q && (
              <button
                type="button"
                onClick={() => { setQ(''); inputRef.current?.focus() }}
                className="shrink-0 grid place-items-center h-6 w-6 rounded-full bg-line/60 text-ink-muted"
                aria-label="Clear"
              >
                <X size={11} strokeWidth={2.4} />
              </button>
            )}
          </form>
        </div>

        {/* Active topic filter chip — sits below the input, removable */}
        {activeTopic && (
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[11.5px] font-medium text-ink-dim">
              {t('community.search.filtered')}
            </span>
            <button
              onClick={() => setTopicFilter(null)}
              className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1 rounded-full bg-ink text-canvas text-[11.5px] font-semibold"
            >
              <activeTopic.Icon size={11} strokeWidth={2.2} />
              {t(activeTopic.labelKey)}
              <span className="grid place-items-center h-5 w-5 rounded-full bg-canvas/15">
                <X size={10} strokeWidth={2.6} />
              </span>
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!isSearching ? (
          <div className="pt-5">
            {/* Browse by topic — outline chips that set the topic filter,
                so the user can still type a keyword within that topic. */}
            <Section title={t('community.search.popular')}>
              <div className="px-5 flex flex-wrap gap-1.5">
                {TOPIC_ORDER.map((id) => {
                  const top = TOPICS[id]
                  return (
                    <button
                      key={id}
                      onClick={() => { setTopicFilter(id); requestAnimationFrame(() => inputRef.current?.focus()) }}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-canvas border border-line/70 text-[12px] font-semibold leading-none text-ink hover:border-line-strong transition"
                    >
                      <top.Icon size={12.5} strokeWidth={2.2} className="text-ink-muted" />
                      {t(top.labelKey)}
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* Most talked about shops */}
            {shopRank.length > 0 && (
              <Section title={t('community.search.popularShops')}>
                <ul className="px-2">
                  {shopRank.map(({ providerId, count }) => {
                    const provider = PROVIDER_BY_ID[providerId]
                    if (!provider) return null
                    return (
                      <li key={providerId}>
                        <button
                          onClick={() => { setQ(provider.name); commitRecent(provider.name) }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-surface-higher transition text-left"
                        >
                          <span className="grid place-items-center h-9 w-9 rounded-xl bg-surface-higher text-[13px] font-semibold text-ink">
                            {provider.name[0]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13.5px] font-semibold tracking-tight truncate">{provider.name}</div>
                            <div className="text-[11.5px] text-ink-muted truncate">{provider.area} · {provider.city}</div>
                          </div>
                          <span className="shrink-0 text-[10.5px] font-semibold text-ink-dim uppercase tracking-wider">
                            {t('community.search.shopPosts', { count })}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </Section>
            )}

            {/* Recent searches */}
            {recent.length > 0 && (
              <Section
                title={t('community.search.recent')}
                right={
                  <button
                    onClick={() => { setRecent([]); saveRecent([]) }}
                    className="text-[11.5px] font-semibold text-ink-muted"
                  >
                    {t('community.search.clearRecent')}
                  </button>
                }
              >
                <ul className="px-2">
                  {recent.map((term) => (
                    <li key={term}>
                      <button
                        onClick={() => { setQ(term); commitRecent(term) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-surface-higher text-left"
                      >
                        <span className="grid place-items-center h-8 w-8 rounded-full bg-surface-higher">
                          <Clock size={14} strokeWidth={2} className="text-ink-muted" />
                        </span>
                        <span className="flex-1 text-[13.5px] tracking-tight text-ink truncate">{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <div className="h-8" />
          </div>
        ) : !hasResults ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-surface-higher">
              <Search size={18} className="text-ink-dim" />
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight mt-3">{t('community.search.empty.title')}</h3>
            <p className="text-[12.5px] text-ink-muted mt-1">{t('community.search.empty.sub')}</p>
          </div>
        ) : (
          <div className="pb-6">
            {/* Shops first if matches */}
            {results.shops.length > 0 && (
              <section>
                <div className="px-5 pt-4 pb-2 kicker text-[10px]">{t('community.search.shops')}</div>
                <ul className="px-2">
                  {results.shops.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => go({ kind: 'provider', providerId: p.id })}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-surface-higher text-left"
                      >
                        <span className="grid place-items-center h-9 w-9 rounded-xl bg-surface-higher text-[13px] font-semibold text-ink">
                          {p.name[0]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-semibold tracking-tight truncate">{p.name}</div>
                          <div className="text-[11.5px] text-ink-muted truncate">{p.area} · {p.city}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Post matches */}
            {results.posts.length > 0 && (
              <section>
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                  <div className="kicker text-[10px]">{t('community.search.posts')}</div>
                  <span className="text-[11px] text-ink-dim">{t('community.search.resultsCount', { count: results.posts.length })}</span>
                </div>
                {results.posts.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    helpfulMarked={helpfulIds.has(p.id)}
                    onToggleHelpful={() => onToggleHelpful(p.id)}
                    onOpen={() => { commitRecent(q); go({ kind: 'community-post', postId: p.id }) }}
                    onOpenShop={(providerId) => go({ kind: 'provider', providerId })}
                  />
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  icon: Icon, title, right, children,
}: {
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  title: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="mb-5">
      <div className="px-5 mb-2 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 kicker text-[10px]">
          {Icon && <Icon size={11} strokeWidth={2.2} className="text-ink-dim" />}
          {title}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}
