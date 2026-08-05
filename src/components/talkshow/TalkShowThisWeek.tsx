import { useNavigate } from 'react-router-dom'
import { Play, FileUp, Mic, ChevronRight } from 'lucide-react'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import TalkShowThumb, { openEpisode, releaseLabel } from './TalkShowThumb'
import { useTalkShow } from '../../state/TalkShowContext'
import { useRailScroll } from '../../lib/useRailScroll'

// Home section: current weekly Talk Show episode first, then previous episodes as
// a horizontal rail. Header action opens the Upload Résumé (Guest Artist) flow.
// Hidden entirely when nothing is featured.
export default function TalkShowThisWeek() {
  const navigate = useNavigate()
  const { featuredEpisode, previousEpisodes } = useTalkShow()
  const railRef = useRailScroll('rail:talkshow')

  if (!featuredEpisode) return null
  const ep = featuredEpisode

  return (
    <div>
      <PageContainer>
        <SectionHeader title="Talk Show This Week" action="Upload Résumé" onAction={() => navigate('/talk-show/apply', { state: { episodeId: ep.id } })} />
      </PageContainer>

      {/* Current episode */}
      <PageContainer>
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <button onClick={() => openEpisode(ep)} aria-label={`Watch ${ep.title} on YouTube`} className="tap block w-full text-left">
            <TalkShowThumb episode={ep} />
          </button>
          <div className="p-3.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-brand"><Mic className="h-3.5 w-3.5" /> This week</span>
            <h3 className="mt-1 font-serif text-[18px] leading-tight text-ink">{ep.title}</h3>
            <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{ep.description}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-muted">
              <span>Host: <span className="font-semibold text-ink">{ep.host}</span></span>
              {ep.guest && <span>Guest: <span className="font-semibold text-ink">{ep.guest}</span></span>}
            </div>
            <p className="mt-0.5 text-[11px] text-muted">Released {releaseLabel(ep.releaseDate)}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => openEpisode(ep)} className="tap flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-control bg-ink text-[13px] font-semibold text-white hover:bg-ink/90">
                <Play className="h-4 w-4 fill-white" /> Watch Talk Show
              </button>
              <button onClick={() => navigate('/talk-show/apply', { state: { episodeId: ep.id } })} className="tap flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-control border border-brand/40 bg-brand-soft text-[13px] font-semibold text-brand-dark hover:border-brand">
                <FileUp className="h-4 w-4" /> Upload Résumé
              </button>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Previous episodes — horizontally swipeable */}
      {previousEpisodes.length > 0 && (
        <>
          <PageContainer><p className="mb-2 mt-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Previous episodes</p></PageContainer>
          <div ref={railRef} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[18px] pb-1">
            {previousEpisodes.map((e) => (
              <button
                key={e.id}
                onClick={() => openEpisode(e)}
                aria-label={`Watch ${e.title} on YouTube`}
                className="tap w-[210px] shrink-0 snap-start overflow-hidden rounded-card border border-border bg-surface text-left"
              >
                <TalkShowThumb episode={e} />
                <div className="p-3">
                  <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink">{e.title}</h4>
                  <p className="mt-0.5 truncate text-[11.5px] text-muted">{e.host}{e.guest ? ` · ${e.guest}` : ''}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">{releaseLabel(e.releaseDate)}</p>
                </div>
              </button>
            ))}
            <button
              onClick={() => navigate('/talk-show')}
              aria-label="View all Talk Show episodes"
              className="tap flex w-[120px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-card border border-dashed border-border bg-surface text-brand"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="text-[12.5px] font-semibold">View All</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
