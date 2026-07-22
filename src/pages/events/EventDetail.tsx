import { useNavigate, useParams } from 'react-router-dom'
import {
  CalendarDays, Clock, MapPin, Globe, Bookmark, BookmarkCheck, Share2, Users,
  Ticket as TicketIcon, ChevronRight, Lock, Info,
} from 'lucide-react'
import { useEvents } from '../../state/EventsContext'
import { useSavedArtists } from '../../state/useSavedArtists'
import { fmtDate, fmtTime, inr, startingPrice, isSoldOut, eventCapacityLeft, remaining } from '../../events/format'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import EventCard from '../../components/events/EventCard'
import { useState } from 'react'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, events, bookingFor } = useEvents()
  const { isSaved, toggle } = useSavedArtists()
  const [toast, setToast] = useState('')

  const ev = getEvent(id)
  if (!ev) return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Event" />
      <div className="flex flex-1 items-center justify-center px-8 text-center">
        <div>
          <p className="font-serif text-[22px] text-ink">Event not found</p>
          <div className="mt-4"><PrimaryButton onClick={() => navigate('/events')}>Browse Events</PrimaryButton></div>
        </div>
      </div>
    </div>
  )

  const saved = isSaved('event:' + ev.id)
  const soldOut = isSoldOut(ev)
  const booking = bookingFor(ev.id)
  const capLeft = eventCapacityLeft(ev)
  const cancelled = ev.status === 'cancelled'
  const similar = events.filter((e) => e.id !== ev.id && e.status === 'published' && e.category === ev.category).slice(0, 4)

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }

  const primaryAction = () => {
    if (booking) return navigate(`/my-tickets/${booking.id}`)
    if (cancelled) return
    if (soldOut) return flash('Added to waitlist (prototype)')
    if (ev.paid) return navigate(`/events/${ev.id}/tickets`)
    return navigate(`/events/${ev.id}/register`)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="no-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="relative">
          <BackHeader transparent right={
            <div className="flex gap-1.5">
              <button onClick={() => navigate(`/artist/${ev.organiserId}/share`)} aria-label="Share" className="tap flex h-10 w-10 items-center justify-center rounded-full bg-ink/35 text-white backdrop-blur-sm"><Share2 className="h-5 w-5" /></button>
              <button onClick={() => toggle('event:' + ev.id)} aria-label="Save" className="tap flex h-10 w-10 items-center justify-center rounded-full bg-ink/35 text-white backdrop-blur-sm">{saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}</button>
            </div>
          } />
          <div className="absolute inset-x-0 top-0 -z-10 h-60 overflow-hidden">
            <img src={ev.cover} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-black/25" />
          </div>
        </div>

        <div className="px-[18px] pb-40">
          <div className="mt-44">
            <div className="flex flex-wrap gap-1.5">
              <StatusBadge tone="brand">{ev.category}</StatusBadge>
              {ev.paid ? <StatusBadge tone="neutral">Paid</StatusBadge> : <StatusBadge tone="success">Free</StatusBadge>}
              {cancelled && <StatusBadge tone="error">Cancelled</StatusBadge>}
              {!cancelled && soldOut && <StatusBadge tone="error">Sold Out</StatusBadge>}
            </div>
            <h1 className="mt-2 font-serif text-[27px] leading-tight text-ink">{ev.title}</h1>
            <p className="mt-1 text-[13.5px] text-muted">{ev.summary}</p>
          </div>

          {/* key facts */}
          <div className="mt-5 flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
            <Fact icon={<CalendarDays className="h-4 w-4" />} title={fmtDate(ev.startDate)} sub={`${fmtTime(ev.startTime)} – ${fmtTime(ev.endTime)} · ${ev.timezone}`} />
            {ev.format === 'Online' ? (
              <Fact icon={<Globe className="h-4 w-4" />} title="Online event" sub="Joining details revealed after registration" />
            ) : (
              <Fact icon={<MapPin className="h-4 w-4" />} title={ev.venueName ?? 'Venue'} sub={[ev.address, ev.city, ev.state].filter(Boolean).join(', ')} />
            )}
            {ev.doorTime && <Fact icon={<Clock className="h-4 w-4" />} title={`Doors ${fmtTime(ev.doorTime)}`} sub="Entry open time" />}
            <Fact icon={<Users className="h-4 w-4" />} title={soldOut ? 'Sold out' : `${capLeft} spots left`} sub={`Capacity ${ev.capacity || '—'}`} />
          </div>

          {/* organiser */}
          <button onClick={() => navigate(`/artist/${ev.organiserId}`)} className="tap mt-4 flex w-full items-center gap-3 rounded-card border border-border bg-surface p-3 text-left">
            <Avatar name={ev.organiserName} src={ev.organiserAvatar} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wide text-muted">Organised by</p>
              <p className="truncate text-[14px] font-semibold text-ink">{ev.organiserName}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted" />
          </button>

          <Section title="About this event"><p className="text-[14px] leading-relaxed text-ink">{ev.description}</p></Section>
          {ev.expect && <Section title="What to expect"><p className="text-[14px] leading-relaxed text-muted">{ev.expect}</p></Section>}

          {ev.performers.length > 0 && (
            <Section title="Line-up">
              <div className="flex flex-col gap-2">
                {ev.performers.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-[13px] font-semibold text-brand-dark">{p.name.slice(0, 1)}</span>
                    <div><p className="text-[14px] font-semibold text-ink">{p.name}</p><p className="text-[12px] text-muted">{p.role}</p></div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {ev.schedule.length > 0 && (
            <Section title="Schedule">
              <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
                {ev.schedule.map((s) => (
                  <div key={s.id} className="flex gap-3 px-3.5 py-3">
                    <span className="w-[86px] shrink-0 text-[12px] font-semibold text-brand">{fmtTime(s.start)}–{fmtTime(s.end)}</span>
                    <div className="min-w-0 flex-1"><p className="text-[13.5px] font-semibold text-ink">{s.title}</p>{s.host && <p className="text-[12px] text-muted">{s.host}</p>}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Ticket options */}
          {ev.paid && ev.tickets.length > 0 && (
            <Section title="Tickets">
              <div className="flex flex-col gap-2">
                {ev.tickets.map((t) => {
                  const left = remaining(t)
                  return (
                    <div key={t.id} className="flex items-center justify-between rounded-card border border-border bg-surface p-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                        {t.description && <p className="truncate text-[12px] text-muted">{t.description}</p>}
                        <p className="mt-0.5 text-[11.5px] font-medium text-muted">{left === 0 ? 'Sold out' : `${left} left`}</p>
                      </div>
                      <span className="shrink-0 text-[15px] font-bold text-ink">{inr(t.price)}</span>
                    </div>
                  )
                })}
              </div>
            </Section>
          )}

          {/* Venue / online */}
          {ev.format !== 'Online' && (
            <Section title="Venue">
              <div className="overflow-hidden rounded-card border border-border">
                <div className="relative flex h-32 items-center justify-center bg-brand-soft">
                  <MapPin className="h-8 w-8 text-brand" />
                  <span className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-muted">Map preview</span>
                </div>
                <div className="bg-surface p-3">
                  <p className="text-[14px] font-semibold text-ink">{ev.venueName}</p>
                  <p className="text-[12.5px] text-muted">{[ev.address, ev.city, ev.state, ev.postal].filter(Boolean).join(', ')}</p>
                  {ev.accessibility && <p className="mt-2 text-[12px] text-muted"><span className="font-semibold text-ink">Accessibility:</span> {ev.accessibility}</p>}
                  {ev.parking && <p className="mt-1 text-[12px] text-muted"><span className="font-semibold text-ink">Parking:</span> {ev.parking}</p>}
                </div>
              </div>
            </Section>
          )}
          {ev.format === 'Online' && (
            <Section title="Online access">
              <div className="flex items-start gap-3 rounded-card border border-border bg-surface p-3.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-[13px] leading-relaxed text-muted">Platform: <span className="font-semibold text-ink">{ev.online?.platform}</span>. The private joining link is revealed on your ticket after you register.</p>
              </div>
            </Section>
          )}

          {ev.refundPolicy && (
            <Section title="Policies">
              <div className="flex items-start gap-2.5 rounded-card border border-border bg-surface p-3.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                <p className="text-[12.5px] leading-relaxed text-muted">{ev.refundPolicy}</p>
              </div>
            </Section>
          )}

          {similar.length > 0 && (
            <section className="pt-8">
              <h2 className="mb-3 font-serif text-[19px] text-ink">Similar events</h2>
              <div className="no-scrollbar -mx-[18px] flex gap-3 overflow-x-auto px-[18px] pb-1">
                {similar.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky action */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            {booking ? (
              <><p className="text-[11px] uppercase tracking-wide text-muted">Booked</p><p className="text-[15px] font-bold text-success">You're going</p></>
            ) : (
              <><p className="text-[11px] uppercase tracking-wide text-muted">{ev.paid ? 'From' : 'Entry'}</p><p className="text-[18px] font-bold text-ink">{ev.paid ? inr(startingPrice(ev)) : 'Free'}</p></>
            )}
          </div>
          <PrimaryButton className="flex-1" disabled={cancelled} onClick={primaryAction}>
            {booking ? 'View My Ticket' : cancelled ? 'Event Cancelled' : soldOut ? 'Join Waitlist' : ev.paid ? (<><TicketIcon className="h-4 w-4" /> View Tickets</>) : 'Register for Free'}
          </PrimaryButton>
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span>
        </div>
      )}
    </div>
  )
}

function Fact({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark">{icon}</span>
      <div className="min-w-0"><p className="text-[14px] font-semibold text-ink">{title}</p><p className="truncate text-[12px] text-muted">{sub}</p></div>
    </div>
  )
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="pt-7"><h2 className="mb-2.5 font-serif text-[19px] text-ink">{title}</h2>{children}</section>
}
