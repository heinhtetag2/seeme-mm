import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useT } from '../i18n'

export function SubScreenHeader({
  title,
  onBack,
  right,
  variant = 'default',
}: {
  title?: string
  onBack: () => void
  right?: ReactNode
  variant?: 'default' | 'overlay'
}) {
  const t = useT()
  return (
    <header className={`relative z-30 flex items-center justify-between gap-3 px-3 pt-12 pb-3
      ${variant === 'overlay' ? 'bg-transparent' : 'bg-canvas/80 backdrop-blur'}`}>
      <button
        onClick={onBack}
        aria-label={t('a11y.back')}
        className="h-11 w-11 grid place-items-center rounded-full border border-line/70 bg-surface/80 backdrop-blur shrink-0"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
      {title && (
        <h1 className="absolute left-1/2 -translate-x-1/2 max-w-[55%] text-[15px] font-semibold tracking-tight truncate pointer-events-none">
          {title}
        </h1>
      )}
      <div className="flex items-center gap-2 shrink-0">{right}</div>
    </header>
  )
}
