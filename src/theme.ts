import { useEffect, useState } from 'react'

export type ThemePref = 'system' | 'dark' | 'light'
type Resolved = 'dark' | 'light'

const STORAGE_KEY = 'seeme:theme'

function resolve(pref: ThemePref): Resolved {
  if (pref === 'system') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return pref
}

function apply(resolved: Resolved) {
  if (typeof document === 'undefined') return
  if (resolved === 'dark') document.documentElement.setAttribute('data-theme', 'dark')
  else document.documentElement.removeAttribute('data-theme')
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem(STORAGE_KEY) as ThemePref) || 'light'
  })

  useEffect(() => {
    apply(resolve(pref))
    if (pref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => apply(resolve('system'))
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [pref])

  const update = (next: ThemePref) => {
    setPref(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { theme: pref, setTheme: update }
}

/* ───────── Accent ───────── */

export type AccentId = 'rausch' | 'blue' | 'violet' | 'emerald' | 'rose' | 'amber'

const ACCENT_KEY = 'seeme:accent'

export const ACCENTS: Record<AccentId, {
  brand: string
  brand2: string
  /** Soft tint background (pale chip / hover / kicker bg). Used in light mode. */
  brandSoftLight: string
  /** Dark-mode soft tint — a deep, low-chroma version that reads on near-black. */
  brandSoftDark: string
  hex: string
}> = {
  rausch:  { brand: '255 56 92',   brand2: '218 18 73',  brandSoftLight: '254 229 231', brandSoftDark: '77 23 38',  hex: '#FF385C' },
  blue:    { brand: '91 141 239',  brand2: '139 92 246', brandSoftLight: '219 232 254', brandSoftDark: '22 35 70',  hex: '#5B8DEF' },
  violet:  { brand: '139 92 246',  brand2: '168 85 247', brandSoftLight: '237 230 254', brandSoftDark: '42 31 74',  hex: '#8B5CF6' },
  emerald: { brand: '16 185 129',  brand2: '20 184 166', brandSoftLight: '209 250 229', brandSoftDark: '10 50 38',  hex: '#10B981' },
  rose:    { brand: '244 63 94',   brand2: '236 72 153', brandSoftLight: '254 219 215', brandSoftDark: '74 22 30',  hex: '#F43F5E' },
  amber:   { brand: '245 158 11',  brand2: '249 115 22', brandSoftLight: '254 232 184', brandSoftDark: '70 44 10',  hex: '#F59E0B' },
}

function isDark() {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

function applyAccent(id: AccentId) {
  if (typeof document === 'undefined') return
  const a = ACCENTS[id]
  document.documentElement.style.setProperty('--brand', a.brand)
  document.documentElement.style.setProperty('--brand-2', a.brand2)
  document.documentElement.style.setProperty(
    '--brand-soft',
    isDark() ? a.brandSoftDark : a.brandSoftLight,
  )
}

export function useAccent() {
  const [accent, setAccentState] = useState<AccentId>(() => {
    if (typeof window === 'undefined') return 'rausch'
    const v = localStorage.getItem(ACCENT_KEY) as AccentId | null
    return v && v in ACCENTS ? v : 'rausch'
  })

  useEffect(() => {
    applyAccent(accent)
    // Re-apply soft tint whenever the data-theme attribute flips (dark ↔ light)
    // so the brand-soft chip background follows the active mode.
    const obs = new MutationObserver(() => applyAccent(accent))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [accent])

  const setAccent = (next: AccentId) => {
    setAccentState(next)
    localStorage.setItem(ACCENT_KEY, next)
  }

  return { accent, setAccent }
}
