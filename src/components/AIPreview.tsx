/**
 * AI Try-On Preview — deterministic SVG renders of mock "AI" results.
 *
 * Real generation would call an image model; here we draw a stylised
 * portrait / nail / face vignette in pure SVG so previews load instantly
 * and stay coherent with the rest of the app's editorial vibe.
 */

import { LOOK_BY_KIND, type GeneratedLook } from '../studio'

export function AIPreview({
  look,
  className = '',
  rounded = 'rounded-2xl',
}: {
  look: GeneratedLook
  className?: string
  rounded?: string
}) {
  const cat = LOOK_BY_KIND[look.kind]
  const color = cat.colors.find((c) => c.id === look.colorId) ?? cat.colors[0]
  const style = cat.styles.find((s) => s.id === look.styleId) ?? cat.styles[0]
  const bg = backdropFor(look.seed)
  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} style={{ background: bg }}>
      <svg viewBox="0 0 200 240" className="absolute inset-0 h-full w-full">
        {look.kind === 'hair' && <HairPortrait color={color.hex} styleId={style.id} seed={look.seed} />}
        {look.kind === 'nails' && <NailsHand color={color.hex} styleId={style.id} seed={look.seed} />}
        {look.kind === 'makeup' && <MakeupFace color={color.hex} styleId={style.id} seed={look.seed} />}
      </svg>
      {/* faint film grain on top, matching Cover.tsx aesthetic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.18,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  )
}

/* ─────────────────── backdrop palettes ─────────────────── */

function backdropFor(seed: number): string {
  const palettes = [
    'radial-gradient(at 30% 20%, #f6d7c8 0%, #e3a98f 55%, #b87e60 100%)',
    'radial-gradient(at 70% 18%, #ead7c4 0%, #c4a98a 55%, #836549 100%)',
    'radial-gradient(at 28% 25%, #f3e0ea 0%, #d9a8be 55%, #8c5d76 100%)',
    'radial-gradient(at 70% 22%, #dfe7e3 0%, #a8c0b6 55%, #5f7a72 100%)',
    'radial-gradient(at 30% 25%, #e9dffa 0%, #b6a6d7 55%, #6d5a96 100%)',
    'radial-gradient(at 70% 20%, #f6dccb 0%, #d99a78 55%, #82503a 100%)',
  ]
  return palettes[Math.abs(seed) % palettes.length]
}

/* ─────────────────── HAIR ─────────────────── */

function HairPortrait({ color, styleId, seed }: { color: string; styleId: string; seed: number }) {
  const skin = '#e6c2a2'
  const skinShade = '#c89978'
  const tilt = ((seed % 5) - 2) * 0.6
  return (
    <g transform={`translate(0,0) rotate(${tilt} 100 130)`}>
      {/* neck */}
      <path d="M82 178 L82 210 Q100 220 118 210 L118 178 Z" fill={skin} />
      <path d="M82 200 Q100 208 118 200 L118 210 Q100 220 82 210 Z" fill={skinShade} opacity={0.4} />

      {/* hair back-layer (the silhouette behind the head) */}
      <HairBack styleId={styleId} color={color} />

      {/* face oval */}
      <ellipse cx="100" cy="118" rx="36" ry="46" fill={skin} />
      {/* jaw shading */}
      <path d="M64 130 Q 64 160 100 168 Q 136 160 136 130 Q 130 155 100 162 Q 70 155 64 130 Z" fill={skinShade} opacity={0.35} />

      {/* eyes */}
      <ellipse cx="86" cy="118" rx="3" ry="1.6" fill="#1c1815" />
      <ellipse cx="114" cy="118" rx="3" ry="1.6" fill="#1c1815" />
      {/* brows */}
      <path d="M79 108 Q 86 105 93 108" stroke="#3a2618" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M107 108 Q 114 105 121 108" stroke="#3a2618" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* nose */}
      <path d="M100 122 Q 98 132 96 138 Q 100 141 104 138 Q 102 132 100 122" stroke={skinShade} strokeWidth="1" fill="none" opacity="0.6" />
      {/* lips */}
      <path d="M91 148 Q 100 151 109 148 Q 100 154 91 148 Z" fill="#a35064" opacity="0.85" />
      <path d="M91 148 Q 100 145 109 148" stroke="#a35064" strokeWidth="1" fill="none" opacity="0.6" />

      {/* hair top-layer (in front of forehead) */}
      <HairFront styleId={styleId} color={color} seed={seed} />

      {/* subtle highlight on hair */}
      <HairShine styleId={styleId} seed={seed} />
    </g>
  )
}

function HairBack({ styleId, color }: { styleId: string; color: string }) {
  switch (styleId) {
    case 'long-wave':
      return (
        <path
          d="M52 110 Q 48 60 100 56 Q 152 60 148 110 L 152 200 Q 150 218 138 220 L 134 170 Q 130 130 100 130 Q 70 130 66 170 L 62 220 Q 50 218 48 200 Z"
          fill={color}
        />
      )
    case 'lob':
      return (
        <path
          d="M58 110 Q 54 60 100 58 Q 146 60 142 110 L 144 170 Q 140 184 128 182 L 124 156 Q 120 138 100 138 Q 80 138 76 156 L 72 182 Q 60 184 56 170 Z"
          fill={color}
        />
      )
    case 'bob':
      return (
        <path
          d="M60 110 Q 58 62 100 60 Q 142 62 140 110 L 142 156 Q 138 168 126 168 L 122 148 Q 118 134 100 134 Q 82 134 78 148 L 74 168 Q 62 168 58 156 Z"
          fill={color}
        />
      )
    case 'pixie':
      return (
        <path
          d="M64 110 Q 62 70 100 66 Q 138 70 136 110 L 138 130 Q 134 138 124 138 L 120 122 Q 114 112 100 112 Q 86 112 80 122 L 76 138 Q 66 138 62 130 Z"
          fill={color}
        />
      )
    case 'updo':
      return (
        <>
          <ellipse cx="100" cy="74" rx="30" ry="22" fill={color} />
          <path
            d="M68 110 Q 66 92 100 90 Q 134 92 132 110 L 130 134 Q 124 140 116 140 L 112 122 Q 106 116 100 116 Q 94 116 88 122 L 84 140 Q 76 140 70 134 Z"
            fill={color}
          />
        </>
      )
    case 'bangs':
      return (
        <path
          d="M56 110 Q 52 60 100 56 Q 148 60 144 110 L 148 196 Q 144 212 132 212 L 130 168 Q 126 134 100 134 Q 74 134 70 168 L 68 212 Q 56 212 52 196 Z"
          fill={color}
        />
      )
  }
  return null
}

function HairFront({ styleId, color, seed }: { styleId: string; color: string; seed: number }) {
  const part = (seed % 2 === 0) ? 'left' : 'right'
  switch (styleId) {
    case 'long-wave':
      return part === 'left' ? (
        <path d="M64 92 Q 76 78 100 78 Q 134 78 144 110 Q 124 96 104 100 Q 86 102 78 110 Q 70 110 64 104 Z" fill={color} />
      ) : (
        <path d="M56 110 Q 66 78 100 78 Q 124 78 136 92 L 136 104 Q 130 110 122 110 Q 114 102 96 100 Q 76 96 56 110 Z" fill={color} />
      )
    case 'lob':
    case 'bob':
      return (
        <path d="M60 110 Q 70 78 100 78 Q 130 78 140 110 Q 126 94 100 94 Q 74 94 60 110 Z" fill={color} />
      )
    case 'pixie':
      return (
        <path d="M66 108 Q 76 74 100 74 Q 124 74 134 108 Q 124 94 110 94 Q 96 94 92 102 Q 84 96 74 102 Q 70 108 66 108 Z" fill={color} />
      )
    case 'updo':
      return (
        <path d="M70 108 Q 80 92 100 92 Q 120 92 130 108 Q 118 100 100 100 Q 82 100 70 108 Z" fill={color} />
      )
    case 'bangs':
      return (
        <path d="M60 110 Q 68 84 100 82 Q 132 84 140 110 L 138 118 Q 124 110 100 110 Q 76 110 62 118 Z" fill={color} />
      )
  }
  return null
}

function HairShine({ styleId, seed }: { styleId: string; seed: number }) {
  const dx = (seed % 9) - 4
  if (styleId === 'pixie' || styleId === 'updo') {
    return <ellipse cx={100 + dx} cy="78" rx="14" ry="3" fill="white" opacity="0.18" />
  }
  return (
    <>
      <ellipse cx={88 + dx} cy="82" rx="6" ry="2" fill="white" opacity="0.22" />
      <ellipse cx={112 + dx} cy="82" rx="4" ry="1.4" fill="white" opacity="0.15" />
    </>
  )
}

/* ─────────────────── NAILS ─────────────────── */

function NailsHand({ color, styleId, seed }: { color: string; styleId: string; seed: number }) {
  const skin = '#e6c2a2'
  const shade = '#c89978'
  // 5 fingertips arranged in a slight fan
  const fingers: Array<{ x: number; y: number; rot: number; len: number }> = [
    { x: 45,  y: 158, rot: -16, len: 60 },
    { x: 76,  y: 130, rot: -7,  len: 78 },
    { x: 108, y: 122, rot: 0,   len: 86 },
    { x: 140, y: 132, rot: 8,   len: 76 },
    { x: 168, y: 162, rot: 18,  len: 56 },
  ]
  // shape variant by styleId
  const shape: 'square' | 'almond' | 'round' =
    styleId === 'almond' ? 'almond' :
    styleId === 'square' ? 'square' : 'round'
  return (
    <g>
      {/* palm */}
      <path
        d="M30 188 Q 30 224 100 232 Q 170 224 170 188 Q 170 174 154 174 Q 100 168 46 174 Q 30 174 30 188 Z"
        fill={skin}
      />
      <path d="M40 210 Q 100 220 160 210 Q 100 226 40 210 Z" fill={shade} opacity={0.4} />

      {fingers.map((f, i) => (
        <g key={i} transform={`rotate(${f.rot} ${f.x} ${f.y + f.len / 2})`}>
          {/* finger */}
          <rect x={f.x - 10} y={f.y} width="20" height={f.len} rx="9" fill={skin} />
          <rect x={f.x - 10} y={f.y} width="20" height={f.len} rx="9" fill={shade} opacity="0.18" />
          {/* nail bed background */}
          <rect x={f.x - 8} y={f.y + 4} width="16" height="20" rx="7" fill="#f3dcc8" />
          {/* nail */}
          <Nail
            cx={f.x}
            cy={f.y + 14}
            shape={shape}
            color={color}
            styleId={styleId}
            isAccent={i === 3 && (styleId === 'gem')}
            seed={seed + i}
          />
        </g>
      ))}
    </g>
  )
}

function Nail({
  cx, cy, shape, color, styleId, isAccent, seed,
}: {
  cx: number; cy: number; shape: 'square' | 'almond' | 'round'
  color: string; styleId: string; isAccent: boolean; seed: number
}) {
  const w = 14, h = 22
  const nailPath =
    shape === 'square'
      ? `M${cx - w / 2} ${cy - h / 2} h${w} v${h} h${-w} z`
      : shape === 'almond'
        ? `M${cx} ${cy - h / 2 - 4} Q${cx + w / 2 + 1} ${cy} ${cx} ${cy + h / 2} Q${cx - w / 2 - 1} ${cy} ${cx} ${cy - h / 2 - 4} Z`
        : `M${cx - w / 2} ${cy - h / 2} Q${cx} ${cy - h / 2 - 4} ${cx + w / 2} ${cy - h / 2} L${cx + w / 2} ${cy + h / 2 - 4} Q${cx} ${cy + h / 2} ${cx - w / 2} ${cy + h / 2 - 4} Z`

  return (
    <>
      {/* base coat */}
      <path d={nailPath} fill={color} />

      {/* style-specific decoration */}
      {styleId === 'french' && (
        <path
          d={`M${cx - w / 2} ${cy - h / 2 + 2} Q${cx} ${cy - h / 2 - 2} ${cx + w / 2} ${cy - h / 2 + 2} L${cx + w / 2} ${cy - h / 2 + 6} Q${cx} ${cy - h / 2 + 2} ${cx - w / 2} ${cy - h / 2 + 6} Z`}
          fill="#fdf5ec"
        />
      )}
      {styleId === 'ombre' && (
        <>
          <defs>
            <linearGradient id={`om-${seed}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={nailPath} fill={`url(#om-${seed})`} />
        </>
      )}
      {isAccent && (
        <>
          <circle cx={cx} cy={cy - 2} r="2.4" fill="#fff" opacity="0.9" />
          <circle cx={cx} cy={cy - 2} r="2.4" fill="none" stroke="#fff" strokeOpacity="0.6" />
          <circle cx={cx - 3} cy={cy + 2} r="1.1" fill="#fff" opacity="0.7" />
          <circle cx={cx + 3} cy={cy + 4} r="0.9" fill="#fff" opacity="0.6" />
        </>
      )}
      {/* gloss highlight */}
      <ellipse cx={cx - 2} cy={cy - h / 2 + 6} rx="2.2" ry="4" fill="white" opacity="0.32" />
    </>
  )
}

/* ─────────────────── MAKEUP ─────────────────── */

function MakeupFace({ color, styleId, seed }: { color: string; styleId: string; seed: number }) {
  const skin = '#e8c4a3'
  const skinShade = '#c79878'
  return (
    <g>
      {/* hair behind */}
      <path
        d="M52 112 Q 50 56 100 52 Q 150 56 148 112 L 150 210 Q 146 224 134 222 L 130 168 Q 126 132 100 132 Q 74 132 70 168 L 66 222 Q 54 224 50 210 Z"
        fill="#3a241a"
      />
      {/* neck */}
      <path d="M82 180 L82 218 Q100 226 118 218 L118 180 Z" fill={skin} />
      {/* face */}
      <ellipse cx="100" cy="120" rx="38" ry="48" fill={skin} />
      {/* contour */}
      <path d="M64 132 Q 64 166 100 172 Q 136 166 136 132 Q 128 158 100 164 Q 72 158 64 132 Z" fill={skinShade} opacity={0.3} />

      {/* cheeks (blush) */}
      <Cheek cx={78}  cy={138} styleId={styleId} color={color} />
      <Cheek cx={122} cy={138} styleId={styleId} color={color} />

      {/* eye shadow */}
      <EyeShadow cx={86} styleId={styleId} color={color} seed={seed} />
      <EyeShadow cx={114} styleId={styleId} color={color} seed={seed} />

      {/* eyes + lashes */}
      <Eye cx={86} styleId={styleId} />
      <Eye cx={114} styleId={styleId} />

      {/* brows */}
      <path d="M76 110 Q 86 106 96 110" stroke="#3a2618" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M104 110 Q 114 106 124 110" stroke="#3a2618" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* nose */}
      <path d="M100 124 Q 98 138 96 144 Q 100 147 104 144 Q 102 138 100 124" stroke={skinShade} strokeWidth="1" fill="none" opacity="0.7" />

      {/* lips */}
      <Lips color={color} styleId={styleId} />

      {/* glow */}
      <ellipse cx="100" cy="118" rx="34" ry="44" fill="white" opacity="0.05" />
    </g>
  )
}

function Cheek({ cx, cy, styleId, color }: { cx: number; cy: number; styleId: string; color: string }) {
  const opacity =
    styleId === 'natural' ? 0.18 :
    styleId === 'dewy'    ? 0.3 :
    styleId === 'bold-lip'? 0.15 :
    styleId === 'smoky'   ? 0.12 :
    0.22
  return <ellipse cx={cx} cy={cy} rx="10" ry="6" fill={color} opacity={opacity} />
}

function EyeShadow({ cx, styleId, color, seed }: { cx: number; styleId: string; color: string; seed: number }) {
  if (styleId === 'natural' || styleId === 'dewy') {
    return <ellipse cx={cx} cy={119} rx="9" ry="3" fill={color} opacity={0.12} />
  }
  if (styleId === 'smoky') {
    return (
      <>
        <ellipse cx={cx} cy={120} rx="10" ry="5" fill="#1f1a17" opacity={0.7} />
        <ellipse cx={cx} cy={119} rx="8.5" ry="3.5" fill={color} opacity={0.5} />
      </>
    )
  }
  if (styleId === 'editorial') {
    const dx = (seed % 3) - 1
    return (
      <>
        <path d={`M${cx - 9} 121 Q ${cx + dx} 113 ${cx + 9} 121`} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.8} />
        <path d={`M${cx - 9} 121 Q ${cx + dx} 115 ${cx + 9} 121`} stroke="white" strokeWidth="0.8" fill="none" opacity={0.7} />
      </>
    )
  }
  return <ellipse cx={cx} cy={119} rx="9" ry="4" fill={color} opacity={0.35} />
}

function Eye({ cx, styleId }: { cx: number; styleId: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={120} rx="3.2" ry="1.8" fill="#1c1815" />
      {/* eyeliner */}
      <path
        d={`M${cx - 4} 121 Q ${cx} 122.5 ${cx + 5} 119`}
        stroke="#1a1714"
        strokeWidth={styleId === 'smoky' || styleId === 'editorial' || styleId === 'bold-lip' ? 1.6 : 1}
        fill="none"
        strokeLinecap="round"
      />
      {/* lash flick for smoky/editorial */}
      {(styleId === 'smoky' || styleId === 'editorial') && (
        <path d={`M${cx + 4} 120 L ${cx + 8} 117`} stroke="#1a1714" strokeWidth="1.2" strokeLinecap="round" />
      )}
    </g>
  )
}

function Lips({ color, styleId }: { color: string; styleId: string }) {
  // Bold/red lips: use the chosen color fully. Natural: blend toward skin.
  const isBold = styleId === 'bold-lip' || styleId === 'editorial' || styleId === 'smoky'
  const fill = isBold ? color : blend(color, '#c87766', 0.55)
  return (
    <g>
      {/* upper */}
      <path d="M86 152 Q 92 148 100 151 Q 108 148 114 152 Q 108 155 100 153 Q 92 155 86 152 Z" fill={fill} />
      {/* lower */}
      <path d="M88 154 Q 100 162 112 154 Q 108 158 100 159 Q 92 158 88 154 Z" fill={fill} />
      {/* gloss */}
      <ellipse cx="100" cy="157" rx="4" ry="0.8" fill="white" opacity="0.55" />
    </g>
  )
}

/* ─────────────────── helpers ─────────────────── */

function blend(a: string, b: string, t: number): string {
  const ax = hex(a), bx = hex(b)
  const r = Math.round(ax[0] * (1 - t) + bx[0] * t)
  const g = Math.round(ax[1] * (1 - t) + bx[1] * t)
  const bl = Math.round(ax[2] * (1 - t) + bx[2] * t)
  return `rgb(${r},${g},${bl})`
}
function hex(h: string): [number, number, number] {
  const s = h.replace('#', '')
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]
}
