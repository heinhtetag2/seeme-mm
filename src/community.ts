/* ───────── Community: types + seed data ───────── */

import type { LucideIcon } from 'lucide-react'
import { Lightbulb, MessageCircleQuestion, ThumbsUp, AlertTriangle, Sparkles, Gem } from 'lucide-react'

export type TopicId =
  | 'tip'        // Hidden tip / pro advice
  | 'question'   // Q&A
  | 'recommend'  // Recommendation
  | 'complaint'  // Complaint / issue
  | 'experience' // First-time / story
  | 'promo'      // Promotion alert

export type Topic = {
  id: TopicId
  label: string  // English fallback; UI uses i18n key
  labelKey: string
  Icon: LucideIcon
  /** Tailwind classes for the filled chip variant (background + text). */
  tone: string
  /** Subtle tone (used as a soft pill on cards). */
  toneSoft: string
}

export const TOPICS: Record<TopicId, Topic> = {
  tip:        { id: 'tip',        label: 'Hidden tip',   labelKey: 'community.topic.tip',        Icon: Lightbulb,             tone: 'bg-moss-50 text-canvas',     toneSoft: 'bg-alpha-moss-10 text-moss-70' },
  question:   { id: 'question',   label: 'Question',     labelKey: 'community.topic.question',   Icon: MessageCircleQuestion, tone: 'bg-ocean-60 text-canvas',    toneSoft: 'bg-alpha-ocean-10 text-ocean-70' },
  recommend:  { id: 'recommend',  label: 'Recommended',  labelKey: 'community.topic.recommend',  Icon: ThumbsUp,              tone: 'bg-iris-60 text-canvas',     toneSoft: 'bg-alpha-iris-10 text-iris-60' },
  complaint:  { id: 'complaint',  label: 'Complaint',    labelKey: 'community.topic.complaint',  Icon: AlertTriangle,         tone: 'bg-ember-50 text-canvas',    toneSoft: 'bg-alpha-ember-10 text-ember-60' },
  experience: { id: 'experience', label: 'Experience',   labelKey: 'community.topic.experience', Icon: Sparkles,              tone: 'bg-sakura-50 text-canvas',   toneSoft: 'bg-alpha-sakura-10 text-sakura-70' },
  promo:      { id: 'promo',      label: 'Promo',        labelKey: 'community.topic.promo',      Icon: Gem,                   tone: 'bg-rust-60 text-canvas',     toneSoft: 'bg-alpha-rust-10 text-rust-60' },
}

/** Display order for filter chips & pickers — UX over alpha. */
export const TOPIC_ORDER: TopicId[] = ['tip', 'recommend', 'question', 'experience', 'complaint', 'promo']

/* ───────── Author + Reactions ───────── */

export type Author = {
  id: string
  name: string
  /** Letter shown in the avatar bubble. */
  initial: string
  /** Verified through a confirmed booking on the tagged provider. */
  verifiedVisitor?: boolean
  /** Lifetime-helpful score (gamification — visible as a small chip). */
  helpfulScore?: number
  /** "Local expert" or "Top contributor" — shown next to the name when set. */
  flair?: 'local-expert' | 'top-contributor'
  /** Optional city for the "Nearby" rail. */
  city?: string
}

export type Reply = {
  id: string
  author: Author
  body: string
  when: string
  helpful: number
}

export type Comment = {
  id: string
  author: Author
  body: string
  when: string
  helpful: number
  /** One level of nested replies. */
  replies?: Reply[]
}

export type Post = {
  id: string
  author: Author
  topic: TopicId
  /** Optional headline; some posts read more naturally without one. */
  title?: string
  body: string
  /** Image URLs (or placeholder gradient ids for the mock). */
  photos?: string[]
  /** Provider being discussed. Optional — some posts are general. */
  providerId?: string
  /** 1–5 stars — only attached on "experience" / "recommend" posts. */
  rating?: number
  when: string
  helpful: number
  comments: Comment[]
  /** Inserted at the top of the feed when the user composes a new post. */
  pinned?: boolean
}

