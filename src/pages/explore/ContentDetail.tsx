import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, BookmarkCheck, Share2, Play, FileText, Music2, Image as ImageIcon, Megaphone } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import ShareSheet from '../../components/explore/ShareSheet'
import { useSaveGate } from '../../components/SaveGate'
import { useLikes } from '../../state/useExplore'
import { getContent, ContentType } from '../../data/exploreData'
import { fmtDate } from '../../events/format'

const typeIcon: Record<ContentType, typeof Play> = { Video: Play, Image: ImageIcon, Audio: Music2, PDF: FileText, 'Artist Update': Megaphone }

export default function ContentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = getContent(id)
  const { save, isSaved, sheet } = useSaveGate()
  const { isLiked, toggle } = useLikes()
  const [share, setShare] = useState(false)
  const [toast, setToast] = useState('')

  if (!item) return <BackHeader title="Content" />
  const Icon = typeIcon[item.type]
  const key = 'content:' + item.id
  const liked = isLiked(item.id)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={item.type} right={
        <button onClick={() => setShare(true)} aria-label="Share" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Share2 className="h-5 w-5" /></button>
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-soft">
          <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
          {(item.type === 'Video' || item.type === 'Audio') && (
            <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink"><Play className="ml-0.5 h-6 w-6 fill-ink" /></span></span>
          )}
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-ink/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm"><Icon className="h-3 w-3" /> {item.type}</span>
        </div>

        <div className="px-[18px]">
          <button onClick={() => navigate(`/artist/${item.creatorSlug}`)} className="tap mt-4 flex items-center gap-2.5 text-left">
            <Avatar name={item.creator} src={item.creatorAvatar} size={40} />
            <div><p className="text-[14px] font-semibold text-ink">{item.creator}</p><p className="text-[12px] text-muted">{fmtDate(item.date)}</p></div>
          </button>
          <h1 className="mt-4 font-serif text-[24px] leading-tight text-ink">{item.title}</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/90">{item.description}</p>
          {item.tags.length > 0 && <p className="mt-2 text-[12.5px] text-brand-dark">{item.tags.map((t) => '#' + t.replace(/\s+/g, '')).join(' ')}</p>}

          <div className="mt-4 flex items-center gap-4 border-y border-border py-3 text-[13px] text-muted">
            <button onClick={() => toggle(item.id)} className="tap flex items-center gap-1.5"><Heart className={`h-5 w-5 ${liked ? 'fill-error text-error' : ''}`} /> {item.likes + (liked ? 1 : 0)}</button>
            <span className="flex items-center gap-1.5"><MessageCircle className="h-5 w-5" /> {item.comments}</span>
            <button onClick={() => save(key)} className="tap ml-auto flex h-9 w-9 items-center justify-center">{isSaved(key) ? <BookmarkCheck className="h-5 w-5 text-brand" /> : <Bookmark className="h-5 w-5" />}</button>
          </div>

          <div className="mt-6 rounded-card border border-border bg-surface p-4 text-center">
            <StatusBadge tone="neutral">Prototype</StatusBadge>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">Full media playback, comments and the content feed will be built in a later phase.</p>
            <div className="mt-3"><PrimaryButton full onClick={() => navigate(`/artist/${item.creatorSlug}`)}>View Creator</PrimaryButton></div>
          </div>
        </div>
      </div>

      {sheet}
      {share && <ShareSheet title={item.title} url={`https://iica.app/content/${item.id}`} onClose={() => setShare(false)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
