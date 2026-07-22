import { useParams } from 'react-router-dom'
import { CalendarDays, MapPin, Ticket, Clock } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import StatusBadge from '../../components/StatusBadge'
import { usePublicArtist } from '../../data/usePublicArtist'

export default function ArtistEventDetails() {
  const { slug, id } = useParams()
  const { artist } = usePublicArtist(slug)
  const event = artist?.upcomingEvents.find((e) => e.id === id)

  if (!artist || !event) return <BackHeader title="Event" />

  const free = !event.paid

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="relative">
        <BackHeader transparent />
        <div className="absolute inset-x-0 top-0 -z-10 h-56 overflow-hidden">
          <img src={event.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-black/25" />
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-32">
        <div className="mt-40">
          <div className="flex gap-1.5">
            <StatusBadge tone="brand">{event.category}</StatusBadge>
            {event.soldOut && <StatusBadge tone="error">Sold Out</StatusBadge>}
          </div>
          <h1 className="mt-2 font-serif text-[28px] leading-tight text-ink">{event.title}</h1>
          <p className="mt-1 text-[13px] text-muted">Hosted by {artist.name}</p>

          <div className="mt-5 flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
            <Row icon={<CalendarDays className="h-4 w-4" />} text={event.date} />
            {event.time && <Row icon={<Clock className="h-4 w-4" />} text={event.time} />}
            <Row icon={<MapPin className="h-4 w-4" />} text={`${event.venue}, ${event.city}`} />
            <Row icon={<Ticket className="h-4 w-4" />} text={free ? 'Free entry' : `₹${event.price} per ticket`} />
          </div>

          <p className="mt-5 text-[14px] leading-relaxed text-muted">
            Join {artist.name} for {event.title}. Full booking will be available soon — this is a prototype event page.
          </p>

          <div className="mt-6">
            <StatusBadge tone="neutral">Sample event</StatusBadge>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Ticketing and registration will be implemented in a later phase.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">{free ? 'Entry' : 'From'}</p>
            <p className="text-[18px] font-bold text-ink">{free ? 'Free' : `₹${event.price}`}</p>
          </div>
          <PrimaryButton className="flex-1" disabled={event.soldOut}>
            {event.soldOut ? 'Sold Out' : free ? 'Register for Free' : 'View Tickets'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[14px] text-ink">
      <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand-soft text-brand-dark">{icon}</span>
      {text}
    </div>
  )
}
