import { useState } from 'react'
import { Music2, Play, VideoOff } from 'lucide-react'
import type { NewMusicRecord } from '../../state/NewMusicContext'

// YouTube thumbnail with graceful fallbacks:
//  - invalid/missing video id → stable "Video unavailable" card (never blank)
//  - image load failure → branded placeholder
// Never embeds a player; tapping opens YouTube in a new tab.
export default function MusicThumb({ record, rounded = 'top' }: { record: NewMusicRecord; rounded?: 'top' | 'all' }) {
  const [failed, setFailed] = useState(false)
  const radius = rounded === 'all' ? 'rounded-[10px]' : 'rounded-t-card'
  const alt = `${record.title} by ${record.artist} — open on YouTube`

  if (!record.videoId) {
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
          <Music2 className="h-6 w-6" strokeWidth={1.6} />
          <span className="text-[10.5px] font-semibold text-muted">Thumbnail unavailable</span>
        </div>
      ) : (
        <img src={record.thumbnail} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-subtle">
          <Play className="ml-0.5 h-5 w-5 fill-ink" />
        </span>
      </span>
    </div>
  )
}

// Safely open a record's YouTube link in a new tab.
export function openMusic(record: NewMusicRecord) {
  if (!record.videoId || !record.url) return
  window.open(record.url, '_blank', 'noopener,noreferrer')
}

export function addedLabel(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
