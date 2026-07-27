import { Play, Bookmark, BookmarkCheck, Share2 } from 'lucide-react'
import Avatar from '../Avatar'
import { ArchiveVideo } from '../../data/archive'

function fmtDate(d: string): string {
  if (!d) return ''
  const t = Date.parse(d)
  if (Number.isNaN(t)) return d
  return new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  video: ArchiveVideo
  saved: boolean
  onOpen: () => void
  onCreator: () => void
  onSave: () => void
  onShare: () => void
  variant?: 'rail' | 'list'
}

export default function ArchiveVideoCard({ video, saved, onOpen, onCreator, onSave, onShare, variant = 'list' }: Props) {
  const rail = variant === 'rail'
  return (
    <div className={`overflow-hidden rounded-card border border-border bg-surface ${rail ? 'w-[260px] shrink-0' : 'w-full'}`}>
      {/* 16:9 thumbnail */}
      <button onClick={onOpen} className="tap relative block aspect-video w-full overflow-hidden bg-brand-soft text-left">
        {video.thumbnail && <img src={video.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-subtle">
            <Play className="ml-0.5 h-5 w-5 fill-ink" />
          </span>
        </span>
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10.5px] font-semibold text-white">{video.duration}</span>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10.5px] font-semibold text-white backdrop-blur-sm">{video.category}</span>
      </button>

      <div className="p-3">
        <button onClick={onOpen} className="tap block w-full text-left">
          <h3 className="line-clamp-2 font-serif text-[15px] leading-snug text-ink">{video.title}</h3>
        </button>
        <div className="mt-2 flex items-center gap-2">
          <button onClick={onCreator} className="tap flex min-w-0 items-center gap-1.5">
            <Avatar name={video.creatorName} src={video.creatorAvatar} size={22} />
            <span className="truncate text-[12px] font-semibold text-ink">{video.creatorName}</span>
          </button>
        </div>
        <div className="mt-2 flex items-center gap-3 border-t border-border pt-2 text-[11.5px] text-muted">
          <span>{fmtDate(video.date)}</span>
          {video.views > 0 && <span>· {video.views.toLocaleString('en-IN')} views</span>}
          <button onClick={onSave} aria-label={saved ? 'Unsave' : 'Save'} className="tap ml-auto flex h-8 w-8 items-center justify-center">
            {saved ? <BookmarkCheck className="h-[17px] w-[17px] text-brand" /> : <Bookmark className="h-[17px] w-[17px]" />}
          </button>
          <button onClick={onShare} aria-label="Share" className="tap flex h-8 w-8 items-center justify-center"><Share2 className="h-[17px] w-[17px]" /></button>
        </div>
      </div>
    </div>
  )
}
