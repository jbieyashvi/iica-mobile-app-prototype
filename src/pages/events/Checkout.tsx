import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CreditCard, Smartphone, CheckCircle2, XCircle, Tag, Check } from 'lucide-react'
import { useEvents, PurchaseSelection } from '../../state/EventsContext'
import { useAuth } from '../../state/AuthContext'
import { PLATFORM_FEE_RATE, PROMO_CODE, PROMO_RATE } from '../../events/types'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import Checkbox from '../../components/form/Checkbox'
import OtpInput from '../../components/form/OtpInput'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { inr } from '../../events/format'
import { isEmail } from '../../lib/validation'

type Pay = 'Card' | 'UPI' | 'Google Pay'

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getEvent, purchase } = useEvents()
  const { state } = useAuth()
  const ev = getEvent(id)
  const selections: PurchaseSelection[] = (location.state as { selections?: PurchaseSelection[] })?.selections ?? []

  const [name, setName] = useState(state.name || '')
  const [email, setEmail] = useState(state.email || '')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('India')
  const [agree, setAgree] = useState(false)
  const [touched, setTouched] = useState(false)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [pay, setPay] = useState<Pay>('Card')
  const [processing, setProcessing] = useState(false)
  const [failed, setFailed] = useState(false)
  const [otpSheet, setOtpSheet] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpErr, setOtpErr] = useState('')

  if (!ev || selections.length === 0) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Checkout" />
        <div className="flex flex-1 items-center justify-center px-8 text-center">
          <div><p className="text-[14px] text-muted">Your selection expired.</p><div className="mt-4"><PrimaryButton onClick={() => navigate(`/events/${id}/tickets`)}>Choose Tickets</PrimaryButton></div></div>
        </div>
      </div>
    )
  }

  const subtotal = selections.reduce((s, x) => s + x.qty * x.unitPrice, 0)
  const discount = promoApplied ? Math.round(subtotal * PROMO_RATE) : 0
  const fee = Math.round((subtotal - discount) * PLATFORM_FEE_RATE)
  const total = subtotal - discount + fee

  const errors = {
    name: !name.trim() ? 'Required' : '',
    email: !isEmail(email) ? 'Valid email required' : '',
    agree: !agree ? 'Please accept the policies' : '',
  }
  const valid = Object.values(errors).every((e) => !e)
  const isGuest = !state.authed

  const applyPromo = () => setPromoApplied(promo.trim().toUpperCase() === PROMO_CODE)

  const doPurchase = () => {
    setProcessing(true)
    setTimeout(() => {
      const booking = purchase(ev.id, selections, { name: name.trim(), email: email.trim() }, total)
      setProcessing(false)
      navigate(`/events/${ev.id}/confirmation`, { state: { bookingId: booking.id } })
    }, 1400)
  }

  const onPay = () => {
    setTouched(true)
    if (!valid) return
    if (isGuest) { setOtpSheet(true); return }
    doPurchase()
  }

  const onFail = () => {
    setTouched(true)
    if (!valid) return
    setProcessing(true)
    setTimeout(() => { setProcessing(false); setFailed(true) }, 1200)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Checkout" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6">
        {/* event summary */}
        <div className="mt-2 flex items-center gap-3 rounded-card border border-border bg-surface p-3">
          <img src={ev.cover} alt="" className="h-12 w-12 rounded-[8px] object-cover" />
          <div className="min-w-0"><p className="truncate font-serif text-[15px] text-ink">{ev.title}</p><p className="text-[12px] text-muted">{ev.city}</p></div>
        </div>

        <h2 className="mb-2.5 mt-6 font-serif text-[18px] text-ink">Attendee details</h2>
        <div className="flex flex-col gap-4">
          <TextField label="Buyer name" value={name} onChange={setName} error={touched ? errors.name : ''} />
          <TextField label="Email" type="email" value={email} onChange={setEmail} error={touched ? errors.email : ''} hint="Your tickets and receipt are sent here." />
          <TextField label="Phone" optional value={phone} onChange={setPhone} />
          <TextField label="Billing country" value={country} onChange={setCountry} />
        </div>

        {/* order summary */}
        <h2 className="mb-2.5 mt-7 font-serif text-[18px] text-ink">Order summary</h2>
        <div className="rounded-card border border-border bg-surface p-4">
          {selections.map((s) => (
            <div key={s.ticketTypeId} className="flex items-center justify-between py-1 text-[13.5px]">
              <span className="text-ink">{s.qty}× {s.ticketTypeName}</span>
              <span className="font-semibold text-ink">{inr(s.qty * s.unitPrice)}</span>
            </div>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            <div className="flex flex-1 items-center gap-2 rounded-control border border-border bg-bg px-3">
              <Tag className="h-4 w-4 text-muted" />
              <input value={promo} onChange={(e) => { setPromo(e.target.value); setPromoApplied(false) }} placeholder="Promo code" className="h-10 w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none" />
            </div>
            <SecondaryButton onClick={applyPromo} className="min-w-[80px]">Apply</SecondaryButton>
          </div>
          {promo && (promoApplied
            ? <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-success"><Check className="h-3.5 w-3.5" /> {PROMO_CODE} applied — 10% off</p>
            : <p className="mt-1.5 text-[12px] text-muted">Enter a valid code (try {PROMO_CODE}).</p>)}

          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-[13px]">
            <Line label="Subtotal" value={inr(subtotal)} />
            {discount > 0 && <Line label="Discount" value={`− ${inr(discount)}`} tone="success" />}
            <Line label="Platform fee" value={inr(fee)} />
            <p className="text-[11px] text-muted">Taxes included where applicable.</p>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
              <span className="text-[15px] font-semibold text-ink">Total</span>
              <span className="text-[18px] font-bold text-ink">{inr(total)}</span>
            </div>
          </div>
        </div>

        {/* payment method */}
        <h2 className="mb-2.5 mt-7 font-serif text-[18px] text-ink">Payment method</h2>
        <div className="flex gap-2">
          {(['Card', 'UPI', 'Google Pay'] as Pay[]).map((p) => (
            <button key={p} onClick={() => setPay(p)} className={`tap flex flex-1 flex-col items-center gap-1.5 rounded-card border py-3 text-[12px] font-semibold ${pay === p ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`}>
              {p === 'Card' ? <CreditCard className="h-5 w-5" /> : p === 'UPI' ? <Smartphone className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
              {p}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11.5px] text-muted">Prototype simulation — no real card, UPI or payment details are collected.</p>

        <Checkbox checked={agree} onChange={setAgree} error={touched && !!errors.agree}>
          I agree to the event and refund policies.
        </Checkbox>
        {touched && errors.agree && <p className="-mt-1 text-[12px] font-medium text-error">{errors.agree}</p>}

        {failed && (
          <div className="mt-4 rounded-card border border-error/30 bg-[#F7E9EA] p-4">
            <div className="flex items-center gap-2 text-error"><XCircle className="h-5 w-5" /><p className="text-[14px] font-semibold">Payment unsuccessful</p></div>
            <p className="mt-1 text-[12.5px] text-[#7a2b30]">No charge was made. Your tickets and details are saved.</p>
            <div className="mt-3 flex gap-2">
              <PrimaryButton full onClick={() => { setFailed(false); onPay() }}>Try Again</PrimaryButton>
              <SecondaryButton onClick={() => navigate(`/events/${ev.id}`)} className="min-w-[110px]">Return</SecondaryButton>
            </div>
          </div>
        )}
      </div>

      {!failed && (
        <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-wide text-muted">Total</span>
            <span className="text-[18px] font-bold text-ink">{inr(total)}</span>
          </div>
          <div className="mt-2 flex gap-2.5">
            <SecondaryButton onClick={onFail} disabled={processing} className="min-w-[130px] !text-error">Simulate Fail</SecondaryButton>
            <PrimaryButton full disabled={processing} onClick={onPay}>{processing ? 'Processing…' : 'Simulate Successful Payment'}</PrimaryButton>
          </div>
        </div>
      )}

      {otpSheet && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setOtpSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><CheckCircle2 className="h-6 w-6" strokeWidth={1.75} /></div>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Verify your email</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">Confirm the code sent to {email || 'your email'} to complete your booking. Your order is saved.</p>
            <div className="mt-5"><OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpErr('') }} /></div>
            {otpErr && <p className="mt-2 text-[12px] font-medium text-error">{otpErr}</p>}
            <div className="mt-3 rounded-control border border-dashed border-brand/40 bg-brand-soft px-3 py-2 text-[12px] text-brand-dark">Prototype code: <span className="font-bold tracking-wide">123456</span></div>
            <div className="mt-5"><PrimaryButton full disabled={otp.length < 6} onClick={() => { if (otp === '123456') { setOtpSheet(false); doPurchase() } else setOtpErr('Incorrect code. Try 123456.') }}>Verify & Pay</PrimaryButton></div>
          </div>
        </div>
      )}
    </div>
  )
}

function Line({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={`font-semibold ${tone === 'success' ? 'text-success' : 'text-ink'}`}>{value}</span>
    </div>
  )
}
