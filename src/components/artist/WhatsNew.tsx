import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, ExternalLink } from 'lucide-react'
import { ArtistUpdate } from '../../data/publicArtists'
import {
  WHATS_NEW_EYEBROW, headingForCategory, dateStatus, isCurrent, humanDate,
} from '../../config/announcements'

// Reusable across every profile category. Renders nothing when there are no
// current published announcements (public section hidden).
export default function WhatsNew({ updates, category }: { updates: ArtistUpdate[]; category?: string }) {
  const items = useMemo(() => {
    const current = updates.filter((u) => {
      const s = dateStatus(u.date, u.type)
      return s === 'Upcoming' || s === 'Today' || isCurrent(u.date)
    })
    // Featured first, then nearest upcoming date, then most recent.
    return [...current].sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1
      const ta = Date.parse(a.date) || 0
      const tb = Date.parse(b.date) || 0
      return ta - tb
    })
  }, [updates])

  if (items.length === 0) return null

  return (
    <div className="mt-7">
      <div className="mb-2.5 px-[18px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">{WHATS_NEW_EYEBROW}</p>
        <h2 className="mt-0.5 font-serif text-[20px] leading-tight text-ink">{headingForCategory(category)}</h2>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1" role="list" aria-label="What's New announcements, scroll horizontally">
        {items.map((u) => <Card key={u.id} u={u} />)}
      </div>
    </div>
  )
}

function Card({ u }: { u: ArtistUpdate }) {
  const navigate = useNavigate()
  const status = dateStatus(u.date, u.type)
  const external = !!u.href && /^https?:\/\//i.test(u.href)

  const ctaInner = (
    <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand">
      {u.cta}{external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
    </span>
  )

  return (
    <div role="listitem" className="w-[292px] shrink-0 overflow-hidden rounded-[11px] border border-border bg-surface">
      {u.image && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-brand-soft">
          <img src={u.image} alt={u.title} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{u.type}</span>
          <span className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{status}</span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-[16px] leading-snug text-ink">{u.title}</h3>
        <p className="mt-1 text-[12px] font-medium text-ink/70">{humanDate(u.date)}{u.time ? ` · ${u.time}` : ''}</p>
        {u.description && <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{u.description}</p>}
        {u.location && <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-muted"><MapPin className="h-3 w-3" /> {u.location}</p>}
        {u.cta && u.href && (
          external ? (
            <a href={u.href} target="_blank" rel="noopener noreferrer" aria-label={`${u.cta} — ${u.title}`} className="tap mt-2.5 inline-flex min-h-[36px] items-center">{ctaInner}</a>
          ) : (
            <button onClick={() => navigate(u.href!)} aria-label={`${u.cta} — ${u.title}`} className="tap mt-2.5 inline-flex min-h-[36px] items-center">{ctaInner}</button>
          )
        )}
        {u.cta && !u.href && (
          <span className="mt-2.5 inline-flex min-h-[36px] items-center">{ctaInner}</span>
        )}
      </div>
    </div>
  )
}
