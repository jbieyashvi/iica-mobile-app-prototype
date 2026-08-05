import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Pencil, Sparkles, Lock, X, Check, Send, RotateCcw, Heart } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import AiSwipeCard from '../../components/aicollab/AiSwipeCard'
import Avatar from '../../components/Avatar'
import TextArea from '../../components/form/TextArea'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { membershipPurchaseEnabled, MEMBERSHIP_UNAVAILABLE_MSG } from '../../config/platform'
import { useAiCollab } from '../../state/AiCollabContext'
import { matchCreators } from '../../aicollab/match'
import { getMatchCreator } from '../../aicollab/creators'
import type { CollaborationMatch } from '../../aicollab/types'

function useReducedMotion() {
  const [rm, setRm] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setRm(mq.matches)
    const on = () => setRm(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return rm
}

export default function MatchResults() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useAuth()
  const access = membershipAccess(state)
  const { current, swipe, ensureSwipe, swipeSkip, swipeInterest, createRequest } = useAiCollab()
  const reducedMotion = useReducedMotion()

  const matches = useMemo(() => (current ? matchCreators(current) : []), [current])
  const [review, setReview] = useState<CollaborationMatch | null>(null)
  const [message, setMessage] = useState('')
  const [gate, setGate] = useState(false)
  const sending = useRef(false)

  useEffect(() => { if (current) ensureSwipe(current.id) }, [current, ensureSwipe])
  // Open review sheet when returning from a profile via "Interested in Collaborating".
  useEffect(() => {
    const rc = (location.state as { reviewCreator?: string } | null)?.reviewCreator
    if (rc) { const m = matches.find((x) => x.creatorId === rc); if (m) startReview(m); navigate(location.pathname, { replace: true, state: {} }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, matches])

  if (!current) return <Navigate to="/collaborate" replace />
  if (access.isGuest) return <Navigate to="/collaborate/confirm" replace />
  // Suspended/expired members are read-only — no new matching sessions.
  if (access.isSuspended) return <Navigate to="/collaborate" replace />

  const decided = new Set([...(swipe?.skipped ?? []), ...(swipe?.interested ?? [])])
  const stack = matches.filter((m) => !decided.has(m.creatorId))
  const active = stack[0]
  const next = stack[1]
  const viewed = (swipe?.skipped.length ?? 0) + (swipe?.interested.length ?? 0)

  const canSend = access.isActiveMember
  const startReview = (m: CollaborationMatch) => {
    if (!canSend) { setGate(true); return }
    setMessage(''); setReview(m)
  }
  const doSkip = () => active && swipeSkip(active.creatorId)
  const doInterest = () => active && startReview(active)

  const send = () => {
    if (!review || sending.current) return
    sending.current = true
    const c = getMatchCreator(review.creatorId)!
    const req = createRequest({
      requirementId: current.id, receiverUserId: c.slug, receiverName: c.name,
      title: `${current.role} — ${current.purpose !== 'Not specified' ? current.purpose : 'Collaboration'}`,
      description: current.originalText,
      skill: current.skill !== 'Not specified' ? current.skill : '',
      genre: current.genre !== 'Not specified' ? current.genre : '',
      proposedDate: current.preferredDate !== 'Not specified' ? current.preferredDate : 'Flexible',
      format: current.format === 'Flexible' ? 'In Person' : current.format,
      locationOrPlatform: current.location !== 'Any location' && current.location !== 'Near Me' ? current.location : (current.format === 'Online' ? 'To be decided' : ''),
      budget: current.budget, additionalNote: message.trim(),
    }, { id: state.iicaId || state.email || 'me', name: state.name || 'You' })
    swipeInterest(review.creatorId)
    navigate(`/collaborate/new/sent/${req.id}`, { replace: true })
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="Creator Matches" />
      <div className="flex flex-1 flex-col overflow-hidden px-[18px] pb-4 pt-3">
        {/* requirement summary */}
        <div className="flex items-start gap-2 rounded-card border border-border bg-surface p-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink">{current.role}{current.location !== 'Any location' ? ` · ${current.location}` : ''}</p>
            <p className="truncate text-[12px] text-muted">{[current.genre, current.format, current.preferredDate].filter((x) => x && x !== 'Not specified').join(' · ')}</p>
          </div>
          <button onClick={() => navigate('/collaborate/confirm')} aria-label="Edit requirement" className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Pencil className="h-3.5 w-3.5" /> Edit</button>
        </div>

        {!canSend && (
          <div className="mt-2 flex items-start gap-2 rounded-control border border-warning/30 bg-[#F7F0E4] px-3 py-2 text-[12px] text-[#7a5412]">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /><span>Browse matches freely. Sending a request needs an active IICA Creator Membership.</span>
          </div>
        )}

        {/* ---- states ---- */}
        {matches.length === 0 ? (
          <NoMatch onEdit={() => navigate('/collaborate/confirm')} onNew={() => navigate('/collaborate')} />
        ) : stack.length === 0 ? (
          <EndOfStack viewed={viewed} interested={swipe?.interested.length ?? 0} onMine={() => navigate('/collaborate/mine')} onNew={() => navigate('/collaborate')} />
        ) : (
          <>
            <div className="relative mx-auto mt-3 w-full max-w-[360px] flex-1">
              {next && (
                <div className="absolute inset-0 scale-[0.96] opacity-60" style={{ transform: 'translateY(10px) scale(0.96)' }} aria-hidden>
                  <div className="h-full overflow-hidden rounded-card border border-border bg-surface">
                    <div className="h-[50%] w-full overflow-hidden bg-brand-soft"><img src={getMatchCreator(next.creatorId)?.photo} alt="" className="h-full w-full object-cover" /></div>
                  </div>
                </div>
              )}
              {active && getMatchCreator(active.creatorId) && (
                <AiSwipeCard
                  key={active.creatorId}
                  creator={getMatchCreator(active.creatorId)!}
                  match={active}
                  reducedMotion={reducedMotion}
                  onSkip={doSkip}
                  onInterest={doInterest}
                  onView={() => navigate(`/artist/${active.creatorId}`, { state: { from: '/collaborate/matches', collabSelect: true } })}
                />
              )}
            </div>

            {/* accessible fallback buttons (same as gestures) */}
            <div className="mt-3 flex items-center justify-center gap-4">
              <button onClick={doSkip} aria-label="Skip" className="tap flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-error shadow-subtle hover:border-error/40"><X className="h-6 w-6" /></button>
              <p className="text-[11.5px] text-muted">{stack.length} left</p>
              <button onClick={doInterest} aria-label="Interested" className="tap flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-subtle hover:bg-brand-dark"><Heart className="h-6 w-6" /></button>
            </div>
          </>
        )}
      </div>

      {/* ---- swipe-right review sheet ---- */}
      {review && (() => {
        const c = getMatchCreator(review.creatorId)!
        return (
          <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
            <button aria-label="Close" onClick={() => setReview(null)} className="absolute inset-0 bg-ink/40" />
            <div className="fade-in relative max-h-[88%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(18px + var(--safe-bottom))' }}>
              <div className="flex items-center gap-3">
                <Avatar name={c.name} src={c.photo} size={44} />
                <div className="min-w-0 flex-1"><p className="truncate font-serif text-[17px] text-ink">{c.name}</p><p className="truncate text-[12px] text-muted">{c.category} · {c.city}</p></div>
                <span className="rounded-md bg-brand-soft px-2 py-1 text-[11px] font-semibold text-brand-dark">Interested</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-card border border-border">
                <Row label="Purpose" value={current.purpose !== 'Not specified' ? current.purpose : 'Collaboration'} />
                <Row label="Format" value={current.format} />
                <Row label="Location" value={current.location} />
                {current.preferredDate !== 'Not specified' && <Row label="Preferred date" value={current.preferredDate} />}
              </div>
              <div className="mt-4"><TextArea label="Message (optional)" value={message} onChange={setMessage} maxLength={300} rows={3} placeholder={`Add a note for ${c.name.split(' ')[0]}…`} /></div>
              <p className="mt-2 text-[11.5px] text-muted">Swiping right doesn’t send anything — review, then send explicitly.</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <PrimaryButton full onClick={send}><Send className="h-4 w-4" /> Send Collaboration Request</PrimaryButton>
                <SecondaryButton full onClick={() => setReview(null)}>Back to Matches</SecondaryButton>
              </div>
            </div>
          </div>
        )
      })()}

      {/* membership gate for non-active members */}
      {gate && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setGate(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Lock className="h-6 w-6" strokeWidth={1.75} /></div>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Creator membership required</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Sending collaboration requests is available to active IICA Creator Members.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {!membershipPurchaseEnabled() ? (
                <p className="rounded-control bg-surface px-3.5 py-3 text-[12.5px] text-muted ring-1 ring-border">{MEMBERSHIP_UNAVAILABLE_MSG}</p>
              ) : access.hasIicaId ? (
                <PrimaryButton full onClick={() => navigate('/membership/status')}>Complete Membership Purchase</PrimaryButton>
              ) : (
                <PrimaryButton full onClick={() => navigate('/membership')}>Apply for Membership</PrimaryButton>
              )}
              <button onClick={() => setGate(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Keep Browsing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-border px-4 py-2.5 last:border-b-0 text-[13px]"><span className="text-muted">{label}</span><span className="font-semibold text-ink">{value}</span></div>
}

function NoMatch({ onEdit, onNew }: { onEdit: () => void; onNew: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
      <p className="font-serif text-[20px] text-ink">No strong match yet</p>
      <p className="mt-1 max-w-[260px] text-[13px] text-muted">We couldn’t find a strong match for this requirement. Try broadening the location or genre.</p>
      <div className="mt-4 flex w-full max-w-[260px] flex-col gap-2.5">
        <PrimaryButton full onClick={onEdit}><Pencil className="h-4 w-4" /> Edit Requirement</PrimaryButton>
        <SecondaryButton full onClick={onNew}><RotateCcw className="h-4 w-4" /> Try Another Search</SecondaryButton>
      </div>
    </div>
  )
}

function EndOfStack({ viewed, interested, onMine, onNew }: { viewed: number; interested: number; onMine: () => void; onNew: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><Check className="h-6 w-6" /></span>
      <p className="mt-3 font-serif text-[20px] text-ink">You’ve seen every match</p>
      <p className="mt-1 text-[13px] text-muted">{viewed} viewed · {interested} interested</p>
      <div className="mt-4 flex w-full max-w-[260px] flex-col gap-2.5">
        <PrimaryButton full onClick={onMine}>Review Selected Creators</PrimaryButton>
        <SecondaryButton full onClick={onNew}><RotateCcw className="h-4 w-4" /> Start New Search</SecondaryButton>
      </div>
    </div>
  )
}
