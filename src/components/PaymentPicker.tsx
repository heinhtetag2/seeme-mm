import { useState } from 'react'
import { Check, Banknote, Smartphone, CreditCard, Zap, ShieldCheck, X, Plus, Loader2, Settings2 } from 'lucide-react'
import { PAYMENT_LABEL, PAYMENT_SUBLABEL, type PaymentMethod } from '../data'
import { useT } from '../i18n'

const ICON: Record<PaymentMethod, typeof Banknote> = {
  cash: Banknote,
  kbz: Smartphone,
  wave: Smartphone,
  aya: Smartphone,
  card: CreditCard,
}

const TINT: Record<PaymentMethod, string> = {
  cash: 'from-evergreen-30 to-moss-30',
  kbz: 'from-rust-30 to-ember-30',
  wave: 'from-iris-30 to-sakura-30',
  aya: 'from-tropic-30 to-ocean-30',
  card: 'from-pebble-30 to-sand-30',
}

/** Real brand logos for methods that have one. Rendered inside the gradient swatch. */
const LOGO: Partial<Record<PaymentMethod, string>> = {
  kbz: '/images/logos/kbz.png',
  wave: '/images/logos/wave.png',
  aya: '/images/logos/aya.png',
}

function PaymentSwatch({ method, size = 40 }: { method: PaymentMethod; size?: number }) {
  const Icon = ICON[method]
  const logo = LOGO[method]
  if (logo) {
    return (
      <span
        className="shrink-0 rounded-2xl overflow-hidden bg-canvas border border-line/60"
        style={{ height: size, width: size }}
      >
        <img src={logo} alt="" className="h-full w-full object-cover" />
      </span>
    )
  }
  return (
    <span
      className={`shrink-0 rounded-2xl grid place-items-center bg-gradient-to-br ${TINT[method]} text-ink`}
      style={{ height: size, width: size }}
    >
      <Icon size={Math.round(size * 0.4)} strokeWidth={2} />
    </span>
  )
}

/** Methods that need a one-time setup (link account / add card). */
const NEEDS_SETUP: Record<PaymentMethod, boolean> = {
  cash: false,
  kbz: true,
  wave: true,
  aya: true,
  card: true,
}

const SETUP_COPY: Record<PaymentMethod, { title: string; sub: string; field: string; placeholder: string; cta: string }> = {
  cash: { title: '', sub: '', field: '', placeholder: '', cta: '' },
  kbz: { title: 'Link KBZPay', sub: 'Confirm the number registered with KBZPay. We\'ll send a code.', field: 'KBZPay phone', placeholder: '09 ••• ••••', cta: 'Send code' },
  wave: { title: 'Link Wave Money', sub: 'Confirm your Wave number to link your wallet.', field: 'Wave phone', placeholder: '09 ••• ••••', cta: 'Send code' },
  aya: { title: 'Link AYA Pay', sub: 'Confirm the number registered with AYA Pay.', field: 'AYA Pay phone', placeholder: '09 ••• ••••', cta: 'Send code' },
  card: { title: 'Add a card', sub: 'Visa, Master, or JCB. We\'ll save it to your wallet.', field: 'Card number', placeholder: '0000 0000 0000 0000', cta: 'Add card' },
}

