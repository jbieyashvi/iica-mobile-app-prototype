import { useNavigate } from 'react-router-dom'
import { BadgeCheck, MapPin, Bookmark, BookmarkCheck } from 'lucide-react'
import { PublicArtist } from '../../data/publicArtists'
import { Collection, ExploreCategory, ShopItem } from '../../data/exploreData'
import StatusBadge from '../StatusBadge'
import { inr } from '../../events/format'

/* ---------- Artist ---------- */
export function ArtistListCard({ artist, saved, onSave, list }: { artist: PublicArtist; saved: boolean; onSave: (k: string) => void; list?: boolean }) {
  const navigate = useNavigate()
  const key = 'artist:' + artist.slug
  const availTone = artist.availability === 'Available' ? 'success' : artist.availability === 'Selectively Available' ? 'warning' : 'neutral'

  if (list) {
    return (
      <div className="relative flex gap-3 rounded-card border border-border bg-surface p-3">
        <button onClick={() => navigate(`/artist/${artist.slug}`)} className="tap flex min-w-0 flex-1 gap-3 text-left">
          <img src={artist.photo} alt="" loading="lazy" className="h-[72px] w-[72px] shrink-0 rounded-[10px] object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate font-serif text-[16px] leading-tight text-ink">{artist.name}</span>
              {artist.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />}
            </div>
            <p className="truncate text-[12.5px] text-muted">{artist.headline}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted"><MapPin className="h-3 w-3" /> {artist.location.split(',')[0]} · {artist.primaryDomain}</p>
            <div className="mt-1.5"><StatusBadge tone={availTone}>{artist.availability}</StatusBadge></div>
          </div>
        </button>
        <button aria-label={saved ? 'Unsave' : 'Save'} onClick={() => onSave(key)} className="tap absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/[0.04]">
          {saved ? <BookmarkCheck className="h-[18px] w-[18px] text-brand" /> : <Bookmark className="h-[18px] w-[18px]" />}
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-[150px] shrink-0 overflow-hidden rounded-card border border-border bg-surface">
      <button onClick={() => navigate(`/artist/${artist.slug}`)} className="tap block w-full text-left">
        <div className="aspect-[3/4] w-full overflow-hidden bg-brand-soft"><img src={artist.photo} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
        <div className="p-2.5">
          <div className="flex items-center gap-1"><span className="truncate font-serif text-[15px] leading-tight text-ink">{artist.name}</span>{artist.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" />}</div>
          <p className="truncate text-[11.5px] text-muted">{artist.primaryDomain}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted"><MapPin className="h-2.5 w-2.5" /> {artist.location.split(',')[0]}</p>
        </div>
      </button>
      <button aria-label={saved ? 'Unsave' : 'Save'} onClick={() => onSave(key)} className="tap absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/40 text-white backdrop-blur-sm">
        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </button>
    </div>
  )
}

/* ---------- Category ---------- */
export function CategoryCard({ category }: { category: ExploreCategory }) {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(`/explore/category/${category.slug}`)} className="tap relative w-[140px] shrink-0 overflow-hidden rounded-card border border-border text-left">
      <div className="aspect-[4/5] w-full overflow-hidden bg-brand-soft"><img src={category.image} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
        <p className="font-serif text-[16px] leading-tight">{category.name}</p>
        <p className="text-[11px] text-white/80">{category.creators} creators</p>
      </div>
    </button>
  )
}

/* ---------- Collection ---------- */
export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <div className="relative w-[250px] shrink-0 overflow-hidden rounded-card border border-border">
      <div className="aspect-[16/9] w-full overflow-hidden bg-brand-soft"><img src={collection.image} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/80">{collection.subtitle}</span>
        <p className="mt-0.5 font-serif text-[18px] leading-tight">{collection.title}</p>
        <p className="text-[11.5px] text-white/80">{collection.count} entries</p>
      </div>
    </div>
  )
}

/* ---------- Shop ---------- */
export function ShopCard({ item }: { item: ShopItem }) {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(`/product/${item.id}`)} className="tap w-[160px] shrink-0 overflow-hidden rounded-card border border-border bg-surface text-left">
      <div className="aspect-square w-full overflow-hidden bg-brand-soft"><img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
      <div className="p-2.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-wide text-brand">{item.kind}</span>
        <p className="mt-0.5 line-clamp-1 text-[13px] font-semibold text-ink">{item.title}</p>
        <p className="truncate text-[11.5px] text-muted">{item.creator}</p>
        <p className="mt-1 text-[13px] font-bold text-ink">{inr(item.price)}</p>
      </div>
    </button>
  )
}

/* ---------- Skeletons ---------- */
export function SkeletonCard({ list }: { list?: boolean }) {
  return (
    <div className={`animate-pulse rounded-card border border-border bg-surface ${list ? 'flex gap-3 p-3' : 'w-[150px] shrink-0 overflow-hidden'}`}>
      <div className={`bg-border/60 ${list ? 'h-[72px] w-[72px] shrink-0 rounded-[10px]' : 'aspect-[3/4] w-full'}`} />
      <div className={list ? 'flex-1 space-y-2 py-1' : 'space-y-2 p-2.5'}>
        <div className="h-3 w-2/3 rounded bg-border/60" />
        <div className="h-2.5 w-1/2 rounded bg-border/50" />
        <div className="h-2.5 w-1/3 rounded bg-border/40" />
      </div>
    </div>
  )
}
