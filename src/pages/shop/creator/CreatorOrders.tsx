import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import StatusBadge from '../../../components/StatusBadge'
import { useShop } from '../../../state/ShopContext'
import { usePortfolio } from '../../../state/PortfolioContext'
import { inr, creatorEarnings } from '../../../shop/pricing'
import { fmtDate } from '../../../events/format'

type Filter = 'All' | 'New' | 'Processing' | 'Shipped' | 'Delivered' | 'Refund Requests'

export default function CreatorOrders() {
  const navigate = useNavigate()
  const { orders, products, refunds } = useShop()
  const { portfolio } = usePortfolio()
  const [filter, setFilter] = useState<Filter>('All')

  const mineIds = new Set(products.filter((p) => p.createdByMe || p.sellerId === portfolio.slug || p.sellerId === 'abhishek-singh-chouhan').map((p) => p.id))
  const refundOrderIds = new Set(refunds.map((r) => r.orderId))
  const myOrders = orders.filter((o) => o.items.some((i) => mineIds.has(i.productId)))
  const filtered = myOrders.filter((o) => {
    if (filter === 'All') return true
    if (filter === 'New') return o.status === 'Confirmed' || o.status === 'Pending' || o.status === 'Available'
    if (filter === 'Refund Requests') return refundOrderIds.has(o.id)
    if (filter === 'Processing') return o.status === 'Processing'
    if (filter === 'Shipped') return o.status === 'Shipped' || o.status === 'Out for Delivery'
    if (filter === 'Delivered') return o.status === 'Delivered'
    return true
  })

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Seller Orders" />
      <div className="shrink-0 px-[18px] pt-2">
        <div className="no-scrollbar -mx-[18px] flex gap-1.5 overflow-x-auto px-[18px]">
          {(['All', 'New', 'Processing', 'Shipped', 'Delivered', 'Refund Requests'] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${filter === f ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4">
        {filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">No orders here.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((o) => {
              const myItems = o.items.filter((i) => mineIds.has(i.productId))
              const earn = myItems.reduce((s, i) => s + creatorEarnings(i.price * i.qty), 0)
              return (
                <button key={o.id} onClick={() => navigate(`/creator/orders/${o.id}`)} className="tap rounded-card border border-border bg-surface p-3.5 text-left">
                  <div className="flex items-center gap-3">
                    <img src={myItems[0].cover} alt="" className="h-12 w-12 rounded-[9px] object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate font-serif text-[14.5px] text-ink">{myItems[0].title}</p><p className="truncate text-[12px] text-muted">{o.buyerName} · {fmtDate(o.createdAt)}</p></div>
                    <StatusBadge tone={refundOrderIds.has(o.id) ? 'warning' : o.status === 'Delivered' || o.status === 'Available' ? 'success' : 'warning'}>{refundOrderIds.has(o.id) ? 'Refund' : o.status}</StatusBadge>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[12px] text-muted"><span className="font-mono">{o.orderId}</span><span className="flex items-center gap-1 font-semibold text-brand">Earn {inr(earn)} <ChevronRight className="h-4 w-4 text-muted" /></span></div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
