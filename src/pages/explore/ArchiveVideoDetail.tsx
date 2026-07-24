import { useMemo, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ChevronLeft, Play, Bookmark, BookmarkCheck, Share2, ExternalLink, BadgeCheck, ArrowRight } from 'lucide-react'
import Avatar from '../../components/Avatar'
import ArchiveVideoCard from '../../components/archive/ArchiveVideoCard'
import { useSaveGate } from '../../components/SaveGate'
import { useArchive } from '../../data/useArchive'
import { getArchiveVideo, ArchiveVideo } from '../../data/archive'
import { youTubeEmbedUrl, youTubeWatchUrl } from '../../lib/youtube'

function fmtDate(d: string): string {
  if (!d) return ''
  const t = Date.parse(d)
  return Number.isNaN(t) ? d : new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ArchiveVideoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const back = (location.state as { from?: string } | null)?.from ?? '/explore/archive'
  const { save, isSaved, sheet } = useSaveGate()
  const all = useArchive()
  const video = getArchiveVideo(all, id)

  const [playing, setPlaying] = useState(false)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const related = useMemo(() => {
    if (!video) return []
    return all.filter((v) => v.id !== video.id && (v.category === video.category || v.creatorSlug === video.creatorSlug)).slice(0, 4)
  }, [all, video])

  if (!video) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
        <p className="font-serif text-[20px] text-ink">Video not found</p>
        <button onClick={() => navigate('/explore/archive')} className="tap rounded-control bg-brand px-4 py-2 text-[14px] font-semibold text-white">Back to Archive</button>
      </div>
    )
  }

  const embeddable = !!video.videoId
  const openCreator = () => navigate(`/artist/${video.creatorSlug}`, { state: { from: `/archive/video/${video.id}` } })
  const openVideo = (v: ArchiveVideo) => navigate(`/archive/video/${v.id}`, { state: { from: back } })

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={() => navigate(back)} aria-label="Back" className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
        <span className="truncate font-serif text-[16px] text-ink">Archive</span>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}>
        {/* Player */}
        <div className="relative aspect-video w-full bg-black">
          {embeddable && playing ? (
            <iframe
              className="h-full w-full"
              src={youTubeEmbedUrl(video.videoId) + '&autoplay=1'}
              title={video.title}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : embeddable ? (
            <button onClick={() => setPlaying(true)} className="tap group relative block h-full w-full text-left">
              {video.thumbnail && <img src={video.thumbnail} alt="" className="h-full w-full object-cover" />}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink shadow-subtle"><Play className="ml-0.5 h-6 w-6 fill-ink" /></span>
              </span>
            </button>
          ) : (
            /* non-embeddable fallback */
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              {video.thumbnail && <img src={video.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
              <p className="relative z-10 text-[14px] font-semibold text-white">This video can’t be played inside IICA.</p>
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="relative z-10 flex items-center gap-1.5 rounded-control bg-white px-4 py-2 text-[13px] font-semibold text-ink">
                <ExternalLink className="h-4 w-4" /> Watch on YouTube
              </a>
            </div>
          )}
        </div>

        <div className="px-[18px] py-4">
          <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-dark">{video.category}</span>
          <h1 className="mt-2 font-serif text-[22px] leading-tight text-ink">{video.title}</h1>
          <p className="mt-1 text-[12.5px] text-muted">
            {fmtDate(video.date)}{video.duration ? ` · ${video.duration}` : ''}{video.views > 0 ? ` · ${video.views.toLocaleString('en-IN')} views` : ''}
          </p>

          {/* creator */}
          <button onClick={openCreator} className="tap mt-3 flex w-full items-center gap-3 rounded-card border border-border bg-surface p-3 text-left hover:border-ink/20">
            <Avatar name={video.creatorName} src={video.creatorAvatar} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1"><span className="truncate text-[14px] font-semibold text-ink">{video.creatorName}</span>{video.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />}</div>
              <p className="truncate text-[12px] text-muted">{video.creatorCategory}</p>
            </div>
            <span className="flex items-center gap-0.5 text-[12px] font-semibold text-brand">Portfolio <ArrowRight className="h-3.5 w-3.5" /></span>
          </button>

          {/* actions */}
          <div className="mt-3 flex gap-2.5">
            <button onClick={() => save('video:' + video.id)} className="tap flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-control border border-border bg-surface text-[13.5px] font-semibold text-ink hover:border-ink/25">
              {isSaved('video:' + video.id) ? <><BookmarkCheck className="h-4 w-4 text-brand" /> Saved</> : <><Bookmark className="h-4 w-4" /> Save</>}
            </button>
            <button onClick={() => { navigator.clipboard?.writeText(`https://iica.app/archive/video/${video.id}`); flash('Link copied') }} className="tap flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-control border border-border bg-surface text-[13.5px] font-semibold text-ink hover:border-ink/25">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {video.description && <p className="mt-4 text-[13.5px] leading-relaxed text-ink">{video.description}</p>}
          {video.credits && <p className="mt-3 text-[12.5px] text-muted"><span className="font-semibold text-ink">Credits:</span> {video.credits}</p>}
          {video.tags.length > 0 && <p className="mt-2 text-[12px] text-brand-dark">{video.tags.map((t) => '#' + t.replace(/\s+/g, '')).join(' ')}</p>}
          <a href={embeddable ? youTubeWatchUrl(video.videoId) : video.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand"><ExternalLink className="h-3.5 w-3.5" /> Watch on YouTube</a>

          {/* related */}
          {related.length > 0 && (
            <section className="mt-7">
              <h2 className="mb-2.5 font-serif text-[18px] text-ink">Related in Archive</h2>
              <div className="no-scrollbar -mx-[18px] flex gap-3 overflow-x-auto px-[18px] pb-1">
                {related.map((v) => (
                  <ArchiveVideoCard key={v.id} video={v} variant="rail" saved={isSaved('video:' + v.id)}
                    onOpen={() => openVideo(v)} onCreator={() => navigate(`/artist/${v.creatorSlug}`, { state: { from: `/archive/video/${video.id}` } })}
                    onSave={() => save('video:' + v.id)} onShare={() => { navigator.clipboard?.writeText(`https://iica.app/archive/video/${v.id}`); flash('Link copied') }} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {sheet}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-10 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
