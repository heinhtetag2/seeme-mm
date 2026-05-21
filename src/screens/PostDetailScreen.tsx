import { useMemo, useRef, useState } from 'react'
import { ThumbsUp, MessageCircle, Share2, Send, MoreHorizontal, Star, X } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { AuthorRow, CommunityAvatar, PhotoGrid, SharePostSheet, PostActionsSheet } from '../components/CommunityBits'
import { PROVIDER_BY_ID, me } from '../data'
import type { Comment, Post, Reply } from '../community'
import { useT } from '../i18n'
import type { View } from '../nav'

export function PostDetailScreen({
  postId,
  posts,
  helpfulIds,
  onToggleHelpful,
  onAddComment,
  onBack,
  go,
}: {
  postId: string
  posts: Post[]
  helpfulIds: Set<string>
  onToggleHelpful: (postId: string) => void
  onAddComment: (postId: string, body: string, parentCommentId?: string) => void
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const post = posts.find((p) => p.id === postId)
  const [sort, setSort] = useState<'helpful' | 'latest'>('helpful')
  const [draft, setDraft] = useState('')
  /** When set, the next "Send" appends a reply under this comment instead of a top-level comment. */
  const [replyTo, setReplyTo] = useState<{ commentId: string; authorName: string } | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const beginReply = (commentId: string, authorName: string) => {
    setReplyTo({ commentId, authorName })
    setDraft((d) => d.startsWith('@') ? d : `@${authorName.split(' ')[0]} `)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  if (!post) {
    return (
      <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
        <SubScreenHeader title="Post" onBack={onBack} />
        <div className="p-6 text-ink-muted">Post not found.</div>
      </div>
    )
  }

  const sortedComments = useMemo(() => {
    const arr = [...post.comments]
    if (sort === 'helpful') return arr.sort((a, b) => b.helpful - a.helpful)
    return arr // latest = seed order (newest first by data convention)
  }, [post.comments, sort])

  const isHelpful = helpfulIds.has(post.id)
  const helpfulCount = post.helpful + (isHelpful ? 1 : 0)
  const provider = post.providerId ? PROVIDER_BY_ID[post.providerId] : undefined

  const submit = () => {
    const body = draft.trim()
    if (!body) return
    onAddComment(post.id, body, replyTo?.commentId)
    setDraft('')
    setReplyTo(null)
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas flex flex-col animate-slide-up">
      <SubScreenHeader title="Post" onBack={onBack} right={
        <button
          onClick={() => setActionsOpen(true)}
          className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80"
          aria-label="More actions"
        >
          <MoreHorizontal size={18} strokeWidth={2} />
        </button>
      } />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Post body */}
        <article className="px-5 pt-2 pb-5 border-b border-line/60">
          <AuthorRow author={post.author} when={post.when} />

          {post.title && (
            <h1 className="mt-4 text-[20px] font-display font-semibold tracking-tight leading-tight">{post.title}</h1>
          )}
          <p className={`text-[14px] text-ink-muted leading-relaxed whitespace-pre-line ${post.title ? 'mt-2' : 'mt-4'}`}>
            {post.body}
          </p>

          {post.rating != null && (
            <div className="mt-3 inline-flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} strokeWidth={0} fill="currentColor" className={n <= post.rating! ? 'text-rust-50' : 'text-line'} />
              ))}
            </div>
          )}

          {post.photos && post.photos.length > 0 && (
            <div className="mt-4">
              <PhotoGrid photos={post.photos} />
            </div>
          )}

          {provider && (
            <div className="mt-4 p-3 rounded-2xl border border-line/60 bg-surface-elevated flex items-center gap-3">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-ink text-canvas text-[10px] font-bold">@</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold tracking-tight truncate">{provider.name}</div>
                <div className="text-[11px] text-ink-muted truncate">{provider.area} · {provider.city}</div>
              </div>
              <button
                onClick={() => go({ kind: 'provider', providerId: provider.id })}
                className="shrink-0 h-8 px-3 rounded-full bg-ink text-canvas text-[11.5px] font-semibold"
              >
                {t('community.viewShop')}
              </button>
            </div>
          )}

          {/* Action row */}
          <div className="mt-5 flex items-center justify-between text-ink-dim">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleHelpful(post.id)}
                className={`inline-flex items-center gap-1.5 h-9 pl-2.5 pr-3.5 rounded-full text-[12.5px] font-semibold transition
                  ${isHelpful ? 'bg-alpha-evergreen-10 text-evergreen-60' : 'bg-surface-higher text-ink-muted'}`}
              >
                <ThumbsUp size={14} strokeWidth={isHelpful ? 0 : 2} fill={isHelpful ? 'currentColor' : 'none'} />
                <span className="tabular-nums">{helpfulCount}</span>
              </button>
              <span className="inline-flex items-center gap-1.5 h-9 pl-2.5 pr-3.5 rounded-full text-[12.5px] font-semibold bg-surface-higher text-ink-muted">
                <MessageCircle size={14} strokeWidth={2} />
                <span className="tabular-nums">{post.comments.length}</span>
              </span>
            </div>
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[12.5px] font-semibold text-ink-muted bg-surface-higher"
            >
              <Share2 size={14} strokeWidth={2} />
              {t('community.share')}
            </button>
          </div>
        </article>

        {/* Comments header */}
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <h2 className="text-[14.5px] font-semibold tracking-tight">
            {t('community.comments')} <span className="text-ink-dim font-medium">· {post.comments.length}</span>
          </h2>
          <div className="inline-flex p-0.5 rounded-full bg-surface-higher">
            <SortTab active={sort === 'helpful'} onClick={() => setSort('helpful')}>{t('community.sort.helpful')}</SortTab>
            <SortTab active={sort === 'latest'} onClick={() => setSort('latest')}>{t('community.sort.recent')}</SortTab>
          </div>
        </div>

        {/* Comments */}
        {sortedComments.length === 0 ? (
          <p className="px-5 py-10 text-center text-[12.5px] text-ink-muted">{t('community.comment.empty')}</p>
        ) : (
          <ul className="px-5 pb-6">
            {sortedComments.map((c) => (
              <li key={c.id}>
                <CommentRow comment={c} onReply={beginReply} />
              </li>
            ))}
          </ul>
        )}

        <div className="h-20" />
      </div>

      {/* Sticky reply composer */}
      <div className="shrink-0 bg-canvas border-t border-line/60 px-3 pt-2 pb-5">
        {replyTo && (
          <div className="mx-1 mb-2 inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1 rounded-full bg-alpha-iris-10 text-iris-60 text-[11.5px] font-semibold">
            Replying to {replyTo.authorName}
            <button
              onClick={() => { setReplyTo(null); setDraft('') }}
              className="grid place-items-center h-5 w-5 rounded-full bg-iris-60 text-canvas"
              aria-label="Cancel reply"
            >
              <X size={10} strokeWidth={2.6} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <CommunityAvatar author={{ id: me.email, name: me.name, initial: me.name[0] }} size={32} />
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
            placeholder={replyTo ? `Reply to ${replyTo.authorName}…` : t('community.reply.placeholder')}
            className="flex-1 h-10 px-4 rounded-full bg-surface-higher text-[13px] outline-none placeholder:text-ink-muted"
          />
          <button
            onClick={submit}
            disabled={!draft.trim()}
            className={`grid place-items-center h-10 w-10 rounded-full transition
              ${draft.trim() ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
          >
            <Send size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      {shareOpen && <SharePostSheet post={post} onClose={() => setShareOpen(false)} />}
      {actionsOpen && <PostActionsSheet post={post} onClose={() => setActionsOpen(false)} />}
    </div>
  )
}

function SortTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-7 px-3 rounded-full text-[11.5px] font-semibold leading-none transition
        ${active ? 'bg-canvas text-ink shadow-sm' : 'text-ink-muted'}`}
    >
      {children}
    </button>
  )
}

