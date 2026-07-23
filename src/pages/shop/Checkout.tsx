import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, ChevronRight, UserRound } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import TextField from '../../components/form/TextField'
import { useShop } from '../../state/ShopContext'
import { useAuth } from '../../state/AuthContext'
import { inr, unitPrice } from '../../shop/pricing'
import { isEmail } from '../../lib/validation'
import { demoCheckout } from '../../demo/demoData'

const GUEST_KEY = 'iica_checkout_guest'
export interface GuestContact { name: string; email: string; phone: string; country: string }
export function loadGuestContact(): GuestContact | undefined {
  try { const r = localStorage.getItem(GUEST_KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return undefined
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, getProduct } = useShop()
  const { state } = useAuth()

  const active = cart.filter((i) => !i.savedForLater)
  const hasPhysical = active.some((i) => getProduct(i.productId)?.type === 'Physical')

  const saved = loadGuestContact()
  const [g, setG] = useState<GuestContact>(saved ?? {
    name: demoCheckout.name, email: 'guest@demo.iica.app', phone: demoCheckout.phone, country: demoCheckout.country,
  })
  const [touched, setTouched] = useState(false)
  const setF = <K extends keyof GuestContact>(k: K, v: GuestContact[K]) => setG((s) => ({ ...s, [k]: v }))

  if (active.length === 0) return <BackHeader title="Checkout" fallback="/shop" />

  const sellers = [...new Set(active.map((i) => getProduct(i.productId)?.sellerId).filter(Boolean))] as string[]
  const isGuest = !state.authed
  const guestErr = { name: !g.name.trim() ? 'Required' : '', email: !isEmail(g.email) ? 'Valid email required' : '' }
  const guestValid = !guestErr.name && !guestErr.email
  const canContinue = !isGuest || guestValid

  const cont = () => {
    if (isGuest) {
      setTouched(true)
      if (!guestValid) return
      localStorage.setItem(GUEST_KEY, JSON.stringify(g))
    }
    navigate(hasPhysical ? '/checkout/address' : '/checkout/payment')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Checkout" fallback="/cart" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-28 pt-3">
        {isGuest ? (
          <div className="rounded-card border border-border bg-surface p-4">
            <div className="flex items-center gap-2 text-brand"><UserRound className="h-5 w-5" /><p className="font-serif text-[17px] text-ink">Guest checkout</p></div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">You can purchase as a guest. No account required.</p>
            <div className="mt-3.5 flex flex-col gap-3.5">
              <TextField label="Full name" value={g.name} onChange={(v) => setF('name', v)} error={touched ? guestErr.name : ''} />
              <TextField label="Email address" type="email" value={g.email} onChange={(v) => setF('email', v)} error={touched ? guestErr.email : ''} hint="Your order confirmation and access details go here." />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Phone" optional value={g.phone} onChange={(v) => setF('phone', v)} />
                <TextField label="Billing country" value={g.country} onChange={(v) => setF('country', v)} />
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="tap mt-3 min-h-[40px] text-[13px] font-semibold text-brand hover:text-brand-dark">Sign in for a faster checkout</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-card border border-border bg-surface p-3 text-[13px]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3EE] text-success">✓</span>
            <div><p className="font-semibold text-ink">{state.name}</p><p className="text-[12px] text-muted">{state.email}</p></div>
          </div>
        )}

        {/* order review grouped by seller */}
        <h2 className="mb-2 mt-6 font-serif text-[18px] text-ink">Order review</h2>
        <div className="flex flex-col gap-3">
          {sellers.map((sid) => {
            const items = active.filter((i) => getProduct(i.productId)?.sellerId === sid)
            const sname = getProduct(items[0].productId)?.sellerName
            return (
              <div key={sid} className="overflow-hidden rounded-card border border-border bg-surface">
                <p className="border-b border-border px-3.5 py-2 text-[12px] font-bold uppercase tracking-wide text-muted">{sname}</p>
                {items.map((i) => {
                  const p = getProduct(i.productId)!
                  const v = p.variants?.find((x) => x.id === i.variantId)
                  return (
                    <div key={i.productId + (i.variantId ?? '')} className="flex items-center gap-3 px-3.5 py-2.5">
                      <img src={p.cover} alt="" className="h-10 w-10 rounded-[8px] object-cover" />
                      <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold text-ink">{p.title}</p><p className="text-[11.5px] text-muted">{p.type}{v ? ` · ${v.name}` : ''} · Qty {i.qty}</p></div>
                      <span className="text-[13px] font-bold text-ink">{p.free ? 'Free' : inr(unitPrice(p, i.variantId) * i.qty)}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {!hasPhysical && (
          <p className="mt-4 flex items-center gap-2 rounded-control bg-surface px-3.5 py-3 text-[12.5px] text-muted ring-1 ring-border"><Download className="h-4 w-4 text-brand" /> Instant digital access after payment{isGuest ? ' — sent to your email' : ''}. No shipping needed.</p>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <PrimaryButton full disabled={!canContinue} onClick={cont}>
          {isGuest ? 'Continue as Guest' : 'Continue'} <ChevronRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </div>
  )
}
