import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Play, UserPlus, Mic, Tv } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import TalkShowThumb, { openEpisode, releaseLabel } from '../components/talkshow/TalkShowThumb'
import { useTalkShow } from '../state/TalkShowContext'

const PAGE = 6
type Sort = 'Newest' | 'Oldest'

export default function TalkShow() {
  const navigate = useNavigate()
  const { featuredEpisode, previousEpisodes } = useTalkShow()

  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('Newest')
  const [limit, setLimit] = useState(PAGE)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    let r = previousEpisodes.filter((e) => !query || (e.title + ' ' + e.guest + ' ' + e.host).toLowerCase().includes(query))
    r = [...r].sort((a, b) => (sort === 'Newest' ? b.releaseDate.localeCompare(a.releaseDate) : a.releaseDate.localeCompare(b.releaseDate)))
    return r
  }, [previousEpisodes, q, sort])

  const shown = filtered.slice(0, limit)
  const applyFrom = (episodeId?: string) => navigate('/talk-show/apply', { state: { episodeId } })

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Talk Show" fallback="/home" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-3" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        {/* Current featured episode */}
        {featuredEpisode ? (
          <section>
            <div className="overflow-hidden rounded-card border border-border bg-surface">
              <button onClick={() => openEpisode(featuredEpisode)} aria-label={`Watch ${featuredEpisode.title} on YouTube`} className="tap block w-full text-left">
                <TalkShowThumb episode={featuredEpisode} />
              </button>
              <div className="p-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-brand"><Mic className="h-3.5 w-3.5" /> This week</span>
                <h1 className="mt-1 font-serif text-[21px] leading-tight text-ink">{featuredEpisode.title}</h1>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{featuredEpisode.description}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[12.5px] text-muted">
                  <span>Host: <span className="font-semibold text-ink">{featuredEpisode.host}</span></span>
                  {featuredEpisode.guest && <span>Guest: <span className="font-semibold text-ink">{featuredEpisode.guest}</span></span>}
                </div>
                <p className="mt-0.5 text-[11.5px] text-muted">Released {releaseLabel(featuredEpisode.releaseDate)}</p>
                <div className="mt-3.5 flex flex-col gap-2.5">
                  <PrimaryButton full onClick={() => openEpisode(featuredEpisode)}><Play className="h-4 w-4 fill-white" /> Watch on YouTube</PrimaryButton>
                  <SecondaryButton full onClick={() => applyFrom(featuredEpisode.id)}><UserPlus className="h-4 w-4" /> Apply as Guest Artist</SecondaryButton>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Tv className="h-6 w-6" strokeWidth={1.6} /></span>
            <p className="mt-3 font-serif text-[19px] text-ink">No episode this week</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-muted">A new Talk Show episode will appear here soon.</p>
            <div className="mt-4"><PrimaryButton onClick={() => applyFrom()}><UserPlus className="h-4 w-4" /> Apply as Guest Artist</PrimaryButton></div>
          </div>
        )}

        {/* Previous Episodes */}
        <section className="mt-8">
          <h2 className="mb-2.5 font-serif text-[18px] text-ink">Previous Episodes</h2>

          {previousEpisodes.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface px-4 py-10 text-center text-[13px] text-muted">No previous episodes yet.</div>
          ) : (
            <>
              {/* Search */}
              <div className="flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-3">
                <Search className="h-4 w-4 text-muted" />
                <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE) }} placeholder="Search by episode or guest" className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-muted focus:outline-none" aria-label="Search episodes" />
                {q && <button onClick={() => setQ('')} aria-label="Clear search"><X className="h-4 w-4 text-muted" /></button>}
              </div>

              {/* Sort + count */}
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[12.5px] font-semibold text-muted">{filtered.length} episode{filtered.length === 1 ? '' : 's'}</p>
                <div className="flex gap-1">
                  {(['Newest', 'Oldest'] as Sort[]).map((s) => (
                    <button key={s} onClick={() => setSort(s)} className={`tap rounded-control px-2.5 py-1 text-[12px] font-semibold ${sort === s ? 'text-brand underline decoration-2 underline-offset-4' : 'text-muted'}`}>{s}</button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="mt-3 rounded-card border border-dashed border-border bg-surface px-4 py-10 text-center text-[13px] text-muted">No episodes match your search.</div>
              ) : (
                <div className="mt-3 flex flex-col gap-3">
                  {shown.map((e) => (
                    <button key={e.id} onClick={() => openEpisode(e)} aria-label={`Open ${e.title} with ${e.guest || e.host} on YouTube`} className="tap flex gap-3 overflow-hidden rounded-card border border-border bg-surface p-2.5 text-left">
                      <div className="w-[120px] shrink-0"><TalkShowThumb episode={e} rounded="all" /></div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink">{e.title}</h3>
                        {e.guest && <p className="mt-0.5 truncate text-[12px] text-muted">Guest: {e.guest}</p>}
                        <p className="mt-0.5 text-[11px] text-muted">{releaseLabel(e.releaseDate)}</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand"><Play className="h-3 w-3 fill-brand" /> Open YouTube</span>
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
            </>
          )}
        </section>
      </div>

      {/* Apply CTA */}
      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={() => applyFrom(featuredEpisode?.id)}><UserPlus className="h-[18px] w-[18px]" /> Apply as Guest Artist</PrimaryButton>
      </div>
    </div>
  )
}
