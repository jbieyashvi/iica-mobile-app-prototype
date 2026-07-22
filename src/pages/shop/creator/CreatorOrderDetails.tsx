import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Truck, X } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import StatusBadge from '../../../components/StatusBadge'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import { useShop } from '../../../state/ShopContext'
import { inr, creatorEarnings } from '../../../shop/pricing'

export default function CreatorOrderDetails() {
  const { orderId } = useParams()
  const { orders, refunds, updateOrderStatus, setRefundStatus } = useShop()
  const [courier, setCourier] = useState('')
  const [tracking, setTracking] = useState('')
  const [rejectSheet, setRejectSheet] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [toast, setToast] = useState('')
  const o = orders.find((x) => x.id === orderId)
  if (!o) return <BackHeader title="Order" />
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const refund = refunds.find((r) => r.orderId === o.id)
  const earn = o.items.reduce((s, i) => s + creatorEarnings(i.price * i.qty), 0)

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Order" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="flex items-center justify-between">
          <div><p className="font-mono text-[13px] font-semibold text-ink">{o.orderId}</p><p className="text-[12px] text-muted">{o.buyerName} · {o.buyerEmail}</p></div>
          <StatusBadge tone={o.status === 'Delivered' || o.status === 'Available' ? 'success' : o.status === 'Refunded' ? 'error' : 'warning'}>{o.status}</StatusBadge>
        </div>

        <div className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
          {o.items.map((it) => (
            <div key={it.productId} className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-0">
              <img src={it.cover} alt="" className="h-11 w-11 rounded-[8px] object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold text-ink">{it.title}</p><p className="text-[11.5px] text-muted">{it.type} · Qty {it.qty}</p></div>
              <span className="text-[13px] font-bold text-ink">{inr(it.price * it.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-1 rounded-card border border-border bg-surface p-4 text-[13px]">
          <div className="flex justify-between"><span className="text-muted">Payment</span><span className="font-semibold text-success">Paid</span></div>
          <div className="flex justify-between"><span className="text-muted">Your earnings</span><span className="font-bold text-brand">{inr(earn)}</span></div>
        </div>

        {o.hasPhysical && o.address && <div className="mt-3 rounded-card border border-border bg-surface p-4 text-[12.5px] text-muted"><p className="mb-1 text-[13px] font-semibold text-ink">Ship to</p>{o.address.name}, {o.address.line}, {o.address.city}, {o.address.state} {o.address.postal} · {o.address.phone}</div>}
        {!o.hasPhysical && <p className="mt-3 flex items-center gap-2 rounded-control bg-surface px-3.5 py-3 text-[12.5px] text-muted ring-1 ring-border"><Check className="h-4 w-4 text-success" /> Digital delivery — access granted automatically.</p>}

        {/* refund review */}
        {refund && refund.status !== 'Refunded' && refund.status !== 'Rejected' && (
          <div className="mt-4 rounded-card border border-warning/30 bg-[#F7F0E4] p-4">
            <p className="text-[13px] font-semibold text-ink">Refund request · {refund.requestType}</p>
            <p className="mt-0.5 text-[12.5px] text-[#7a5412]">{refund.reason} — {refund.description}</p>
            <div className="mt-3 flex gap-2.5">
              <PrimaryButton full onClick={() => { setRefundStatus(refund.id, 'Refunded'); flash('Refund approved') }}>Approve</PrimaryButton>
              <SecondaryButton onClick={() => setRejectSheet(true)} className="min-w-[100px] !text-error">Reject</SecondaryButton>
            </div>
            <button onClick={() => flash('Escalated to IICA admin')} className="tap mt-2 w-full text-[12px] font-semibold text-muted">Escalate to Admin</button>
          </div>
        )}

        {/* seller physical actions */}
        {o.hasPhysical && !refund && o.status !== 'Delivered' && o.status !== 'Refunded' && (
          <div className="mt-5 flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold text-ink">Fulfilment</p>
            {o.status === 'Confirmed' && <PrimaryButton full onClick={() => { updateOrderStatus(o.id, 'Processing'); flash('Marked processing') }}>Mark Processing</PrimaryButton>}
            {(o.status === 'Confirmed' || o.status === 'Processing') && (
              <div className="rounded-card border border-border bg-surface p-3">
                <div className="grid grid-cols-2 gap-2"><TextField label="Courier" value={courier} onChange={setCourier} placeholder="e.g. BlueDart" /><TextField label="Tracking #" value={tracking} onChange={setTracking} /></div>
                <div className="mt-3"><PrimaryButton full disabled={!courier || !tracking} onClick={() => { updateOrderStatus(o.id, 'Shipped', { courier, tracking }); flash('Marked shipped') }}><Truck className="h-4 w-4" /> Mark Shipped</PrimaryButton></div>
              </div>
            )}
            {o.status === 'Shipped' && <PrimaryButton full onClick={() => { updateOrderStatus(o.id, 'Delivered'); flash('Marked delivered') }}>Mark Delivered</PrimaryButton>}
          </div>
        )}
      </div>

      {rejectSheet && refund && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setRejectSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[20px] text-ink">Reject refund</h3><button aria-label="Close" onClick={() => setRejectSheet(false)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted"><X className="h-5 w-5" /></button></div>
            <TextArea label="Reason (required)" value={rejectReason} onChange={setRejectReason} maxLength={200} rows={3} placeholder="Explain why" />
            <div className="mt-4"><button disabled={!rejectReason.trim()} onClick={() => { setRefundStatus(refund.id, 'Rejected'); setRejectSheet(false); flash('Refund rejected') }} className="tap min-h-[48px] w-full rounded-control bg-error text-[15px] font-semibold text-white disabled:opacity-50">Reject Request</button></div>
          </div>
        </div>
      )}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
