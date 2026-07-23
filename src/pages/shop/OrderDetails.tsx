import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2, BookOpen, Play, FileText, MessageSquare, LifeBuoy, Truck, Check, ChevronRight, ShieldQuestion,
} from 'lucide-react'
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
const TYPE_LABEL: Record<string, string> = { Masterclass: 'Masterclass', Digital: 'Digital Audio Pack', Physical: 'Physical Product' }

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, refunds } = useShop()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  // Always open at the top — never under the sticky header.
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }) }, [orderId])

  const o = orders.find((x) => x.id === orderId)
  if (!o) return <BackHeader title="Order Details" fallback="/orders" />

  const refund = refunds.find((r) => r.orderId === o.id)
  const item = o.items[0]
  const isPhysical = o.hasPhysical
  const isMasterclass = !isPhysical && o.items.some((i) => i.type === 'Masterclass')

  const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0)
  const fee = Math.max(0, o.amount - subtotal)
  const cur = stepIndex(o.status)

  const statusLine = isPhysical
    ? 'Your order is on its way.'
    : isMasterclass
      ? 'Your masterclass is ready to watch.'
      : 'Your digital purchase is ready to access.'

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Order Details" fallback="/orders" />
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-4">
        {/* 1 · Order status */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-6 w-6" strokeWidth={1.9} /></div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-[21px] leading-tight text-ink">Order completed</h1>
              <StatusBadge tone={o.status === 'Cancelled' || o.status === 'Refunded' ? 'error' : o.status === 'Delivered' || o.status === 'Available' ? 'success' : 'warning'}>{o.status}</StatusBadge>
            </div>
            <p className="mt-0.5 text-[13px] text-muted">{statusLine}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-control border border-border bg-surface px-3.5 py-2.5 text-[12.5px]">
          <span className="text-muted">Order ID</span>
          <span className="font-mono font-semibold text-ink">{o.orderId}</span>
        </div>
        <p className="mt-1.5 text-[12px] text-muted">Purchased on {fmtDate(o.createdAt)}</p>

        {/* 2 · Purchased item */}
        <Section title="Purchased item">
          <button
            onClick={() => item && navigate(`/product/${item.productId}`)}
            className="tap flex w-full items-center gap-3 rounded-card border border-border bg-surface p-3 text-left hover:border-ink/20"
          >
            <img src={item?.cover} alt="" className="h-14 w-14 shrink-0 rounded-[10px] object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">{item?.title}</p>
              <p className="truncate text-[12px] text-muted">{item?.sellerName}</p>
              <p className="mt-0.5 text-[11.5px] text-muted">{TYPE_LABEL[item?.type ?? 'Digital']}{item?.variantName ? ` · ${item.variantName}` : ''} · {inr(item?.price ?? 0)}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
          </button>
        </Section>

        {/* 3 · Access */}
        {isPhysical ? (
          <Section title="Delivery">
            <div className="rounded-card border border-border bg-surface p-4">
              <div className="flex flex-col">
                {PHYSICAL_STEPS.map((step, i) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i <= cur ? 'bg-brand text-white' : 'border border-border bg-surface text-muted'}`}>{i <= cur ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-muted" />}</span>
                      {i < PHYSICAL_STEPS.length - 1 && <span className={`my-0.5 w-px flex-1 ${i < cur ? 'bg-brand/40' : 'bg-border'}`} />}
                    </div>
                    <div className={`pb-4 ${i === PHYSICAL_STEPS.length - 1 ? 'pb-0' : ''}`}><p className={`text-[13px] font-semibold ${i <= cur ? 'text-ink' : 'text-muted'}`}>{step}</p></div>
                  </div>
                ))}
              </div>
              {o.tracking && <div className="mt-2 border-t border-border pt-3 text-[12.5px]"><span className="text-muted">Courier</span> <span className="font-semibold text-ink">{o.courier}</span> · <span className="font-mono text-ink">{o.tracking}</span></div>}
            </div>
            {o.address && <div className="mt-3 rounded-card border border-border bg-surface p-4 text-[12.5px] text-muted"><p className="mb-1 text-[13px] font-semibold text-ink">Delivery address</p>{o.address.name}, {o.address.line}, {o.address.city}, {o.address.state} {o.address.postal}</div>}
            <div className="mt-3"><PrimaryButton full onClick={() => flash('Tracking: ' + (o.tracking ?? 'pending'))}><Truck className="h-4 w-4" /> Track Order</PrimaryButton></div>
          </Section>
        ) : (
          <Section title="Access">
            {isMasterclass ? (
              <PrimaryButton full onClick={() => navigate(`/library/${item?.productId}`)}><Play className="h-4 w-4" /> Start Masterclass</PrimaryButton>
            ) : (
              <PrimaryButton full onClick={() => navigate('/library')}><BookOpen className="h-4 w-4" /> Open in My Library</PrimaryButton>
            )}
            <p className="mt-2 text-center text-[12px] text-muted">Your files are available anytime in My Library.</p>
            {isMasterclass && <div className="mt-2"><SecondaryButton full onClick={() => navigate('/library')}><BookOpen className="h-4 w-4" /> Open My Library</SecondaryButton></div>}
          </Section>
        )}

        {/* 4 · Payment summary */}
        <Section title="Payment summary">
          <div className="rounded-card border border-border bg-surface p-4">
            <Row label="Item subtotal" value={inr(subtotal)} />
            {fee > 0 && <Row label="Platform fee & tax" value={inr(fee)} />}
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2.5">
              <span className="text-[13.5px] font-semibold text-ink">Total paid</span>
              <span className="text-[15px] font-bold text-ink">{inr(o.amount)}</span>
            </div>
            <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-[12.5px]">
              <div className="flex justify-between"><span className="text-muted">Payment status</span><span className="font-semibold text-success">Paid</span></div>
              <div className="flex justify-between"><span className="text-muted">Payment method</span><span className="font-semibold text-ink">UPI · demo@upi</span></div>
              <div className="flex justify-between"><span className="text-muted">Transaction ID</span><span className="font-mono text-ink">TXN-••••{o.orderId.slice(-4)}</span></div>
            </div>
          </div>
        </Section>

        {/* 5 · Order actions */}
        <Section title="Order actions">
          <div className="overflow-hidden rounded-card border border-border bg-surface">
            <ActionRow icon={<FileText className="h-[18px] w-[18px] text-brand" />} label="Download Invoice" onClick={() => flash('Invoice downloaded (prototype)')} />
            <ActionRow icon={<MessageSquare className="h-[18px] w-[18px] text-brand" />} label="Contact Seller" onClick={() => flash('Message sent (prototype)')} />
            <ActionRow icon={<LifeBuoy className="h-[18px] w-[18px] text-brand" />} label="Get Help" onClick={() => flash('Support request opened (prototype)')} last />
          </div>
        </Section>

        {/* 6 · Need help / refund */}
        {!refund && o.status !== 'Cancelled' && o.status !== 'Refunded' && (
          <Section title="Need help with this purchase?">
            <button onClick={() => navigate(`/refunds/${o.id}/request`)} className="tap flex w-full items-center gap-3 rounded-card border border-border bg-surface p-3.5 text-left hover:border-ink/20">
              <ShieldQuestion className="h-5 w-5 shrink-0 text-muted" />
              <span className="flex-1 text-[14px] font-semibold text-ink">{isPhysical ? 'Request Return or Refund' : 'Request a Refund'}</span>
              <ChevronRight className="h-5 w-5 text-muted" />
            </button>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{isPhysical ? 'Eligible items may be returned or refunded per IICA’s policy.' : 'Digital purchases may be eligible for a refund according to IICA’s refund policy.'}</p>
          </Section>
        )}
        {refund && <div className="mt-4 rounded-card border border-warning/30 bg-[#F7F0E4] p-3.5"><p className="text-[13px] font-semibold text-ink">Refund {refund.status}</p><p className="mt-0.5 text-[12.5px] text-[#7a5412]">{refund.requestType} · {refund.reason}</p></div>}

        {/* 7 · Navigation */}
        <div className="mt-7 border-t border-border pt-5">
          <SecondaryButton full onClick={() => navigate('/orders')}>View All Orders</SecondaryButton>
          <div className="mt-2.5 flex items-center justify-center gap-5">
            <button onClick={() => navigate('/shop')} className="tap min-h-[44px] text-[13px] font-semibold text-muted hover:text-ink">Continue Shopping</button>
            <button onClick={() => navigate('/home')} className="tap min-h-[44px] text-[13px] font-semibold text-muted hover:text-ink">Go to Home</button>
          </div>
        </div>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6"><h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-muted">{title}</h2>{children}</section>
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between py-0.5 text-[13px]"><span className="text-muted">{label}</span><span className="font-semibold text-ink">{value}</span></div>
}
function ActionRow({ icon, label, onClick, last }: { icon: React.ReactNode; label: string; onClick: () => void; last?: boolean }) {
  return (
    <button onClick={onClick} className={`tap flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-black/[0.015] ${last ? '' : 'border-b border-border'}`}>
      {icon}
      <span className="flex-1 text-[13.5px] font-semibold text-ink">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted" />
    </button>
  )
}
