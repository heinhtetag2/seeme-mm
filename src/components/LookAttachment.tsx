/**
 * Reference-look attachment — a compact pill that expands inline to show
 * the AI preview and quick actions (view / change / remove).
 */

import { useState } from 'react'
import { Paperclip, ChevronDown, ChevronUp, X, Pencil } from 'lucide-react'
import { AIPreview } from './AIPreview'
import { LOOK_BY_KIND, type GeneratedLook } from '../studio'

export function LookAttachment({
  look,
  footer,
  onChange,
  onRemove,
}: {
  look: GeneratedLook
  footer?: string
  /** If provided, shows a "Change" action that lets the user swap the look. */
  onChange?: () => void
  /** If provided, shows a "Remove" action that detaches the look. */
  onRemove?: () => void
}) {
  const [open, setOpen] = useState(false)
  const cat = LOOK_BY_KIND[look.kind]
  const style = cat.styles.find((s) => s.id === look.styleId)
  const color = cat.colors.find((c) => c.id === look.colorId)
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Pill — always visible, tappable */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 h-8 pl-2.5 pr-2 rounded-full bg-surface-elevated border border-line/60 text-[11.5px] font-medium leading-none transition hover:border-line-strong"
      >
        <Paperclip size={10} strokeWidth={2.2} className="text-ink-dim" />
        <span className="text-ink">
          {style?.name} <span className="text-ink-muted">·</span> {color?.name}
        </span>
        {open
          ? <ChevronUp size={11} strokeWidth={2.4} className="text-ink-muted" />
          : <ChevronDown size={11} strokeWidth={2.4} className="text-ink-muted" />}
      </button>

      {footer && !open && (
        <span className="text-[10px] text-ink-dim">{footer}</span>
      )}

      {/* Expanded preview */}
      {open && (
        <div className="w-full rounded-2xl border border-line/60 bg-surface-elevated/60 p-3 animate-fade-in">
          <div className="flex gap-3">
            <AIPreview look={look} className="shrink-0 h-24 w-20 rounded-lg" rounded="rounded-lg" />
            <div className="flex-1 min-w-0 leading-tight">
              <div className="text-[13px] font-semibold tracking-tight">
                {style?.name} <span className="text-ink-muted font-normal">in</span> {color?.name}
              </div>
              <div className="text-[10.5px] text-ink-muted mt-1">{look.vibe || cat.name}</div>
              {footer && (
                <div className="text-[10.5px] text-ink-dim mt-2 leading-relaxed">
                  {footer}
                </div>
              )}
            </div>
          </div>
          {(onChange || onRemove) && (
            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-line/40">
              {onChange && (
                <button
                  onClick={onChange}
                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full border border-line/60 text-[11px] font-semibold leading-none text-ink"
                >
                  <Pencil size={10} strokeWidth={2.2} /> Change
                </button>
              )}
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-semibold leading-none text-rust-50"
                >
                  <X size={11} strokeWidth={2.4} /> Remove
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
