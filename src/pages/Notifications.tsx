import { useNavigate } from 'react-router-dom'
import {
  Inbox, CheckCircle2, Clock, XCircle, CalendarCheck, RotateCcw, BellRing, ChevronRight,
} from 'lucide-react'
import BackHeader from '../components/BackHeader'
import { useCollab } from '../state/CollabContext'

interface Notif {
  id: string
  icon: typeof Inbox
  tone: string
  title: string
  body: string
  time: string
  to: string
}

export default function Notifications() {
  const navigate = useNavigate()
  const { requests, meetings } = useCollab()

  const received = requests.find((r) => r.direction === 'received' && r.status === 'Pending')
  const sent = requests.find((r) => r.direction === 'sent')
  const meeting = meetings[0]

  const items: Notif[] = [
    received && { id: 'n1', icon: Inbox, tone: 'text-brand', title: 'New collaboration request', body: `${received.artistName} · ${received.purpose}`, time: '2h ago', to: `/collaborate/requests/${received.id}` },
    { id: 'n2', icon: CheckCircle2, tone: 'text-success', title: 'Request accepted', body: 'Your request was accepted — pick a meeting slot.', time: '5h ago', to: sent ? `/collaborate/requests/${sent.id}` : '/collaborate/requests' },
    { id: 'n3', icon: Clock, tone: 'text-warning', title: 'Alternate time proposed', body: 'A creator proposed new meeting times.', time: '1d ago', to: '/collaborate/requests' },
    { id: 'n4', icon: XCircle, tone: 'text-error', title: 'Request declined', body: 'One of your requests was declined.', time: '1d ago', to: '/collaborate/requests' },
    meeting && { id: 'n5', icon: CalendarCheck, tone: 'text-success', title: 'Meeting confirmed', body: `${meeting.project} · ${meeting.date}`, time: '2d ago', to: `/collaborate/meetings/${meeting.id}` },
    { id: 'n6', icon: RotateCcw, tone: 'text-warning', title: 'Reschedule requested', body: 'A meeting reschedule is awaiting your response.', time: '2d ago', to: '/collaborate/meetings' },
    meeting && { id: 'n7', icon: BellRing, tone: 'text-brand', title: 'Meeting reminder', body: `${meeting.project} is coming up soon.`, time: '3d ago', to: `/collaborate/meetings/${meeting.id}` },
  ].filter(Boolean) as Notif[]

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Notifications" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-3">
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {items.map((n) => {
            const Icon = n.icon
            return (
              <button key={n.id} onClick={() => navigate(n.to)} className="tap flex items-start gap-3 px-4 py-3.5 text-left hover:bg-black/[0.015]">
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft ${n.tone}`}><Icon className="h-[18px] w-[18px]" strokeWidth={1.75} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink">{n.title}</p>
                  <p className="truncate text-[12.5px] text-muted">{n.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{n.time}</p>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
