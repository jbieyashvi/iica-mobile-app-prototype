import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Pencil, MapPin, Globe, CalendarDays } from 'lucide-react'
import { useEvents } from '../../../state/EventsContext'
import { usePortfolio } from '../../../state/PortfolioContext'
import { useAuth } from '../../../state/AuthContext'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import Checkbox from '../../../components/form/Checkbox'
import StatusBadge from '../../../components/StatusBadge'
import { fmtDate, fmtTime, inr, startingPrice } from '../../../events/format'
import { EventItem } from '../../../events/types'

export default function StepPreview() {
  const navigate = useNavigate()
  const { draft, publishDraft } = useEvents()
  const { portfolio } = usePortfolio()
  const { state } = useAuth()
  const [mode, setMode] = useState<'guest' | 'registered'>('guest')
  const [ack, setAck] = useState(false)

  const d = draft as Partial<EventItem>
  const checks = [
    { label: 'Required details complete', ok: !!d.title && !!d.category && !!d.summary },
    { label: 'Schedule valid', ok: !!d.startDate && !!d.startTime && !!d.endDate && !!d.endTime },
    { label: 'Venue / online complete', ok: d.format === 'Online' ? !!d.online?.platform : !!d.venueName && !!d.city },
    { label: 'Ticket setup complete', ok: d.paid ? (d.tickets?.length ?? 0) > 0 : (d.capacity ?? 0) > 0 },
    { label: 'Cover image added', ok: !!d.cover },
    { label: 'Policies acknowledged', ok: ack },
  ]
  const firstMissing = checks.find((c) => !c.ok)
  const canPublish = checks.every((c) => c.ok)

  const editStep = (path: string) => navigate(path)

  const publish = () => {
    const ev = publishDraft({ id: portfolio.slug, name: portfolio.basics.fullName || state.name, avatar: portfolio.basics.photo })
    // replace so browser Back from Success can't reopen the completed builder steps.
    navigate('/events/create/success', { replace: true, state: { eventId: ev.id } })
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg/90 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={() => navigate('/events/create/media')} aria-label="Back" className="tap flex h-11 items-center gap-1 rounded-control pl-1 pr-2 text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /><span className="text-[13px] font-semibold">Back to Editing</span></button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold text-ink">Preview</h1>
        <span className="h-11 w-11" />
      </header>

      {/* view-as toggle */}
      <div className="shrink-0 px-[18px] pt-3">
        <div className="flex gap-1 rounded-control bg-surface p-1">
          {(['guest', 'registered'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`tap flex-1 rounded-[7px] py-1.5 text-[12.5px] font-semibold capitalize ${mode === m ? 'bg-brand text-white' : 'text-muted'}`}>As {m === 'guest' ? 'Guest' : 'Registered User'}</button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-4">
        {/* attendee preview */}
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="relative h-36 bg-brand-soft">
            {d.cover && <img src={d.cover} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <StatusBadge tone="brand">{d.category === 'Others' ? d.customCategory : d.category}</StatusBadge>
                {d.paid ? <StatusBadge tone="neutral">Paid</StatusBadge> : <StatusBadge tone="success">Free</StatusBadge>}
              </div>
              <button onClick={() => editStep('/events/create/details')} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Pencil className="h-3 w-3" /> Edit</button>
            </div>
            <h2 className="mt-2 font-serif text-[22px] leading-tight text-ink">{d.title || 'Untitled event'}</h2>
            <p className="mt-1 text-[13px] text-muted">{d.summary}</p>

            <div className="mt-3 flex flex-col gap-2 text-[13px] text-ink">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand" /> {fmtDate(d.startDate ?? '')} · {fmtTime(d.startTime ?? '')}</span>
              <span className="flex items-center gap-2">{d.format === 'Online' ? <Globe className="h-4 w-4 text-brand" /> : <MapPin className="h-4 w-4 text-brand" />} {d.format === 'Online' ? 'Online' : `${d.venueName ?? ''}${d.city ? ', ' + d.city : ''}`}</span>
            </div>

            {d.paid && (d.tickets?.length ?? 0) > 0 && (
              <p className="mt-3 text-[14px] font-bold text-ink">From {inr(startingPrice(d as EventItem))}</p>
            )}
            {mode === 'guest' && d.format === 'Online' && (
              <p className="mt-2 text-[11.5px] text-muted">Joining link hidden until registration.</p>
            )}
          </div>
        </div>

        {/* publish checklist */}
        <h3 className="mb-2 mt-6 text-[12px] font-bold uppercase tracking-wide text-muted">Before you publish</h3>
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 px-3.5 py-2.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${c.ok ? 'bg-success text-white' : 'bg-border text-muted'}`}><Check className="h-3 w-3" strokeWidth={3} /></span>
              <span className="flex-1 text-[13.5px] text-ink">{c.label}</span>
              {!c.ok && c.label !== 'Policies acknowledged' && <span className="text-[11.5px] font-semibold text-error">Incomplete</span>}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Checkbox checked={ack} onChange={setAck}>I confirm this event follows IICA's event policies.</Checkbox>
        </div>
        {!canPublish && firstMissing && (
          <p className="mt-2 text-[12px] font-medium text-error">Complete: {firstMissing.label}</p>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => navigate('/events/create/details')} className="min-w-[104px]">Edit</SecondaryButton>
          <PrimaryButton full disabled={!canPublish} onClick={publish}>Publish Event</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
