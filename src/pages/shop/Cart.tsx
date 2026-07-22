import { useNavigate } from 'react-router-dom'
import { Trash2, Bookmark, AlertTriangle, ShoppingBag } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { useShop } from '../../state/ShopContext'
import { inr, unitPrice, shippingFor, platformFee } from '../../shop/pricing'
import { CartItem } from '../../shop/types'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, products, getProduct, setQty, removeFromCart, toggleSaveForLater } = useShop()

  const active = cart.filter((i) => !i.savedForLater)
  const saved = cart.filter((i) => i.savedForLater)

  const activeProducts = active.map((i) => getProduct(i.productId)).filter(Boolean) as typeof products
  const subtotal = active.reduce((s, i) => { const p = getProduct(i.productId); return p ? s + unitPrice(p, i.variantId) * i.qty : s }, 0)
  const shipping = shippingFor(activeProducts)
  const fee = platformFee(subtotal)
  const total = subtotal + shipping + fee
  const anySoldOut = activeProducts.some((p) => p.type === 'Physical' && (p.stock ?? 0) <= 0)

  // group by seller
  const sellers = [...new Set(active.map((i) => getProduct(i.productId)?.sellerId).filter(Boolean))] as string[]

  if (cart.length === 0) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Cart" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-brand"><ShoppingBag className="h-7 w-7" strokeWidth={1.6} /></div>
          <p className="mt-4 font-serif text-[22px] text-ink">Your cart is empty</p>
          <p className="mt-1 max-w-[260px] text-[13px] text-muted">Browse masterclasses, downloads and handmade goods from IICA creators.</p>
          <div className="mt-6"><PrimaryButton onClick={() => navigate('/shop')}>Browse Shop</PrimaryButton></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={`Cart (${active.reduce((s, i) => s + i.qty, 0)})`} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-40 pt-3">
        {sellers.map((sid) => {
          const items = active.filter((i) => getProduct(i.productId)?.sellerId === sid)
          const sname = getProduct(items[0].productId)?.sellerName
          return (
            <div key={sid} className="mb-4">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">{sname}</p>
              <div className="flex flex-col gap-2.5">{items.map((i) => <Line key={i.productId + (i.variantId ?? '')} item={i} shop={{ getProduct, setQty, removeFromCart, toggleSaveForLater }} />)}</div>
            </div>
          )
        })}

        {saved.length > 0 && (
          <div className="mt-2">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">Saved for later</p>
            <div className="flex flex-col gap-2.5">{saved.map((i) => <Line key={i.productId + (i.variantId ?? '')} item={i} saved shop={{ getProduct, setQty, removeFromCart, toggleSaveForLater }} />)}</div>
          </div>
        )}

        {anySoldOut && <div className="mt-3 flex items-center gap-2 rounded-control border border-error/30 bg-[#F7E9EA] px-3 py-2 text-[12.5px] text-error"><AlertTriangle className="h-4 w-4" /> Remove sold-out items to check out.</div>}

        {/* totals */}
        {active.length > 0 && (
          <div className="mt-4 rounded-card border border-border bg-surface p-4 text-[13px]">
            <Row label="Subtotal" value={inr(subtotal)} />
            <Row label="Shipping (est.)" value={shipping ? inr(shipping) : '—'} />
            <Row label="Platform fee" value={inr(fee)} />
            <p className="text-[11px] text-muted">Taxes calculated at checkout.</p>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2"><span className="text-[15px] font-semibold text-ink">Estimated total</span><span className="text-[18px] font-bold text-ink">{inr(total)}</span></div>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => navigate('/shop')} className="min-w-[130px]">Continue</SecondaryButton>
          <PrimaryButton full disabled={active.length === 0 || anySoldOut} onClick={() => navigate('/checkout')}>Proceed to Checkout</PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function Line({ item, saved, shop }: { item: CartItem; saved?: boolean; shop: Pick<ReturnType<typeof useShop>, 'getProduct' | 'setQty' | 'removeFromCart' | 'toggleSaveForLater'> }) {
  const p = shop.getProduct(item.productId)
  if (!p) return null
  const soldOut = p.type === 'Physical' && (p.stock ?? 0) <= 0
  const price = unitPrice(p, item.variantId)
  const v = p.variants?.find((x) => x.id === item.variantId)
  return (
    <div className="flex gap-3 rounded-card border border-border bg-surface p-3">
      <img src={p.cover} alt="" className="h-[64px] w-[64px] shrink-0 rounded-[9px] object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-ink">{p.title}</p>
            <p className="text-[11.5px] text-muted">{p.type}{v ? ` · ${v.name}` : ''}</p>
          </div>
          <span className="shrink-0 text-[14px] font-bold text-ink">{p.free ? 'Free' : inr(price * item.qty)}</span>
        </div>
        {soldOut && <div className="mt-1"><StatusBadge tone="error">Sold Out</StatusBadge></div>}
        <div className="mt-2 flex items-center gap-3">
          {!saved && p.type === 'Physical' && !soldOut && (
            <div className="flex items-center gap-2">
              <button onClick={() => shop.setQty(item.productId, item.qty - 1, item.variantId)} className="tap flex h-8 w-8 items-center justify-center rounded-control border border-border text-[16px]">−</button>
              <span className="w-5 text-center text-[13px] font-bold text-ink">{item.qty}</span>
              <button onClick={() => shop.setQty(item.productId, item.qty + 1, item.variantId)} className="tap flex h-8 w-8 items-center justify-center rounded-control border border-border text-[16px]">+</button>
            </div>
          )}
          <button onClick={() => shop.toggleSaveForLater(item.productId, item.variantId)} className="tap ml-auto flex items-center gap-1 text-[11.5px] font-semibold text-muted hover:text-ink"><Bookmark className="h-3.5 w-3.5" /> {saved ? 'Move to cart' : 'Save'}</button>
          <button onClick={() => shop.removeFromCart(item.productId, item.variantId)} aria-label="Remove" className="tap flex h-8 w-8 items-center justify-center text-muted hover:text-error"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between py-0.5"><span className="text-muted">{label}</span><span className="font-semibold text-ink">{value}</span></div>
}
