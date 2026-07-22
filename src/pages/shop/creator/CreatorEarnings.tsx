import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Wallet } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import { useShop } from '../../../state/ShopContext'
import { usePortfolio } from '../../../state/PortfolioContext'
import { inr, commission, creatorEarnings } from '../../../shop/pricing'

export default function CreatorEarnings() {
  const navigate = useNavigate()
  const { orders, products, payouts } = useShop()
  const { portfolio } = usePortfolio()
  const [range, setRange] = useState('All time')

  const mineIds = new Set(products.filter((p) => p.createdByMe || p.sellerId === portfolio.slug || p.sellerId === 'abhishek-singh-chouhan').map((p) => p.id))
  const myLines = orders.flatMap((o) => o.items.filter((i) => mineIds.has(i.productId)).map((i) => ({ ...i, total: i.price * i.qty })))
  const gross = myLines.reduce((s, i) => s + i.total, 0)
  const comm = commission(gross)
  const net = creatorEarnings(gross)
  const pending = payouts.filter((p) => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0)
  const completed = payouts.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0)

  const byProduct = [...mineIds].map((id) => {
    const prod = products.find((p) => p.id === id)!
    const total = myLines.filter((l) => l.productId === id).reduce((s, l) => s + l.total, 0)
    return { prod, total, units: myLines.filter((l) => l.productId === id).reduce((s, l) => s + l.qty, 0) }
  }).filter((x) => x.total > 0).sort((a, b) => b.total - a.total)

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Earnings" right={<button onClick={() => navigate('/creator/payouts')} aria-label="Payouts" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Wallet className="h-5 w-5" /></button>} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="no-scrollbar -mx-[18px] mb-4 flex gap-1.5 overflow-x-auto px-[18px]">
          {['All time', 'This month', 'Last 30 days', 'This year'].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${range === r ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{r}</button>
          ))}
        </div>

        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-[12px] uppercase tracking-wide text-muted">Net earnings</p>
          <p className="font-serif text-[32px] leading-none text-brand">{inr(net)}</p>
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-[13px]">
            <Row label={`Total sales (${myLines.reduce((s, l) => s + l.qty, 0)} units)`} value={inr(gross)} />
            <Row label="Gross revenue" value={inr(gross)} />
            <Row label="IICA commission" value={`− ${inr(comm)}`} />
            <Row label="Net earnings" value={inr(net)} bold />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-card border border-border bg-surface p-3"><p className="text-[11px] uppercase tracking-wide text-muted">Pending payout</p><p className="mt-1 font-serif text-[20px] text-ink">{inr(pending)}</p></div>
          <button onClick={() => navigate('/creator/payouts')} className="tap rounded-card border border-border bg-surface p-3 text-left"><p className="text-[11px] uppercase tracking-wide text-muted">Completed payouts</p><p className="mt-1 flex items-center gap-1 font-serif text-[20px] text-ink">{inr(completed)} <ChevronRight className="h-4 w-4 text-muted" /></p></button>
        </div>

        <h2 className="mb-2.5 mt-6 font-serif text-[18px] text-ink">By product</h2>
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {byProduct.length === 0 ? <p className="px-4 py-8 text-center text-[13px] text-muted">No sales yet.</p> : byProduct.map(({ prod, total, units }) => (
            <div key={prod.id} className="flex items-center gap-3 px-3.5 py-3">
              <img src={prod.cover} alt="" className="h-10 w-10 rounded-[8px] object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold text-ink">{prod.title}</p><p className="text-[11.5px] text-muted">{units} sold</p></div>
              <span className="text-[13px] font-bold text-ink">{inr(creatorEarnings(total))}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className="flex items-center justify-between"><span className="text-muted">{label}</span><span className={bold ? 'font-bold text-brand' : 'font-semibold text-ink'}>{value}</span></div>
}
