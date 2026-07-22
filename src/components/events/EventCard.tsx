import { MapPin, Globe, Bookmark, BookmarkCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EventItem } from '../../events/types'
import { fmtDay, inr, isSoldOut, startingPrice } from '../../events/format'
import StatusBadge from '../StatusBadge'
import { useSavedArtists } from '../../state/useSavedArtists'

// reuse the saved store, keyed with an "event:" prefix
export default function EventCard({ event, wide }: { event: EventItem; wide?: boolean }) {
  const navigate = useNavigate()
  const { isSaved, toggle } = useSavedArtists()
  const day = fmtDay(event.startDate)
  const soldOut = isSoldOut(event)
  const price = startingPrice(event)
  const key = 'event:' + event.id
  const saved = isSaved(key)

  return (
    <div className={`group relative overflow-hidden rounded-card border border-border bg-surface ${wide ? 'w-full' : 'w-[230px] shrink-0'}`}>
      <button onClick={() => navigate(`/events/${event.id}`)} className="tap block w-full text-left">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-soft">
          <img src={event.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute left-2 top-2 flex flex-col items-center rounded-[8px] bg-white/95 px-2 py-1 leading-none shadow-subtle">
            <span className="text-[14px] font-bold text-ink">{day.day}</span>
            <span className="text-[9px] font-semibold text-muted">{day.month}</span>
          </div>
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {event.status === 'cancelled' && <StatusBadge tone="error">Cancelled</StatusBadge>}
            {soldOut && event.status !== 'cancelled' && <StatusBadge tone="error">Sold Out</StatusBadge>}
          </div>
        </div>
        <div className="p-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{event.category}</span>
          <h3 className="mt-0.5 line-clamp-1 font-serif text-[16px] leading-snug text-ink">{event.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-[12px] text-muted">{event.organiserName}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="flex min-w-0 items-center gap-1 text-[12px] text-muted">
              {event.format === 'Online' ? <Globe className="h-3.5 w-3.5 shrink-0" /> : <MapPin className="h-3.5 w-3.5 shrink-0" />}
              <span className="truncate">{event.format === 'Online' ? 'Online' : event.city}</span>
            </span>
            {event.paid ? (
              <span className="shrink-0 text-[13px] font-bold text-ink">{price === 0 ? '—' : `${inr(price)}+`}</span>
            ) : (
              <StatusBadge tone="success">Free</StatusBadge>
            )}
          </div>
        </div>
      </button>
      <button
        aria-label={saved ? 'Unsave' : 'Save'}
        onClick={() => toggle(key)}
        className="tap absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/45 text-white backdrop-blur-sm"
      >
        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </button>
    </div>
  )
}
