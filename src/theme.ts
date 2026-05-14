import { useEffect, useState } from 'react'

export type ThemePref = 'system' | 'dark' | 'light'
type Resolved = 'dark' | 'light'

const STORAGE_KEY = 'bookly:theme'

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

export type AccentId = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber'

const ACCENT_KEY = 'bookly:accent'

export const ACCENTS: Record<AccentId, { brand: string; brand2: string; hex: string }> = {
  blue:    { brand: '91 141 239',  brand2: '139 92 246',  hex: '#5B8DEF' },
  violet:  { brand: '139 92 246',  brand2: '168 85 247',  hex: '#8B5CF6' },
  emerald: { brand: '16 185 129',  brand2: '20 184 166',  hex: '#10B981' },
  rose:    { brand: '244 63 94',   brand2: '236 72 153',  hex: '#F43F5E' },
  amber:   { brand: '245 158 11',  brand2: '249 115 22',  hex: '#F59E0B' },
}

function applyAccent(id: AccentId) {
  if (typeof document === 'undefined') return
  const a = ACCENTS[id]
  document.documentElement.style.setProperty('--brand', a.brand)
  document.documentElement.style.setProperty('--brand-2', a.brand2)
}

export function useAccent() {
  const [accent, setAccentState] = useState<AccentId>(() => {
    if (typeof window === 'undefined') return 'blue'
    const v = localStorage.getItem(ACCENT_KEY) as AccentId | null
    return v && v in ACCENTS ? v : 'blue'
  })

  useEffect(() => {
    applyAccent(accent)
  }, [accent])

  const setAccent = (next: AccentId) => {
    setAccentState(next)
    localStorage.setItem(ACCENT_KEY, next)
  }

  return { accent, setAccent }
}
