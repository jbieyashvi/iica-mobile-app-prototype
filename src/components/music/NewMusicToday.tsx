import { useNavigate } from 'react-router-dom'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import MusicThumb, { openMusic, addedLabel } from './MusicThumb'
import { useNewMusic } from '../../state/NewMusicContext'

const HOME_MAX = 6

// Compact Home carousel of Admin-featured "New Music Today". Hidden entirely
// when nothing is featured, to keep Home compact. No embedded players.
export default function NewMusicToday() {
  const navigate = useNavigate()
  const { featured } = useNewMusic()

  if (featured.length === 0) return null
  const items = featured.slice(0, HOME_MAX)

  return (
    <div>
      <PageContainer>
        <SectionHeader title="New Music Today" action="View All" onAction={() => navigate('/music')} />
        <p className="-mt-1 mb-3 text-[12.5px] text-muted">Discover fresh music selected by IICA.</p>
      </PageContainer>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
        {items.map((r) => (
          <button
            key={r.id}
            onClick={() => openMusic(r)}
            aria-label={`Open ${r.title} by ${r.artist} on YouTube`}
            className="tap w-[220px] shrink-0 overflow-hidden rounded-card border border-border bg-surface text-left"
          >
            <MusicThumb record={r} />
            <div className="p-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-brand">{r.genre}</span>
              <h3 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug text-ink">{r.title}</h3>
              <p className="mt-0.5 truncate text-[12px] text-muted">{r.artist}</p>
              <p className="mt-0.5 text-[11px] text-muted">Added {addedLabel(r.featuredAt || r.submittedAt)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