function CommentRow({
  comment,
  onReply,
}: {
  comment: Comment
  onReply: (commentId: string, authorName: string) => void
}) {
  return (
    <div className="py-3.5 border-b border-line/60 last:border-b-0">
      <AuthorRow author={comment.author} when={comment.when} compact />
      <p className="mt-2 ml-[42px] text-[13px] text-ink leading-relaxed">{comment.body}</p>
      <div className="mt-2 ml-[42px] flex items-center gap-3">
        <button className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-ink-muted">
          <ThumbsUp size={12} strokeWidth={2} />
          <span className="tabular-nums">{comment.helpful}</span>
        </button>
        <button
          onClick={() => onReply(comment.id, comment.author.name)}
          className="text-[11.5px] font-semibold text-ink-muted hover:text-ink transition"
        >
          Reply
        </button>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <ul className="ml-[42px] mt-2.5 pl-3 border-l-2 border-line/60">
          {comment.replies.map((r) => (
            <ReplyRow key={r.id} reply={r} onReply={() => onReply(comment.id, r.author.name)} />
          ))}
        </ul>
      )}
    </div>
  )
}

function ReplyRow({ reply, onReply }: { reply: Reply; onReply: () => void }) {
  return (
    <li className="py-2.5">
      <AuthorRow author={reply.author} when={reply.when} compact />
      <p className="mt-1.5 ml-[40px] text-[12.5px] text-ink leading-relaxed">{reply.body}</p>
      <div className="mt-1.5 ml-[40px] flex items-center gap-3">
        <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
          <ThumbsUp size={11} strokeWidth={2} />
          <span className="tabular-nums">{reply.helpful}</span>
        </button>
        <button
          onClick={onReply}
          className="text-[11px] font-semibold text-ink-muted hover:text-ink transition"
        >
          Reply
        </button>
      </div>
    </li>
  )
}