/* ───────── Seed posts ───────── */

const author = (
  id: string, name: string, initial: string,
  extra: Partial<Author> = {},
): Author => ({ id, name, initial, ...extra })

const A = {
  ei:     author('u-ei',     'Ei Mon',     'E', { verifiedVisitor: true,  helpfulScore: 240, flair: 'local-expert',    city: 'Yangon' }),
  thant:  author('u-thant',  'Thant Z.',   'T', { verifiedVisitor: true,  helpfulScore: 96,                            city: 'Yangon' }),
  hsu:    author('u-hsu',    'Hsu Yee',    'H', { verifiedVisitor: true,  helpfulScore: 412, flair: 'top-contributor', city: 'Mandalay' }),
  ko:     author('u-ko',     'Ko Min',     'K', {                          helpfulScore: 18,                            city: 'Yangon' }),
  thiri:  author('u-thiri',  'Thiri P.',   'T', { verifiedVisitor: true,  helpfulScore: 64,                            city: 'Yangon' }),
  nyein:  author('u-nyein',  'Nyein W.',   'N', {                          helpfulScore: 7,                             city: 'Naypyitaw' }),
  yamone: author('u-yamone', 'Yamone K.',  'Y', { verifiedVisitor: true,  helpfulScore: 132,                           city: 'Yangon' }),
  aung:   author('u-aung',   'Aung H.',    'A', { verifiedVisitor: true,  helpfulScore: 51,                            city: 'Yangon' }),
  phyu:   author('u-phyu',   'Phyu E.',    'P', { verifiedVisitor: true,  helpfulScore: 28,                            city: 'Yangon' }),
}

