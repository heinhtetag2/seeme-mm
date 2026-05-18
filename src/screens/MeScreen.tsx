import {
  ChevronRight, Bell, Languages, Sun, HelpCircle, FileText, Info, LogOut, Pencil, UserCog,
  type LucideIcon,
} from 'lucide-react'
import { me } from '../data'
import { useT } from '../i18n'
import type { Tab, View } from '../nav'

export function MeScreen({ go, setTab, savedCount, bookingsCount, onLogout }: {
  go: (v: View) => void
  setTab: (t: Tab) => void
  savedCount: number
  bookingsCount: number
  onLogout: () => void
}) {
  const t = useT()
  return (
    <div className="px-5 pt-2 pb-2 space-y-7 animate-fade-in">
      {/* Editorial profile */}
      <div>
        <div className="kicker mb-1.5">{t('me.profile.kicker')}</div>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-[28px] leading-[1.05] tracking-tight font-semibold truncate">{me.name}</h1>
            <div className="text-[12px] text-ink-muted mt-1 truncate">{me.email} · {me.city}</div>
          </div>
          <button
            onClick={() => go({ kind: 'edit-profile' })}
            className="shrink-0 h-9 px-3.5 rounded-full border border-line/70 text-[12px] font-semibold leading-none inline-flex items-center gap-1.5"
          >
            <Pencil size={12} strokeWidth={2.2} />
            {t('me.editProfile')}
          </button>
        </div>
      </div>

      {/* Quiet stat row */}
      <div className="grid grid-cols-3 border-y border-line/60 divide-x divide-line/60">
        <Stat n={bookingsCount} label={t('me.stats.bookings')} onClick={() => setTab('bookings')} />
        <Stat n={savedCount} label={t('me.stats.saved')} onClick={() => go({ kind: 'saved' })} />
        <Stat n={me.joined.split(' ')[1]?.slice(2) ?? '26'} label={t('me.stats.memberSince')} prefix="'" />
      </div>

      <Section title={t('me.section.preferences')}>
        <Row Icon={UserCog} label="Account" onClick={() => go({ kind: 'account-settings' })} />
        <Row Icon={Bell} label={t('me.notifications')} onClick={() => go({ kind: 'notif-prefs' })} />
        <Row Icon={Languages} label={t('me.language')} onClick={() => go({ kind: 'language' })} />
        <Row Icon={Sun} label={t('me.appearance')} onClick={() => go({ kind: 'appearance' })} />
      </Section>

      <Section title={t('me.section.helpAbout')}>
        <Row Icon={HelpCircle} label={t('me.help')} onClick={() => go({ kind: 'help' })} />
        <Row Icon={FileText} label={t('me.terms')} onClick={() => go({ kind: 'terms' })} />
        <Row Icon={Info} label={t('me.about')} onClick={() => go({ kind: 'about' })} />
      </Section>

      <button
        onClick={onLogout}
        className="w-full h-11 text-rust-50 text-[12.5px] font-semibold inline-flex items-center justify-center gap-2 border-t border-line/60 pt-5"
      >
        <LogOut size={13} strokeWidth={2} />
        {t('me.logout')}
      </button>
    </div>
  )
}

function Stat({ n, label, onClick, prefix = '' }: { n: number | string; label: string; onClick?: () => void; prefix?: string }) {
  const inner = (
    <>
      <div className="font-serif text-[24px] font-semibold tabular-nums leading-none">
        {prefix}{n}
      </div>
      <div className="kicker text-[9.5px] mt-2">{label}</div>
    </>
  )
  return onClick ? (
    <button onClick={onClick} className="py-4 text-center">{inner}</button>
  ) : (
    <div className="py-4 text-center">{inner}</div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="kicker mb-2">{title}</div>
      <div className="divide-y divide-line/60 border-y border-line/60">
        {children}
      </div>
    </div>
  )
}

function Row({ Icon, label, onClick }: { Icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-3.5 text-left transition">
      <Icon size={15} strokeWidth={1.8} className="text-ink-muted" />
      <span className="flex-1 text-[13.5px] text-ink">{label}</span>
      <ChevronRight size={14} strokeWidth={2} className="text-ink-dim" />
    </button>
  )
}
