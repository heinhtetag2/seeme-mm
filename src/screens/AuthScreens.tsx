import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowLeft, Phone, Pencil, Mail, Camera, X, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useT } from '../i18n'

/** Public profile returned to App.tsx once auth completes. */
export type AuthProfile = { name: string; city: string; phone: string; email?: string; avatar?: string }

/* ───────── Outer router: a tiny state machine across the steps ─────────
   Phone keeps OTP (SIM-based verification is common in Myanmar). Email is
   password-based and exposes Forgot Password. Sign Up is a separate entry
   point for new accounts. */

type Step = 'choice' | 'phone' | 'email' | 'otp' | 'profile' | 'signup' | 'forgot' | 'forgotSent'
type Contact = { kind: 'phone'; value: string } | { kind: 'email'; value: string } | null

export function AuthFlow({
  onAuthed,
}: {
  onAuthed: (profile: AuthProfile) => void
}) {
  const [step, setStep] = useState<Step>('choice')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [contact, setContact] = useState<Contact>(null)

  // For the demo, Google "sign in" treats you as an existing user so we skip
  // the profile step. Phone/email flows go through profile setup so you can
  // see it on the prototype.
  const finishAsExisting = () => onAuthed({ name: 'Hein Htet', city: 'Yangon', phone: '+95 9 •••• 3421' })

  return (
    <div className="relative h-full w-full bg-canvas flex flex-col">
      {step === 'choice'  && (
        <AuthChoice
          onPhone={() => setStep('phone')}
          onEmail={() => setStep('email')}
          onGoogle={finishAsExisting}
          onSignUp={() => setStep('signup')}
        />
      )}
      {step === 'phone'   && (
        <AuthPhone
          value={phone}
          onChange={setPhone}
          onBack={() => setStep('choice')}
          onContinue={() => { setContact({ kind: 'phone', value: phone }); setStep('otp') }}
        />
      )}
      {step === 'email'   && (
        <AuthEmail
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onBack={() => setStep('choice')}
          onForgot={() => { setForgotEmail(email); setStep('forgot') }}
          onContinue={() => {
            // Existing-account sign-in: skip the profile-setup step (they
            // already have one) and land them in the app with mock identity
            // pulled from the email they typed.
            const display = email.trim().split('@')[0] || 'You'
            const name = display
              .replace(/[._-]+/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase())
            onAuthed({ name, city: 'Yangon', phone: '+95 9 •••• 3421', email: email.trim() })
          }}
        />
      )}
      {step === 'otp'     && contact && (
        <AuthOtp
          contact={contact}
          onBack={() => setStep(contact.kind === 'phone' ? 'phone' : 'email')}
          onContinue={() => setStep('profile')}
        />
      )}
      {step === 'signup'  && (
        <AuthSignUp
          name={signupName}
          email={signupEmail}
          password={signupPassword}
          onNameChange={setSignupName}
          onEmailChange={setSignupEmail}
          onPasswordChange={setSignupPassword}
          onBack={() => setStep('choice')}
          onContinue={() => { setContact({ kind: 'email', value: signupEmail }); setStep('profile') }}
        />
      )}
      {step === 'forgot'  && (
        <AuthForgot
          value={forgotEmail}
          onChange={setForgotEmail}
          onBack={() => setStep('email')}
          onContinue={() => setStep('forgotSent')}
        />
      )}
      {step === 'forgotSent' && (
        <AuthForgotSent email={forgotEmail} onBackToSignIn={() => setStep('email')} />
      )}
      {step === 'profile' && (
        <AuthProfile
          contact={contact}
          onBack={() => setStep('otp')}
          onContinue={(p) => onAuthed(p)}
        />
      )}
    </div>
  )
}

/* ───────── 1. Choice screen ───────── */

