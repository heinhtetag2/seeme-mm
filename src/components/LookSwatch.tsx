/**
 * Minimal two-dot visual representing an attached AI Studio look.
 * Reads as a small "color pair" tag — like a palette chip — not as
 * an AI-rendered portrait.
 */

import { LOOK_BY_KIND, type GeneratedLook } from '../studio'

export function LookSwatch({
  look,
  size = 14,
}: {
  look: GeneratedLook
  /** Diameter of each dot in pixels. */
  size?: number
}) {
  const cat = LOOK_BY_KIND[look.kind]
  const color = cat.colors.find((c) => c.id === look.colorId) ?? cat.colors[0]
  const dot: React.CSSProperties = {
    width: size,
    height: size,
    background: color.hex,
  }
  return (
    <span className="inline-flex items-center shrink-0">
      <span
        className="rounded-full ring-[1.5px] ring-canvas shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        style={dot}
      />
      <span
        className="rounded-full ring-[1.5px] ring-canvas shadow-[0_1px_2px_rgba(0,0,0,0.25)] -ml-1.5"
        style={{ ...dot, opacity: 0.6 }}
      />
    </span>
  )
}
