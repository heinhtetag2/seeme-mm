import { useState } from 'react'
import { Search, MapPin, Locate, Check, X } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'
import { useT } from '../i18n'

type CityRow = { id: string; name: string; region: string; popular?: boolean }

/** Hand-curated list of cities Seeme currently serves. */
const CITIES: CityRow[] = [
  { id: 'yangon',      name: 'Yangon',      region: 'Yangon Region',         popular: true },
  { id: 'mandalay',    name: 'Mandalay',    region: 'Mandalay Region',       popular: true },
  { id: 'naypyidaw',   name: 'Naypyidaw',   region: 'Union Territory',       popular: true },
  { id: 'bago',        name: 'Bago',        region: 'Bago Region' },
  { id: 'mawlamyine',  name: 'Mawlamyine',  region: 'Mon State' },
  { id: 'taunggyi',    name: 'Taunggyi',    region: 'Shan State' },
  { id: 'pathein',     name: 'Pathein',     region: 'Ayeyarwady Region' },
  { id: 'monywa',      name: 'Monywa',      region: 'Sagaing Region' },
  { id: 'pyin-oo-lwin',name: 'Pyin Oo Lwin', region: 'Mandalay Region' },
  { id: 'bagan',       name: 'Bagan',       region: 'Mandalay Region' },
  { id: 'inle',        name: 'Inle Lake',   region: 'Shan State' },
  { id: 'sittwe',      name: 'Sittwe',      region: 'Rakhine State' },
  { id: 'myitkyina',   name: 'Myitkyina',   region: 'Kachin State' },
  { id: 'lashio',      name: 'Lashio',      region: 'Shan State' },
  { id: 'pyay',        name: 'Pyay',        region: 'Bago Region' },
  { id: 'hpa-an',      name: 'Hpa-An',      region: 'Kayin State' },
]

export function CityPickerScreen({
  current,
  onPick,
  onBack,
}: {
  current: string
  onPick: (city: string) => void
  onBack: () => void
}) {
  const [q, setQ] = useState('')
  const t = useT()
  const { show } = useToast()

  const needle = q.trim().toLowerCase()
  const filtered = needle
    ? CITIES.filter((c) => c.name.toLowerCase().includes(needle) || c.region.toLowerCase().includes(needle))
    : CITIES

  const popular = filtered.filter((c) => c.popular)
  const all = filtered

  const choose = (name: string) => {
    onPick(name)
    onBack()
  }

  const detect = () => {
    show(t('toast.detectedYangon'))
    choose('Yangon')
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />

      <div className="px-5">
        <div className="kicker mb-1.5">{t('cityPicker.kicker')}</div>
        <h1 className="font-serif text-[28px] leading-[1.05] tracking-tight font-semibold mb-5">
          {t('cityPicker.headline')}
        </h1>

        {/* Search */}
        <div className="flex items-center gap-2.5 h-12 px-4 rounded-full bg-surface-elevated border border-line/70 mb-5">
          <Search size={16} className="text-ink-muted" strokeWidth={1.9} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('cityPicker.search')}
            className="flex-1 bg-transparent border-none outline-none text-[13.5px] placeholder:text-ink-muted"
          />
          {q && (
            <button onClick={() => setQ('')} className="h-6 w-6 grid place-items-center rounded-full bg-surface-higher">
              <X size={11} className="text-ink-muted" strokeWidth={2.4} />
            </button>
          )}
        </div>

        {/* Detect */}
        <button
          onClick={detect}
          className="w-full flex items-center gap-3 py-3.5 px-4 rounded-2xl border border-line/70 bg-surface-elevated mb-7 text-left"
        >
          <span className="h-9 w-9 rounded-full bg-brand/15 grid place-items-center shrink-0">
            <Locate size={15} strokeWidth={2} className="text-brand" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold tracking-tight">{t('cityPicker.useLocation')}</div>
            <div className="text-[11.5px] text-ink-muted mt-0.5">{t('cityPicker.useLocationSub')}</div>
          </div>
        </button>

        {/* Popular */}
        {!q && popular.length > 0 && (
          <Section title={t('cityPicker.popular')}>
            {popular.map((c) => (
              <CityRowItem key={c.id} c={c} active={c.name === current} onClick={() => choose(c.name)} />
            ))}
          </Section>
        )}

        {/* All / search results — when searching, render results once (don't
            duplicate the popular cities under a second header). */}
        {q ? (
          all.length > 0 && (
            <Section title={t('cityPicker.results')}>
              {all.map((c) => (
                <CityRowItem key={c.id} c={c} active={c.name === current} onClick={() => choose(c.name)} />
              ))}
            </Section>
          )
        ) : (
          all.length > popular.length && (
            <Section title={t('cityPicker.allCities')}>
              {all.filter((c) => !c.popular).map((c) => (
                <CityRowItem key={c.id} c={c} active={c.name === current} onClick={() => choose(c.name)} />
              ))}
            </Section>
          )
        )}

        {q && all.length === 0 && (
          <div className="py-12 text-center">
            <div className="kicker mb-2">{t('cityPicker.nothingMatched')}</div>
            <p className="text-[12.5px] text-ink-muted max-w-[260px] mx-auto">
              {t('cityPicker.nothingMatchedSub')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="kicker mb-2">{title}</div>
      <div className="divide-y divide-line/60 border-y border-line/60">{children}</div>
    </div>
  )
}

function CityRowItem({ c, active, onClick }: { c: CityRow; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-3.5 text-left">
      <MapPin size={14} strokeWidth={1.8} className="text-ink-dim shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold tracking-tight">{c.name}</div>
        <div className="text-[11px] text-ink-muted mt-0.5">{c.region}</div>
      </div>
      {active && (
        <span className="h-5 w-5 rounded-full bg-brand text-white grid place-items-center">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}
