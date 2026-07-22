import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Ticket as TicketIcon, ChevronRight } from 'lucide-react'
import { useEvents } from '../../state/EventsContext'
import { Booking } from '../../events/types'
import BottomNavigation from '../../components/BottomNavigation'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import { fmtDate, inr } from '../../events/format'

type Tab = 'Upcoming' | 'Past' | 'Cancelled'
const TODAY = '2026-07-22'
const cancelledStatuses = ['Cancelled', 'Refunded', 'Event Cancelled']

const tone = (s: Booking['status']) =>
  s === 'Confirmed' ? 'success' : s === 'Pending Approval' || s === 'Waitlisted' ? 'warning' : 'error'

export default function MyTickets() {
  const navigate = useNavigate()
  const { bookings } = useEvents()
  const [tab, setTab] = useState<Tab>('Upcoming')

  const filtered = bookings.filter((b) => {
    if (tab === 'Cancelled') return cancelledStatuses.includes(b.status)
    if (cancelledStatuses.includes(b.status)) return false
    const upcoming = b.eventDate >= TODAY
    return tab === 'Upcoming' ? upcoming : !upcoming
  })

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/profile')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">My Tickets</h1>
          <span className="h-10 w-10" />
        </div>
        <div className="flex gap-1 pb-2">
          {(['Upcoming', 'Past', 'Cancelled'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tap flex-1 rounded-control py-2 text-[13px] font-semibold transition-colors ${tab === t ? 'bg-brand text-white' : 'bg-surface text-muted'}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-brand"><TicketIcon className="h-6 w-6" strokeWidth={1.6} /></div>
            <p className="mt-4 font-serif text-[20px] text-ink">No {tab.toLowerCase()} tickets</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-muted">When you register or book, your tickets appear here.</p>
            <div className="mt-5"><PrimaryButton onClick={() => navigate('/events')}>Browse Events</PrimaryButton></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((b) => (
              <button key={b.id} onClick={() => navigate(`/my-tickets/${b.id}`)} className="tap flex items-stretch gap-3 overflow-hidden rounded-card border border-border bg-surface p-3 text-left">
                <img src={b.cover} alt="" className="h-[68px] w-[68px] shrink-0 rounded-[9px] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[15px] leading-tight text-ink">{b.eventTitle}</p>
                  <p className="mt-0.5 text-[12px] text-muted">{fmtDate(b.eventDate)}</p>
                  <p className="text-[12px] text-muted">{b.qty} · {b.paid ? inr(b.amount) : 'Free'}</p>
                  <div className="mt-1.5"><StatusBadge tone={tone(b.status)}>{b.status}</StatusBadge></div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 self-center text-muted" />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
