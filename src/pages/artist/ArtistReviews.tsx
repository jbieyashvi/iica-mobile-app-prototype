import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, Flag, BadgeCheck } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import PrimaryButton from '../../components/PrimaryButton'
import { usePublicArtist } from '../../data/usePublicArtist'

type Sort = 'recent' | 'top'

export default function ArtistReviews() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { artist } = usePublicArtist(slug)
  const [sort, setSort] = useState<Sort>('recent')
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const [reported, setReported] = useState<string[]>([])
  const [toast, setToast] = useState('')

  const list = useMemo(() => {
    if (!artist) return []
    let r = [...artist.reviews]
    if (starFilter) r = r.filter((x) => Math.round(x.rating) === starFilter)
    r.sort((a, b) => (sort === 'recent' ? b.date.localeCompare(a.date) : b.rating - a.rating))
    return r
  }, [artist, sort, starFilter])

  if (!artist) return <BackHeader title="Reviews" />

  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(''), 1800)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Reviews" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-28">
        {/* summary */}
        <div className="mt-3 flex items-center gap-4 rounded-card border border-border bg-surface p-4">
          <div className="text-center">
            <p className="font-serif text-[36px] leading-none text-ink">{artist.ratingSummary.avg.toFixed(1)}</p>
            <div className="mt-1 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.round(artist.ratingSummary.avg) ? 'fill-brand text-brand' : 'text-border'}`} />
              ))}
            </div>
            <p className="mt-1 text-[11.5px] text-muted">{artist.ratingSummary.total} reviews</p>
          </div>
          <div className="flex-1">
            {artist.ratingSummary.distribution.map((count, i) => {
              const star = 5 - i
              const pct = artist.ratingSummary.total ? (count / artist.ratingSummary.total) * 100 : 0
              return (
                <button
                  key={star}
                  onClick={() => setStarFilter(starFilter === star ? null : star)}
                  className="flex w-full items-center gap-2 py-0.5"
                >
                  <span className={`w-3 text-[11px] ${starFilter === star ? 'font-bold text-brand' : 'text-muted'}`}>{star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* filters */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1 rounded-control bg-surface p-1">
            {(['recent', 'top'] as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`tap rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${sort === s ? 'bg-brand text-white' : 'text-muted'}`}
              >
                {s === 'recent' ? 'Most Recent' : 'Highest Rated'}
              </button>
            ))}
          </div>
          {starFilter && (
            <button onClick={() => setStarFilter(null)} className="text-[12.5px] font-semibold text-brand">
              Clear {starFilter}★
            </button>
          )}
        </div>

        {/* list */}
        <div className="mt-4 flex flex-col gap-2.5">
          {list.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface px-4 py-8 text-center text-[13px] text-muted">
              No reviews match this filter.
            </div>
          ) : (
            list.map((r) => (
              <div key={r.id} className="rounded-card border border-border bg-surface p-3.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={r.author} src={r.avatar} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[13.5px] font-semibold text-ink">{r.author}</p>
                      {r.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" />}
                    </div>
                    <p className="truncate text-[11.5px] text-muted">{r.relationship} · {r.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-brand text-brand" />
                    ))}
                  </div>
                </div>
                {r.title && <p className="mt-2 text-[13.5px] font-semibold text-ink">{r.title}</p>}
                <p className="mt-1 text-[13px] leading-relaxed text-ink">“{r.text}”</p>
                <button
                  onClick={() => {
                    if (reported.includes(r.id)) return
                    setReported((x) => [...x, r.id])
                    flash('Review reported for moderation')
                  }}
                  className="tap mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold text-muted hover:text-error"
                >
                  <Flag className="h-3.5 w-3.5" /> {reported.includes(r.id) ? 'Reported' : 'Report'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* sticky write CTA */}
      <div
        className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md"
        style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
      >
        <PrimaryButton full onClick={() => navigate(`/artist/${artist.slug}/write-review`)}>
          Write a Review
        </PrimaryButton>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span>
        </div>
      )}
    </div>
  )
}
