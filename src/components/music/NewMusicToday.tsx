import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import MusicThumb, { openMusic, locationLabel } from './MusicThumb'
import { useNewMusic } from '../../state/NewMusicContext'
import { useRailScroll } from '../../lib/useRailScroll'

const HOME_MAX = 8

// Compact Home carousel of Admin-featured "New Music Today". Hidden entirely
// when nothing is featured. No embedded players. Header action submits music;
// a trailing card links to View All.
export default function NewMusicToday() {
  const navigate = useNavigate()
  const { featured } = useNewMusic()
  const railRef = useRailScroll('rail:new-music')

  if (featured.length === 0) return null
  const items = featured.slice(0, HOME_MAX)
  const showViewAll = featured.length > 3

  return (
    <div>
      <PageContainer>
        <SectionHeader title="New Music Today" action="Submit Music" onAction={() => navigate('/music/submit')} />
        <p className="-mt-1 mb-3 text-[12.5px] text-muted">Fresh music selected by IICA.</p>
      </PageContainer>
      <div ref={railRef} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[18px] pb-1">
        {items.map((r) => {
          const loc = locationLabel(r)
          return (
            <button
              key={r.id}
              onClick={() => openMusic(r)}
              aria-label={`Open ${r.title} by ${r.artist} on YouTube`}
              className="tap w-[210px] shrink-0 snap-start overflow-hidden rounded-card border border-border bg-surface text-left"
            >
              <MusicThumb record={r} />
              <div className="p-3">
                {r.genre && <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{r.genre}</span>}
                <h3 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug text-ink">{r.title}</h3>
                <p className="mt-0.5 truncate text-[12px] font-medium text-ink/85">{r.artist}{loc ? ` · ${r.submittedByCity}` : ''}</p>
                {loc && <p className="truncate text-[11px] text-muted">{loc}</p>}
              </div>
            </button>
          )
        })}
        {showViewAll && (
          <button
            onClick={() => navigate('/music')}
            aria-label="View all new music"
            className="tap flex w-[120px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-card border border-dashed border-border bg-surface text-brand"
          >
            <ChevronRight className="h-6 w-6" />
            <span className="text-[12.5px] font-semibold">View All</span>
          </button>
        )}
      </div>
      <PageContainer>
        <button onClick={() => navigate('/music/submit')} className="tap mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand hover:text-brand-dark">
          <Plus className="h-3.5 w-3.5" /> Submit your music link
        </button>
      </PageContainer>
    </div>
  )
}
