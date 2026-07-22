import { MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EventItem } from '../data/events'
import StatusBadge from './StatusBadge'

interface Props {
  event: EventItem
}

export default function EventCard({ event }: Props) {
  const navigate = useNavigate()
  const free = event.price === null

  return (
    <button
      onClick={() => navigate(`/event/${event.id}`)}
      className="tap flex w-full items-stretch gap-3 rounded-card border border-border bg-surface p-3 text-left"
    >
      <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[9px] bg-brand-soft">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-black/45 py-0.5 text-white backdrop-blur-sm">
          <span className="text-[14px] font-bold leading-none">{event.day}</span>
          <span className="text-[8px] font-semibold tracking-wide">
            {event.month}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mb-1 flex items-center gap-2">
          <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-brand">
            {event.category}
          </span>
        </div>
        <h3 className="truncate font-serif text-[16px] leading-snug text-ink">
          {event.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 truncate text-[12px] text-muted">
          <MapPin className="h-3 w-3 shrink-0" /> {event.city}
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        {free ? (
          <StatusBadge tone="success">Free</StatusBadge>
        ) : (
          <span className="text-[14px] font-bold text-ink">₹{event.price}</span>
        )}
      </div>
    </button>
  )
}
