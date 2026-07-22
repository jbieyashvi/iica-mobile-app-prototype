import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { useParams } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import PrimaryButton from '../components/PrimaryButton'
import StatusBadge from '../components/StatusBadge'
import { getEvent } from '../data/events'

export default function EventDetails() {
  const { id } = useParams()
  const event = getEvent(id)
  const free = event.price === null

  return (
    <div className="flex h-full flex-col">
      <div className="relative">
        <BackHeader transparent />
        <div className="absolute inset-x-0 top-0 -z-10 h-56 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-black/25" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-[18px] pb-32">
        <div className="mt-40">
          <StatusBadge tone="brand">{event.category}</StatusBadge>
          <h1 className="mt-2 font-serif text-[28px] leading-tight text-ink">
            {event.title}
          </h1>
          <p className="mt-1 text-[13px] text-muted">Hosted by {event.host}</p>

          <div className="mt-5 flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
            <Row icon={<CalendarDays className="h-4 w-4" />} text={event.date} />
            <Row
              icon={<MapPin className="h-4 w-4" />}
              text={`${event.venue}, ${event.city}`}
            />
            <Row
              icon={<Ticket className="h-4 w-4" />}
              text={free ? 'Free entry' : `₹${event.price} per ticket`}
            />
          </div>

          <p className="mt-5 text-[14px] leading-relaxed text-muted">
            {event.description}
          </p>

          <div className="mt-6">
            <StatusBadge tone="neutral">Sample event</StatusBadge>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              This is a sample event details placeholder. Ticketing and booking
              will be built in a later phase.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky booking bar */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md"
        style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">
              {free ? 'Entry' : 'From'}
            </p>
            <p className="text-[18px] font-bold text-ink">
              {free ? 'Free' : `₹${event.price}`}
            </p>
          </div>
          <PrimaryButton className="flex-1">
            {free ? 'Register' : 'Get Tickets'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[14px] text-ink">
      <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand-soft text-brand-dark">
        {icon}
      </span>
      {text}
    </div>
  )
}
