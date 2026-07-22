import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarPlus, Video, MapPin, Clock, MessageSquare, X, RotateCcw, Ban } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import TextArea from '../../components/form/TextArea'
import ConfirmSheet from '../../components/portfolio/ConfirmSheet'
import { useCollab } from '../../state/CollabContext'
import { MeetingSlot } from '../../collab/types'
import { fmtDate, fmtTime } from '../../events/format'

const TODAY = '2026-07-22'

export default function MeetingDetails() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const collab = useCollab()
  const m = collab.getMeeting(meetingId)
  const [reschedule, setReschedule] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [slots, setSlots] = useState<MeetingSlot[]>([{ id: 'r1', date: '', time: '' }, { id: 'r2', date: '', time: '' }, { id: 'r3', date: '', time: '' }])
  const [reason, setReason] = useState('')
  const [toast, setToast] = useState('')
  const flash = (x: string) => { setToast(x); setTimeout(() => setToast(''), 1600) }

  if (!m) return <BackHeader title="Meeting" />
  const cancelled = m.status === 'Cancelled'
  // simulated join window: within meeting day
  const joinAvailable = m.online && m.date <= TODAY

  const sendReschedule = () => {
    const filled = slots.filter((s) => s.date && s.time)
    if (filled.length === 0) return flash('Add at least one slot')
    collab.rescheduleMeeting(m.id, filled, reason)
    setReschedule(false); flash('Reschedule requested')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Meeting" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-32">
        <div className="mt-2 flex flex-col items-center text-center">
          <StatusBadge tone={m.status === 'Upcoming' ? 'success' : m.status === 'Reschedule Requested' ? 'warning' : m.status === 'Cancelled' ? 'error' : 'neutral'}>{m.status}</StatusBadge>
          <h1 className="mt-3 font-serif text-[24px] leading-tight text-ink">{m.project}</h1>
          <p className="mt-1 text-[13px] text-muted">{m.purpose}</p>
        </div>

        {/* participants */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <div className="flex flex-col items-center"><Avatar name="You" size={48} /><p className="mt-1 text-[12px] font-semibold text-ink">You</p></div>
          <span className="text-[12px] text-muted">×</span>
          <button onClick={() => navigate(`/artist/${m.artistId}`)} className="tap flex flex-col items-center"><Avatar name={m.artistName} src={m.artistPhoto} size={48} /><p className="mt-1 text-[12px] font-semibold text-ink">{m.artistName.split(' ')[0]}</p></button>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
          <Fact icon={<CalendarPlus className="h-4 w-4" />} title={fmtDate(m.date)} sub={`${fmtTime(m.time)} · ${m.timezone}`} />
          <Fact icon={m.online ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />} title={m.online ? 'Online meeting' : m.location} sub={m.mode} />
        </div>

        {/* online join */}
        {m.online && !cancelled && (
          <div className="mt-4 rounded-card border border-border bg-surface p-4">
            {joinAvailable ? (
              <><p className="text-[13px] font-semibold text-ink">Join available</p><div className="mt-2"><PrimaryButton full onClick={() => flash('Opening meeting (prototype)')}><Video className="h-4 w-4" /> Join Meeting</PrimaryButton></div></>
            ) : (
              <p className="flex items-center gap-2 text-[12.5px] text-muted"><Clock className="h-4 w-4 text-brand" /> Join link becomes available shortly before the meeting.</p>
            )}
            <p className="mt-2 text-[11.5px] text-muted">Contact details stay inside IICA until the meeting.</p>
          </div>
        )}
        {!m.online && !cancelled && (
          <button onClick={() => flash('Opening directions (prototype)')} className="tap mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink"><MapPin className="h-4 w-4" /> Directions</button>
        )}

        {m.status === 'Reschedule Requested' && m.rescheduleSlots && (
          <div className="mt-4 rounded-card border border-warning/30 bg-[#F7F0E4] p-3.5">
            <p className="text-[13px] font-semibold text-ink">Reschedule requested</p>
            {m.rescheduleReason && <p className="mt-0.5 text-[12.5px] text-[#7a5412]">{m.rescheduleReason}</p>}
            <div className="mt-2 flex flex-col gap-1">{m.rescheduleSlots.map((s) => <span key={s.id} className="text-[12.5px] text-ink">{fmtDate(s.date)} · {s.time}</span>)}</div>
          </div>
        )}
      </div>

      {!cancelled && (
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2.5">
              <SecondaryButton onClick={() => flash('Added to calendar (prototype)')}><CalendarPlus className="h-4 w-4" /> Calendar</SecondaryButton>
              <SecondaryButton onClick={() => flash('Messaging coming soon')}><MessageSquare className="h-4 w-4" /> Message</SecondaryButton>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <SecondaryButton onClick={() => setReschedule(true)}><RotateCcw className="h-4 w-4" /> Reschedule</SecondaryButton>
              <SecondaryButton onClick={() => setCancelConfirm(true)} className="!text-error"><Ban className="h-4 w-4" /> Cancel</SecondaryButton>
            </div>
          </div>
        </div>
      )}
      {cancelled && <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface px-[18px] py-4 text-center text-[13px] font-semibold text-error" style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}>Meeting cancelled</div>}

      {/* reschedule sheet */}
      {reschedule && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setReschedule(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative max-h-[88%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[20px] text-ink">Request reschedule</h3><button aria-label="Close" onClick={() => setReschedule(false)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button></div>
            <p className="mb-3 text-[12.5px] text-muted">Current: {fmtDate(m.date)} · {fmtTime(m.time)}. The meeting won't change until {m.artistName.split(' ')[0]} accepts.</p>
            <div className="flex flex-col gap-2">
              {slots.map((s, i) => (
                <div key={s.id} className="flex gap-2">
                  <input type="date" aria-label={`New ${i + 1} date`} value={s.date} onChange={(e) => setSlots((p) => p.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} className="min-h-[44px] flex-1 rounded-control border border-border bg-bg px-3 text-[14px] text-ink outline-none focus:border-brand" />
                  <input type="time" aria-label={`New ${i + 1} time`} value={s.time} onChange={(e) => setSlots((p) => p.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} className="min-h-[44px] w-[110px] rounded-control border border-border bg-bg px-3 text-[14px] text-ink outline-none focus:border-brand" />
                </div>
              ))}
            </div>
            <div className="mt-3"><TextArea label="Reason" value={reason} onChange={setReason} maxLength={200} rows={2} placeholder="Optional" /></div>
            <div className="mt-4"><PrimaryButton full onClick={sendReschedule}>Send Reschedule Request</PrimaryButton></div>
          </div>
        </div>
      )}

      <ConfirmSheet open={cancelConfirm} title="Cancel this meeting?" body={`${m.artistName} will be notified. This can't be undone.`} confirmLabel="Cancel Meeting" danger onConfirm={() => { collab.cancelMeeting(m.id); setCancelConfirm(false); flash('Meeting cancelled') }} onCancel={() => setCancelConfirm(false)} />
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
function Fact({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark">{icon}</span><div className="min-w-0"><p className="text-[14px] font-semibold text-ink">{title}</p><p className="truncate text-[12px] text-muted">{sub}</p></div></div>
}
