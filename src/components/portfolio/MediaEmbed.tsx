import { Play, Music2 } from 'lucide-react'
import { MediaItem } from '../../portfolio/types'

// Prototype embed simulations — no real media APIs.
export default function MediaEmbed({ item }: { item: MediaItem }) {
  const isSpotify = item.type.includes('Spotify')
  const isYouTube = item.type.includes('YouTube')

  if (isSpotify) {
    return (
      <div className="flex items-center gap-3 rounded-card border border-border bg-[#0f1512] p-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-black">
          {item.thumbnail && (
            <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-white">{item.title}</p>
          <p className="truncate text-[12px] text-white/60">{item.type}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DB954] text-black">
          <Music2 className="h-4 w-4" />
        </span>
      </div>
    )
  }

  // YouTube / video default
  return (
    <div className="overflow-hidden rounded-card border border-border bg-black">
      <div className="relative aspect-video w-full bg-brand-soft">
        {item.thumbnail && (
          <img src={item.thumbnail} alt="" className="h-full w-full object-cover opacity-90" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink shadow-subtle">
            <Play className="ml-0.5 h-5 w-5 fill-ink" />
          </span>
        </div>
        {isYouTube && (
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            YouTube
          </span>
        )}
      </div>
      <div className="bg-surface px-3 py-2">
        <p className="truncate text-[13px] font-semibold text-ink">{item.title}</p>
        {item.credits && <p className="truncate text-[11.5px] text-muted">{item.credits}</p>}
      </div>
    </div>
  )
}
