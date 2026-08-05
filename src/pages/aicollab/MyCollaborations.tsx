import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Inbox, Send as SendIcon, MapPin, Info, Trash2, Handshake, Lock } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import TextArea from '../../components/form/TextArea'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { membershipPurchaseEnabled, MEMBERSHIP_UNAVAILABLE_MSG } from '../../config/platform'
import { useAiCollab } from '../../state/AiCollabContext'
import { getMatchCreator } from '../../aicollab/creators'
import type { CollaborationRequest, CollabRequestStatus } from '../../aicollab/types'
import type { SavedMatch } from '../../state/AiCollabContext'

type Filter = 'All' | 'Saved' | 'Sent' | 'Received' | 'Active'
const FILTERS: Filter[] = ['All', 'Saved', 'Sent', 'Received', 'Active']
const tone = (s: CollabRequestStatus) => (s === 'Accepted' ? 'success' : s === 'Declined' || s === 'Cancelled' ? 'error' : s === 'Completed' ? 'brand' : 'warning')

function matchReq(r: CollaborationRequest, f: Filter): boolean {
  if (f === 'All') return true
  if (f === 'Sent') return r.direction === 'sent'
  if (f === 'Received') return r.direction === 'received'
  if (f === 'Active') return r.status === 'Accepted'
  return false
}

