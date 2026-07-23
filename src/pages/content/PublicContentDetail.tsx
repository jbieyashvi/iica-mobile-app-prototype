import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, BookmarkCheck, Share2, Eye, Download, UserPlus, X, ChevronRight } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import MediaViewer from '../../components/content/MediaViewer'
import ShareSheet from '../../components/explore/ShareSheet'
import { ContentCard } from '../../components/explore/cards'
import { useSaveGate } from '../../components/SaveGate'
import { useLikes } from '../../state/useExplore'
import { useAuth } from '../../state/AuthContext'
import { useContentStore } from '../../state/ContentContext'
import { fmtDate } from '../../events/format'

export default function PublicContentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useAuth()
  const { getRecord, records, incrementView, registerShare, registerDownload, contentComments, addComment } = useContentStore()
  const { save, isSaved, sheet } = useSaveGate()
  const { isLiked, toggle } = useLikes()
  const [share, setShare] = useState(false)
  const [gate, setGate] = useState(false)
  const [comment, setComment] = useState('')
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const viewed = useRef(false)

  const item = getRecord(id)
  useEffect(() => { if (item && !viewed.current) { viewed.current = true; incrementView(item.id) } }, [item, incrementView])

  const comments = useMemo(() => (item ? contentComments(item.id) : []), [item, contentComments])
  const related = useMemo(() => records.filter((r) => item && r.id !== item.id && r.status === 'published' && r.category === item.category).slice(0, 4), [records, item])
  const more = useMemo(() => records.filter((r) => item && r.id !== item.id && r.status === 'published' && r.creatorSlug === item.creatorSlug).slice(0, 4), [records, item])

  if (!item) return <BackHeader title="Content" />
  const liked = isLiked(item.id)
  const savedKey = 'content:' + item.id

  const onLike = () => { if (!state.authed) { setGate(true); return } toggle(item.id) }
  const onComment = () => {
    if (!state.authed) { setGate(true); return }
    if (!comment.trim()) return
    addComment(item.id, comment.trim()); setComment(''); flash('Comment posted')
  }
  const onDownload = () => { registerDownload(item.id); flash('Download started (prototype)') }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={item.type} right={
        item.allowSharing ? <button onClick={() => { setShare(true); registerShare(item.id) }} aria-label="Share" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Share2 className="h-5 w-5" /></button> : undefined
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        <div className="px-[18px] pt-3">
          <MediaViewer item={item} canDownload={item.download === 'download'} onDownload={onDownload} />

          {/* Creator */}
          <div className="mt-4 flex items-center gap-2.5">
            <button onClick={() => navigate(`/artist/${item.creatorSlug}`)} className="tap flex items-center gap-2.5 text-left">
              <Avatar name={item.creator} src={item.creatorAvatar} size={42} />
              <div><p className="text-[14px] font-semibold text-ink">{item.creator}</p><p className="text-[12px] text-muted">{fmtDate(item.date)} · {item.type}</p></div>
            </button>
            <button onClick={() => flash('Following creator')} className="tap ml-auto flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:border-ink/25"><UserPlus className="h-3.5 w-3.5" /> Follow</button>
          </div>

          <h1 className="mt-4 font-serif text-[24px] leading-tight text-ink">{item.title}</h1>
          {item.mature && <div className="mt-1.5"><StatusBadge tone="warning">Mature / Sensitive</StatusBadge></div>}
          <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-ink/90">{item.fullDescription || item.description}</p>
          {item.tags.length > 0 && <p className="mt-2 text-[12.5px] text-brand-dark">{item.tags.map((t) => '#' + t.replace(/\s+/g, '')).join(' ')}</p>}
          {item.credits.length > 0 && <p className="mt-2 text-[12.5px] text-muted"><span className="font-semibold text-ink">Credits: </span>{item.credits.map((c) => `${c.name} — ${c.role}`).join(' · ')}</p>}
          {item.collectionId && <button onClick={() => navigate(`/creator/collections/${item.collectionId}`)} className="tap mt-2 text-[12.5px] font-semibold text-brand">In a collection ›</button>}

          {/* Engagement bar */}
          <div className="mt-4 flex items-center gap-4 border-y border-border py-3 text-[13px] text-muted">
            {item.allowLikes && <button onClick={onLike} className="tap flex items-center gap-1.5"><Heart className={`h-5 w-5 ${liked ? 'fill-error text-error' : ''}`} /> {item.likes + (liked ? 1 : 0)}</button>}
            {item.allowComments && <button onClick={() => navigate(`/content/${item.id}/comments`)} className="tap flex items-center gap-1.5"><MessageCircle className="h-5 w-5" /> {item.comments}</button>}
            {item.showViews && <span className="flex items-center gap-1.5"><Eye className="h-5 w-5" /> {item.views.toLocaleString('en-IN')}</span>}
            <button onClick={() => (state.authed ? save(savedKey) : setGate(true))} className="tap ml-auto flex h-9 w-9 items-center justify-center">{isSaved(savedKey) ? <BookmarkCheck className="h-5 w-5 text-brand" /> : <Bookmark className="h-5 w-5" />}</button>
            {item.download === 'download' && <button onClick={onDownload} aria-label="Download" className="tap flex h-9 w-9 items-center justify-center"><Download className="h-5 w-5" /></button>}
          </div>
          {item.download === 'download' && item.usageNote && <p className="mt-1.5 text-[11.5px] text-muted">{item.usageNote}{item.downloadLimit ? ` · ${item.downloadLimit}` : ''}</p>}
        </div>

        {/* Comments */}
        {item.allowComments && (
          <div className="mt-6 px-[18px]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[18px] text-ink">Comments ({item.comments})</h2>
              <button onClick={() => navigate(`/content/${item.id}/comments`)} className="tap text-[12.5px] font-semibold text-brand">View all</button>
            </div>
            <div className="mt-3 flex gap-2">
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder={state.authed ? 'Add a comment…' : 'Sign in to comment'} onFocus={() => { if (!state.authed) setGate(true) }} className="min-h-[42px] flex-1 rounded-control border border-border bg-surface px-3 text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
              <button onClick={onComment} className="tap rounded-control bg-brand px-4 text-[13px] font-semibold text-white">Post</button>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {comments.slice(0, 2).map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <Avatar name={c.author} src={c.avatar} size={32} />
                  <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-ink">{c.author}</p><p className="text-[13px] leading-snug text-ink/90">{c.text}</p></div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-[13px] text-muted">Be the first to comment.</p>}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-7">
            <h2 className="px-[18px] font-serif text-[18px] text-ink">Related content</h2>
            <div className="mt-3 flex flex-col gap-3.5 px-[18px]">
              {related.map((c) => <ContentCard key={c.id} item={c} saved={isSaved('content:' + c.id)} liked={isLiked(c.id)} onSave={(k) => (state.authed ? save(k) : setGate(true))} onLike={() => (state.authed ? toggle(c.id) : setGate(true))} onShare={() => setShare(true)} />)}
            </div>
          </div>
        )}

        {/* More from creator */}
        {more.length > 0 && (
          <div className="mt-7">
            <div className="flex items-center justify-between px-[18px]"><h2 className="font-serif text-[18px] text-ink">More from {item.creator}</h2></div>
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-[18px] pb-1">
              {more.map((c) => (
                <button key={c.id} onClick={() => navigate(`/content/${c.id}`)} className="tap w-[180px] shrink-0 overflow-hidden rounded-card border border-border bg-surface text-left">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-brand-soft"><img src={c.thumbnail} alt="" className="h-full w-full object-cover" /></div>
                  <div className="p-2.5"><p className="line-clamp-2 text-[13px] font-semibold text-ink">{c.title}</p><p className="mt-0.5 text-[11.5px] text-muted">{c.type}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {sheet}
      {share && <ShareSheet title={item.title} url={`https://iica.app/content/${item.id}`} onClose={() => setShare(false)} onToast={flash} />}
      {gate && <AuthGate onClose={() => setGate(false)} onSignup={() => navigate('/signup')} onLogin={() => navigate('/login')} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function AuthGate({ onClose, onSignup, onLogin }: { onClose: () => void; onSignup: () => void; onLogin: () => void }) {
  return (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <button aria-label="Close" onClick={onClose} className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Heart className="h-6 w-6" strokeWidth={1.75} /></div>
        <h2 className="font-serif text-[23px] leading-tight text-ink">Sign in to interact</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Create a free account to like, comment and save content. We’ll bring you right back.</p>
        <div className="mt-5 flex flex-col gap-2.5">
          <PrimaryButton full onClick={onSignup}>Create an Account</PrimaryButton>
          <button onClick={onLogin} className="tap flex min-h-[44px] items-center justify-center gap-1 text-[14px] font-semibold text-muted hover:text-ink">Sign In <ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )
}
