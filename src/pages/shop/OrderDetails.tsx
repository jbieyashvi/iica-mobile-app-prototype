import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2, BookOpen, Play, FileText, Truck, Check, ChevronRight, Send, UserPlus,
} from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useShop } from '../../state/ShopContext'
import { useAuth } from '../../state/AuthContext'
import { inr } from '../../shop/pricing'
import { fmtDate } from '../../events/format'

// Customer-facing delivery is a simple 3-stage flow. Removed statuses
// (Processing, Out for Delivery) collapse into the nearest visible stage.
const PHYSICAL_STEPS = ['Order Confirmed', 'Shipped', 'Delivered']
const stepIndex = (s: string) => {
  const map: Record<string, number> = { Pending: 0, Confirmed: 0, Processing: 0, Shipped: 1, 'Out for Delivery': 1, Delivered: 2 }
  return map[s] ?? 0
}
const PAY_METHOD = 'UPI · demo@upi'
const TYPE_LABEL: Record<string, string> = { Masterclass: 'Masterclass', Digital: 'Digital Audio Pack', Physical: 'Physical Product' }

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders } = useShop()
  const { state } = useAuth()
  const isGuest = !state.authed
  const scrollRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  // Always open at the top — never under the sticky header.
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }) }, [orderId])

  const o = orders.find((x) => x.id === orderId)
  if (!o) return <BackHeader title="Order Details" fallback="/orders" />

  const item = o.items[0]
  const isPhysical = o.hasPhysical
  const isMasterclass = !isPhysical && o.items.some((i) => i.type === 'Masterclass')

  const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0)
  const fee = Math.max(0, o.amount - subtotal)
  const cur = stepIndex(o.status)
  const txnId = `TXN-XXXX${o.orderId.slice(-4)}`
  const statusLabel = o.status === 'Cancelled' || o.status === 'Refunded'
    ? o.status
    : isPhysical ? PHYSICAL_STEPS[cur] : o.status

  // Functional prototype invoice: a self-contained, printable HTML file.
  const downloadInvoice = () => {
    const rows = o.items.map((i) => `<tr><td>${i.title}</td><td>${i.sellerName}</td><td class="r">${i.qty}</td><td class="r">${inr(i.price * i.qty)}</td></tr>`).join('')
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>IICA Invoice ${o.orderId}</title>
<style>
  *{box-sizing:border-box} body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#191718;margin:0;padding:32px;background:#fff}
  .wrap{max-width:720px;margin:0 auto}
  .hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #9D2567;padding-bottom:16px}
  .logo{display:flex;align-items:center;gap:10px}
  .mark{width:40px;height:40px;border-radius:9px;background:#9D2567;color:#fff;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif}
  .brand{font-family:Georgia,serif;font-size:22px} .tag{font-size:11px;color:#8a8580;letter-spacing:.12em;text-transform:uppercase}
  h1{font-family:Georgia,serif;font-size:20px;margin:24px 0 4px} .muted{color:#8a8580;font-size:12px}
  .grid{display:flex;gap:32px;margin-top:16px;flex-wrap:wrap} .grid>div{flex:1;min-width:180px}
  .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8a8580;margin-bottom:4px}
  table{width:100%;border-collapse:collapse;margin-top:24px;font-size:13px}
  th{text-align:left;border-bottom:1px solid #e7e3df;padding:8px 6px;font-size:11px;text-transform:uppercase;color:#8a8580}
  td{padding:9px 6px;border-bottom:1px solid #f0ece8} .r{text-align:right}
  .tot{margin-top:16px;margin-left:auto;width:260px;font-size:13px}
  .tot .row{display:flex;justify-content:space-between;padding:4px 0}
  .tot .grand{border-top:2px solid #191718;margin-top:6px;padding-top:8px;font-weight:700;font-size:15px}
  .ft{margin-top:28px;border-top:1px solid #e7e3df;padding-top:12px;font-size:11px;color:#8a8580}
</style></head><body><div class="wrap">
  <div class="hd">
    <div class="logo"><div class="mark">II</div><div><div class="brand">IICA</div><div class="tag">International Indian Culture &amp; Arts</div></div></div>
    <div style="text-align:right"><div class="lbl">Invoice</div><div style="font-family:monospace;font-weight:700">INV-${o.orderId}</div></div>
  </div>
  <h1>Tax Invoice</h1>
  <div class="grid">
    <div><div class="lbl">Order ID</div><div style="font-family:monospace">${o.orderId}</div>
      <div class="lbl" style="margin-top:10px">Purchase date</div><div>${fmtDate(o.createdAt)}</div></div>
    <div><div class="lbl">Billed to</div><div>${o.buyerName}</div><div class="muted">${o.buyerEmail}</div>
      ${o.address ? `<div class="muted" style="margin-top:6px">${o.address.line}, ${o.address.city}, ${o.address.state} ${o.address.postal}</div>` : ''}</div>
  </div>
  <table><thead><tr><th>Item</th><th>Seller</th><th class="r">Qty</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="tot">
    <div class="row"><span>Item subtotal</span><span>${inr(subtotal)}</span></div>
    ${fee > 0 ? `<div class="row"><span>Platform fee &amp; tax</span><span>${inr(fee)}</span></div>` : ''}
    <div class="row grand"><span>Total paid</span><span>${inr(o.amount)}</span></div>
  </div>
  <div class="ft">Payment method: ${PAY_METHOD} &nbsp;·&nbsp; Transaction ID: ${txnId} &nbsp;·&nbsp; Status: Paid<br/>
  This is a prototype invoice generated by the IICA demo app. No real transaction occurred.</div>
</div></body></html>`
    try {
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `IICA-Invoice-${o.orderId}.html`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      flash('Invoice downloaded')
    } catch { flash('Could not generate invoice') }
  }

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
              <StatusBadge tone={o.status === 'Cancelled' || o.status === 'Refunded' ? 'error' : o.status === 'Delivered' || o.status === 'Available' ? 'success' : 'warning'}>{statusLabel}</StatusBadge>
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
            {isGuest ? (
              <>
                <PrimaryButton full onClick={() => flash('Opening your purchase (prototype)')}>
                  {isMasterclass ? <><Play className="h-4 w-4" /> Access Your Masterclass</> : <><BookOpen className="h-4 w-4" /> Access Your Purchase</>}
                </PrimaryButton>
                <p className="mt-2 text-center text-[12px] text-muted">Access is linked to your email and Order ID.{isMasterclass ? ' A free account saves your progress across devices.' : ''}</p>
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  <SecondaryButton onClick={() => flash('Access link sent (prototype)')}><Send className="h-4 w-4" /> Send Access Link</SecondaryButton>
                  <SecondaryButton onClick={() => navigate('/signup')}><UserPlus className="h-4 w-4" /> Create Account</SecondaryButton>
                </div>
              </>
            ) : isMasterclass ? (
              <>
                <PrimaryButton full onClick={() => navigate(`/library/${item?.productId}`)}><Play className="h-4 w-4" /> Start Masterclass</PrimaryButton>
                <p className="mt-2 text-center text-[12px] text-muted">Your masterclass is saved in My Library.</p>
                <div className="mt-2"><SecondaryButton full onClick={() => navigate('/library')}><BookOpen className="h-4 w-4" /> Open My Library</SecondaryButton></div>
              </>
            ) : (
              <>
                <PrimaryButton full onClick={() => navigate('/library')}><BookOpen className="h-4 w-4" /> Open in My Library</PrimaryButton>
                <p className="mt-2 text-center text-[12px] text-muted">Your files are available anytime in My Library.</p>
              </>
            )}
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
            <ActionRow icon={<FileText className="h-[18px] w-[18px] text-brand" />} label="Download Invoice" onClick={downloadInvoice} last />
          </div>
        </Section>

        {/* 6 · Navigation */}
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
