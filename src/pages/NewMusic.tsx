import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Plus, Music2 } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import PrimaryButton from '../components/PrimaryButton'
import MusicThumb, { openMusic, addedLabel } from '../components/music/MusicThumb'
import { useNewMusic } from '../state/NewMusicContext'

const PAGE = 8
type Sort = 'Newest' | 'Oldest'

export default function NewMusic() {
  const navigate = useNavigate()
  const { featured } = useNewMusic()

  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState<Sort>('Newest')
  const [limit, setLimit] = useState(PAGE)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    let r = featured.filter((m) =>
      (!query || (m.title + ' ' + m.artist + ' ' + m.genre).toLowerCase().includes(query)) &&
      (!genre || m.genre === genre),
    )
    const ts = (m: typeof featured[number]) => new Date(m.featuredAt || m.submittedAt).getTime() || 0
    r = [...r].sort((a, b) => (sort === 'Newest' ? ts(b) - ts(a) : ts(a) - ts(b)))
    return r
  }, [featured, q, genre, sort])

  const shown = filtered.slice(0, limit)
  const genresPresent = useMemo(() => Array.from(new Set(featured.map((m) => m.genre))).sort(), [featured])

  const chip = (active: boolean) =>
    `tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${active ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="New Music Today" fallback="/home" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-3" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        <p className="mb-3 text-[13px] leading-relaxed text-muted">Discover fresh music selected by IICA.</p>

        {/* Search */}
        <div className="flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-3">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE) }} placeholder="Search by title or artist" className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-muted focus:outline-none" aria-label="Search music" />
          {q && <button onClick={() => setQ('')} aria-label="Clear search"><X className="h-4 w-4 text-muted" /></button>}
        </div>

        {/* Genre filter */}
        <div className="no-scrollbar -mx-[18px] mt-2.5 flex gap-2 overflow-x-auto px-[18px] pb-1">
          <button onClick={() => { setGenre(''); setLimit(PAGE) }} className={chip(!genre)}>All Genres</button>
          {genresPresent.map((g) => (
            <button key={g} onClick={() => { setGenre(genre === g ? '' : g); setLimit(PAGE) }} className={chip(genre === g)}>{g}</button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[12.5px] font-semibold text-muted">{filtered.length} track{filtered.length === 1 ? '' : 's'}</p>
          <div className="flex gap-1">
            {(['Newest', 'Oldest'] as Sort[]).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`tap rounded-control px-2.5 py-1 text-[12px] font-semibold ${sort === s ? 'text-brand underline decoration-2 underline-offset-4' : 'text-muted'}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Music2 className="h-6 w-6" strokeWidth={1.6} /></span>
            <p className="mt-3 font-serif text-[19px] text-ink">No music yet</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-muted">
              {featured.length === 0 ? 'No music has been featured yet. Be the first to submit a link.' : 'Nothing matches your search or genre filter.'}
            </p>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {shown.map((r) => (
              <button key={r.id} onClick={() => openMusic(r)} aria-label={`Open ${r.title} by ${r.artist} on YouTube`} className="tap overflow-hidden rounded-card border border-border bg-surface text-left">
                <MusicThumb record={r} />
                <div className="p-2.5">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wide text-brand">{r.genre}</span>
                  <h3 className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-ink">{r.title}</h3>
                  <p className="truncate text-[11.5px] text-muted">{r.artist}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">Added {addedLabel(r.featuredAt || r.submittedAt)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {shown.length < filtered.length && (
          <button onClick={() => setLimit((n) => n + PAGE)} className="tap mt-4 flex min-h-[44px] w-full items-center justify-center rounded-control border border-border bg-surface text-[13.5px] font-semibold text-ink hover:border-ink/25">
            Load More ({filtered.length - shown.length} more)
          </button>
        )}
      </div>

      {/* Submit CTA */}
      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={() => navigate('/music/submit')}>
          <Plus className="h-[18px] w-[18px]" /> Submit New Music Link
        </PrimaryButton>
      </div>
    </div>
  )
}