function AuthChoice({ onPhone, onEmail, onGoogle, onSignUp }: { onPhone: () => void; onEmail: () => void; onGoogle: () => void; onSignUp: () => void }) {
  const t = useT()
  return (
    <>
      {/* Full-bleed image background that softly fades to canvas before the
          headline + CTAs, so the original solid-pill buttons and dark serif
          headline read on plain canvas — no glass, no blur. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-no-repeat bg-top"
          style={{ backgroundImage: 'url(/images/onboarding/oboardinggaphic.jpg)', backgroundSize: '100% auto' }}
        />
        {/* Single clean linear fade to canvas — no scrim, so no band/line. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 50%, rgb(var(--canvas)) 63%)',
          }}
        />
      </div>

      {/* Brand mark */}
      <div className="relative z-10 px-6 pt-12 flex items-center gap-2">
        <div className="relative h-9 w-9 rounded-[10px] bg-ink grid place-items-center">
          <span className="font-serif font-bold text-[20px] -tracking-[0.04em] text-canvas leading-none">S</span>
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-canvas" />
        </div>
        <span className="font-serif text-[18px] font-semibold tracking-tight text-white">Seeme</span>
      </div>

      {/* Editorial headline */}
      <div className="relative z-10 flex-1 px-7 flex flex-col justify-center translate-y-[64px]">
        <div className="kicker" style={{ color: '#e6cd86', textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 2px 14px rgba(0,0,0,0.5)' }}>{t('auth.kicker')}</div>
        <h1 className="font-serif text-[34px] leading-[1.05] tracking-tight font-semibold mt-3 text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.45), 0 2px 24px rgba(0,0,0,0.5)' }}>
          {t('auth.headline')}
        </h1>
        <p className="text-[14px] leading-relaxed text-white/90 mt-3 max-w-[300px] text-balance" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 1px 16px rgba(0,0,0,0.55)' }}>
          {t('auth.subhead')}
        </p>
      </div>

      {/* Stacked CTAs */}
      <div className="relative z-10 px-6 pb-8 pt-4 space-y-2.5">
        <button
          onClick={onPhone}
          className="w-full h-12 rounded-full bg-brand text-white text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-2"
        >
          <Phone size={15} strokeWidth={2.2} />
          {t('auth.phone.cta')}
        </button>
        <button
          onClick={onEmail}
          className="w-full h-12 rounded-full border border-line/70 bg-canvas text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-2 hover:border-line-strong transition"
        >
          <Mail size={15} strokeWidth={2.2} />
          {t('auth.email.cta')}
        </button>
        <div className="flex items-center justify-center gap-3 py-1 text-[11px] text-ink-dim uppercase tracking-[0.06em] font-semibold">
          <span className="w-12 h-px bg-line/70" />
          <span>{t('auth.or')}</span>
          <span className="w-12 h-px bg-line/70" />
        </div>
        <button
          onClick={onGoogle}
          className="w-full h-12 rounded-full border border-line/70 bg-canvas text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-2 hover:border-line-strong transition"
        >
          <GoogleMark />
          {t('auth.google.cta')}
        </button>
        <p className="pt-1 text-[12.5px] text-ink-muted text-center">
          {t('auth.choice.newPrompt')}{' '}
          <button onClick={onSignUp} className="text-ink font-semibold underline-offset-4 underline decoration-line-strong">
            {t('auth.choice.createAccount')}
          </button>
        </p>
        <p className="pt-1 text-[10.5px] text-ink-dim text-center leading-relaxed max-w-[300px] mx-auto">
          {t('auth.terms')}
        </p>
      </div>
    </>
  )
}

/* ───────── 2b. Email entry (password-based) ───────── */

function AuthEmail({
  email, password, onEmailChange, onPasswordChange, onBack, onForgot, onContinue,
}: {
  email: string
  password: string
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onBack: () => void
  onForgot: () => void
  onContinue: () => void
}) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => { inputRef.current?.focus() }, [])
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const passwordValid = password.length >= 6
  const canContinue = emailValid && passwordValid

  return (
    <>
      <FlowHeader onBack={onBack} />
      <div className="flex-1 px-7 flex flex-col">
        <div className="mt-4">
          <div className="kicker">{t('auth.email.kicker')}</div>
          <h1 className="font-serif text-[28px] leading-[1.08] tracking-tight font-semibold mt-3">
            {t('auth.signin.headline')}
          </h1>
          <p className="text-[13px] leading-relaxed text-ink-muted mt-2 max-w-[300px]">
            {t('auth.signin.sub')}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="relative">
            <Mail size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              ref={inputRef}
              type="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder={t('auth.email.placeholder')}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-line/70 bg-canvas text-[13.5px] outline-none placeholder:text-ink-muted focus:border-ink"
            />
          </div>
          <div className="relative">
            <Lock size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder={t('auth.signin.passwordPlaceholder')}
              className="w-full h-12 pl-10 pr-11 rounded-xl border border-line/70 bg-canvas text-[13.5px] outline-none placeholder:text-ink-muted focus:border-ink"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t('auth.password.hide') : t('auth.password.show')}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center text-ink-muted hover:text-ink"
            >
              {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
          </div>
        </div>

        <div className="mt-4 text-right">
          <button onClick={onForgot} className="text-[12.5px] font-semibold text-ink underline-offset-4 underline decoration-line-strong">
            {t('auth.signin.forgot')}
          </button>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4 space-y-2.5">
        <button
          onClick={() => canContinue && onContinue()}
          disabled={!canContinue}
          className={`w-full h-12 rounded-full text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 transition
            ${canContinue ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {t('auth.signin.cta')}
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </>
  )
}

/* ───────── 2. Phone entry ───────── */

function AuthPhone({
  value, onChange, onBack, onContinue,
}: {
  value: string
  onChange: (v: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  const canContinue = value.replace(/\D/g, '').length >= 7

  const handleChange = (raw: string) => {
    // Keep only digits + simple spacing as the user types.
    const digits = raw.replace(/\D/g, '').slice(0, 9)
    const a = digits.slice(0, 1)
    const b = digits.slice(1, 5)
    const c = digits.slice(5, 9)
    onChange([a, b, c].filter(Boolean).join(' '))
  }

  return (
    <>
      <FlowHeader onBack={onBack} />
      <div className="flex-1 px-7 flex flex-col">
        <div className="mt-4">
          <div className="kicker">{t('auth.phone.kicker')}</div>
          <h1 className="font-serif text-[28px] leading-[1.08] tracking-tight font-semibold mt-3">
            {t('auth.phone.headline')}
          </h1>
          <p className="text-[13px] leading-relaxed text-ink-muted mt-2 max-w-[300px]">
            {t('auth.phone.sub')}
          </p>
        </div>

        <div className="mt-8 flex items-stretch gap-2">
          <div className="shrink-0 inline-flex items-center gap-1.5 h-12 px-3 rounded-xl border border-line/70 bg-canvas text-[13.5px] font-semibold tracking-tight">
            🇲🇲 <span>+95</span>
          </div>
          <input
            ref={inputRef}
            inputMode="numeric"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t('auth.phone.placeholder')}
            className="flex-1 h-12 px-4 rounded-xl border border-line/70 bg-canvas text-[14px] tabular-nums tracking-wider outline-none placeholder:text-ink-muted focus:border-ink"
          />
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => canContinue && onContinue()}
          disabled={!canContinue}
          className={`w-full h-12 rounded-full text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 transition
            ${canContinue ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {t('auth.phone.continue')}
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </>
  )
}

/* ───────── 3. OTP verification ───────── */

function AuthOtp({
  contact, onBack, onContinue,
}: {
  contact: { kind: 'phone' | 'email'; value: string }
  onBack: () => void
  onContinue: () => void
}) {
  const t = useT()
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [seconds, setSeconds] = useState(30)
  const [verifying, setVerifying] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { inputs.current[0]?.focus() }, [])
  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [seconds])

  const destinationLabel = contact.kind === 'phone' ? `+95 ${contact.value}` : contact.value
  const subText = contact.kind === 'phone'
    ? t('auth.otp.sub', { phone: destinationLabel })
    : t('auth.otp.sub.email', { email: destinationLabel })
  const wrongLabel = contact.kind === 'phone' ? t('auth.otp.wrongNumber') : t('auth.otp.wrongEmail')

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1)
    setCode((prev) => {
      const next = [...prev]
      next[i] = d
      return next
    })
    if (d && i < 5) inputs.current[i + 1]?.focus()
  }
  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) inputs.current[i - 1]?.focus()
  }
  // Allow pasting the whole code at once.
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (txt.length > 0) {
      e.preventDefault()
      setCode((prev) => prev.map((_, idx) => txt[idx] ?? ''))
      inputs.current[Math.min(txt.length, 5)]?.focus()
    }
  }

  const full = code.join('').length === 6
  // Auto-advance once the user fills all 6 digits — show a short "Verifying…"
  // state so the transition feels intentional rather than instantaneous.
  useEffect(() => {
    if (!full || verifying) return
    setVerifying(true)
    const id = setTimeout(onContinue, 600)
    return () => clearTimeout(id)
  }, [full, verifying, onContinue])

  return (
    <>
      <FlowHeader onBack={onBack} />
      <div className="flex-1 px-7 flex flex-col">
        <div className="mt-4">
          <div className="kicker">{t('auth.otp.kicker')}</div>
          <h1 className="font-serif text-[26px] leading-[1.1] tracking-tight font-semibold mt-3">
            {t('auth.otp.headline')}
          </h1>
          <p className="text-[13px] leading-relaxed text-ink-muted mt-2">
            {subText}{' '}
            <button onClick={onBack} className="inline-flex items-center gap-1 text-ink font-semibold underline-offset-2">
              <Pencil size={11} strokeWidth={2.4} />
              {wrongLabel}
            </button>
          </p>
        </div>

        {/* 6-digit boxes */}
        <div className="mt-8 grid grid-cols-6 gap-2">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              onPaste={handlePaste}
              inputMode="numeric"
              maxLength={1}
              className="h-14 text-center text-[20px] font-semibold tabular-nums rounded-2xl border border-line/70 bg-canvas outline-none focus:border-ink"
            />
          ))}
        </div>

        <div className="mt-6">
          {seconds > 0 ? (
            <span className="text-[12.5px] text-ink-dim">
              {t('auth.otp.resendIn', { seconds })}
            </span>
          ) : (
            <button onClick={() => setSeconds(30)} className="text-[12.5px] font-semibold text-ink">
              {t('auth.otp.resend')}
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => full && !verifying && onContinue()}
          disabled={!full || verifying}
          className={`w-full h-12 rounded-full text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 transition
            ${full && !verifying ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {verifying ? t('auth.signin.verifying') : t('auth.phone.continue')}
          {!verifying && <ArrowRight size={15} strokeWidth={2.4} />}
        </button>
      </div>
    </>
  )
}

/* ───────── 4. Profile setup ───────── */

function AuthProfile({
  contact, onBack, onContinue,
}: {
  contact: Contact
  onBack: () => void
  onContinue: (p: AuthProfile) => void
}) {
  const t = useT()
  const [name, setName] = useState('')
  const [city, setCity] = useState('Yangon')
  const [avatar, setAvatar] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  const canContinue = name.trim().length >= 2

  const CITIES = ['Yangon', 'Mandalay', 'Naypyitaw', 'Bago', 'Mawlamyine']

  const initial = name.trim()[0]?.toUpperCase() ?? ''

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file)
    setAvatar(url)
  }

  return (
    <>
      <FlowHeader onBack={onBack} />
      <div className="flex-1 px-7 flex flex-col">
        <div className="mt-4">
          <div className="kicker">{t('auth.profile.kicker')}</div>
          <h1 className="font-serif text-[26px] leading-[1.1] tracking-tight font-semibold mt-3">
            {t('auth.profile.headline')}
          </h1>
          <p className="text-[13px] leading-relaxed text-ink-muted mt-2 max-w-[300px]">
            {t('auth.profile.sub')}
          </p>
        </div>

        {/* Profile photo picker — empty state is a dashed-outline circle on
            canvas; once a photo is picked it becomes a solid filled circle. */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative group"
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
                onClick={(e) => { e.stopPropagation(); setAvatar(null) }}
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
        <p className="mt-2 text-[11.5px] text-ink-dim text-center font-medium">
          {avatar ? t('auth.profile.changePhoto') : t('auth.profile.addPhoto')}
        </p>

        <div className="mt-6">
          <label className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-dim">
            {t('auth.profile.name.label')}
          </label>
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.profile.name.placeholder')}
            className="mt-1.5 w-full h-12 px-4 rounded-xl border border-line/70 bg-canvas text-[14px] outline-none placeholder:text-ink-muted focus:border-ink"
          />
        </div>

        <div className="mt-5">
          <label className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-dim">
            {t('auth.profile.city.label')}
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {CITIES.map((c) => {
              const isSel = c === city
              return (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`h-9 px-3.5 rounded-full text-[12px] font-semibold transition
                    ${isSel
                      ? 'bg-brand text-white'
                      : 'bg-surface-elevated border border-line/70 text-ink hover:border-line-strong'}`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => canContinue && onContinue({
            name: name.trim(),
            city,
            phone: contact?.kind === 'phone' ? `+95 ${contact.value}` : '',
            email: contact?.kind === 'email' ? contact.value : undefined,
            avatar: avatar ?? undefined,
          })}
          disabled={!canContinue}
          className={`w-full h-12 rounded-full text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 transition
            ${canContinue ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {t('auth.profile.continue')}
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </>
  )
}

/* ───────── Shared bits ───────── */

/* ───────── 5. Sign up — new account ───────── */

function AuthSignUp({
  name, email, password,
  onNameChange, onEmailChange, onPasswordChange,
  onBack, onContinue,
}: {
  name: string
  email: string
  password: string
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  const t = useT()
  const nameRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => { nameRef.current?.focus() }, [])

  const nameValid = name.trim().length >= 2
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const passwordValid = password.length >= 6
  const canContinue = nameValid && emailValid && passwordValid

  return (
    <>
      <FlowHeader onBack={onBack} />
      <div className="flex-1 px-7 flex flex-col">
        <div className="mt-4">
          <div className="kicker">{t('auth.signup.kicker')}</div>
          <h1 className="font-serif text-[28px] leading-[1.08] tracking-tight font-semibold mt-3">
            {t('auth.signup.headline')}
          </h1>
          <p className="text-[13px] leading-relaxed text-ink-muted mt-2 max-w-[300px]">
            {t('auth.signup.sub')}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="relative">
            <User size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('auth.signup.namePlaceholder')}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-line/70 bg-canvas text-[13.5px] outline-none placeholder:text-ink-muted focus:border-ink"
            />
          </div>
          <div className="relative">
            <Mail size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder={t('auth.signup.emailPlaceholder')}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-line/70 bg-canvas text-[13.5px] outline-none placeholder:text-ink-muted focus:border-ink"
            />
          </div>
          <div className="relative">
            <Lock size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder={t('auth.signup.passwordPlaceholder')}
              className="w-full h-12 pl-10 pr-11 rounded-xl border border-line/70 bg-canvas text-[13.5px] outline-none placeholder:text-ink-muted focus:border-ink"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t('auth.password.hide') : t('auth.password.show')}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center text-ink-muted hover:text-ink"
            >
              {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4 space-y-3">
        <button
          onClick={() => canContinue && onContinue()}
          disabled={!canContinue}
          className={`w-full h-12 rounded-full text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 transition
            ${canContinue ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {t('auth.signup.cta')}
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
        <p className="text-[12.5px] text-ink-muted text-center">
          {t('auth.signup.havePrompt')}{' '}
          <button onClick={onBack} className="text-ink font-semibold underline-offset-4 underline decoration-line-strong">
            {t('auth.signup.signIn')}
          </button>
        </p>
      </div>
    </>
  )
}

/* ───────── 6. Forgot password — request reset ───────── */

function AuthForgot({
  value, onChange, onBack, onContinue,
}: {
  value: string
  onChange: (v: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  return (
    <>
      <FlowHeader onBack={onBack} />
      <div className="flex-1 px-7 flex flex-col">
        <div className="mt-4">
          <div className="kicker">{t('auth.forgot.kicker')}</div>
          <h1 className="font-serif text-[28px] leading-[1.08] tracking-tight font-semibold mt-3">
            {t('auth.forgot.headline')}
          </h1>
          <p className="text-[13px] leading-relaxed text-ink-muted mt-2 max-w-[320px]">
            {t('auth.forgot.sub')}
          </p>
        </div>

        <div className="mt-8 relative">
          <Mail size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            ref={inputRef}
            type="email"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('auth.forgot.placeholder')}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-line/70 bg-canvas text-[13.5px] outline-none placeholder:text-ink-muted focus:border-ink"
          />
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => isValid && onContinue()}
          disabled={!isValid}
          className={`w-full h-12 rounded-full text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 transition
            ${isValid ? 'bg-brand text-white' : 'bg-surface-higher text-ink-dim cursor-not-allowed'}`}
        >
          {t('auth.forgot.cta')}
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </>
  )
}

/* ───────── 7. Forgot password — sent confirmation ───────── */

function AuthForgotSent({ email, onBackToSignIn }: { email: string; onBackToSignIn: () => void }) {
  const t = useT()
  const [seconds, setSeconds] = useState(60)
  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [seconds])
  return (
    <>
      <div className="px-6 pt-12" />
      <div className="flex-1 px-7 flex flex-col items-center justify-center text-center">
        <Mail size={28} strokeWidth={1.5} className="text-ink-muted mb-4" />
        <div className="kicker mb-1.5">{t('auth.forgot.sentKicker')}</div>
        <h1 className="font-serif text-[24px] leading-[1.1] tracking-tight font-semibold max-w-[300px] text-balance">
          {t('auth.forgot.sentHeadline')}
        </h1>
        <p className="text-[13px] leading-relaxed text-ink-muted mt-3 max-w-[320px] text-balance">
          {t('auth.forgot.sentSub', { email: email })}
        </p>
        <div className="mt-6 h-6">
          {seconds > 0 ? (
            <span className="text-[12.5px] text-ink-dim">
              {t('auth.forgot.resendIn', { seconds })}
            </span>
          ) : (
            <button onClick={() => setSeconds(60)} className="text-[12.5px] font-semibold text-ink underline-offset-4 underline decoration-line-strong">
              {t('auth.forgot.resend')}
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={onBackToSignIn}
          className="w-full h-12 rounded-full bg-brand text-white text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5"
        >
          {t('auth.forgot.back')}
        </button>
      </div>
    </>
  )
}

function FlowHeader({ onBack }: { onBack: () => void }) {
  const t = useT()
  return (
    <div className="px-3 pt-12 pb-1">
      <button
        onClick={onBack}
        className="h-11 w-11 grid place-items-center rounded-full border border-line/70 bg-surface/80 backdrop-blur"
        aria-label={t('a11y.back')}
      >
        <ArrowLeft size={18} strokeWidth={2} />
      </button>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.4c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.1 14.97 1 12 1A11 11 0 0 0 2.18 7.05L5.84 9.9C6.71 7.3 9.14 5.4 12 5.4z" />
    </svg>
  )
}
