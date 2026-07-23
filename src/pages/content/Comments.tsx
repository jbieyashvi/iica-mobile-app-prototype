import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, Trash2, Flag, CornerDownRight, ShieldOff } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../state/AuthContext'
import { useContentStore } from '../../state/ContentContext'
import { fmtDate } from '../../events/format'

export default function Comments() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useAuth()
  const { getRecord, contentComments, addComment, deleteComment, toggleCommentLike, reportComment, updateRecord } = useContentStore()
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1500) }

  const item = getRecord(id)
  const comments = useMemo(() => (item ? contentComments(item.id) : []), [item, contentComments])
  if (!item) return <BackHeader title="Comments" />

  const isCreator = item.createdByMe
  const post = () => {
    if (!state.authed) { navigate('/login'); return }
    if (!text.trim()) return
    addComment(item.id, text.trim(), replyTo); setText(''); setReplyTo(null); flash('Comment posted')
  }

  if (!item.allowComments) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Comments" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <ShieldOff className="h-8 w-8 text-muted" />
          <p className="mt-3 text-[14px] font-semibold text-ink">Comments are turned off</p>
          <p className="mt-1 text-[13px] text-muted">The creator has disabled comments for this content.</p>
        </div>
      </div>
    )
  }

  const roots = comments.filter((c) => !c.parentId)

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={`Comments (${item.comments})`} right={
        isCreator ? <button onClick={() => { updateRecord(item.id, { allowComments: false }); flash('Comments disabled') }} className="tap text-[12px] font-semibold text-muted hover:text-error">Disable</button> : undefined
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4">
        {roots.length === 0 && <p className="py-10 text-center text-[13px] text-muted">No comments yet. Start the conversation.</p>}
        <div className="flex flex-col gap-4">
          {roots.map((c) => {
            const replies = comments.filter((r) => r.parentId === c.id)
            return (
              <div key={c.id}>
                <CommentRow c={c} isCreator={isCreator} onLike={() => toggleCommentLike(c.id)} onReply={() => setReplyTo(c.id)} onReport={() => { reportComment(c.id); flash('Reported') }} onDelete={() => deleteComment(c.id)} />
                {replies.length > 0 && (
                  <div className="mt-3 flex flex-col gap-3 border-l border-border pl-3">
                    {replies.map((r) => <CommentRow key={r.id} c={r} isCreator={isCreator} onLike={() => toggleCommentLike(r.id)} onReply={() => setReplyTo(c.id)} onReport={() => { reportComment(r.id); flash('Reported') }} onDelete={() => deleteComment(r.id)} />)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-2.5 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        {replyTo && <p className="mb-1.5 flex items-center gap-1 text-[12px] text-muted"><CornerDownRight className="h-3.5 w-3.5" /> Replying… <button onClick={() => setReplyTo(null)} className="font-semibold text-brand">cancel</button></p>}
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={state.authed ? 'Add a comment…' : 'Sign in to comment'} onKeyDown={(e) => e.key === 'Enter' && post()} className="min-h-[44px] flex-1 rounded-control border border-border bg-surface px-3 text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
          <button onClick={post} className="tap rounded-control bg-brand px-4 text-[13px] font-semibold text-white">Post</button>
        </div>
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function CommentRow({ c, isCreator, onLike, onReply, onReport, onDelete }: {
  c: import('../../content/types').ContentComment; isCreator: boolean; onLike: () => void; onReply: () => void; onReport: () => void; onDelete: () => void
}) {
  return (
    <div className="flex gap-2.5">
      <Avatar name={c.author} src={c.avatar} size={34} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className="text-[13px] font-semibold text-ink">{c.author}</p><span className="text-[11px] text-muted">{fmtDate(c.date)}</span></div>
        <p className="mt-0.5 text-[13.5px] leading-snug text-ink/90">{c.text}</p>
        <div className="mt-1.5 flex items-center gap-4 text-[12px] text-muted">
          <button onClick={onLike} className="tap flex items-center gap-1"><Heart className={`h-4 w-4 ${c.liked ? 'fill-error text-error' : ''}`} /> {c.likes + (c.liked ? 1 : 0)}</button>
          <button onClick={onReply} className="tap font-semibold">Reply</button>
          {(c.mine || isCreator) ? (
            <button onClick={onDelete} className="tap ml-auto flex items-center gap-1 hover:text-error"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
          ) : (
            <button onClick={onReport} className={`tap ml-auto flex items-center gap-1 ${c.reported ? 'text-error' : 'hover:text-error'}`}><Flag className="h-3.5 w-3.5" /> {c.reported ? 'Reported' : 'Report'}</button>
          )}
        </div>
      </div>
    </div>
  )
}
