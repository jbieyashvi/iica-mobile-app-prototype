import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, X, Trash2 } from 'lucide-react'
import { useShop } from '../../state/ShopContext'
import { inr, unitPrice, shippingFor, platformFee } from '../../shop/pricing'
import PrimaryButton from '../PrimaryButton'
import SecondaryButton from '../SecondaryButton'

// Show only on Shop + Product screens (never checkout/cart/confirmation).
function visibleOn(path: string) {
  return path === '/shop' || path.startsWith('/shop/') || path.startsWith('/product/')
}

export default function FloatingCart() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useShop()
  const [open, setOpen] = useState(false)
  const [bounce, setBounce] = useState(false)
  const prevCount = useRef(cartCount)

  // subtle one-shot bounce whenever the count increases
  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBounce(true)
      const t = setTimeout(() => setBounce(false), 380)
      prevCount.current = cartCount
      return () => clearTimeout(t)
    }
    prevCount.current = cartCount
  }, [cartCount])

  // the floating button shows only on Shop/Product screens with items;
  // the sheet stays mounted while open so it can show an empty state after
  // the last item is removed.
  const showFab = cartCount > 0 && visibleOn(pathname)
  if (!showFab && !open) return null

  return (
    <>
      {showFab && (
        <button
          onClick={() => setOpen(true)}
          aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          className={`tap absolute right-4 z-40 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-brand text-white shadow-subtle ${bounce ? 'cart-bounce' : ''}`}
          style={{ bottom: 'calc(var(--safe-bottom) + 74px)' }}
        >
          <ShoppingBag className="h-6 w-6" strokeWidth={1.9} />
          <span className="absolute -right-1 -top-1 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-bg bg-ink px-1 text-[11px] font-bold text-white">{cartCount}</span>
        </button>
      )}

      {open && <QuickCartSheet onClose={() => setOpen(false)} onCheckout={() => { setOpen(false); navigate('/checkout') }} onFull={() => { setOpen(false); navigate('/cart') }} />}
    </>
  )
}

function QuickCartSheet({ onClose, onCheckout, onFull }: { onClose: () => void; onCheckout: () => void; onFull: () => void }) {
  const { cart, getProduct, setQty, removeFromCart } = useShop()
  const active = cart.filter((i) => !i.savedForLater)
  const products = active.map((i) => getProduct(i.productId)).filter((p): p is NonNullable<typeof p> => !!p)
  const subtotal = active.reduce((s, i) => { const p = getProduct(i.productId); return p ? s + unitPrice(p, i.variantId) * i.qty : s }, 0)
  const shipping = shippingFor(products)
  const fee = platformFee(subtotal)
  const total = subtotal + shipping + fee
  const count = active.reduce((s, i) => s + i.qty, 0)
  const empty = active.length === 0

  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative flex max-h-[82%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface">
        {/* header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
          <div>
            <h3 className="font-serif text-[20px] leading-none text-ink">Your Cart</h3>
            {!empty && <p className="mt-1 text-[12px] text-muted">{count} item{count === 1 ? '' : 's'}</p>}
          </div>
          <button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        </div>

        {empty ? (
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg text-brand"><ShoppingBag className="h-6 w-6" strokeWidth={1.6} /></div>
            <p className="mt-4 font-serif text-[19px] text-ink">Your cart is empty</p>
            <div className="mt-5"><PrimaryButton onClick={onClose}>Continue Shopping</PrimaryButton></div>
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-3">
              <div className="flex flex-col gap-3">
                {active.map((i) => {
                  const p = getProduct(i.productId)
                  if (!p) return null
                  const v = p.variants?.find((x) => x.id === i.variantId)
                  const price = unitPrice(p, i.variantId)
                  return (
                    <div key={i.productId + (i.variantId ?? '')} className="flex gap-3">
                      <img src={p.cover} alt="" className="h-[56px] w-[56px] shrink-0 rounded-[9px] object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-semibold text-ink">{p.title}</p>
                            <p className="truncate text-[11.5px] text-muted">{p.sellerName} · {p.type}{v ? ` · ${v.name}` : ''}</p>
                          </div>
                          <span className="shrink-0 text-[13px] font-bold text-ink">{p.free ? 'Free' : inr(price * i.qty)}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          {p.type === 'Physical' ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => setQty(i.productId, i.qty - 1, i.variantId)} className="tap flex h-7 w-7 items-center justify-center rounded-control border border-border text-[15px]">−</button>
                              <span className="w-5 text-center text-[13px] font-bold text-ink">{i.qty}</span>
                              <button onClick={() => setQty(i.productId, i.qty + 1, i.variantId)} className="tap flex h-7 w-7 items-center justify-center rounded-control border border-border text-[15px]">+</button>
                            </div>
                          ) : <span className="text-[11.5px] text-muted">Qty 1</span>}
                          <button onClick={() => removeFromCart(i.productId, i.variantId)} aria-label="Remove" className="tap ml-auto flex h-7 w-7 items-center justify-center text-muted hover:text-error"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* summary */}
              <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3 text-[13px]">
                <Row label="Subtotal" value={inr(subtotal)} />
                {shipping > 0 && <Row label="Shipping (est.)" value={inr(shipping)} />}
                <Row label="Platform fee" value={inr(fee)} />
                <div className="mt-1 flex items-center justify-between border-t border-border pt-2"><span className="text-[14px] font-semibold text-ink">Estimated total</span><span className="text-[17px] font-bold text-ink">{inr(total)}</span></div>
              </div>
            </div>

            {/* actions */}
            <div className="shrink-0 border-t border-border px-5 pt-3" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
              <PrimaryButton full onClick={onCheckout}>Proceed to Pay</PrimaryButton>
              <div className="mt-2 flex items-center justify-between">
                <SecondaryButton onClick={onFull} className="flex-1">View Full Cart</SecondaryButton>
              </div>
              <button onClick={onClose} className="tap mt-2 min-h-[40px] w-full text-[13px] font-semibold text-muted hover:text-ink">Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-muted">{label}</span><span className="font-semibold text-ink">{value}</span></div>
}
