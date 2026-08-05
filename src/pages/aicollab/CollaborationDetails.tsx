import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check, X, Ban, MessageCircle, CheckCheck, UserRound } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import TextArea from '../../components/form/TextArea'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { useAiCollab } from '../../state/AiCollabContext'
import type { CollabRequestStatus } from '../../aicollab/types'
import { fmtDate } from '../../events/format'

const tone = (s: CollabRequestStatus) => (s === 'Accepted' ? 'success' : s === 'Declined' || s === 'Cancelled' ? 'error' : s === 'Completed' ? 'brand' : 'warning')
type Confirm = null | 'accept' | 'decline' | 'cancel' | 'complete'

export default function CollaborationDetails() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { state } = useAuth()
  const access = membershipAccess(state)
  const { getRequest, accept, decline, cancel, complete } = useAiCollab()
  const req = getRequest(requestId)
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [reason, setReason] = useState('')
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  if (!req) return <Navigate to="/collaborate/mine" replace />

  const other = req.direction === 'received' ? { name: req.senderName, slug: req.senderUserId } : { name: req.receiverName, slug: req.receiverUserId }
  const readOnly = access.isSuspended // suspended/expired: read-only, data preserved
  const isReceived = req.direction === 'received'
  const isSent = req.direction === 'sent'

  const run = () => {
    if (confirm === 'accept') { accept(req.id); flash('Request accepted') }
    else if (confirm === 'decline') { decline(req.id, reason.trim() || undefined); flash('Request declined') }
    else if (confirm === 'cancel') { cancel(req.id); flash('Request cancelled') }
    else if (confirm === 'complete') { complete(req.id); flash('Marked completed') }
    setConfirm(null); setReason('')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="Collaboration" fallback="/collaborate/mine" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-[22px] leading-tight text-ink">{req.title}</h1>
          <StatusBadge tone={tone(req.status)}>{req.status}</StatusBadge>
        </div>
        <p className="mt-1 text-[12.5px] text-muted">{isReceived ? `From ${req.senderName}` : `To ${req.receiverName}`} · <span className="font-mono">{req.id}</span></p>

        <div className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
          <Row label="Participants" value={`${req.senderName} → ${req.receiverName}`} />
          <Row label="Description" value={req.description} />
          <Row label="Skill / Genre" value={[req.skill, req.genre].filter(Boolean).join(' · ') || '—'} />
          <Row label="Proposed date" value={req.proposedDate || 'Flexible'} />
          <Row label="Format" value={req.format} />
          <Row label={req.format === 'Online' ? 'Platform' : 'Location'} value={req.locationOrPlatform || '—'} />
          <Row label="Budget" value={req.budget} />
          <Row label="Sent" value={fmtDate(req.createdAt.slice(0, 10))} />
          {req.status === 'Declined' && req.declineReason && <Row label="Decline reason" value={req.declineReason} />}
        </div>

        <button onClick={() => navigate(`/artist/${other.slug}`, { state: { from: `/collaborate/mine/${req.id}` } })} className="tap mt-3 flex w-full items-center gap-2 rounded-control border border-border bg-surface px-4 py-3 text-left hover:border-ink/20">
          <UserRound className="h-5 w-5 shrink-0 text-brand" /><span className="flex-1 text-[13.5px] font-semibold text-ink">View {isReceived ? 'sender' : 'creator'} profile</span>
        </button>

        {readOnly && <p className="mt-4 rounded-control bg-surface px-3.5 py-3 text-[12.5px] text-muted ring-1 ring-border">Your membership is inactive — this collaboration is read-only. Your data is preserved.</p>}

        {/* Actions by role + status */}
        {!readOnly && (
          <div className="mt-5 flex flex-col gap-2.5">
            {req.status === 'Sent' && isReceived && (
              <>
                <PrimaryButton full onClick={() => setConfirm('accept')}><Check className="h-4 w-4" /> Accept Request</PrimaryButton>
                <SecondaryButton full onClick={() => setConfirm('decline')}><X className="h-4 w-4" /> Decline Request</SecondaryButton>
              </>
            )}
            {req.status === 'Sent' && isSent && (
              <SecondaryButton full onClick={() => setConfirm('cancel')}><Ban className="h-4 w-4" /> Cancel Request</SecondaryButton>
            )}
            {req.status === 'Accepted' && (
              <>
                <PrimaryButton full onClick={() => flash('Messaging opens for accepted collaborations (prototype)')}><MessageCircle className="h-4 w-4" /> Message Collaborator</PrimaryButton>
                <SecondaryButton full onClick={() => setConfirm('complete')}><CheckCheck className="h-4 w-4" /> Mark Completed</SecondaryButton>
              </>
            )}
          </div>
        )}

        {req.status !== 'Accepted' && (
          <p className="mt-4 text-[11.5px] leading-relaxed text-muted">Private messaging opens only after a request is accepted. Until then, these details are your shared context.</p>
        )}
      </div>

      {confirm && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setConfirm(null)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h3 className="font-serif text-[21px] text-ink">
              {confirm === 'accept' ? 'Accept this request?' : confirm === 'decline' ? 'Decline this request?' : confirm === 'cancel' ? 'Cancel this request?' : 'Mark as completed?'}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {confirm === 'accept' ? 'It moves into your active collaborations and messaging opens.' : confirm === 'decline' ? 'The sender is notified. You can add a short reason.' : confirm === 'cancel' ? 'The request will be withdrawn.' : 'This closes the collaboration as completed.'}
            </p>
            {confirm === 'decline' && <div className="mt-3"><TextArea label="Reason (optional)" value={reason} onChange={setReason} maxLength={200} rows={2} placeholder="e.g. Travelling that week" /></div>}
            <div className="mt-4 flex flex-col gap-2.5">
              <button onClick={run} className={`tap min-h-[48px] rounded-control text-[15px] font-semibold text-white ${confirm === 'decline' || confirm === 'cancel' ? 'bg-error' : 'bg-brand'}`}>
                {confirm === 'accept' ? 'Accept' : confirm === 'decline' ? 'Decline' : confirm === 'cancel' ? 'Cancel Request' : 'Mark Completed'}
              </button>
              <button onClick={() => setConfirm(null)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Keep</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-[60] flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <span className="shrink-0 text-[13px] text-muted">{label}</span>
      <span className="max-w-[62%] text-right text-[13px] font-semibold text-ink">{value}</span>
    </div>
  )
}
