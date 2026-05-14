/**
 * AI Try-On Studio — mock data model.
 *
 * The "AI" is fully simulated: we deterministically render SVG previews
 * from (style × color × seed). Saved looks live in App-level state.
 */

import type { CategoryId } from './data'

export type LookKind = 'hair' | 'nails' | 'makeup'

/** Sub-style (e.g. "long-wave", "french") for a given LookKind. */
export type LookStyle = {
  id: string
  name: string
  /** Short editorial blurb shown under the chip. */
  hint: string
}

export type LookColor = {
  id: string
  name: string
  /** Hex code, used for swatches AND for SVG rendering. */
  hex: string
}

export type LookCategory = {
  kind: LookKind
  /** Display name on the picker tile. */
  name: string
  /** Short tagline shown on the tile. */
  tagline: string
  /** Provider category to deep-link to when user taps "Book this look". */
  bookCategory: CategoryId
  /** What service keyword to surface in the booking CTA. */
  bookKeyword: string
  styles: LookStyle[]
  colors: LookColor[]
}

export const LOOK_CATEGORIES: LookCategory[] = [
  {
    kind: 'hair',
    name: 'Hairstyle',
    tagline: 'Try cuts, colors & waves',
    bookCategory: 'spa',
    bookKeyword: 'hair',
    styles: [
      { id: 'long-wave',  name: 'Long waves',   hint: 'Soft, romantic' },
      { id: 'bob',        name: 'Modern bob',   hint: 'Sharp & clean' },
      { id: 'lob',        name: 'Long bob',     hint: 'Shoulder length' },
      { id: 'bangs',      name: 'Curtain bangs',hint: 'Face-framing' },
      { id: 'pixie',      name: 'Pixie cut',    hint: 'Bold & short' },
      { id: 'updo',       name: 'Sleek updo',   hint: 'Evening look' },
    ],
    colors: [
      { id: 'jet',     name: 'Jet black',     hex: '#161410' },
      { id: 'espresso',name: 'Espresso',      hex: '#3a241a' },
      { id: 'caramel', name: 'Caramel',       hex: '#8a5a2d' },
      { id: 'honey',   name: 'Honey blonde',  hex: '#c89a5b' },
      { id: 'platinum',name: 'Platinum',      hex: '#e8dccb' },
      { id: 'rose',    name: 'Rose copper',   hex: '#b25247' },
      { id: 'plum',    name: 'Plum',          hex: '#5b2545' },
      { id: 'midnight',name: 'Midnight blue', hex: '#1f2a55' },
    ],
  },
  {
    kind: 'nails',
    name: 'Nail design',
    tagline: 'Colors, gels & art',
    bookCategory: 'spa',
    bookKeyword: 'nail',
    styles: [
      { id: 'classic',  name: 'Classic',     hint: 'Glossy solid' },
      { id: 'french',   name: 'French',      hint: 'Tip accent' },
      { id: 'almond',   name: 'Almond',      hint: 'Tapered shape' },
      { id: 'square',   name: 'Square',      hint: 'Clean edges' },
      { id: 'ombre',    name: 'Ombre',       hint: 'Tip gradient' },
      { id: 'gem',      name: 'Gem accent',  hint: 'One-finger sparkle' },
    ],
    colors: [
      { id: 'nude',    name: 'Nude beige',   hex: '#d8b39a' },
      { id: 'rose',    name: 'Petal rose',   hex: '#d97b9b' },
      { id: 'red',     name: 'Cherry red',   hex: '#b8243a' },
      { id: 'plum',    name: 'Wine plum',    hex: '#5a1f3a' },
      { id: 'sage',    name: 'Sage green',   hex: '#9dad8a' },
      { id: 'sky',     name: 'Sky blue',     hex: '#9cc1d6' },
      { id: 'pearl',   name: 'Pearl white',  hex: '#efe7d8' },
      { id: 'noir',    name: 'Glossy noir',  hex: '#1a1a1f' },
    ],
  },
  {
    kind: 'makeup',
    name: 'Makeup look',
    tagline: 'Lip, eye & cheek styles',
    bookCategory: 'spa',
    bookKeyword: 'makeup',
    styles: [
      { id: 'natural',  name: 'Natural',     hint: 'Everyday glow' },
      { id: 'soft',     name: 'Soft glam',   hint: 'Wedding-ready' },
      { id: 'smoky',    name: 'Smoky eye',   hint: 'Night out' },
      { id: 'bold-lip', name: 'Bold lip',    hint: 'Statement red' },
      { id: 'dewy',     name: 'Dewy fresh',  hint: 'Skin-first' },
      { id: 'editorial',name: 'Editorial',   hint: 'High-fashion' },
    ],
    colors: [
      { id: 'rose',    name: 'Rose pink',    hex: '#d97b8a' },
      { id: 'mauve',   name: 'Soft mauve',   hex: '#9d6a78' },
      { id: 'berry',   name: 'Berry',        hex: '#8a2e4a' },
      { id: 'red',     name: 'Classic red',  hex: '#b8243a' },
      { id: 'nude',    name: 'Nude',         hex: '#c89980' },
      { id: 'coral',   name: 'Coral',        hex: '#e2826b' },
      { id: 'bronze',  name: 'Bronze',       hex: '#8a5a3c' },
      { id: 'wine',    name: 'Wine',         hex: '#621e2c' },
    ],
  },
]

export const LOOK_BY_KIND: Record<LookKind, LookCategory> = Object.fromEntries(
  LOOK_CATEGORIES.map((c) => [c.kind, c]),
) as Record<LookKind, LookCategory>

/** A single AI "generation" — one variant the user can save, vote, compare. */
export type GeneratedLook = {
  id: string
  kind: LookKind
  styleId: string
  colorId: string
  /** Random seed used for SVG render variety. */
  seed: number
  /** ISO timestamp. */
  createdAt: string
  /** AI-style fake confidence score 0–100, shown on the card. */
  match: number
  /** AI-style descriptor under the card. */
  vibe: string
}

const VIBES = [
  'Editorial · Confident',
  'Soft · Sun-kissed',
  'Bold · Statement',
  'Minimal · Modern',
  'Romantic · Effortless',
  'Sharp · Architectural',
  'Warm · Approachable',
  'Cool · Magazine-ready',
]

/** Deterministic mulberry32-style integer RNG. */
function rng(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Build 4 variants in one "generation pass". Same (style,color) — different
 * seeds → different SVG renders + different fake match scores.
 */
export function generateLooks(
  kind: LookKind,
  styleId: string,
  colorId: string,
  count = 4,
): GeneratedLook[] {
  const now = Date.now()
  const baseSeed = (now ^ hash(styleId) ^ hash(colorId)) | 0
  const r = rng(baseSeed)
  return Array.from({ length: count }, (_, i) => {
    const variantSeed = (baseSeed + i * 7919) | 0
    return {
      id: `look-${now}-${i}`,
      kind,
      styleId,
      colorId,
      seed: variantSeed,
      createdAt: new Date(now).toISOString(),
      match: 78 + Math.floor(r() * 21),
      vibe: VIBES[Math.floor(r() * VIBES.length)],
    }
  })
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