export function PaymentPicker({
  methods,
  value,
  onChange,
}: {
  methods: PaymentMethod[]
  value: PaymentMethod
  onChange: (m: PaymentMethod) => void
}) {
  const t = useT()
  // Mock connection state: cash is always linked; others start unlinked
  // (but Wave starts linked so the user has at least one in-app default).
  const [linked, setLinked] = useState<Record<PaymentMethod, { last4?: string } | undefined>>({
    cash: {},
    wave: { last4: '4421' },
    kbz: undefined,
    aya: undefined,
    card: undefined,
  })

  const [setupMethod, setSetupMethod] = useState<PaymentMethod | null>(null)
  const [manageOpen, setManageOpen] = useState(false)

  function onRowClick(m: PaymentMethod) {
    if (NEEDS_SETUP[m] && !linked[m]) {
      setSetupMethod(m)
      return
    }
    onChange(m)
  }

  function onSetupComplete(m: PaymentMethod, value: string) {
    const last4 = value.replace(/\D/g, '').slice(-4) || '0000'
    setLinked((prev) => ({ ...prev, [m]: { last4 } }))
    setSetupMethod(null)
    onChange(m) // auto-select the freshly linked method
  }

  function onUnlink(m: PaymentMethod) {
    setLinked((prev) => ({ ...prev, [m]: undefined }))
    if (value === m) onChange('cash')
  }

  const linkedInApp = (methods.filter((m) => m !== 'cash' && linked[m]) as PaymentMethod[])

  return (
    <>
      <div className="divide-y divide-line/60 border-y border-line/60">
        {methods.map((m) => {
          const isSel = value === m
          const isLinked = !!linked[m]
          const needsSetup = NEEDS_SETUP[m] && !isLinked
          const last4 = linked[m]?.last4
          return (
            <button
              key={m}
              onClick={() => onRowClick(m)}
              className="w-full flex items-center gap-3 py-3.5 text-left"
            >
              <PaymentSwatch method={m} size={40} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="text-[13.5px] font-semibold tracking-tight">{PAYMENT_LABEL[m]}</div>
                  {needsSetup && (
                    <span className="inline-flex items-center h-[18px] px-1.5 rounded-full bg-surface-higher text-[9.5px] font-semibold uppercase tracking-[0.04em] text-ink-muted">
                      {t('payment.notSetUp')}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5 truncate">
                  {needsSetup ? (
                    <span className="text-brand font-semibold">{t('payment.tapToSetUp')}</span>
                  ) : last4 ? (
                    <>•••• {last4}</>
                  ) : (
                    PAYMENT_SUBLABEL[m]
                  )}
                </div>
              </div>
              {needsSetup ? (
                <span className="h-5 w-5 rounded-full grid place-items-center shrink-0 border border-line-strong text-ink-muted">
                  <Plus size={11} strokeWidth={2.6} />
                </span>
              ) : (
                <span className={`h-5 w-5 rounded-full grid place-items-center shrink-0 transition
                  ${isSel ? 'bg-ink text-canvas' : 'border border-line-strong'}`}>
                  {isSel && <Check size={11} strokeWidth={3.4} />}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {linkedInApp.length > 0 && (
        <button
          onClick={() => setManageOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-muted hover:text-ink"
        >
          <Settings2 size={12} strokeWidth={2.2} />
          {t('payment.managePayments')}
        </button>
      )}

      {setupMethod && (
        <SetupSheet
          method={setupMethod}
          onClose={() => setSetupMethod(null)}
          onComplete={(value) => onSetupComplete(setupMethod, value)}
        />
      )}

      {manageOpen && (
        <ManageSheet
          methods={linkedInApp}
          linked={linked}
          onClose={() => setManageOpen(false)}
          onUnlink={onUnlink}
        />
      )}
    </>
  )
}

function ManageSheet({
  methods,
  linked,
  onClose,
  onUnlink,
}: {
  methods: PaymentMethod[]
  linked: Record<PaymentMethod, { last4?: string } | undefined>
  onClose: () => void
  onUnlink: (m: PaymentMethod) => void
}) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[70%] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full border border-line/70"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />

        <div className="kicker mb-1.5">{t('payment.manage.kicker')}</div>
        <h2 className="font-serif text-[22px] leading-[1.1] tracking-tight font-semibold">{t('payment.manage.title')}</h2>
        <p className="text-[12.5px] text-ink-muted mt-1">{t('payment.manage.sub')}</p>

        <div className="mt-5 divide-y divide-line/60 border-y border-line/60">
          {methods.length === 0 ? (
            <div className="py-5 text-center text-[12.5px] text-ink-muted">{t('payment.manage.empty')}</div>
          ) : (
            methods.map((m) => {
              return (
                <div key={m} className="flex items-center gap-3 py-3.5">
                  <PaymentSwatch method={m} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold tracking-tight">{PAYMENT_LABEL[m]}</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">•••• {linked[m]?.last4 ?? '0000'}</div>
                  </div>
                  <button
                    onClick={() => onUnlink(m)}
                    className="shrink-0 inline-flex items-center h-8 px-3.5 rounded-full border border-line/70 text-[11.5px] font-semibold text-rust-50"
                  >
                    {t('payment.unlink')}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function SetupSheet({
  method,
  onClose,
  onComplete,
}: {
  method: PaymentMethod
  onClose: () => void
  onComplete: (value: string) => void
}) {
  const copy = SETUP_COPY[method]
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)

  function submit() {
    if (!value.trim()) return
    setBusy(true)
    // Mock async link
    setTimeout(() => onComplete(value), 900)
  }

  return (
    <div className="absolute inset-0 z-50 bg-black/30 flex items-end animate-fade-in">
      <button onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full bg-surface-elevated border-t border-line/70 rounded-t-3xl p-5 pb-8 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full border border-line/70"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <div className="mx-auto h-1 w-10 rounded-full bg-line-strong mb-5" />

        <div className="flex items-center gap-3 mb-3">
          <PaymentSwatch method={method} size={44} />
          <div>
            <div className="kicker">{PAYMENT_LABEL[method]}</div>
            <h2 className="font-serif text-[20px] font-semibold tracking-tight leading-tight">{copy.title}</h2>
          </div>
        </div>
        <p className="text-[12.5px] text-ink-muted leading-relaxed mb-4">{copy.sub}</p>

        <label className="block">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted mb-1.5">
            {copy.field}
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={copy.placeholder}
            inputMode={method === 'card' ? 'numeric' : 'tel'}
            className="w-full h-12 px-4 rounded-2xl border border-line/70 bg-canvas text-[14px] font-medium tracking-wide outline-none focus:border-ink"
          />
        </label>

        <div className="mt-2 text-[11px] text-ink-dim flex items-center gap-1.5">
          <ShieldCheck size={11} strokeWidth={2.2} /> Encrypted · used only for booking payments
        </div>

        <button
          onClick={submit}
          disabled={busy || !value.trim()}
          className="mt-5 w-full h-12 rounded-full bg-ink text-canvas text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {busy ? <><Loader2 size={14} className="animate-spin" /> Linking…</> : copy.cta}
        </button>
      </div>
    </div>
  )
}

/* ─────── Small inline badges used on provider/list rows ─────── */

export function InstantConfirmBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-7 text-[11.5px] px-3' : 'h-6 text-[10.5px] px-2.5'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-alpha-evergreen-10 text-evergreen-60 font-semibold ${cls}`}>
      <Zap size={11} strokeWidth={2.4} fill="currentColor" />
      Instant confirmation
    </span>
  )
}

export function PayInAppBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-7 text-[11.5px] px-3' : 'h-6 text-[10.5px] px-2.5'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-iris-20 text-iris-70 font-semibold ${cls}`}>
      <ShieldCheck size={11} strokeWidth={2.4} />
      Pay in app
    </span>
  )
}
