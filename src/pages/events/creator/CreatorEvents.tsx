import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, ChevronRight, Ticket as TicketIcon, Users, IndianRupee, CalendarDays } from 'lucide-react'
import { useEvents } from '../../../state/EventsContext'
import { usePortfolio } from '../../../state/PortfolioContext'
import { EventItem } from '../../../events/types'
import BottomNavigation from '../../../components/BottomNavigation'
import StatusBadge from '../../../components/StatusBadge'
import PrimaryButton from '../../../components/PrimaryButton'
import { fmtDate, inr } from '../../../events/format'

type Tab = 'Upcoming' | 'Drafts' | 'Past' | 'Cancelled'
const TODAY = '2026-07-22'

export default function CreatorEvents() {
  const navigate = useNavigate()
  const { events, attendeesFor, resetDraft } = useEvents()
  const { portfolio } = usePortfolio()
  const [tab, setTab] = useState<Tab>('Upcoming')

  const mine = useMemo(
    () => events.filter((e) => e.createdByMe || e.organiserId === portfolio.slug || e.organiserId === 'abhishek-singh-chouhan'),
    [events, portfolio.slug],
  )

  const ticketsSold = (e: EventItem) => e.paid ? e.tickets.reduce((s, t) => s + t.sold, 0) : attendeesFor(e.id).reduce((s, a) => s + a.qty, 0)
  const revenue = (e: EventItem) => e.tickets.reduce((s, t) => s + t.sold * t.price, 0)

  const summary = {
    total: mine.length,
    upcoming: mine.filter((e) => e.status === 'published' && e.startDate >= TODAY).length,
    sold: mine.reduce((s, e) => s + (e.paid ? ticketsSold(e) : 0), 0),
    revenue: mine.reduce((s, e) => s + revenue(e), 0),
    free: mine.reduce((s, e) => s + (!e.paid ? ticketsSold(e) : 0), 0),
  }

  const filtered = mine.filter((e) => {
    if (tab === 'Drafts') return e.status === 'draft'
    if (tab === 'Cancelled') return e.status === 'cancelled'
    if (e.status !== 'published') return false
    return tab === 'Upcoming' ? e.startDate >= TODAY : e.startDate < TODAY
  })

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/profile')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">My Events</h1>
          <button onClick={() => { resetDraft(); navigate('/events/create/details', { state: { from: '/creator/events', source: 'creator-events' } }) }} aria-label="Create event" className="tap flex h-10 w-10 items-center justify-center rounded-control text-brand hover:bg-black/[0.04]"><Plus className="h-6 w-6" /></button>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        {/* summary */}
        <div className="grid grid-cols-2 gap-2.5">
          <Stat icon={<CalendarDays className="h-4 w-4" />} label="Upcoming" value={String(summary.upcoming)} />
          <Stat icon={<TicketIcon className="h-4 w-4" />} label="Tickets sold" value={String(summary.sold)} />
          <Stat icon={<IndianRupee className="h-4 w-4" />} label="Revenue" value={inr(summary.revenue)} />
          <Stat icon={<Users className="h-4 w-4" />} label="Free regs" value={String(summary.free)} />
        </div>

        {/* tabs */}
        <div className="mt-4 flex gap-1 rounded-control bg-surface p-1">
          {(['Upcoming', 'Drafts', 'Past', 'Cancelled'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tap flex-1 rounded-[7px] py-1.5 text-[12px] font-semibold ${tab === t ? 'bg-brand text-white' : 'text-muted'}`}>{t}</button>
          ))}
        </div>

        {/* list */}
        <div className="mt-4 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center">
              <p className="text-[13px] text-muted">No {tab.toLowerCase()} events.</p>
              {tab !== 'Cancelled' && <div className="mt-4 flex justify-center"><PrimaryButton onClick={() => { resetDraft(); navigate('/events/create/details', { state: { from: '/creator/events', source: 'creator-events' } }) }}><Plus className="h-4 w-4" /> Create Event</PrimaryButton></div>}
            </div>
          ) : filtered.map((e) => (
            <button key={e.id} onClick={() => navigate(`/creator/events/${e.id}`)} className="tap overflow-hidden rounded-card border border-border bg-surface text-left">
              <div className="flex items-stretch gap-3 p-3">
                <img src={e.cover} alt="" className="h-[64px] w-[64px] shrink-0 rounded-[9px] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[15px] leading-tight text-ink">{e.title}</p>
                  <p className="mt-0.5 text-[12px] text-muted">{fmtDate(e.startDate)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <StatusBadge tone={e.status === 'cancelled' ? 'error' : e.status === 'draft' ? 'warning' : 'success'}>{e.status === 'published' ? 'Live' : e.status}</StatusBadge>
                    {e.paid ? <StatusBadge tone="neutral">Paid</StatusBadge> : <StatusBadge tone="success">Free</StatusBadge>}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 self-center text-muted" />
              </div>
              <div className="flex divide-x divide-border border-t border-border text-center">
                <Mini label={e.paid ? 'Sold' : 'Regs'} value={String(ticketsSold(e))} />
                <Mini label="Capacity" value={String(e.capacity || e.tickets.reduce((s, t) => s + t.quantity, 0))} />
                <Mini label="Revenue" value={e.paid ? inr(revenue(e)) : 'Free'} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-surface p-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand-soft text-brand-dark">{icon}</span>
      <p className="mt-2 font-serif text-[20px] leading-none text-ink">{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
    </div>
  )
}
function Mini({ label, value }: { label: string; value: string }) {
  return <div className="flex-1 py-2"><p className="text-[13px] font-bold text-ink">{value}</p><p className="text-[10.5px] uppercase tracking-wide text-muted">{label}</p></div>
}
