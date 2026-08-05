import { useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Send, Pencil } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { useAiCollab, CreateRequestInput } from '../../state/AiCollabContext'
import { DRAFT_KEY } from './CreateRequest'

function loadDraft(): CreateRequestInput | null {
  try { const r = sessionStorage.getItem(DRAFT_KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return null
}

export default function ReviewRequest() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { createRequest } = useAiCollab()
  const draft = useMemo(loadDraft, [])
  const sending = useRef(false)
  const [busy, setBusy] = useState(false)

  if (!draft) return <Navigate to="/collaborate" replace />

  const send = () => {
    if (sending.current) return
    sending.current = true
    setBusy(true)
    const req = createRequest(draft, { id: state.iicaId || state.email || 'me', name: state.name || 'You' })
    try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* */ }
    navigate(`/collaborate/new/sent/${req.id}`, { replace: true })
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="Review Collaboration Request" fallback="/collaborate/matches" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <Row label="From" value={state.name || 'You'} />
          <Row label="To" value={draft.receiverName} />
          <Row label="Title" value={draft.title} />
          <Row label="Purpose" value={draft.description} />
          <Row label="Skill / Genre" value={[draft.skill, draft.genre].filter(Boolean).join(' · ') || '—'} />
          <Row label="Proposed date" value={draft.proposedDate || 'Flexible'} />
          <Row label="Format" value={draft.format} />
          <Row label={draft.format === 'Online' ? 'Platform' : 'Location'} value={draft.locationOrPlatform || '—'} />
          <Row label="Budget" value={draft.budget} />
          {draft.additionalNote && <Row label="Note" value={draft.additionalNote} />}
        </div>
        <p className="mt-3 text-[11.5px] text-muted">Sending shares these details with {draft.receiverName}. Private contact details open only if they accept.</p>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full disabled={busy} onClick={send}><Send className="h-4 w-4" /> {busy ? 'Sending…' : 'Send Request'}</PrimaryButton>
        <div className="mt-2"><SecondaryButton full disabled={busy} onClick={() => navigate(-1)}><Pencil className="h-4 w-4" /> Edit</SecondaryButton></div>
      </div>
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
