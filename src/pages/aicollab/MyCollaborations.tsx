import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Inbox, Send as SendIcon } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import StatusBadge from '../../components/StatusBadge'
import { useAiCollab } from '../../state/AiCollabContext'
import type { CollaborationRequest, CollabRequestStatus } from '../../aicollab/types'

type Filter = 'All' | 'Sent' | 'Received' | 'Active' | 'Completed'
const FILTERS: Filter[] = ['All', 'Sent', 'Received', 'Active', 'Completed']
const tone = (s: CollabRequestStatus) => (s === 'Accepted' ? 'success' : s === 'Declined' || s === 'Cancelled' ? 'error' : s === 'Completed' ? 'brand' : 'warning')

function match(r: CollaborationRequest, f: Filter): boolean {
  if (f === 'All') return true
  if (f === 'Sent') return r.direction === 'sent'
  if (f === 'Received') return r.direction === 'received'
  if (f === 'Active') return r.status === 'Accepted'
  return r.status === 'Completed'
}

export default function MyCollaborations() {
  const navigate = useNavigate()
  const { requests } = useAiCollab()
  const [filter, setFilter] = useState<Filter>('All')
  const list = useMemo(() => requests.filter((r) => match(r, filter)), [requests, filter])

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="My Collaborations" fallback="/collaborate" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="no-scrollbar -mx-[18px] flex gap-2 overflow-x-auto px-[18px] pb-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`tap shrink-0 rounded-control border px-3.5 py-1.5 text-[12.5px] font-semibold ${filter === f ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{f}</button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="font-serif text-[19px] text-ink">Nothing here yet</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-muted">Find a collaborator and send your first request.</p>
            <button onClick={() => navigate('/collaborate')} className="tap mt-4 min-h-[42px] rounded-control bg-brand px-5 text-[13.5px] font-semibold text-white">Find Collaborators</button>
          </div>
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
    </div>
  )
}
