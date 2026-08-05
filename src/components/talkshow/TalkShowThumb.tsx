import { useState } from 'react'
import { Tv, Play, VideoOff } from 'lucide-react'
import type { TalkShowEpisode } from '../../state/TalkShowContext'

// YouTube thumbnail for a Talk Show episode with graceful fallbacks:
//  - invalid/missing video id → stable "Video unavailable" (never blank)
//  - image load failure → branded placeholder
// Never embeds a player; tapping opens YouTube in a new tab.
export default function TalkShowThumb({ episode, rounded = 'top' }: { episode: TalkShowEpisode; rounded?: 'top' | 'all' }) {
  const [failed, setFailed] = useState(false)
  const radius = rounded === 'all' ? 'rounded-[10px]' : 'rounded-t-card'
  const alt = `${episode.title}${episode.guest ? ` with ${episode.guest}` : ''} — open on YouTube`

  if (!episode.videoId) {
    return (
      <div className={`relative flex aspect-video w-full flex-col items-center justify-center gap-1 bg-brand-soft ${radius}`}>
        <VideoOff className="h-6 w-6 text-muted" strokeWidth={1.6} />
        <span className="text-[11px] font-semibold text-muted">Video unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-brand-soft ${radius}`}>
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-brand-dark">
          <Tv className="h-6 w-6" strokeWidth={1.6} />
          <span className="text-[10.5px] font-semibold text-muted">Thumbnail unavailable</span>
        </div>
      ) : (
        <img src={episode.thumbnail} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-subtle">
          <Play className="ml-0.5 h-5 w-5 fill-ink" />
        </span>
      </span>
    </div>
  )
}

export function openEpisode(ep: TalkShowEpisode) {
  if (!ep.videoId || !ep.url) return
  window.open(ep.url, '_blank', 'noopener,noreferrer')
}

export function releaseLabel(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