export const POSTS_SEED: Post[] = [
  {
    id: 'cp-1',
    author: A.ei,
    topic: 'tip',
    title: 'Skip the 6pm rush at Lotus Spa — try 2pm Tuesdays',
    body: "I've been booking 2pm Tuesdays for six months. Zero wait, and Khin Sandi is usually free for last-minute upgrades. Tip: ask for the lavender oil — they don't list it on the menu but it's the best one.",
    photos: ['ph-1', 'ph-2'],
    providerId: 'p-spa-1',
    when: '2 h',
    helpful: 84,
    comments: [
      {
        id: 'cm-1-1', author: A.thant, body: 'This is gold. Booked 2pm Tuesday last week and you were right — empty.', when: '1 h', helpful: 12,
        replies: [
          { id: 'cm-1-1-r1', author: A.ei, body: 'Right? Their app schedule just doesn\'t reflect it.', when: '50 m', helpful: 4 },
        ],
      },
      { id: 'cm-1-2', author: A.thiri, body: 'Lavender oil tip confirmed. Asked for it today — they had it.', when: '30 m', helpful: 6 },
    ],
  },
  {
    id: 'cp-2',
    author: A.hsu,
    topic: 'question',
    title: 'Any English-speaking pediatricians near Sanchaung?',
    body: 'Moved to Yangon last month with a 3-year-old. Looking for a doctor who is comfortable in English. Dr. Aung Thiha came up but his nearest slot is two weeks out. Anyone tried Dr. Hnin Phyu?',
    providerId: 'p-doc-1',
    when: '5 h',
    helpful: 14,
    comments: [
      { id: 'cm-2-1', author: A.aung, body: 'Dr. Hnin Phyu is fantastic with kids. Both my daughters see her. English is perfect.', when: '3 h', helpful: 22 },
      { id: 'cm-2-2', author: A.nyein, body: 'Seconding Dr. Hnin Phyu — and you can usually get in within 3 days.', when: '2 h', helpful: 9 },
      { id: 'cm-2-3', author: A.ko, body: 'Sanchaung Medical has walk-in hours 8-10am if it\'s urgent.', when: '1 h', helpful: 4 },
    ],
  },
  {
    id: 'cp-3',
    author: A.yamone,
    topic: 'recommend',
    title: 'BrightHome saved our deposit — full move-out clean for 95k',
    body: "Landlord did the inspection this morning and we got every kyat of our deposit back. The crew brought eco supplies, scrubbed the oven (twice!), and even fixed a curtain rod that came loose. Booked the move-out package — worth every kyat if you're handing back keys.",
    photos: ['ph-3', 'ph-4', 'ph-5'],
    providerId: 'p-home-1',
    rating: 5,
    when: '1 d',
    helpful: 56,
    comments: [
      { id: 'cm-3-1', author: A.phyu, body: 'Booked them based on this. Coming in a week — fingers crossed!', when: '20 h', helpful: 5 },
      { id: 'cm-3-2', author: A.yamone, body: 'You\'ll be fine — ask for Team Lead Khin specifically.', when: '18 h', helpful: 8 },
    ],
  },
  {
    id: 'cp-4',
    author: A.thant,
    topic: 'complaint',
    title: 'Booked 4:30, started at 5:15 — twice in a row',
    body: 'I love the salon but the wait times are getting worse. Same staff, same day-of-week, 45 minutes late twice this month. Has anyone else seen this lately or is it just my luck?',
    providerId: 'p-spa-2',
    when: '1 d',
    helpful: 22,
    comments: [
      { id: 'cm-4-1', author: A.thiri, body: 'Same — they\'ve been over-booking Saturdays since promo started.', when: '22 h', helpful: 14 },
      { id: 'cm-4-2', author: A.ei,    body: 'Try the 10am slot. They\'re always on time before 12.', when: '20 h', helpful: 9 },
    ],
  },
  {
    id: 'cp-5',
    author: A.nyein,
    topic: 'experience',
    title: 'First-time massage — Lotus Spa exceeded every expectation',
    body: 'Honestly nervous walking in. Was sat in a quiet lounge with ginger tea, the therapist explained pressure preferences in detail, and asked twice if I was comfortable. Walked out floating. 100% going back next month.',
    photos: ['ph-6'],
    providerId: 'p-spa-1',
    rating: 5,
    when: '2 d',
    helpful: 31,
    comments: [
      { id: 'cm-5-1', author: A.hsu, body: 'Welcome to the obsession. Try the hot stone next.', when: '1 d', helpful: 7 },
    ],
  },
  {
    id: 'cp-6',
    author: A.aung,
    topic: 'promo',
    title: '20% off cleanings at BrightHome — code BRIGHT20, ends Sunday',
    body: 'Saw this in their in-app message but it\'s also working for new users. Stackable with the move-in/out packages. Just booked next month\'s clean.',
    providerId: 'p-home-1',
    when: '2 d',
    helpful: 41,
    comments: [
      { id: 'cm-6-1', author: A.ko, body: 'Just used it — confirmed working.', when: '1 d', helpful: 6 },
    ],
  },
  {
    id: 'cp-7',
    author: A.phyu,
    topic: 'tip',
    body: 'Pro tip from the nail tech: tell them you want a "thin base coat" if you\'re doing back-to-back appointments. Mine lasted 3 weeks instead of the usual 10 days. Yu Yu knows what I\'m talking about.',
    providerId: 'p-spa-3',
    when: '3 d',
    helpful: 19,
    comments: [],
  },
  {
    id: 'cp-8',
    author: A.ko,
    topic: 'question',
    title: 'Are walk-ins really walk-in or do they actually want you to call ahead?',
    body: 'Tried showing up at Lotus Spa on a Saturday — was told the next available was 90 minutes out. Their listing says "walk-in welcome". Is the badge meaningful or marketing?',
    providerId: 'p-spa-1',
    when: '3 d',
    helpful: 8,
    comments: [
      { id: 'cm-8-1', author: A.ei, body: 'Walk-in usually works Mon–Thu before 4. Weekends, call first.', when: '2 d', helpful: 11 },
    ],
  },
  {
    id: 'cp-9',
    author: A.thiri,
    topic: 'recommend',
    title: 'Hidden gem for dental — Dr. Aye Mar is bookable same-week',
    body: 'Tried three other dentists with 3-week waits. Dr. Aye Mar had Thursday next-day. Painless cleaning, transparent pricing, and they email a follow-up plan. Highly recommend if you\'ve been putting it off.',
    providerId: 'p-doc-3',
    rating: 5,
    when: '4 d',
    helpful: 38,
    comments: [],
  },
  {
    id: 'cp-10',
    author: A.hsu,
    topic: 'experience',
    title: 'Telehealth visit at 10pm — actually worked',
    body: 'My toddler spiked a fever at 9. Booked a telehealth call with Dr. Aung Thiha for 10pm, he answered on time, calmed both of us down, and prescribed paracetamol with clear instructions. Total game changer for parents.',
    providerId: 'p-doc-1',
    rating: 5,
    when: '5 d',
    helpful: 67,
    comments: [
      { id: 'cm-10-1', author: A.nyein, body: 'Saving this for my emergency contacts.', when: '4 d', helpful: 9 },
      { id: 'cm-10-2', author: A.aung,  body: 'Did insurance cover the call?', when: '4 d', helpful: 2 },
    ],
  },
]

