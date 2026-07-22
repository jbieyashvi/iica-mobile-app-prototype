import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CalendarPlus, Share2, Download, MessageSquare, Globe, Lock, XCircle,
} from 'lucide-react'
import { useEvents } from '../../state/EventsContext'
import BackHeader from '../../components/BackHeader'
import QrCode from '../../components/portfolio/QrCode'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import { fmtDate, fmtTime, inr } from '../../events/format'

const REASONS = ['Can no longer attend', 'Schedule conflict', 'Bought by mistake', 'Event changed', 'Other']

export default function TicketDetail() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const { bookings, getEvent, cancelBooking, requestRefund } = useEvents()
  const [toast, setToast] = useState('')
  const [sheet, setSheet] = useState(false)
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')

  const booking = bookings.find((b) => b.id === ticketId)
  if (!booking) return <BackHeader title="Ticket" />
  const ev = getEvent(booking.eventId)

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }
  const cancelled = ['Cancelled', 'Refunded', 'Event Cancelled'].includes(booking.status)
  const refundable = booking.paid && ev?.tickets.some((t) => t.refundable) && !cancelled
  const canCancel = !cancelled && (booking.paid ? refundable : true)
  const online = booking.format === 'Online'
  // joining window: reveal if within prototype (always reveal for confirmed for demo)
  const joinReady = booking.status === 'Confirmed'

  const submitRefund = () => {
    if (booking.paid) { cancelBooking(booking.id); requestRefund(booking.id) }
    else cancelBooking(booking.id)
    setSheet(false)
    flash(booking.paid ? 'Refund request submitted' : 'Registration cancelled')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Your Ticket" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6">
        {/* Ticket */}
        <div className="mt-3 overflow-hidden rounded-card border border-border bg-surface">
          <div className="bg-ink px-4 py-3 text-white">
            <p className="font-serif text-[18px] leading-tight">{booking.eventTitle}</p>
            <p className="text-[12px] text-white/70">{fmtDate(booking.eventDate)}{ev ? ` · ${fmtTime(ev.startTime)}` : ''}</p>
          </div>
          <div className="flex flex-col items-center border-b border-dashed border-border py-5">
            {cancelled ? (
              <div className="flex flex-col items-center py-4"><XCircle className="h-10 w-10 text-error" /><p className="mt-2 text-[13px] font-semibold text-error">{booking.status}</p></div>
            ) : (
              <>
                <div className="rounded-[10px] border border-border p-2.5"><QrCode value={`IICA-TKT-${booking.id}`} size={148} /></div>
                <p className="mt-2 font-mono text-[12px] text-muted">{booking.tickets[0]?.id ?? booking.orderId}</p>
              </>
            )}
          </div>
          <div className="p-4">
            <div className="flex flex-col divide-y divide-border">
              <Row label="Attendee" value={booking.buyerName} />
              <Row label="Ticket" value={`${booking.qty} · ${booking.ticketTypeName}`} />
              <Row label="Order ID" value={booking.orderId} mono />
              <Row label="Amount" value={booking.paid ? inr(booking.amount) : 'Free'} />
              <Row label="Status" value={booking.status} badge />
            </div>
          </div>
        </div>

        {/* Online joining */}
        {online && !cancelled && (
          <div className="mt-4 rounded-card border border-border bg-surface p-4">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-ink">{joinReady ? <Globe className="h-4 w-4 text-brand" /> : <Lock className="h-4 w-4 text-muted" />} Online access</div>
            {joinReady ? (
              <>
                <p className="mt-1.5 text-[12.5px] text-muted">Platform: <span className="font-semibold text-ink">{ev?.online?.platform}</span></p>
                <a href={ev?.online?.link} target="_blank" rel="noopener noreferrer" className="mt-3 block"><PrimaryButton full>Join Event</PrimaryButton></a>
                {ev?.online?.instructions && <p className="mt-2 text-[12px] text-muted">{ev.online.instructions}</p>}
              </>
            ) : (
              <p className="mt-1.5 text-[12.5px] text-muted">Joining link becomes available shortly before the event starts.</p>
            )}
          </div>
        )}

        {/* refund status */}
        {booking.refundStatus && (
          <div className="mt-4 rounded-card border border-warning/30 bg-[#F7F0E4] p-3.5">
            <p className="text-[13px] font-semibold text-ink">Refund {booking.refundStatus}</p>
            <p className="mt-0.5 text-[12px] text-[#7a5412]">We'll notify you once the refund is processed to your original payment method.</p>
          </div>
        )}

        {/* actions */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <SecondaryButton onClick={() => flash('Added to calendar (prototype)')}><CalendarPlus className="h-4 w-4" /> Calendar</SecondaryButton>
          <SecondaryButton onClick={() => navigate(`/artist/${ev?.organiserId ?? ''}/share`)}><Share2 className="h-4 w-4" /> Share</SecondaryButton>
          <SecondaryButton onClick={() => flash('Ticket downloaded (prototype)')}><Download className="h-4 w-4" /> Download</SecondaryButton>
          <SecondaryButton onClick={() => flash('Message sent to organiser (prototype)')}><MessageSquare className="h-4 w-4" /> Organiser</SecondaryButton>
        </div>

        {canCancel && (
          <button onClick={() => setSheet(true)} className="tap mt-4 min-h-[48px] w-full rounded-control border border-border bg-surface text-[14px] font-semibold text-error hover:border-error/30">
            {booking.paid ? 'Request Cancellation / Refund' : 'Cancel Registration'}
          </button>
        )}
      </div>

      {sheet && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h2 className="font-serif text-[22px] leading-tight text-ink">{booking.paid ? 'Request refund' : 'Cancel registration'}</h2>
            <p className="mt-1 text-[12.5px] text-muted">{booking.qty} × {booking.ticketTypeName}</p>
            <div className="mt-4 flex flex-col gap-4">
              <SelectField label="Reason" value={reason} onChange={setReason} options={REASONS} />
              <TextArea label="Additional comments" value={comment} onChange={setComment} maxLength={300} rows={3} placeholder="Optional" />
              {booking.paid && (
                <div className="rounded-control border border-border bg-bg p-3 text-[12.5px]">
                  <div className="flex justify-between"><span className="text-muted">Estimated refund</span><span className="font-semibold text-ink">{inr(Math.round(booking.amount * 0.9))}</span></div>
                  <p className="mt-1 text-[11.5px] text-muted">To original payment method · 10% processing fee.</p>
                </div>
              )}
            </div>
            <div className="mt-5"><PrimaryButton full onClick={submitRefund}>Submit Request</PrimaryButton></div>
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono, badge }: { label: string; value: string; mono?: boolean; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-muted">{label}</span>
      {badge ? <StatusBadge tone={value === 'Confirmed' ? 'success' : value.includes('Pending') || value === 'Waitlisted' ? 'warning' : 'error'}>{value}</StatusBadge>
        : <span className={`text-[13px] font-semibold text-ink ${mono ? 'font-mono' : ''}`}>{value}</span>}
    </div>
  )
}
