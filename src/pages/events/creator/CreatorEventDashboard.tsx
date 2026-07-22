import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Pencil, Users, Download, ScanLine, MessageSquare, Share2, ExternalLink, IndianRupee, Ban,
} from 'lucide-react'
import { useEvents } from '../../../state/EventsContext'
import BackHeader from '../../../components/BackHeader'
import StatusBadge from '../../../components/StatusBadge'
import SecondaryButton from '../../../components/SecondaryButton'
import TextArea from '../../../components/form/TextArea'
import Checkbox from '../../../components/form/Checkbox'
import { fmtDate, inr } from '../../../events/format'

export default function CreatorEventDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, attendeesFor, loadDraftFrom, cancelEvent } = useEvents()
  const [toast, setToast] = useState('')
  const [cancelSheet, setCancelSheet] = useState(false)
  const [reason, setReason] = useState('')
  const [ack, setAck] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const ev = getEvent(id)
  if (!ev) return <BackHeader title="Event" />
  const attendees = attendeesFor(ev.id)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }

  const sold = ev.paid ? ev.tickets.reduce((s, t) => s + t.sold, 0) : attendees.reduce((s, a) => s + a.qty, 0)
  const capacity = ev.capacity || ev.tickets.reduce((s, t) => s + t.quantity, 0)
  const revenue = ev.tickets.reduce((s, t) => s + t.sold * t.price, 0)
  const pct = capacity ? Math.min(100, Math.round((sold / capacity) * 100)) : 0
  const isCancelled = ev.status === 'cancelled' || cancelled
  const soldLabel = ev.paid ? 'Sales' : 'Registrations'

  const doEdit = () => { loadDraftFrom(ev); navigate('/events/create/details') }
  const confirmCancel = () => { cancelEvent(ev.id); setCancelSheet(false); setCancelled(true); flash('Event cancelled · attendees notified') }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Manage Event" right={
        <button onClick={() => navigate(`/artist/${ev.organiserId}/share`)} aria-label="Share" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Share2 className="h-5 w-5" /></button>
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6">
        <div className="mt-2 flex items-center gap-3">
          <img src={ev.cover} alt="" className="h-14 w-14 rounded-[9px] object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-[17px] leading-tight text-ink">{ev.title}</p>
            <p className="text-[12px] text-muted">{fmtDate(ev.startDate)}</p>
          </div>
          <StatusBadge tone={isCancelled ? 'error' : 'success'}>{isCancelled ? 'Cancelled' : 'Live'}</StatusBadge>
        </div>

        {/* capacity */}
        <div className="mt-5 rounded-card border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ink">{soldLabel}</p>
            <p className="text-[13px] font-bold text-brand">{sold}/{capacity}</p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} /></div>
          <p className="mt-2 text-[11.5px] text-muted">{pct}% of capacity</p>
        </div>

        {/* stats */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-card border border-border bg-surface p-3"><span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand-soft text-brand-dark"><Users className="h-4 w-4" /></span><p className="mt-2 font-serif text-[20px] leading-none text-ink">{attendees.length}</p><p className="mt-1 text-[11px] uppercase tracking-wide text-muted">Attendees</p></div>
          <div className="rounded-card border border-border bg-surface p-3"><span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand-soft text-brand-dark"><IndianRupee className="h-4 w-4" /></span><p className="mt-2 font-serif text-[20px] leading-none text-ink">{ev.paid ? inr(revenue) : 'Free'}</p><p className="mt-1 text-[11px] uppercase tracking-wide text-muted">Revenue</p></div>
        </div>

        {/* trend placeholder */}
        <div className="mt-3 rounded-card border border-border bg-surface p-4">
          <p className="mb-2 text-[13px] font-semibold text-ink">Registration trend</p>
          <div className="flex h-16 items-end gap-1.5">
            {[3, 5, 4, 7, 6, 9, 8].map((h, i) => <div key={i} className="flex-1 rounded-t bg-brand-soft" style={{ height: `${h * 10}%` }} />)}
          </div>
        </div>

        {/* ticket breakdown */}
        {ev.paid && ev.tickets.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-[13px] font-semibold text-ink">Ticket types</p>
            <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
              {ev.tickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-[13.5px] font-semibold text-ink">{t.name}</span>
                  <span className="text-[12.5px] text-muted">{t.sold}/{t.quantity} · {inr(t.sold * t.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* recent attendees */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-ink">Recent attendees</p>
          <button onClick={() => navigate(`/creator/events/${ev.id}/attendees`)} className="text-[12.5px] font-semibold text-brand">View all</button>
        </div>
        <div className="mt-2 flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {attendees.slice(0, 3).map((a) => (
            <div key={a.id} className="flex items-center justify-between px-3.5 py-2.5">
              <div><p className="text-[13.5px] font-semibold text-ink">{a.name}</p><p className="text-[11.5px] text-muted">{a.ticketType} · {a.qty}</p></div>
              <StatusBadge tone={a.approval === 'Confirmed' ? 'success' : a.approval === 'Cancelled' ? 'error' : 'warning'}>{a.approval}</StatusBadge>
            </div>
          ))}
          {attendees.length === 0 && <p className="px-3.5 py-6 text-center text-[13px] text-muted">No attendees yet.</p>}
        </div>

        {/* actions */}
        {!isCancelled && (
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={doEdit}><Pencil className="h-4 w-4" /> Edit</SecondaryButton>
            <SecondaryButton onClick={() => navigate(`/creator/events/${ev.id}/attendees`)}><Users className="h-4 w-4" /> Attendees</SecondaryButton>
            <SecondaryButton onClick={() => flash('Attendee list exported (prototype)')}><Download className="h-4 w-4" /> Export</SecondaryButton>
            <SecondaryButton onClick={() => flash('Scanner coming soon')}><ScanLine className="h-4 w-4" /> Scan</SecondaryButton>
            <SecondaryButton onClick={() => flash('Message sent (prototype)')}><MessageSquare className="h-4 w-4" /> Message</SecondaryButton>
            <SecondaryButton onClick={() => navigate(`/events/${ev.id}`)}><ExternalLink className="h-4 w-4" /> View</SecondaryButton>
          </div>
        )}

        {!isCancelled && (
          <button onClick={() => setCancelSheet(true)} className="tap mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-error/30 bg-surface text-[14px] font-semibold text-error hover:bg-[#F7E9EA]">
            <Ban className="h-4 w-4" /> Cancel Event
          </button>
        )}
        {isCancelled && (
          <div className="mt-4 rounded-card border border-error/30 bg-[#F7E9EA] p-4 text-center">
            <p className="text-[14px] font-semibold text-error">Event cancelled</p>
            <p className="mt-1 text-[12.5px] text-[#7a2b30]">{ev.paid ? 'Refunds are being processed for ticket holders.' : 'Registered attendees have been notified.'}</p>
          </div>
        )}
      </div>

      {/* cancel confirm flow */}
      {cancelSheet && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setCancelSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative max-h-[88%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Cancel “{ev.title}”?</h2>
            <div className="mt-3 flex flex-col gap-2 rounded-card border border-border bg-bg p-3 text-[13px]">
              <div className="flex justify-between"><span className="text-muted">Affected attendees</span><span className="font-semibold text-ink">{attendees.length}</span></div>
              <div className="flex justify-between"><span className="text-muted">Refund implication</span><span className="font-semibold text-ink">{ev.paid ? `${inr(revenue)} to refund` : 'No payments'}</span></div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <TextArea label="Reason for cancellation" value={reason} onChange={setReason} maxLength={300} rows={3} placeholder="Required — shared with attendees" />
              <Checkbox checked={ack} onChange={setAck}>I understand this notifies all attendees and cannot be undone.</Checkbox>
            </div>
            <button
              disabled={!reason.trim() || !ack}
              onClick={confirmCancel}
              className="tap mt-5 min-h-[48px] w-full rounded-control bg-error text-[15px] font-semibold text-white disabled:opacity-50"
            >
              Cancel Event
            </button>
            <button onClick={() => setCancelSheet(false)} className="tap mt-2 min-h-[44px] w-full text-[14px] font-semibold text-muted hover:text-ink">Keep Event</button>
          </div>
        </div>
      )}

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
