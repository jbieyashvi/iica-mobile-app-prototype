import BackHeader from '../../../components/BackHeader'
import StatusBadge from '../../../components/StatusBadge'
import { useShop } from '../../../state/ShopContext'
import { inr } from '../../../shop/pricing'
import { fmtDate } from '../../../events/format'
import { PayoutStatus } from '../../../shop/types'

const tone = (s: PayoutStatus) => s === 'Paid' ? 'success' : s === 'Failed' ? 'error' : 'warning'

export default function CreatorPayouts() {
  const { payouts } = useShop()
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Payouts" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-[13px] font-semibold text-ink">Bank account</p>
          <p className="mt-1 text-[12.5px] text-muted">HDFC Bank · •••• 4821 · Reshma Patra</p>
          <p className="mt-2 text-[11.5px] text-muted">Payouts are processed on the 1st and 15th of each month (prototype).</p>
        </div>

        <h2 className="mb-2.5 mt-6 font-serif text-[18px] text-ink">Payout history</h2>
        <div className="flex flex-col gap-3">
          {payouts.map((p) => (
            <div key={p.id} className="rounded-card border border-border bg-surface p-3.5">
              <div className="flex items-center justify-between">
                <div><p className="font-mono text-[13px] font-semibold text-ink">{p.id.toUpperCase()}</p><p className="text-[12px] text-muted">{fmtDate(p.date)} · {p.orders} orders</p></div>
                <div className="text-right"><p className="text-[15px] font-bold text-ink">{inr(p.amount)}</p><div className="mt-1"><StatusBadge tone={tone(p.status)}>{p.status}</StatusBadge></div></div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed text-muted">Payout and bank data shown here is prototype sample data only.</p>
      </div>
    </div>
  )
}
