import { useRef, useState } from 'react'
import { Check, Mail, MessageCircle, FileText, Camera, X, Phone, Lock, ChevronRight, LogOut, Trash2, Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useT, useLang, LANGS, type Lang } from '../i18n'
import { useTheme, type ThemePref } from '../theme'
import { account, me } from '../data'
import { useToast } from '../components/Toast'
import type { AuthProfile } from './AuthScreens'

/* ───────── Edit profile ───────── */

export function EditProfileScreen({
  profile,
  onSave,
  onBack,
}: {
  profile: AuthProfile
  onSave: (next: AuthProfile) => void
  onBack: () => void
}) {
  const t = useT()
  const { show } = useToast()
  const [name, setName] = useState(profile.name ?? me.name)
  const [email, setEmail] = useState(profile.email ?? me.email)
  const [phone, setPhone] = useState(profile.phone ?? me.phone)
  const [city, setCity] = useState(profile.city ?? me.city)
  const [avatar, setAvatar] = useState<string | undefined>(profile.avatar)
  const fileRef = useRef<HTMLInputElement>(null)
  const initial = name.trim()[0]?.toUpperCase() ?? ''

  const handleFile = (file: File) => {
    setAvatar(URL.createObjectURL(file))
  }

  const save = () => {
    onSave({ ...profile, name, email, phone, city, avatar })
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

        {/* Avatar picker — same pattern as the auth profile step */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative"
            aria-label={avatar ? t('auth.profile.changePhoto') : t('auth.profile.addPhoto')}
          >
            {avatar ? (
              <span className="grid place-items-center h-24 w-24 rounded-full overflow-hidden bg-surface-elevated">
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              </span>
            ) : (
              <span className="grid place-items-center h-24 w-24 rounded-full bg-canvas border-2 border-dashed border-line-strong/70 text-ink-muted">
                {initial ? (
                  <span className="text-[34px] font-semibold tracking-tight text-ink">{initial}</span>
                ) : (
                  <Camera size={28} strokeWidth={1.6} />
                )}
              </span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-8 w-8 grid place-items-center rounded-full bg-ink text-canvas border-[3px] border-canvas shadow-[0_4px_14px_-4px_rgba(0,0,0,0.3)]">
              <Camera size={13} strokeWidth={2.2} />
            </span>
            {avatar && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); setAvatar(undefined) }}
                className="absolute -top-0.5 -left-0.5 h-7 w-7 grid place-items-center rounded-full bg-canvas border border-line/70 text-ink-muted"
                aria-label={t('auth.profile.removePhoto')}
              >
                <X size={11} strokeWidth={2.4} />
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>

        <div className="space-y-4">
          <Field label={t('profile.name')} value={name} onChange={setName} />
          <Field label={t('profile.phone')} value={phone} onChange={setPhone} />
          <Field label={t('profile.email')} value={email} onChange={setEmail} />
          <Field label={t('profile.city')} value={city} onChange={setCity} />
        </div>

        <button
          onClick={save}
          className="w-full mt-7 h-12 rounded-full bg-brand text-white text-[14px] font-semibold"
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
                <span className="h-5 w-5 rounded-full bg-brand text-white grid place-items-center">
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
                <span className="h-5 w-5 rounded-full bg-brand text-white grid place-items-center">
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
        className={`relative h-6 w-11 rounded-full transition shrink-0 ${value ? 'bg-brand' : 'bg-line-strong'}`}
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
          <span className="font-serif font-bold text-[26px] -tracking-[0.04em] text-canvas leading-none">S</span>
        </div>
        <div className="kicker mb-1">{t('settings.kicker.about')}</div>
        <h1 className="font-serif text-[26px] font-semibold tracking-tight">Seeme</h1>
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
  const toast = useToast()
  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.support')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          {t('help.title')}
        </h1>

        <div className="divide-y divide-line/60 border-y border-line/60">
          <HelpRow
            Icon={MessageCircle}
            label={t('help.contact')}
            sub="support@seeme.mm"
            onClick={() => { window.location.href = 'mailto:support@seeme.mm' }}
          />
          <HelpRow
            Icon={FileText}
            label={t('help.faq')}
            sub={t('help.faqSub')}
            onClick={() => toast.show(t('help.faqSub'), 'info')}
          />
          <HelpRow
            Icon={Mail}
            label={t('help.report')}
            sub={t('help.reportSub')}
            onClick={() => { window.location.href = 'mailto:support@seeme.mm?subject=Report%20a%20problem' }}
          />
        </div>
      </div>
    </div>
  )
}

function HelpRow({ Icon, label, sub, onClick }: { Icon: LucideIcon; label: string; sub: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-4 text-left">
      <Icon size={15} strokeWidth={1.8} className="text-ink-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold tracking-tight">{label}</div>
        <div className="text-[11.5px] text-ink-muted mt-0.5 truncate">{sub}</div>
      </div>
    </button>
  )
}

/* ───────── Account settings ─────────
   Sign-in identifiers, password, connected accounts, sign out, delete.
   Sub-screens (change email/phone/password) are out of scope for the prototype
   — taps show a toast so the row stays explorable. */

export function AccountSettingsScreen({
  profile,
  onSignOut,
  onChange,
  onBack,
}: {
  profile: AuthProfile | null
  onSignOut: () => void
  onChange: (field: 'email' | 'phone' | 'password') => void
  onBack: () => void
}) {
  const t = useT()
  const toast = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmUnlink, setConfirmUnlink] = useState(false)

  const email = profile?.email ?? me.email
  const phone = profile?.phone ?? me.phone

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5">
        <div className="kicker mb-1.5">{t('settings.kicker.preferences')}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold mb-6">
          Account
        </h1>

        {/* Sign-in identifiers */}
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted mb-2">
          Sign-in identifiers
        </div>
        <div className="divide-y divide-line/60 border-y border-line/60 mb-7">
          <AccountRow Icon={Mail}  label="Email"    value={email}        actionLabel="Change" onAction={() => onChange('email')} />
          <AccountRow Icon={Phone} label="Phone"    value={phone}        actionLabel="Change" onAction={() => onChange('phone')} />
          <AccountRow Icon={Lock}  label="Password" value="•••••••••"    actionLabel="Change" onAction={() => onChange('password')} />
        </div>

        {/* Connected accounts */}
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted mb-2">
          Connected accounts
        </div>
        <div className="divide-y divide-line/60 border-y border-line/60 mb-7">
          <div className="flex items-center gap-3 py-4">
            <div className="h-8 w-8 rounded-full bg-canvas border border-line/70 grid place-items-center shrink-0">
              <GoogleG />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold tracking-tight">Google</div>
              <div className="text-[11.5px] text-ink-muted mt-0.5 truncate">Linked · {email}</div>
            </div>
            <button
              onClick={() => setConfirmUnlink(true)}
              className="shrink-0 text-[12px] font-semibold text-ink-muted hover:text-ink underline-offset-4 underline decoration-line-strong"
            >
              Unlink
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted mb-2">
          Sign out & deletion
        </div>
        <div className="divide-y divide-line/60 border-y border-line/60">
          <button onClick={onSignOut} className="w-full flex items-center gap-3 py-3.5 text-left">
            <LogOut size={15} strokeWidth={1.8} className="text-ink-muted" />
            <span className="flex-1 text-[13.5px] text-ink">Sign out</span>
            <ChevronRight size={14} strokeWidth={2} className="text-ink-dim" />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full flex items-center gap-3 py-3.5 text-left text-rust-50"
          >
            <Trash2 size={15} strokeWidth={1.8} />
            <span className="flex-1 text-[13.5px] font-semibold">Delete account</span>
            <ChevronRight size={14} strokeWidth={2} className="opacity-60" />
          </button>
        </div>
        <p className="text-[11.5px] text-ink-muted mt-3 max-w-[320px]">
          Deleting your account removes all bookings, saved places, and community activity permanently.
        </p>
      </div>

      {confirmUnlink && (
        <ConfirmSheet
          kicker="DISCONNECT"
          kickerTone="text-ink-muted"
          title="Unlink Google?"
          body="You'll still be able to sign in with your email and phone. You can re-link Google any time."
          confirmLabel="Unlink"
          onCancel={() => setConfirmUnlink(false)}
          onConfirm={() => { setConfirmUnlink(false); toast.show(t('account.toast.googleUnlinked'), 'success') }}
        />
      )}

      {confirmDelete && (
        <ConfirmSheet
          kicker="PERMANENT"
          kickerTone="text-rust-50"
          title="Delete your account?"
          body="Bookings, saved places, and community posts will be gone. This can't be undone."
          confirmLabel="Delete account"
          confirmTone="destructive"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => { setConfirmDelete(false); toast.show(t('account.toast.deleted'), 'info'); onSignOut() }}
        />
      )}
    </div>
  )
}

