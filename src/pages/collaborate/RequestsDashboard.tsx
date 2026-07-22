import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { useCollab } from '../../state/CollabContext'
import { CollabRequest, RequestStatus } from '../../collab/types'
import { getCandidate } from '../../collab/mockCollab'
import { fmtDate } from '../../events/format'

type Tab = 'Received' | 'Sent' | 'Shortlisted'
type Filter = 'All' | 'Pending' | 'Accepted' | 'Declined' | 'Meetings'

const tone = (s: RequestStatus) =>
  s === 'Meeting Confirmed' || s === 'Accepted' ? 'success' : s === 'Declined' || s === 'Cancelled' || s === 'Expired' ? 'error' : 'warning'

export default function RequestsDashboard() {
  const navigate = useNavigate()
  const collab = useCollab()
  const [tab, setTab] = useState<Tab>('Received')
  const [filter, setFilter] = useState<Filter>('All')

  const byDir = collab.requests.filter((r) => r.direction === (tab === 'Sent' ? 'sent' : 'received'))
  const filtered = byDir.filter((r) => {
    if (filter === 'All') return true
    if (filter === 'Pending') return r.status === 'Pending' || r.status === 'Alternate Time Proposed'
    if (filter === 'Accepted') return r.status === 'Accepted' || r.status === 'Meeting Confirmed'
    if (filter === 'Declined') return r.status === 'Declined' || r.status === 'Cancelled'
    if (filter === 'Meetings') return r.status === 'Meeting Confirmed'
    return true
  })

  const shortlist = [...new Set([...collab.session.interested, ...collab.session.saved])].map((id) => getCandidate(id)).filter(Boolean)

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/collaborate')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">Requests</h1>
          <span className="h-10 w-10" />
        </div>
        <div className="flex gap-1 pb-2">
          {(['Received', 'Sent', 'Shortlisted'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tap flex-1 rounded-control py-2 text-[13px] font-semibold ${tab === t ? 'bg-brand text-white' : 'bg-surface text-muted'}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        {tab !== 'Shortlisted' && (
          <div className="no-scrollbar -mx-[18px] mb-3 flex gap-1.5 overflow-x-auto px-[18px]">
            {(['All', 'Pending', 'Accepted', 'Declined', 'Meetings'] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${filter === f ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{f}</button>
            ))}
          </div>
        )}

        {tab === 'Shortlisted' ? (
          shortlist.length === 0 ? <Empty text="No shortlisted artists yet." /> : (
            <div className="flex flex-col gap-3">
              {shortlist.map((c) => c && (
                <button key={c.id} onClick={() => navigate(`/collaborate/match/${c.id}`)} className="tap flex items-center gap-3 rounded-card border border-border bg-surface p-3 text-left">
                  <Avatar name={c.name} src={c.photo} size={46} />
                  <div className="min-w-0 flex-1"><p className="truncate font-serif text-[15px] text-ink">{c.name}</p><p className="truncate text-[12px] text-muted">{c.primaryDomain} · {c.matchPercent}% match</p></div>
                  <Bookmark className="h-4 w-4 shrink-0 text-brand" />
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
                </button>
              ))}
            </div>
          )
        ) : filtered.length === 0 ? (
          <Empty text={`No ${tab.toLowerCase()} requests${filter !== 'All' ? ` (${filter})` : ''}.`} />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => <RequestRow key={r.id} r={r} onClick={() => navigate(`/collaborate/requests/${r.id}`)} />)}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}

function RequestRow({ r, onClick }: { r: CollabRequest; onClick: () => void }) {
  const slot = r.chosenSlotId ? r.slots.find((s) => s.id === r.chosenSlotId) : r.slots[0]
  return (
    <button onClick={onClick} className="tap rounded-card border border-border bg-surface p-3.5 text-left">
      <div className="flex items-center gap-3">
        <Avatar name={r.artistName} src={r.artistPhoto} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-[15px] leading-tight text-ink">{r.project}</p>
          <p className="truncate text-[12.5px] text-muted">{r.artistName} · {r.purpose}</p>
        </div>
        <StatusBadge tone={tone(r.status)}>{r.status}</StatusBadge>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[11.5px] text-muted">
        <span>{r.direction === 'sent' ? 'Sent' : 'Received'} {fmtDate(r.createdAt)}</span>
        {slot && <span>Proposed {fmtDate(slot.date)} · {slot.time}</span>}
      </div>
    </button>
  )
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">{text}</div>
}
