import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Copy, Check, ExternalLink, Share2, Settings, FolderPlus, CalendarPlus } from 'lucide-react'
import { useEvents } from '../../../state/EventsContext'
import BackHeader from '../../../components/BackHeader'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import StatusBadge from '../../../components/StatusBadge'
import { fmtDate } from '../../../events/format'

export default function CreateSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getEvent, resetDraft } = useEvents()
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')

  const eventId = (location.state as { eventId?: string })?.eventId
  const ev = getEvent(eventId)
  if (!ev) return <BackHeader title="Published" />

  const url = `iica.app/events/${ev.id}`
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }
  const copy = async () => { try { await navigator.clipboard.writeText('https://' + url) } catch { /* */ } setCopied(true); setTimeout(() => setCopied(false), 1600) }

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Final screen — back must not reopen the completed builder. */}
      <BackHeader title="Event Published" onBack={() => navigate('/home')} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <div className="flex flex-col items-center pt-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></div>
          <h1 className="mt-5 font-serif text-[28px] leading-tight text-ink">Your event is live</h1>
          <p className="mt-2 text-[14px] text-muted">It's now discoverable and on your portfolio.</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
          <img src={ev.cover} alt="" className="h-24 w-full object-cover" />
          <div className="p-4">
            <p className="font-serif text-[18px] leading-tight text-ink">{ev.title}</p>
            <p className="mt-1 text-[12.5px] text-muted">{fmtDate(ev.startDate)}</p>
            <div className="mt-2">{ev.paid ? <StatusBadge tone="neutral">Paid</StatusBadge> : <StatusBadge tone="success">Free</StatusBadge>}</div>
          </div>
        </div>

        <div className="mt-4 rounded-card border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Public link</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="truncate font-mono text-[13px] font-semibold text-ink">{url}</span>
            <button onClick={copy} className={`tap flex h-10 shrink-0 items-center gap-1.5 rounded-control border px-3 text-[13px] font-semibold ${copied ? 'border-success/40 bg-[#EAF3EE] text-success' : 'border-border bg-bg text-ink'}`}>{copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}</button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => navigate(`/events/${ev.id}`)}><ExternalLink className="h-4 w-4" /> View Event</PrimaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => navigate(`/creator/events/${ev.id}`)}><Settings className="h-4 w-4" /> Manage Event</SecondaryButton>
            <SecondaryButton onClick={() => navigate(`/artist/${ev.organiserId}/share`)}><Share2 className="h-4 w-4" /> Share Event</SecondaryButton>
          </div>
          <SecondaryButton full onClick={() => flash('Added to your portfolio')}><FolderPlus className="h-4 w-4" /> Add to Portfolio</SecondaryButton>
          <SecondaryButton full onClick={() => { resetDraft(); navigate('/events/create/details', { state: { from: '/creator/events', source: 'creator-events' } }) }}><CalendarPlus className="h-4 w-4" /> Create Another</SecondaryButton>
          <div className="mt-1 flex items-center justify-center gap-5">
            <button onClick={() => navigate('/creator/events')} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Manage Events</button>
            <button onClick={() => navigate('/home')} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Go to Home</button>
          </div>
        </div>
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
