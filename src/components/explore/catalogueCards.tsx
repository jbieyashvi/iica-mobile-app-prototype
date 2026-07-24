import { BadgeCheck, MapPin, Bookmark, BookmarkCheck, ChevronRight, Activity } from 'lucide-react'
import { PublicArtist, effectiveCity, profileCategory, primaryGenre } from '../../data/publicArtists'

/* ---------- Featured (horizontal) ---------- */
export function FeaturedProfileCard({ profile, onView }: { profile: PublicArtist; onView: () => void }) {
  const genre = primaryGenre(profile)
  return (
    <div className="w-[190px] shrink-0 overflow-hidden rounded-card border border-border bg-surface">
      <button onClick={onView} className="tap block w-full text-left">
        <div className="aspect-[4/3] w-full overflow-hidden bg-brand-soft">
          <img src={profile.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1">
            <span className="truncate font-serif text-[15px] leading-tight text-ink">{profile.name}</span>
            {profile.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" />}
          </div>
          <p className="mt-0.5 truncate text-[11.5px] font-semibold text-brand-dark">{profileCategory(profile)}</p>
          <p className="truncate text-[11.5px] text-muted">{genre}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted"><MapPin className="h-2.5 w-2.5" /> {effectiveCity(profile)}</p>
          {profile.activity?.lastActiveLabel && (
            <p className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold text-success"><Activity className="h-3 w-3" /> {profile.activity.lastActiveLabel}</p>
          )}
        </div>
      </button>
      <div className="px-3 pb-3">
        <button onClick={onView} className="tap flex min-h-[34px] w-full items-center justify-center rounded-control border border-border bg-bg text-[12px] font-semibold text-ink hover:border-ink/25">
          View Profile
        </button>
      </div>
    </div>
  )
}

/* ---------- Catalogue list item ---------- */
export function CatalogueListItem({ profile, saved, onSave, onView }: {
  profile: PublicArtist; saved: boolean; onSave: () => void; onView: () => void
}) {
  return (
    <div className="relative flex gap-3 rounded-card border border-border bg-surface p-3">
      <button onClick={onView} className="tap flex min-w-0 flex-1 gap-3 text-left">
        <img src={profile.photo} alt="" loading="lazy" className="h-[74px] w-[74px] shrink-0 rounded-[10px] object-cover" />
        <div className="min-w-0 flex-1 pr-6">
          <div className="flex items-center gap-1">
            <span className="truncate font-serif text-[16px] leading-tight text-ink">{profile.name}</span>
            {profile.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />}
          </div>
          <p className="mt-0.5 truncate text-[12.5px] font-semibold text-brand-dark">
            {profileCategory(profile)} · <span className="font-normal text-muted">{primaryGenre(profile)}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted"><MapPin className="h-3 w-3" /> {effectiveCity(profile)}</p>
          <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-muted">{profile.headline}</p>
        </div>
      </button>
      <button aria-label={saved ? 'Unsave' : 'Save'} onClick={onSave} className="tap absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/[0.04]">
        {saved ? <BookmarkCheck className="h-[18px] w-[18px] text-brand" /> : <Bookmark className="h-[18px] w-[18px]" />}
      </button>
      <button onClick={onView} aria-label="View profile" className="tap absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-muted">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
