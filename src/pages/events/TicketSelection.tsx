import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEvents } from '../../state/EventsContext'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import StatusBadge from '../../components/StatusBadge'
import { inr, remaining, fmtDate } from '../../events/format'
import { PurchaseSelection } from '../../state/EventsContext'

export default function TicketSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent } = useEvents()
  const ev = getEvent(id)
  const [qty, setQty] = useState<Record<string, number>>({})

  if (!ev) return <BackHeader title="Tickets" />

  const setQ = (tid: string, n: number, max: number) => setQty((p) => ({ ...p, [tid]: Math.max(0, Math.min(max, n)) }))
  const selections: PurchaseSelection[] = ev.tickets
    .filter((t) => (qty[t.id] ?? 0) > 0)
    .map((t) => ({ ticketTypeId: t.id, ticketTypeName: t.name, qty: qty[t.id], unitPrice: t.price }))
  const subtotal = selections.reduce((s, x) => s + x.qty * x.unitPrice, 0)
  const totalQty = selections.reduce((s, x) => s + x.qty, 0)

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Select Tickets" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6">
        <div className="mt-2 rounded-card border border-border bg-surface p-3">
          <p className="font-serif text-[16px] leading-tight text-ink">{ev.title}</p>
          <p className="mt-0.5 text-[12.5px] text-muted">{fmtDate(ev.startDate)} · {ev.city}</p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {ev.tickets.map((t) => {
            const left = remaining(t)
            const soldOut = left === 0
            const max = Math.min(t.maxPerBuyer, left)
            const n = qty[t.id] ?? 0
            return (
              <div key={t.id} className={`rounded-card border p-4 ${soldOut ? 'border-border bg-surface opacity-70' : 'border-border bg-surface'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-ink">{t.name}</p>
                    {t.description && <p className="mt-0.5 text-[12.5px] text-muted">{t.description}</p>}
                    {t.benefits && <p className="mt-1 text-[12px] text-brand-dark">Includes: {t.benefits}</p>}
                    <p className="mt-1.5 text-[11.5px] font-medium text-muted">Sales close {fmtDate(t.salesEnd)}</p>
                  </div>
                  <span className="shrink-0 text-[16px] font-bold text-ink">{inr(t.price)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  {soldOut ? <StatusBadge tone="error">Sold Out</StatusBadge> : <span className="text-[11.5px] font-medium text-muted">{left} left · max {t.maxPerBuyer}</span>}
                  {!soldOut && (
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQ(t.id, n - 1, max)} disabled={n <= 0} className="tap flex h-9 w-9 items-center justify-center rounded-control border border-border text-[18px] text-ink disabled:opacity-40">−</button>
                      <span className="w-6 text-center text-[15px] font-bold text-ink">{n}</span>
                      <button onClick={() => setQ(t.id, n + 1, max)} disabled={n >= max} className="tap flex h-9 w-9 items-center justify-center rounded-control border border-border text-[18px] text-ink disabled:opacity-40">+</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        {totalQty > 0 && (
          <div className="mb-2 flex items-center justify-between text-[13px]">
            <span className="text-muted">{totalQty} ticket{totalQty > 1 ? 's' : ''}</span>
            <span className="font-bold text-ink">{inr(subtotal)}</span>
          </div>
        )}
        <PrimaryButton full disabled={totalQty === 0} onClick={() => navigate(`/events/${ev.id}/checkout`, { state: { selections } })}>
          {totalQty === 0 ? 'Select tickets to continue' : 'Continue to Attendee Details'}
        </PrimaryButton>
      </div>
    </div>
  )
}
