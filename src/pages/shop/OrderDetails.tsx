import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Download, FileText, MessageSquare, Truck, RotateCcw } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useShop } from '../../state/ShopContext'
import { inr } from '../../shop/pricing'
import { fmtDate } from '../../events/format'

const PHYSICAL_STEPS = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
const stepIndex = (s: string) => {
  const map: Record<string, number> = { Pending: 0, Confirmed: 0, Processing: 1, Shipped: 2, 'Out for Delivery': 3, Delivered: 4 }
  return map[s] ?? 0
}

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, refunds } = useShop()
  const [toast, setToast] = useState('')
  const o = orders.find((x) => x.id === orderId)
  if (!o) return <BackHeader title="Order" />
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const refund = refunds.find((r) => r.orderId === o.id)
  const cur = stepIndex(o.status)
  const digital = !o.hasPhysical

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Order" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="flex items-center justify-between">
          <div><p className="font-mono text-[13px] font-semibold text-ink">{o.orderId}</p><p className="text-[12px] text-muted">{fmtDate(o.createdAt)}</p></div>
          <StatusBadge tone={o.status === 'Delivered' || o.status === 'Available' ? 'success' : o.status === 'Cancelled' || o.status === 'Refunded' ? 'error' : 'warning'}>{o.status}</StatusBadge>
        </div>

        {/* timeline */}
        <section className="mt-5">
          <h2 className="mb-3 font-serif text-[18px] text-ink">{digital ? 'Access' : 'Delivery'}</h2>
          {digital ? (
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-success"><Check className="h-4 w-4" /> Available now</p>
              <p className="mt-1 text-[12.5px] text-muted">Your digital items are ready in My Library.</p>
              <div className="mt-3"><SecondaryButton full onClick={() => navigate('/library')}><Download className="h-4 w-4" /> Open Library</SecondaryButton></div>
            </div>
          ) : (
            <div className="flex flex-col">
              {PHYSICAL_STEPS.map((step, i) => (
                <div key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full ${i <= cur ? 'bg-brand text-white' : 'bg-surface text-muted border border-border'}`}>{i <= cur ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-muted" />}</span>
                    {i < PHYSICAL_STEPS.length - 1 && <span className={`my-0.5 w-px flex-1 ${i < cur ? 'bg-brand/40' : 'bg-border'}`} />}
                  </div>
                  <div className={`pb-5 ${i === PHYSICAL_STEPS.length - 1 ? 'pb-0' : ''}`}><p className={`text-[13.5px] font-semibold ${i <= cur ? 'text-ink' : 'text-muted'}`}>{step}</p></div>
                </div>
              ))}
            </div>
          )}
          {o.tracking && <div className="mt-1 rounded-card border border-border bg-surface p-3 text-[12.5px]"><span className="text-muted">Courier</span> <span className="font-semibold text-ink">{o.courier}</span> · <span className="font-mono text-ink">{o.tracking}</span></div>}
        </section>

        {/* products */}
        <section className="mt-6">
          <h2 className="mb-2.5 font-serif text-[18px] text-ink">Items</h2>
          <div className="overflow-hidden rounded-card border border-border bg-surface">
            {o.items.map((it) => (
              <div key={it.productId + (it.variantName ?? '')} className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-0">
                <img src={it.cover} alt="" className="h-11 w-11 rounded-[8px] object-cover" />
                <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold text-ink">{it.title}</p><p className="text-[11.5px] text-muted">{it.sellerName} · {it.type} · Qty {it.qty}</p></div>
                <span className="text-[13px] font-bold text-ink">{inr(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* payment + address */}
        <div className="mt-5 flex flex-col gap-1 rounded-card border border-border bg-surface p-4 text-[13px]">
          <div className="flex justify-between"><span className="text-muted">Amount paid</span><span className="font-bold text-ink">{inr(o.amount)}</span></div>
        </div>
        {o.address && <div className="mt-3 rounded-card border border-border bg-surface p-4 text-[12.5px] text-muted"><p className="mb-1 text-[13px] font-semibold text-ink">Delivery address</p>{o.address.name}, {o.address.line}, {o.address.city}, {o.address.state} {o.address.postal}</div>}

        {refund && <div className="mt-3 rounded-card border border-warning/30 bg-[#F7F0E4] p-3.5"><p className="text-[13px] font-semibold text-ink">Refund {refund.status}</p><p className="mt-0.5 text-[12.5px] text-[#7a5412]">{refund.requestType} · {refund.reason}</p></div>}

        <div className="mt-5 flex flex-col gap-2.5">
          <SecondaryButton full onClick={() => flash('Invoice downloaded (prototype)')}><FileText className="h-4 w-4" /> Download Invoice</SecondaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => flash('Message sent (prototype)')}><MessageSquare className="h-4 w-4" /> Contact Seller</SecondaryButton>
            {o.hasPhysical && <SecondaryButton onClick={() => flash('Tracking: ' + (o.tracking ?? 'pending'))}><Truck className="h-4 w-4" /> Track</SecondaryButton>}
          </div>
          {!refund && o.status !== 'Cancelled' && o.status !== 'Refunded' && (
            <PrimaryButton full onClick={() => navigate(`/refunds/${o.id}/request`)}><RotateCcw className="h-4 w-4" /> Request Refund / Return</PrimaryButton>
          )}
        </div>

        {/* Always-available exits — never a dead end. */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-border pt-5">
          <SecondaryButton onClick={() => navigate('/orders')}>All Orders</SecondaryButton>
          <SecondaryButton onClick={() => navigate('/shop')}>Continue Shopping</SecondaryButton>
        </div>
        <button onClick={() => navigate('/home')} className="tap mx-auto mt-2 flex min-h-[44px] items-center justify-center text-[14px] font-semibold text-muted hover:text-ink">Go to Home</button>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
