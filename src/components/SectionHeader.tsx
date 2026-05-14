import type { ReactNode } from 'react'

export function SectionHeader({
  kicker,
  title,
  action,
  size = 'md',
}: {
  kicker?: string
  title: string
  action?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'text-[17px]',
    md: 'text-[20px]',
    lg: 'text-[26px]',
  }
  return (
    <div className="flex items-end justify-between mb-4 gap-3">
      <div className="min-w-0">
        {kicker && <div className="kicker mb-1.5">{kicker}</div>}
        <h2 className={`${sizes[size]} font-serif font-semibold tracking-tight text-ink leading-[1.05]`}>
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  )
}
