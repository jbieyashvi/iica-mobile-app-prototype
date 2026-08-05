import { useNavigate } from 'react-router-dom'
import { Play, UserPlus, Mic } from 'lucide-react'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import TalkShowThumb, { openEpisode, releaseLabel } from './TalkShowThumb'
import { useTalkShow } from '../../state/TalkShowContext'

// Compact Home section showing the current featured weekly Talk Show episode.
// Consistent with the New Music Today card style. Hidden when nothing featured.
export default function TalkShowThisWeek() {
  const navigate = useNavigate()
  const { featuredEpisode } = useTalkShow()

  if (!featuredEpisode) return null
  const ep = featuredEpisode

  return (
    <div>
      <PageContainer>
        <SectionHeader title="Talk Show This Week" action="View All" onAction={() => navigate('/talk-show')} />
      </PageContainer>
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
                <UserPlus className="h-4 w-4" /> Apply as Guest
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
