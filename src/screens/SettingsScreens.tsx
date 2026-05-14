import { useState } from 'react'
import { Check, Mail, MessageCircle, FileText, type LucideIcon } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useT, useLang, LANGS, type Lang } from '../i18n'
import { useTheme, type ThemePref } from '../theme'
import { account, me } from '../data'
import { useToast } from '../components/Toast'

/* ───────── Edit profile ───────── */

export function EditProfileScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  const { show } = useToast()
  const [name, setName] = useState(me.name)
  const [email, setEmail] = useState(me.email)
  const [phone, setPhone] = useState(me.phone)
  const [city, setCity] = useState(me.city)

  const save = () => {
    show(t('profile.saved'))
    onBack()
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.account')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          {t('profile.title')}
        </h1>

        <div className="space-y-4">
          <Field label={t('profile.name')} value={name} onChange={setName} />
          <Field label={t('profile.phone')} value={phone} onChange={setPhone} />
          <Field label={t('profile.email')} value={email} onChange={setEmail} />
          <Field label={t('profile.city')} value={city} onChange={setCity} />
        </div>

        <button
          onClick={save}
          className="w-full mt-7 h-12 rounded-full bg-ink text-canvas text-[14px] font-semibold"
        >
          {t('profile.save')}
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 px-0 border-0 border-b border-line/70 bg-transparent text-[15px] outline-none focus:border-ink transition"
      />
    </label>
  )
}

/* ───────── Language ───────── */

export function LanguageScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  const { lang, setLang } = useLang()

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.preferences')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          {t('language.title')}
        </h1>

        <div className="divide-y divide-line/60 border-y border-line/60">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id as Lang)}
              className="w-full flex items-center gap-3 py-4 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold tracking-tight">{l.label}</div>
                <div className="text-[11.5px] text-ink-muted mt-0.5">{l.sub}</div>
              </div>
              {lang === l.id && (
                <span className="h-5 w-5 rounded-full bg-ink text-canvas grid place-items-center">
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="text-[11.5px] text-ink-muted mt-4">{t('language.note')}</p>
      </div>
    </div>
  )
}

/* ───────── Appearance ───────── */

export function AppearanceScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  const { theme, setTheme } = useTheme()
  const items: { id: ThemePref; tKey: string }[] = [
    { id: 'system', tKey: 'appearance.system' },
    { id: 'dark', tKey: 'appearance.dark' },
    { id: 'light', tKey: 'appearance.light' },
  ]
  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.preferences')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          {t('appearance.title')}
        </h1>

        <div className="divide-y divide-line/60 border-y border-line/60">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setTheme(it.id)}
              className="w-full flex items-center gap-3 py-4 text-left"
            >
              <div className="flex-1 text-[14px] font-semibold tracking-tight">{t(it.tKey)}</div>
              {theme === it.id && (
                <span className="h-5 w-5 rounded-full bg-ink text-canvas grid place-items-center">
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────── Notification preferences (toggles) ───────── */

export function NotifPrefsScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  const [push, setPush] = useState(account.notifications)
  const [email, setEmail] = useState(true)
  const [promos, setPromos] = useState(false)

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.preferences')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          {t('notifications.title')}
        </h1>

        <div className="divide-y divide-line/60 border-y border-line/60">
          <Toggle title={t('notifications.push')} sub={t('notifications.push.sub')} value={push} onChange={setPush} />
          <Toggle title={t('notifications.email')} sub={t('notifications.email.sub')} value={email} onChange={setEmail} />
          <Toggle title={t('notifications.promos')} sub={t('notifications.promos.sub')} value={promos} onChange={setPromos} />
        </div>
      </div>
    </div>
  )
}

function Toggle({ title, sub, value, onChange }: { title: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-center gap-3 py-4 text-left">
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold tracking-tight">{title}</div>
        <div className="text-[11.5px] text-ink-muted mt-0.5">{sub}</div>
      </div>
      <span
        className={`relative h-6 w-11 rounded-full transition shrink-0 ${value ? 'bg-ink' : 'bg-line-strong'}`}
      >
        <span className={`absolute top-0.5 ${value ? 'left-[22px]' : 'left-0.5'} h-5 w-5 rounded-full bg-canvas transition-all`} />
      </span>
    </button>
  )
}

/* ───────── About ───────── */

export function AboutScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="h-14 w-14 rounded-[14px] bg-ink grid place-items-center mb-5">
          <span className="font-serif font-bold text-[26px] -tracking-[0.04em] text-canvas leading-none">B</span>
        </div>
        <div className="kicker mb-1">{t('settings.kicker.about')}</div>
        <h1 className="font-serif text-[26px] font-semibold tracking-tight">Bookly</h1>
        <p className="text-[11.5px] text-ink-muted mt-1.5 tabular-nums">{t('about.version')}</p>
        <p className="text-[13px] text-ink-muted mt-7 max-w-[280px] text-balance leading-relaxed">
          {t('about.tagline')}
        </p>
      </div>
    </div>
  )
}

/* ───────── Help ───────── */

export function HelpScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.support')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          {t('help.title')}
        </h1>

        <div className="divide-y divide-line/60 border-y border-line/60">
          <HelpRow Icon={MessageCircle} label={t('help.contact')} sub="support@bookly.mm" />
          <HelpRow Icon={FileText} label={t('help.faq')} sub="Common questions" />
          <HelpRow Icon={Mail} label={t('help.report')} sub="Tell us what went wrong" />
        </div>
      </div>
    </div>
  )
}

function HelpRow({ Icon, label, sub }: { Icon: LucideIcon; label: string; sub: string }) {
  return (
    <button className="w-full flex items-center gap-3 py-4 text-left">
      <Icon size={15} strokeWidth={1.8} className="text-ink-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold tracking-tight">{label}</div>
        <div className="text-[11.5px] text-ink-muted mt-0.5 truncate">{sub}</div>
      </div>
    </button>
  )
}

/* ───────── Terms ───────── */

export function TermsScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.legal')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          {t('terms.title')}
        </h1>

        <div className="space-y-4 font-serif text-[14px] leading-[1.7] text-ink-muted">
          <p>
            By using Bookly you agree to our terms of service and privacy policy.
          </p>
          <p>
            Bookings are held free of charge. Payment is collected by the provider on
            arrival unless stated otherwise. You can cancel any booking up to 2 hours
            before the scheduled time at no cost. Repeated late cancellations may
            impact your account standing.
          </p>
          <p>
            We collect minimal personal data needed to process bookings. We do not
            sell your data. The full privacy policy is available at
            <span className="text-ink"> bookly.mm/privacy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
