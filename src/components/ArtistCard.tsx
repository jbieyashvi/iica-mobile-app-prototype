import { BadgeCheck, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Artist } from '../data/artists'

interface Props {
  artist: Artist
}

export default function ArtistCard({ artist }: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/artist/${artist.id}`)}
      className="tap group w-[152px] shrink-0 overflow-hidden rounded-card border border-border bg-surface text-left"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-brand-soft">
        <img
          src={artist.photo}
          alt={artist.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1">
          <span className="truncate font-serif text-[16px] leading-tight text-ink">
            {artist.name}
          </span>
          {artist.verified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
          )}
        </div>
        <p className="mt-0.5 truncate text-[12px] text-muted">
          {artist.discipline}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted">
          <MapPin className="h-3 w-3" /> {artist.city}
        </p>
      </div>
    </button>
  )
}
