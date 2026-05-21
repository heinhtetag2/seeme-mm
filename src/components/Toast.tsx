import { useState, createContext, useContext, useCallback } from 'react'
import { Check, AlertCircle, X } from 'lucide-react'

type ToastKind = 'success' | 'error' | 'info'
type ToastMsg = { id: number; kind: ToastKind; text: string }

const ToastCtx = createContext<{ show: (text: string, kind?: ToastKind) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  const show = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, kind, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200)
  }, [])

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-24 z-[60] flex flex-col items-center gap-1.5 w-full max-w-[88%]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto inline-flex items-center gap-1.5 min-h-8 py-1.5 pl-2.5 pr-3 max-w-full rounded-2xl bg-ink text-canvas animate-fade-in"
          >
            {t.kind === 'success' && <Check size={12} strokeWidth={2.6} className="shrink-0 mt-px opacity-80" />}
            {t.kind === 'error'   && <X size={12} strokeWidth={2.6} className="shrink-0 mt-px text-rust-30" />}
            {t.kind === 'info'    && <AlertCircle size={12} strokeWidth={2.4} className="shrink-0 mt-px opacity-80" />}
            <span className="text-[11.5px] font-medium tracking-tight leading-snug">{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