/** Bottom-sheet confirm modal — reused by Unlink and Delete. */
function ConfirmSheet({
  kicker, kickerTone, title, body, confirmLabel, confirmTone = 'default',
  onCancel, onConfirm,
}: {
  kicker: string
  kickerTone: string
  title: string
  body: string
  confirmLabel: string
  confirmTone?: 'default' | 'destructive'
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onCancel} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-6 pb-8 animate-slide-up">
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />
        <div className={`kicker mb-1.5 ${kickerTone}`}>{kicker}</div>
        <h2 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold mb-2">{title}</h2>
        <p className="text-[13px] leading-relaxed text-ink-muted mb-5 max-w-[320px]">{body}</p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onCancel}
            className="h-12 rounded-full border border-line/70 text-[13px] font-semibold leading-none inline-flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`h-12 rounded-full text-[13px] font-semibold leading-none inline-flex items-center justify-center
              ${confirmTone === 'destructive' ? 'bg-rust-50 text-canvas' : 'bg-brand text-white'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────── Account · change email / phone / password ───────── */

export function AccountChangeScreen({
  field, profile, onBack,
}: {
  field: 'email' | 'phone' | 'password'
  profile: AuthProfile | null
  onBack: () => void
}) {
  const t = useT()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const currentEmail = profile?.email ?? me.email
  const currentPhone = profile?.phone ?? me.phone

  // Field state is per-mode; keep three independent so switching modes doesn't
  // bleed entered text across forms.
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  let kicker = ''
  let headline = ''
  let sub = ''
  let canSave = false
  let body: React.ReactNode = null
  let saveLabel = 'Save'

  if (field === 'email') {
    kicker = 'ACCOUNT'
    headline = 'Change email'
    sub = "We'll send a verification link to the new address before switching."
    saveLabel = 'Send verification'
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim()) && newEmail.trim() !== currentEmail
    const passOk = confirmPassword.length >= 6
    canSave = emailValid && passOk

    body = (
      <div className="mt-7 space-y-3">
        <ReadOnlyField label="Current email" Icon={Mail} value={currentEmail} />
        <LabelledInput
          label="New email"
          Icon={Mail}
          type="email"
          autoFocus
          value={newEmail}
          onChange={setNewEmail}
          placeholder="you@example.com"
        />
        <LabelledPassword
          label="Confirm your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
        />
      </div>
    )
  } else if (field === 'phone') {
    kicker = 'ACCOUNT'
    headline = 'Change phone'
    sub = "We'll text a 6-digit code to the new number to confirm it's yours."
    saveLabel = 'Send code'
    const digits = newPhone.replace(/\D/g, '')
    const phoneValid = digits.length >= 7
    const passOk = confirmPassword.length >= 6
    canSave = phoneValid && passOk

    body = (
      <div className="mt-7 space-y-3">
        <ReadOnlyField label="Current phone" Icon={Phone} value={currentPhone} />
        <div>
          <div className="text-[11.5px] text-ink-dim font-medium mb-1.5">New phone</div>
          <div className="flex items-stretch gap-2">
            <div className="shrink-0 inline-flex items-center gap-1.5 h-12 px-3 rounded-xl border border-line/70 bg-canvas text-[13.5px] font-semibold tracking-tight">
              🇲🇲 <span>+95</span>
            </div>
            <input
              autoFocus
              inputMode="numeric"
              value={newPhone}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, '').slice(0, 9)
                const a = d.slice(0, 1), b = d.slice(1, 5), c = d.slice(5, 9)
                setNewPhone([a, b, c].filter(Boolean).join(' '))
              }}
              placeholder="9 •••• ••••"
              className="flex-1 h-12 px-4 rounded-xl border border-line/70 bg-canvas text-[14px] tabular-nums tracking-wider outline-none placeholder:text-ink-muted focus:border-ink"
            />
          </div>
        </div>
        <LabelledPassword
          label="Confirm your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
        />
      </div>
    )
  } else {
    kicker = 'SECURITY'
    headline = 'Change password'
    sub = 'Pick a new password — at least 6 characters. You\'ll stay signed in on this device.'
    saveLabel = 'Update password'
    const currentOk = currentPassword.length >= 6
    const newOk = newPassword.length >= 6
    const match = newPassword === confirmNewPassword && confirmNewPassword.length > 0
    canSave = currentOk && newOk && match

    body = (
      <div className="mt-7 space-y-3">
        <LabelledPassword
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
          autoFocus
        />
        <LabelledPassword
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
          helper="At least 6 characters."
        />
        <LabelledPassword
          label="Confirm new password"
          value={confirmNewPassword}
          onChange={setConfirmNewPassword}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
          error={confirmNewPassword.length > 0 && !match ? "Doesn't match the new password." : undefined}
        />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-30 bg-canvas overflow-y-auto scrollbar-hide pb-10 animate-slide-up flex flex-col">
      <SubScreenHeader onBack={onBack} />
      <div className="flex-1 px-5">
        <div className="kicker mb-1.5">{kicker}</div>
        <h1 className="font-serif text-[26px] leading-[1.05] tracking-tight font-semibold">{headline}</h1>
        <p className="text-[12.5px] leading-relaxed text-ink-muted mt-2 max-w-[320px]">{sub}</p>

        {body}
      </div>

      <div className="px-5 pb-8 pt-4">
        <button
          onClick={() => {
            if (!canSave) return
            toast.show(
              field === 'password' ? t('account.toast.passwordSaved')
                : field === 'email' ? t('account.toast.emailSaved')
                : t('account.toast.phoneSaved'),
              'success',
            )
            onBack()
          }}
          disabled={!canSave}
          className={`w-full h-12 rounded-full text-[13.5px] font-semibold leading-none inline-flex items-center justify-center transition
            ${canSave ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

function ReadOnlyField({ label, Icon, value }: { label: string; Icon: LucideIcon; value: string }) {
  return (
    <div>
      <div className="text-[11.5px] text-ink-dim font-medium mb-1.5">{label}</div>
      <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-xl border border-line/60 bg-surface-elevated">
        <Icon size={14} strokeWidth={1.8} className="text-ink-muted shrink-0" />
        <span className="text-[13.5px] text-ink-muted truncate">{value}</span>
      </div>
    </div>
  )
}

function LabelledInput({
  label, Icon, type = 'text', value, onChange, placeholder, autoFocus,
}: {
  label: string
  Icon: LucideIcon
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <div>
      <div className="text-[11.5px] text-ink-dim font-medium mb-1.5">{label}</div>
      <div className="relative">
        <Icon size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          autoFocus={autoFocus}
          type={type}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-line/70 bg-canvas text-[13.5px] outline-none placeholder:text-ink-muted focus:border-ink"
        />
      </div>
    </div>
  )
}

function LabelledPassword({
  label, value, onChange, show, onToggleShow, autoFocus, helper, error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggleShow: () => void
  autoFocus?: boolean
  helper?: string
  error?: string
}) {
  return (
    <div>
      <div className="text-[11.5px] text-ink-dim font-medium mb-1.5">{label}</div>
      <div className="relative">
        <Lock size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          autoFocus={autoFocus}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 pl-10 pr-11 rounded-xl border bg-canvas text-[13.5px] outline-none focus:border-ink
            ${error ? 'border-rust-50' : 'border-line/70'}`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center text-ink-muted hover:text-ink"
        >
          {show ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
        </button>
      </div>
      {helper && !error && <div className="text-[11px] text-ink-dim mt-1">{helper}</div>}
      {error && <div className="text-[11px] text-rust-50 mt-1">{error}</div>}
    </div>
  )
}

function AccountRow({
  Icon, label, value, actionLabel, onAction,
}: {
  Icon: LucideIcon
  label: string
  value: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <Icon size={15} strokeWidth={1.8} className="text-ink-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-ink-muted">{label}</div>
        <div className="text-[13.5px] font-semibold tracking-tight truncate mt-0.5">{value}</div>
      </div>
      <button
        onClick={onAction}
        className="shrink-0 text-[12px] font-semibold text-ink underline-offset-4 underline decoration-line-strong"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A9 9 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.95 10.7a5.41 5.41 0 0 1 0-3.4V4.96H.96a9 9 0 0 0 0 8.08l3-2.34z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96l2.99 2.34A5.36 5.36 0 0 1 9 3.58z" fill="#EA4335" />
    </svg>
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
          <p>{t('terms.p1')}</p>
          <p>{t('terms.p2')}</p>
          <p>
            {t('terms.p3.intro')}{' '}
            <span className="text-ink">{t('terms.p3.url')}</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
