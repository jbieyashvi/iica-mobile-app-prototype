import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Video, MapPin } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { useCollab } from '../../state/CollabContext'
import { fmtDate, fmtTime } from '../../events/format'

type Tab = 'Upcoming' | 'Past' | 'Cancelled'
const TODAY = '2026-07-22'

export default function Meetings() {
  const navigate = useNavigate()
  const { meetings } = useCollab()
  const [tab, setTab] = useState<Tab>('Upcoming')

  const filtered = meetings.filter((m) => {
    if (tab === 'Cancelled') return m.status === 'Cancelled'
    if (m.status === 'Cancelled') return false
    const upcoming = m.date >= TODAY
    return tab === 'Upcoming' ? upcoming : !upcoming
  })

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/collaborate')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">Meetings</h1>
          <span className="h-10 w-10" />
        </div>
        <div className="flex gap-1 pb-2">
          {(['Upcoming', 'Past', 'Cancelled'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tap flex-1 rounded-control py-2 text-[13px] font-semibold ${tab === t ? 'bg-brand text-white' : 'bg-surface text-muted'}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        {filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">No {tab.toLowerCase()} meetings.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((m) => (
              <button key={m.id} onClick={() => navigate(`/collaborate/meetings/${m.id}`)} className="tap rounded-card border border-border bg-surface p-3.5 text-left">
                <div className="flex items-center gap-3">
                  <Avatar name={m.artistName} src={m.artistPhoto} size={46} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[15px] leading-tight text-ink">{m.project}</p>
                    <p className="truncate text-[12.5px] text-muted">with {m.artistName}</p>
                  </div>
                  <StatusBadge tone={m.status === 'Upcoming' ? 'success' : m.status === 'Reschedule Requested' ? 'warning' : m.status === 'Cancelled' ? 'error' : 'neutral'}>{m.status}</StatusBadge>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[12px] text-muted">
                  <span>{fmtDate(m.date)} · {fmtTime(m.time)}</span>
                  <span className="flex items-center gap-1">{m.online ? <><Video className="h-3.5 w-3.5" /> Online</> : <><MapPin className="h-3.5 w-3.5" /> {m.location}</>}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}
