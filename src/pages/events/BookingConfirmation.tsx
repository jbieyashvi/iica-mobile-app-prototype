import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, CalendarPlus, Share2, MapPin, Ticket as TicketIcon } from 'lucide-react'
import { useEvents } from '../../state/EventsContext'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { fmtDate, inr } from '../../events/format'

export default function BookingConfirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { bookings, getEvent } = useEvents()
  const [toast, setToast] = useState('')

  const bookingId = (location.state as { bookingId?: string })?.bookingId
  const booking = bookings.find((b) => b.id === bookingId) ?? bookings.find((b) => b.eventId === id)
  const ev = getEvent(id)

  if (!booking) return <BackHeader title="Confirmation" />

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }
  const pending = booking.status === 'Pending Approval'

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Confirmation" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <div className="flex flex-col items-center pt-6 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${pending ? 'bg-[#F7F0E4] text-warning' : 'bg-[#EAF3EE] text-success'}`}>
            <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
          </div>
          <h1 className="mt-5 font-serif text-[28px] leading-tight text-ink">{pending ? 'Registration received' : "You're going"}</h1>
          <p className="mt-2 text-[14px] text-muted">{pending ? 'Your registration is awaiting organiser approval.' : 'Your booking is confirmed. See you there.'}</p>
          <div className="mt-3">{pending ? <StatusBadge tone="warning">Pending Approval</StatusBadge> : <StatusBadge tone="success">Confirmed</StatusBadge>}</div>
        </div>

        <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
          <img src={booking.cover} alt="" className="h-28 w-full object-cover" />
          <div className="p-4">
            <p className="font-serif text-[18px] leading-tight text-ink">{booking.eventTitle}</p>
            <div className="mt-3 flex flex-col divide-y divide-border">
              <Row label="Date" value={fmtDate(booking.eventDate)} />
              <Row label={booking.format === 'Online' ? 'Format' : 'Venue'} value={booking.format === 'Online' ? 'Online' : (ev?.city ?? '—')} />
              <Row label="Order ID" value={booking.orderId} mono />
              <Row label="Tickets" value={`${booking.qty} · ${booking.ticketTypeName}`} />
              <Row label="Amount" value={booking.paid ? inr(booking.amount) : 'Free'} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => navigate(`/my-tickets/${booking.id}`)}><TicketIcon className="h-4 w-4" /> View Ticket</PrimaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => flash('Added to calendar (prototype)')}><CalendarPlus className="h-4 w-4" /> Add to Calendar</SecondaryButton>
            <SecondaryButton onClick={() => navigate(`/artist/${ev?.organiserId ?? ''}/share`)}><Share2 className="h-4 w-4" /> Share Event</SecondaryButton>
          </div>
          {booking.format !== 'Online' && (
            <SecondaryButton full onClick={() => flash('Opening directions (prototype)')}><MapPin className="h-4 w-4" /> Directions</SecondaryButton>
          )}
          <button onClick={() => navigate('/events')} className="tap mt-1 min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Return to Events</button>
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className={`text-[13px] font-semibold text-ink ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
