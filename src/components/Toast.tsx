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
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-32 z-[60] flex flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-higher/95 backdrop-blur-md border border-line/70 shadow-2xl animate-fade-in"
          >
            {t.kind === 'success' && (
              <span className="h-5 w-5 rounded-full bg-evergreen-50 grid place-items-center">
                <Check size={12} strokeWidth={3} className="text-white" />
              </span>
            )}
            {t.kind === 'error' && (
              <span className="h-5 w-5 rounded-full bg-rust-50 grid place-items-center">
                <X size={12} strokeWidth={3} className="text-white" />
              </span>
            )}
            {t.kind === 'info' && (
              <span className="h-5 w-5 rounded-full bg-brand grid place-items-center">
                <AlertCircle size={12} strokeWidth={3} className="text-white" />
              </span>
            )}
            <span className="text-[12.5px] font-medium pr-1">{t.text}</span>
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