/* ───────── Sort helpers ───────── */

export type SortMode = 'trending' | 'recent' | 'helpful'

/** Quick parser for the seed's "2 h" / "3 d" labels — lower = more recent. */
function whenWeight(when: string): number {
  const m = when.match(/^(\d+)\s*([hd])/i)
  if (!m) return 9999
  const n = parseInt(m[1], 10)
  return m[2].toLowerCase() === 'h' ? n : n * 24
}

export function sortPosts(posts: Post[], mode: SortMode): Post[] {
  const arr = [...posts]
  if (mode === 'recent') {
    return arr.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return whenWeight(a.when) - whenWeight(b.when)
    })
  }
  if (mode === 'helpful') {
    return arr.sort((a, b) => b.helpful - a.helpful)
  }
  // trending: score = helpful per "age". Tiny smoothing to keep new posts visible.
  return arr.sort((a, b) => {
    const sa = (a.helpful + 5) / (whenWeight(a.when) + 1)
    const sb = (b.helpful + 5) / (whenWeight(b.when) + 1)
    return sb - sa
  })
}

/** Pick trending keywords from post titles/bodies. Naive but works for the mock:
 *  keep capitalized multi-word phrases & quoted terms, weight by helpful count. */
export function trendingTerms(posts: Post[], max = 6): string[] {
  const SEED = ['Lavender oil', 'Walk-in welcome', '2pm Tuesdays', 'Move-out clean', 'Telehealth', 'Painless cleaning', 'Wait times', 'BRIGHT20 promo']
  // Score by which seed terms appear in posts, weighted by helpful count.
  const scored = SEED.map((term) => {
    const score = posts.reduce(
      (acc, p) => acc + ((p.title + ' ' + p.body).toLowerCase().includes(term.toLowerCase()) ? (p.helpful + 1) : 0),
      0,
    )
    return { term, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, max).map((x) => x.term)
}

/** Aggregate posts per provider to surface "Most talked about" shops in search. */
export function popularShops(posts: Post[]): { providerId: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const p of posts) {
    if (!p.providerId) continue
    counts.set(p.providerId, (counts.get(p.providerId) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([providerId, count]) => ({ providerId, count }))
    .sort((a, b) => b.count - a.count)
}

/** Build a deterministic gradient for a photo placeholder id like "ph-3". */
export function photoGradient(id: string): string {
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const palettes = [
    ['#fde7d7', '#f4a78e'], // peach
    ['#dceadf', '#7fb997'], // sage
    ['#e3dffb', '#9b8be8'], // lavender
    ['#cfe5ee', '#7da6c1'], // sky
    ['#f7d6e0', '#dd8aa4'], // rose
    ['#f4ecc4', '#cfb96a'], // sand
    ['#d6e9e7', '#79b3aa'], // teal
  ]
  const [from, to] = palettes[seed % palettes.length]
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`
}
