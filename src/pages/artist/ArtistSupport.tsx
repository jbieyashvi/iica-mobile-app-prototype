import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  HeartHandshake, Loader2, CheckCircle2, Copy, Lock, ShieldCheck,
  Smartphone, CreditCard, Landmark, XCircle, ChevronRight,
} from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import TextField from '../../components/form/TextField'
import SelectField from '../../components/form/SelectField'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { usePublicArtist } from '../../data/usePublicArtist'
import { useAuth } from '../../state/AuthContext'
import { useSupport, PaymentMethodType } from '../../state/SupportContext'
import { formatMoney } from '../../shop/pricing'
import { setAuthReturn } from '../../lib/authReturn'

type Phase = 'checkout' | 'method' | 'review' | 'processing' | 'success' | 'failed'
const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank']

// Masked, non-sensitive summaries — the only payment info ever persisted.
function maskUpi(id: string) {
  const [local, domain] = id.split('@')
  if (!domain) return 'UPI'
  const head = local.slice(0, 2)
  return `${head}${'•'.repeat(Math.max(2, local.length - 2))}@${domain}`
}
function maskCard(num: string) {
  const digits = num.replace(/\D/g, '')
  return `•••• ${digits.slice(-4)}`
}

export default function ArtistSupport() {
  const { slug, optionId } = useParams()
  const navigate = useNavigate()
  const { artist } = usePublicArtist(slug)
  const { state } = useAuth()
  const { addSupport } = useSupport()

  const [phase, setPhase] = useState<Phase>('checkout')
  const [ref, setRef] = useState('')
  const [maskedMethod, setMaskedMethod] = useState('')
  const [toast, setToast] = useState('')

  // Donor (prefilled, verifiable)
  const [donorName, setDonorName] = useState(state.name || 'IICA Supporter')
  const [donorEmail, setDonorEmail] = useState(state.email || 'supporter@iica.app')
  const [donorPhone, setDonorPhone] = useState('')

  // Payment method + fields (sensitive — never persisted)
  const [method, setMethod] = useState<PaymentMethodType>('UPI')
  const [upiId, setUpiId] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [bank, setBank] = useState('')
  const [touched, setTouched] = useState(false)

  const submitting = useRef(false)

  const clearSensitive = () => { setUpiId(''); setCardNumber(''); setCardCvv(''); setCardExpiry(''); setCardName('') }
  // Clear any sensitive fields when the flow unmounts (cancel / navigate away).
  useEffect(() => () => clearSensitive(), [])

  const option = artist?.support?.options.find((o) => o.id === optionId)
  const amountLabel = option ? formatMoney(option.amount, option.currency) : ''

  const methodError = useMemo(() => {
    if (method === 'UPI') return /^[a-z0-9._-]{2,}@[a-z]{2,}$/i.test(upiId.trim()) ? '' : 'Enter a valid UPI ID (name@bank)'
    if (method === 'Card') {
      const digits = cardNumber.replace(/\s/g, '')
      if (!cardName.trim()) return 'Cardholder name required'
      if (!/^\d{12,19}$/.test(digits)) return 'Enter a valid card number'
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) return 'Expiry must be MM/YY'
      if (!/^\d{3,4}$/.test(cardCvv.trim())) return 'CVV must be 3–4 digits'
      return ''
    }
    return bank ? '' : 'Select your bank'
  }, [method, upiId, cardName, cardNumber, cardExpiry, cardCvv, bank])

  if (!artist || !option) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Support" fallback={slug ? `/artist/${slug}` : '/home'} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="font-serif text-[20px] text-ink">Support option unavailable</p>
          <p className="mt-1 text-[13px] text-muted">This support option no longer exists.</p>
          <div className="mt-5"><PrimaryButton onClick={() => navigate(`/artist/${artist?.slug ?? ''}`)}>Back to Profile</PrimaryButton></div>
        </div>
      </div>
    )
  }

  const profilePath = `/artist/${artist.slug}`

  // ---- Guest gate: view allowed, but sign in before paying. Returns here after auth. ----
  if (!state.authed) {
    const goAuth = (to: string) => { setAuthReturn(`${profilePath}/support/${option.id}`); navigate(to) }
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Support" fallback={profilePath} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand"><Lock className="h-8 w-8" strokeWidth={1.6} /></span>
          <h1 className="mt-5 font-serif text-[24px] leading-tight text-ink">Sign in to support {artist.name.split(' ')[0]}</h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
            You’re supporting <span className="font-semibold text-ink">{option.title || 'this creator'}</span> ({amountLabel}).
            A free account is all you need — no membership required. We’ll bring you right back here.
          </p>
          <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
            <PrimaryButton full onClick={() => goAuth('/signup')}>Create a Free Account</PrimaryButton>
            <SecondaryButton full onClick={() => goAuth('/login')}>Sign In</SecondaryButton>
          </div>
        </div>
      </div>
    )
  }

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const copyRef = async () => { try { await navigator.clipboard.writeText(ref) } catch { /* ignore */ } flash('Reference copied') }

  const buildMasked = (): string => {
    if (method === 'UPI') return `UPI · ${maskUpi(upiId.trim())}`
    if (method === 'Card') return `Card · ${maskCard(cardNumber)}`
    return `Net Banking · ${bank}`
  }

  const goReview = () => {
    setTouched(true)
    if (methodError) return
    setMaskedMethod(buildMasked())
    setPhase('review')
  }

  // Explicit Confirm & Pay. `fail` drives the controlled failure path.
  const pay = (fail = false) => {
    if (submitting.current) return
    submitting.current = true
    setPhase('processing')
    setTimeout(() => {
      if (fail) {
        submitting.current = false
        setPhase('failed')
        return
      }
      const record = addSupport({
        creatorSlug: artist.slug,
        creatorName: artist.name,
        donorUserId: state.iicaId || state.email || undefined,
        optionId: option.id,
        optionTitle: option.title || 'Support',
        amount: option.amount,
        currency: option.currency,
        supporterName: donorName,
        supporterEmail: donorEmail,
        paymentMethodType: method,
        maskedPaymentMethod: maskedMethod,
      })
      setRef(record.id)
      clearSensitive() // drop card/UPI/CVV the moment payment resolves
      submitting.current = false
      setPhase('success')
    }, 1400)
  }

  // ---------- SUCCESS ----------
  if (phase === 'success') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Support" fallback={profilePath} onBack={() => navigate(profilePath)} />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-8 pt-4">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></span>
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-success">Payment successful</p>
            <h1 className="mt-2 font-serif text-[26px] leading-tight text-ink">Thank you for supporting {artist.name.split(' ')[0]}</h1>
            <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">Your {amountLabel} contribution to “{option.title || 'Support'}” is confirmed.</p>
          </div>
          <div className="mt-6 rounded-card border border-border bg-surface">
            <Row label="Reference" value={ref} mono action={<button onClick={copyRef} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button>} />
            <Row label="Creator" value={artist.name} />
            <Row label="Option" value={option.title || 'Support'} />
            <Row label="Amount" value={`${amountLabel} · fixed`} />
            <Row label="Paid with" value={maskedMethod} />
            <Row label="Date" value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
          </div>
          <p className="mt-4 rounded-control bg-surface px-3.5 py-3 text-[12px] leading-relaxed text-muted ring-1 ring-border">Prototype only — no real payment was processed. Only masked payment info is recorded; card, CVV and UPI details are never stored.</p>
          <div className="mt-5 flex flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate(profilePath)}>Return to Creator Profile</PrimaryButton>
            <SecondaryButton full onClick={() => flash('Receipt: ' + ref)}>View Receipt</SecondaryButton>
          </div>
        </div>
        {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
      </div>
    )
  }

  // ---------- FAILED ----------
  if (phase === 'failed') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Support" fallback={profilePath} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7E9EA] text-error"><XCircle className="h-9 w-9" strokeWidth={1.75} /></span>
          <h1 className="mt-5 font-serif text-[24px] leading-tight text-ink">Payment didn’t go through</h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">No donation was created and nothing was charged. Your {amountLabel} support for “{option.title || 'Support'}” is still selected — you can try again.</p>
          <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
            <PrimaryButton full onClick={() => setPhase('review')}>Retry Payment</PrimaryButton>
            <SecondaryButton full onClick={() => setPhase('method')}>Change Payment Method</SecondaryButton>
            <button onClick={() => navigate(profilePath)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- REVIEW ----------
  if (phase === 'review') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Review Donation" fallback={profilePath} onBack={() => setPhase('method')} />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
          <div className="rounded-card border border-border bg-surface">
            <Row label="Creator" value={artist.name} />
            <Row label="Support option" value={option.title || 'Support'} />
            <Row label="Amount" value={amountLabel} />
            <Row label="Donor" value={donorName} />
            <Row label="Payment method" value={maskedMethod} />
            <Row label="Total" value={amountLabel} strong />
          </div>
          <div className="mt-4 flex items-start gap-2.5 rounded-control border border-border bg-surface px-3.5 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <p className="text-[12.5px] leading-relaxed text-muted">Prototype payment. Nothing is charged; only masked payment details are recorded.</p>
          </div>
        </div>
        <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <PrimaryButton full onClick={() => pay(false)}>
            <HeartHandshake className="h-[18px] w-[18px]" /> Confirm &amp; Pay {amountLabel}
          </PrimaryButton>
          <div className="mt-2 flex items-center justify-between">
            <button onClick={() => setPhase('method')} className="tap min-h-[40px] text-[13px] font-semibold text-muted hover:text-ink">Back to Payment Method</button>
            <button onClick={() => pay(true)} className="tap min-h-[40px] text-[12px] font-semibold text-error/80 hover:text-error">Simulate failed payment</button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- PROCESSING ----------
  if (phase === 'processing') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Processing" fallback={profilePath} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="mt-4 font-serif text-[20px] text-ink">Processing your payment…</p>
          <p className="mt-1 text-[13px] text-muted">Please don’t close this screen.</p>
        </div>
      </div>
    )
  }

  // ---------- METHOD ----------
  if (phase === 'method') {
    const methods: { key: PaymentMethodType; icon: typeof Smartphone; label: string }[] = [
      { key: 'UPI', icon: Smartphone, label: 'UPI' },
      { key: 'Card', icon: CreditCard, label: 'Credit / Debit Card' },
      { key: 'Net Banking', icon: Landmark, label: 'Net Banking' },
    ]
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Payment Method" fallback={profilePath} onBack={() => setPhase('checkout')} />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">Choose a method</p>
          <div className="flex flex-col gap-2">
            {methods.map((m) => (
              <button key={m.key} onClick={() => { setMethod(m.key); setTouched(false) }} className={`tap flex items-center gap-3 rounded-card border px-4 py-3 text-left ${method === m.key ? 'border-brand bg-brand-soft' : 'border-border bg-surface'}`}>
                <m.icon className="h-5 w-5 shrink-0 text-brand" />
                <span className="flex-1 text-[14px] font-semibold text-ink">{m.label}</span>
                {method === m.key && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {method === 'UPI' && (
              <TextField label="UPI ID" value={upiId} onChange={setUpiId} placeholder="name@bank" error={touched ? methodError : ''} hint="Use a fictional test value — e.g. reshma@okaxis" />
            )}
            {method === 'Card' && (
              <>
                <TextField label="Cardholder name" value={cardName} onChange={setCardName} placeholder="Name on card" error={touched && !cardName.trim() ? 'Required' : ''} />
                <TextField label="Card number" value={cardNumber} onChange={(v) => setCardNumber(v.replace(/[^\d ]/g, '').slice(0, 19))} placeholder="4242 4242 4242 4242" inputMode="numeric" error={touched && methodError.includes('card number') ? methodError : ''} hint="Prototype — use test digits only. Never stored." />
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="Expiry (MM/YY)" value={cardExpiry} onChange={(v) => setCardExpiry(v.replace(/[^\d/]/g, '').slice(0, 5))} placeholder="12/29" error={touched && methodError.includes('Expiry') ? methodError : ''} />
                  <TextField label="CVV" type="password" value={cardCvv} onChange={(v) => setCardCvv(v.replace(/\D/g, '').slice(0, 4))} placeholder="123" error={touched && methodError.includes('CVV') ? methodError : ''} />
                </div>
              </>
            )}
            {method === 'Net Banking' && (
              <SelectField label="Bank" value={bank} onChange={setBank} options={BANKS} placeholder="Select your bank" error={touched ? methodError : ''} />
            )}
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-control border border-border bg-surface px-3.5 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <p className="text-[12.5px] leading-relaxed text-muted">Prototype only. No real payment is processed and full card / CVV / UPI details are never saved.</p>
          </div>
        </div>
        <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <PrimaryButton full onClick={goReview}>Review Donation <ChevronRight className="h-4 w-4" /></PrimaryButton>
        </div>
      </div>
    )
  }

  // ---------- CHECKOUT (summary + donor) ----------
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Donation Checkout" fallback={profilePath} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        {/* Creator + option summary */}
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3.5">
          <Avatar name={artist.name} src={artist.photo} size={48} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-ink">{artist.name}</p>
            <p className="truncate text-[12.5px] text-muted">{artist.headline}</p>
          </div>
          <HeartHandshake className="h-5 w-5 shrink-0 text-brand" />
        </div>

        <div className="mt-4 rounded-card border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[18px] text-ink">{option.title || 'Support'}</p>
            <StatusBadge tone="brand">Fixed</StatusBadge>
          </div>
          {option.note && <p className="mt-1 text-[13px] leading-relaxed text-muted">{option.note}</p>}
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-muted">Donation amount</span>
              <span className="font-serif text-[24px] text-ink">{amountLabel}</span>
            </div>
            <p className="mt-1 text-[11.5px] text-brand">Fixed by the creator — cannot be changed.</p>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-[13px] font-semibold text-ink">Total</span>
            <span className="text-[16px] font-bold text-ink">{amountLabel}</span>
          </div>
        </div>

        {/* Donor details — prefilled, verifiable */}
        <p className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-wide text-muted">Your details</p>
        <div className="flex flex-col gap-4">
          <TextField label="Full name" value={donorName} onChange={setDonorName} />
          <TextField label="Email" type="email" value={donorEmail} onChange={setDonorEmail} />
          <TextField label="Phone" optional value={donorPhone} onChange={setDonorPhone} placeholder="+91 98765 43210" />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full disabled={!donorName.trim() || !donorEmail.trim()} onClick={() => setPhase('method')}>
          Continue to Payment <ChevronRight className="h-4 w-4" />
        </PrimaryButton>
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Row({ label, value, mono, strong, action }: { label: string; value: string; mono?: boolean; strong?: boolean; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <span className={`text-[13px] text-ink ${mono ? 'font-mono' : ''} ${strong ? 'font-bold' : 'font-semibold'}`}>{value}</span>
        {action}
      </span>
    </div>
  )
}
