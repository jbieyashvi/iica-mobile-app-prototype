import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Copy, FolderKanban } from 'lucide-react'
import { useState } from 'react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { useAiCollab } from '../../state/AiCollabContext'
import { fmtDate } from '../../events/format'

export default function RequestSent() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { getRequest } = useAiCollab()
  const req = getRequest(requestId)
  const [toast, setToast] = useState('')
  if (!req) return <Navigate to="/collaborate" replace />

  const copy = async () => { try { await navigator.clipboard.writeText(req.id) } catch { /* */ } setToast('Reference copied'); setTimeout(() => setToast(''), 1500) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="Request Sent" fallback="/collaborate" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-8 pt-4">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></span>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Request sent to {req.receiverName.split(' ')[0]}</h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">They’ll be notified and can accept or decline. “Sent” means it’s waiting for their response.</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] text-muted">Request ID</span>
            <span className="flex items-center gap-2"><span className="font-mono text-[13px] font-semibold text-ink">{req.id}</span><button onClick={copy} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button></span>
          </div>
          <Row label="To" value={req.receiverName} />
          <Row label="Title" value={req.title} />
          <Row label="Status" value="" node={<StatusBadge tone="warning">Sent</StatusBadge>} />
          <Row label="Sent" value={fmtDate(req.createdAt.slice(0, 10))} />
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => navigate(`/collaborate/mine/${req.id}`, { replace: true })}>View Request</PrimaryButton>
          <SecondaryButton full onClick={() => navigate('/collaborate/matches', { replace: true })}>Continue Browsing Matches</SecondaryButton>
          <button onClick={() => navigate('/collaborate', { replace: true })} className="tap mx-auto flex min-h-[44px] items-center justify-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink"><FolderKanban className="h-4 w-4" /> Return to Collaborate</button>
        </div>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Row({ label, value, node }: { label: string; value: string; node?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <span className="text-[13px] text-muted">{label}</span>
      {node ?? <span className="text-[13px] font-semibold text-ink">{value}</span>}
    </div>
  )
}
