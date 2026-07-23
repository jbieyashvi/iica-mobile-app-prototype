import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Smartphone, Tag, Check, XCircle } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useShop } from '../../state/ShopContext'
import { useAuth } from '../../state/AuthContext'
import { inr, unitPrice, shippingFor, platformFee } from '../../shop/pricing'
import { PROMO_CODE, PROMO_RATE } from '../../shop/types'
import { loadAddress } from './CheckoutAddress'
import { loadGuestContact } from './Checkout'

type Pay = 'Card' | 'UPI' | 'Google Pay'

export default function CheckoutPayment() {
  const navigate = useNavigate()
  const { cart, getProduct, products, placeOrder, clearPurchased } = useShop()
  const { state } = useAuth()
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(false)
  const [pay, setPay] = useState<Pay>('Card')
  const [processing, setProcessing] = useState(false)
  const [failed, setFailed] = useState(false)

  const active = cart.filter((i) => !i.savedForLater)
  if (active.length === 0) return <BackHeader title="Payment" />
  const activeProducts = active.map((i) => getProduct(i.productId)).filter(Boolean) as typeof products

  const subtotal = active.reduce((s, i) => { const p = getProduct(i.productId); return p ? s + unitPrice(p, i.variantId) * i.qty : s }, 0)
  const shipping = shippingFor(activeProducts)
  const discount = applied ? Math.round(subtotal * PROMO_RATE) : 0
  const fee = platformFee(subtotal - discount)
  const total = subtotal - discount + shipping + fee

  const applyPromo = () => setApplied(promo.trim().toUpperCase() === PROMO_CODE)

  const success = () => {
    setProcessing(true)
    setTimeout(() => {
      const guest = loadGuestContact()
      const buyer = state.authed
        ? { name: state.name || 'Guest', email: state.email || 'you@example.com' }
        : { name: guest?.name || 'Guest', email: guest?.email || 'guest@demo.iica.app' }
      const order = placeOrder(buyer, total, loadAddress())
      clearPurchased(active.map((i) => i.productId))
      setProcessing(false)
      navigate('/checkout/confirmation', { state: { orderId: order.id } })
    }, 1400)
  }
  const fail = () => { setProcessing(true); setTimeout(() => { setProcessing(false); setFailed(true) }, 1100) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Payment" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-40 pt-3">
        {/* totals */}
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-control border border-border bg-bg px-3"><Tag className="h-4 w-4 text-muted" /><input value={promo} onChange={(e) => { setPromo(e.target.value); setApplied(false) }} placeholder="Promo code" className="h-10 w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none" /></div>
            <SecondaryButton onClick={applyPromo} className="min-w-[80px]">Apply</SecondaryButton>
          </div>
          {promo && (applied ? <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-success"><Check className="h-3.5 w-3.5" /> {PROMO_CODE} applied · 10% off</p> : <p className="mt-1.5 text-[12px] text-muted">Enter a valid code (try {PROMO_CODE}).</p>)}
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-[13px]">
            <Row label="Subtotal" value={inr(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`− ${inr(discount)}`} tone="success" />}
            <Row label="Shipping" value={shipping ? inr(shipping) : '—'} />
            <Row label="Platform fee" value={inr(fee)} />
            <p className="text-[11px] text-muted">Taxes included where applicable.</p>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2"><span className="text-[15px] font-semibold text-ink">Total</span><span className="text-[18px] font-bold text-ink">{inr(total)}</span></div>
          </div>
        </div>

        <h2 className="mb-2.5 mt-6 font-serif text-[18px] text-ink">Payment method</h2>
        <div className="flex gap-2">
          {(['Card', 'UPI', 'Google Pay'] as Pay[]).map((m) => (
            <button key={m} onClick={() => setPay(m)} className={`tap flex flex-1 flex-col items-center gap-1.5 rounded-card border py-3 text-[12px] font-semibold ${pay === m ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`}>{m === 'Card' ? <CreditCard className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}{m}</button>
          ))}
        </div>
        <p className="mt-2 text-[11.5px] text-muted">Prototype simulation — no real card, UPI or payment details are collected.</p>
        <p className="mt-1 text-[12px] text-muted">Receipt will be emailed to {state.email || 'your email'}.</p>

        {failed && (
          <div className="mt-4 rounded-card border border-error/30 bg-[#F7E9EA] p-4">
            <div className="flex items-center gap-2 text-error"><XCircle className="h-5 w-5" /><p className="text-[14px] font-semibold">Payment unsuccessful</p></div>
            <p className="mt-1 text-[12.5px] text-[#7a2b30]">No charge was made. Your cart is saved.</p>
            <div className="mt-3 flex gap-2">
              <PrimaryButton full onClick={() => { setFailed(false); success() }}>Try Again</PrimaryButton>
              <SecondaryButton onClick={() => navigate('/cart')} className="min-w-[110px]">Return to Cart</SecondaryButton>
            </div>
          </div>
        )}
      </div>

      {!failed && (
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
          <div className="flex items-center justify-between"><span className="text-[12px] uppercase tracking-wide text-muted">Total</span><span className="text-[18px] font-bold text-ink">{inr(total)}</span></div>
          <div className="mt-2 flex gap-2.5">
            <SecondaryButton onClick={fail} disabled={processing} className="min-w-[120px] !text-error">Simulate Fail</SecondaryButton>
            <PrimaryButton full disabled={processing} onClick={success}>{processing ? 'Processing…' : 'Simulate Successful Payment'}</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
function Row({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return <div className="flex items-center justify-between"><span className="text-muted">{label}</span><span className={`font-semibold ${tone === 'success' ? 'text-success' : 'text-ink'}`}>{value}</span></div>
}
