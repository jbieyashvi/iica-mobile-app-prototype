import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import { useShop } from '../../state/ShopContext'
import { Order } from '../../shop/types'
import { inr } from '../../shop/pricing'
import { fmtDate } from '../../events/format'

type Tab = 'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunds'

const tone = (s: Order['status']) =>
  s === 'Delivered' || s === 'Available' ? 'success' : s === 'Cancelled' || s === 'Refunded' ? 'error' : 'warning'

export default function Orders() {
  const navigate = useNavigate()
  const { orders, refunds } = useShop()
  const [tab, setTab] = useState<Tab>('All')

  const refundedIds = new Set(refunds.map((r) => r.orderId))
  const filtered = orders.filter((o) => {
    if (tab === 'All') return true
    if (tab === 'Refunds') return refundedIds.has(o.id) || o.status === 'Refunded'
    if (tab === 'Processing') return ['Pending', 'Confirmed', 'Processing', 'Available'].includes(o.status)
    if (tab === 'Shipped') return ['Shipped', 'Out for Delivery'].includes(o.status)
    if (tab === 'Delivered') return o.status === 'Delivered'
    if (tab === 'Cancelled') return ['Cancelled', 'Refunded'].includes(o.status)
    return true
  })

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/profile')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">My Orders</h1>
          <span className="h-10 w-10" />
        </div>
        <div className="no-scrollbar -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-2">
          {(['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunds'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${tab === t ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-brand"><Package className="h-6 w-6" strokeWidth={1.6} /></div>
            <p className="mt-4 font-serif text-[20px] text-ink">No {tab.toLowerCase()} orders</p>
            <div className="mt-5"><PrimaryButton onClick={() => navigate('/shop')}>Browse Shop</PrimaryButton></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((o) => (
              <button key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="tap rounded-card border border-border bg-surface p-3.5 text-left">
                <div className="flex items-center gap-3">
                  <img src={o.items[0].cover} alt="" className="h-12 w-12 rounded-[9px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[14.5px] leading-tight text-ink">{o.items[0].title}{o.items.length > 1 ? ` +${o.items.length - 1}` : ''}</p>
                    <p className="truncate text-[12px] text-muted">{o.items[0].sellerName} · {fmtDate(o.createdAt)}</p>
                  </div>
                  <StatusBadge tone={tone(o.status)}>{o.status}</StatusBadge>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[12px] text-muted">
                  <span className="font-mono">{o.orderId}</span>
                  <span className="flex items-center gap-1 font-semibold text-ink">{inr(o.amount)} <ChevronRight className="h-4 w-4 text-muted" /></span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}
