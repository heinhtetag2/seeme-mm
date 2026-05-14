import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useT } from '../i18n'
import { CategoryCover } from '../components/Cover'
import { CATEGORIES } from '../data'

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const t = useT()
  const [step, setStep] = useState(0)

  // Slides reference translated copy from i18n. Render the title with a newline
  // split so the existing line-break + italic styling still feels editorial.
  const renderTitle = (raw: string) => {
    const parts = raw.split('\n')
    return (
      <>
        {parts.map((line, i) => (
          <span key={i} className={i === parts.length - 1 ? 'italic' : ''}>
            {line}
            {i < parts.length - 1 && <br />}
          </span>
        ))}
      </>
    )
  }
  const slides = [
    { kicker: 'BOOK TRUSTED SERVICES', title: renderTitle(t('onb.title.1')), sub: t('onb.sub.1') },
    { kicker: 'NO SURPRISES', title: renderTitle(t('onb.title.2')), sub: t('onb.sub.2') },
    { kicker: 'ONE PLACE', title: renderTitle(t('onb.title.3')), sub: t('onb.sub.3') },
  ]
  const isLast = step === slides.length - 1

  // Cycle category covers as a soft visual rhythm.
  const coverCat = CATEGORIES[step % CATEGORIES.length].id

  return (
    <div className="relative h-full w-full bg-canvas flex flex-col">
      {/* Top: brand + skip */}
      <div className="px-6 pt-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 rounded-[10px] bg-ink grid place-items-center">
            <span className="font-serif font-bold text-[20px] -tracking-[0.04em] text-canvas leading-none">B</span>
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-canvas" />
          </div>
          <span className="font-serif text-[18px] font-semibold tracking-tight">Bookly</span>
        </div>
        {!isLast && (
          <button onClick={onDone} className="text-[12.5px] font-semibold text-ink-muted">
            {t('onb.skip')}
          </button>
        )}
      </div>

      {/* Editorial poster */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        <CategoryCover category={coverCat} className="rounded-3xl h-[300px]">
          <div className="absolute inset-0 px-5 py-6 flex flex-col justify-end">
            <div className="kicker text-white/80 mb-2">{slides[step].kicker}</div>
            <div className="font-serif text-[34px] leading-[1.04] tracking-tight font-semibold text-white">
              {slides[step].title}
            </div>
          </div>
        </CategoryCover>
        <p className="text-[14px] leading-relaxed text-ink-muted mt-6 text-balance max-w-[320px]">
          {slides[step].sub}
        </p>
      </div>

      <div className="px-6 pb-10 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${i === step ? 'w-6 bg-ink' : 'w-1 bg-line-strong'}`}
              />
            ))}
          </div>
          <button
            onClick={() => (isLast ? onDone() : setStep((s) => s + 1))}
            className="h-12 px-5 rounded-full bg-ink text-canvas text-[13.5px] font-semibold leading-none inline-flex items-center gap-1.5"
          >
            {isLast ? t('onb.start') : t('onb.next')}
            <ArrowRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  )
}
