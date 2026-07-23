import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Download, Truck, Package, Mail } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useShop } from '../../state/ShopContext'
import { inr } from '../../shop/pricing'

export default function CheckoutConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { orders } = useShop()
  const orderId = (location.state as { orderId?: string })?.orderId
  const order = orders.find((o) => o.id === orderId) ?? orders[0]
  if (!order) return <BackHeader title="Confirmation" />

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Final screen — back must not re-enter the paid checkout flow. */}
      <BackHeader title="Order Confirmed" onBack={() => navigate('/home')} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <div className="flex flex-col items-center pt-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></div>
          <h1 className="mt-5 font-serif text-[28px] leading-tight text-ink">Order confirmed</h1>
          <p className="mt-2 text-[13px] text-muted">Order <span className="font-mono font-semibold text-ink">{order.orderId}</span></p>
        </div>

        <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
          {order.items.map((it) => (
            <div key={it.productId + (it.variantName ?? '')} className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-0">
              <img src={it.cover} alt="" className="h-11 w-11 rounded-[8px] object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold text-ink">{it.title}</p><p className="text-[11.5px] text-muted">{it.sellerName} · {it.type}{it.variantName ? ` · ${it.variantName}` : ''}</p></div>
              <span className="text-[13px] font-bold text-ink">{inr(it.price * it.qty)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3.5 py-3"><span className="text-[13px] font-semibold text-ink">Amount paid</span><span className="text-[15px] font-bold text-ink">{inr(order.amount)}</span></div>
        </div>

        {order.hasDigital && <Info icon={<Download className="h-4 w-4 text-brand" />} text="Your digital items are available now in My Library." />}
        {order.hasPhysical && <Info icon={<Truck className="h-4 w-4 text-brand" />} text={`Delivery estimate: 5–9 days. Track your order for updates.`} />}
        <Info icon={<Mail className="h-4 w-4 text-brand" />} text={`A confirmation has been emailed to ${order.buyerEmail}.`} />

        <div className="mt-5 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => navigate(`/orders/${order.id}`)}><Package className="h-4 w-4" /> View Order</PrimaryButton>
          {order.hasDigital && <SecondaryButton full onClick={() => navigate('/library')}><Download className="h-4 w-4" /> Open My Library</SecondaryButton>}
          {order.hasPhysical && <SecondaryButton full onClick={() => navigate(`/orders/${order.id}`)}><Truck className="h-4 w-4" /> Track Order</SecondaryButton>}
          <div className="mt-1 flex items-center justify-center gap-5">
            <button onClick={() => navigate('/shop')} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Continue Shopping</button>
            <button onClick={() => navigate('/home')} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Go to Home</button>
          </div>
        </div>
      </div>
    </div>
  )
}
function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="mt-3 flex items-start gap-2.5 rounded-control border border-border bg-surface px-3.5 py-3"><span className="mt-0.5">{icon}</span><p className="text-[12.5px] leading-relaxed text-muted">{text}</p></div>
}