export default function MyCollaborations() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const access = membershipAccess(state)
  const meId = state.iicaId || state.email || 'guest'
  const { requests, savedForUser, unsaveMatch, createRequest } = useAiCollab()
  const [filter, setFilter] = useState<Filter>('All')
  const list = useMemo(() => requests.filter((r) => matchReq(r, filter)), [requests, filter])
  const saved = useMemo(() => savedForUser(meId), [savedForUser, meId])

  // Start-Collaboration review sheet (from a saved creator). Opens review only —
  // never auto-sends. Non-active members hit the membership gate here.
  const [review, setReview] = useState<SavedMatch | null>(null)
  const [gate, setGate] = useState(false)
  const [message, setMessage] = useState('')
  const sending = useRef(false)

  const startCollab = (s: SavedMatch) => {
    if (!access.isActiveMember) { setGate(true); return }
    setMessage(''); setReview(s)
  }
  const send = () => {
    if (!review || sending.current) return
    const c = getMatchCreator(review.creatorId)
    if (!c) return
    sending.current = true
    const req = createRequest({
      requirementId: review.requirementId ?? '',
      receiverUserId: c.slug, receiverName: c.name,
      title: `Collaboration with ${c.name.split(' ')[0]}`,
      description: review.reason ?? `Interested in collaborating with ${c.name}.`,
      skill: '', genre: c.genres[0] ?? '',
      proposedDate: 'Flexible',
      format: c.format === 'Flexible' ? 'In Person' : c.format,
      locationOrPlatform: c.format === 'Online' ? 'Online' : c.city,
      budget: 'Not specified', additionalNote: message.trim(),
    }, { id: meId, name: state.name || 'You' })
    navigate(`/collaborate/new/sent/${req.id}`, { replace: true })
  }

  const showSaved = filter === 'Saved'

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="My Collaborations" fallback="/collaborate" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="no-scrollbar -mx-[18px] flex gap-2 overflow-x-auto px-[18px] pb-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`tap shrink-0 rounded-control border px-3.5 py-1.5 text-[12.5px] font-semibold ${filter === f ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>
              {f}{f === 'Saved' && saved.length > 0 ? ` (${saved.length})` : ''}
            </button>
          ))}
        </div>

        {showSaved ? (
          saved.length === 0 ? (
            <Empty title="No saved creators yet" body="Bookmark a creator from your matches to keep them here for later." onNew={() => navigate('/collaborate')} cta="Find Matches" />
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {saved.map((s) => {
                const c = getMatchCreator(s.creatorId)
                if (!c) return null
                return (
                  <div key={s.creatorId} className="overflow-hidden rounded-card border border-border bg-surface">
                    <div className="flex gap-3 p-3.5">
                      <Avatar name={c.name} src={c.photo} size={56} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-[16px] leading-tight text-ink">{c.name}</p>
                        <p className="truncate text-[12px] font-semibold text-brand-dark">{c.category}</p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-muted"><MapPin className="h-3.5 w-3.5 shrink-0" /> {c.city}, {c.country}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {[...c.genres, ...c.skills].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 3).map((t) => (
                            <span key={t} className="rounded-[6px] border border-border bg-bg px-1.5 py-0.5 text-[10.5px] font-medium text-ink">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {s.reason && <p className="mx-3.5 mb-2 line-clamp-2 rounded-control bg-brand-soft px-2.5 py-1.5 text-[11.5px] leading-relaxed text-brand-dark">{s.reason}</p>}
                    <div className="flex items-center gap-2 border-t border-border p-2.5">
                      <button onClick={() => navigate(`/artist/${c.slug}`, { state: { from: '/collaborate/mine' } })} className="tap flex flex-1 items-center justify-center gap-1.5 rounded-control border border-border py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25"><Info className="h-4 w-4" /> View Profile</button>
                      <button onClick={() => startCollab(s)} className="tap flex flex-1 items-center justify-center gap-1.5 rounded-control bg-brand py-2 text-[12.5px] font-semibold text-white hover:bg-brand-dark"><Handshake className="h-4 w-4" /> Start Collaboration</button>
                      <button onClick={() => unsaveMatch(meId, s.creatorId)} aria-label="Remove from saved" className="tap flex h-[38px] w-[42px] shrink-0 items-center justify-center rounded-control border border-border text-muted hover:border-error/40 hover:text-error"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        ) : list.length === 0 ? (
          <Empty title="Nothing here yet" body="Find a collaborator and send your first request." onNew={() => navigate('/collaborate')} cta="Find Collaborators" />
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {list.map((r) => (
              <button key={r.id} onClick={() => navigate(`/collaborate/mine/${r.id}`)} className="tap rounded-card border border-border bg-surface p-3.5 text-left hover:border-ink/20">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted">{r.direction === 'received' ? <><Inbox className="h-3 w-3" /> Received</> : <><SendIcon className="h-3 w-3" /> Sent</>}</span>
                  <StatusBadge tone={tone(r.status)}>{r.status}</StatusBadge>
                </div>
                <p className="mt-1.5 font-serif text-[16px] leading-tight text-ink">{r.title}</p>
                <p className="mt-0.5 text-[12.5px] text-muted">{r.direction === 'received' ? `From ${r.senderName}` : `To ${r.receiverName}`}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-[11.5px] text-muted">{r.format} · {r.proposedDate} · <span className="font-mono">{r.id}</span></p>
                  <ChevronRight className="h-4 w-4 text-muted" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Start Collaboration review sheet (explicit send) */}
      {review && (() => {
        const c = getMatchCreator(review.creatorId)!
        return (
          <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
            <button aria-label="Close" onClick={() => setReview(null)} className="absolute inset-0 bg-ink/40" />
            <div className="fade-in relative max-h-[88%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(18px + var(--safe-bottom))' }}>
              <div className="flex items-center gap-3">
                <Avatar name={c.name} src={c.photo} size={44} />
                <div className="min-w-0 flex-1"><p className="truncate font-serif text-[17px] text-ink">{c.name}</p><p className="truncate text-[12px] text-muted">{c.category} · {c.city}</p></div>
                <span className="rounded-md bg-brand-soft px-2 py-1 text-[11px] font-semibold text-brand-dark">Review</span>
              </div>
              <div className="mt-4"><TextArea label="Message (optional)" value={message} onChange={setMessage} maxLength={300} rows={3} placeholder={`Add a note for ${c.name.split(' ')[0]}…`} /></div>
              <p className="mt-2 text-[11.5px] text-muted">Review, then send explicitly — nothing is sent automatically.</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <PrimaryButton full onClick={send}><SendIcon className="h-4 w-4" /> Send Collaboration Request</PrimaryButton>
                <SecondaryButton full onClick={() => setReview(null)}>Back to Saved</SecondaryButton>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Membership gate — shown only when starting a collaboration */}
      {gate && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setGate(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Lock className="h-6 w-6" strokeWidth={1.75} /></div>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Creator membership required</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">You can save creators freely. Sending a collaboration request needs an active IICA Creator Membership.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {!membershipPurchaseEnabled() ? (
                <p className="rounded-control bg-surface px-3.5 py-3 text-[12.5px] text-muted ring-1 ring-border">{MEMBERSHIP_UNAVAILABLE_MSG}</p>
              ) : access.hasIicaId ? (
                <PrimaryButton full onClick={() => navigate('/membership/status')}>Complete Membership Purchase</PrimaryButton>
              ) : (
                <PrimaryButton full onClick={() => navigate('/membership')}>Apply for Membership</PrimaryButton>
              )}
              <button onClick={() => setGate(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Not now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Empty({ title, body, onNew, cta }: { title: string; body: string; onNew: () => void; cta: string }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
      <p className="font-serif text-[19px] text-ink">{title}</p>
      <p className="mt-1 max-w-[260px] text-[13px] text-muted">{body}</p>
      <button onClick={onNew} className="tap mt-4 min-h-[42px] rounded-control bg-brand px-5 text-[13.5px] font-semibold text-white">{cta}</button>
    </div>
  )
}
