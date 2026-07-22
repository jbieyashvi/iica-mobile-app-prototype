import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, CalendarClock, Check, X, Clock, Send, Trash2 } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import ConfirmSheet from '../../components/portfolio/ConfirmSheet'
import { useCollab } from '../../state/CollabContext'
import { MeetingSlot } from '../../collab/types'
import { fmtDate } from '../../events/format'

const DECLINE_REASONS = ['Timing does not work', 'Not the right creative fit', 'Project details unclear', 'Not currently available', 'Other']

export default function RequestDetails() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const collab = useCollab()
  const r = collab.getRequest(requestId)
  const [sheet, setSheet] = useState<null | 'accept' | 'alternate' | 'decline'>(null)
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const [chosenSlot, setChosenSlot] = useState('')
  const [altSlots, setAltSlots] = useState<MeetingSlot[]>([{ id: 'a1', date: '', time: '' }, { id: 'a2', date: '', time: '' }, { id: 'a3', date: '', time: '' }])
  const [altMsg, setAltMsg] = useState('')
  const [declineReason, setDeclineReason] = useState('')
  const [declineNote, setDeclineNote] = useState('')
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  useEffect(() => { if (r && r.direction === 'received' && !r.viewed) collab.markViewed(r.id) }, [r, collab])

  if (!r) return <BackHeader title="Request" />
  const received = r.direction === 'received'
  const meeting = collab.meetings.find((m) => m.requestId === r.id)

  const accept = () => {
    const slotId = chosenSlot || r.slots[0]?.id
    if (!slotId) return
    const m = collab.acceptRequest(r.id, slotId)
    setSheet(null)
    navigate(`/collaborate/meetings/${m.id}`)
  }
  const sendAlternate = () => {
    const filled = altSlots.filter((s) => s.date && s.time)
    if (filled.length === 0) return flash('Add at least one slot')
    collab.proposeAlternate(r.id, filled, altMsg)
    setSheet(null); flash('Alternate times proposed')
  }
  const decline = () => { collab.declineRequest(r.id, declineReason); setSheet(null); flash('Request declined') }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={received ? 'Received Request' : 'Sent Request'} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-32">
        {/* artist */}
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={r.artistName} src={r.artistPhoto} size={54} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-[18px] leading-tight text-ink">{r.artistName}</p>
            <p className="text-[12.5px] text-muted">{r.matchPercent}% match</p>
          </div>
          <StatusBadge tone={r.status === 'Meeting Confirmed' ? 'success' : r.status === 'Declined' || r.status === 'Cancelled' ? 'error' : 'warning'}>{r.status}</StatusBadge>
        </div>
        <button onClick={() => navigate(`/artist/${r.artistId}`)} className="tap mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-brand"><ExternalLink className="h-4 w-4" /> View Portfolio</button>

        {/* details */}
        <div className="mt-4 flex flex-col divide-y divide-border rounded-card border border-border bg-surface">
          <Row label="Purpose" value={r.purpose} />
          <Row label="Project" value={r.project} />
          <Row label="Type" value={r.projectType} />
          <Row label="Role" value={r.role || '—'} />
          <Row label="Mode" value={r.mode} />
          <Row label="Timeline" value={r.timeline || '—'} />
          <Row label="Compensation" value={r.compensation} />
        </div>

        {r.description && <Block title="Project details" text={r.description} />}
        {received && r.why && <Block title="Why they want to collaborate" text={r.why} />}
        {r.message && <Block title="Personal message" text={`"${r.message}"`} />}
        {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="tap mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-brand"><ExternalLink className="h-4 w-4" /> Project link</a>}

        {/* slots */}
        <h2 className="mb-2 mt-6 font-serif text-[18px] text-ink">Proposed meeting slots</h2>
        <div className="flex flex-col gap-2">
          {r.slots.map((s) => (
            <div key={s.id} className={`flex items-center gap-3 rounded-card border p-3 ${r.chosenSlotId === s.id ? 'border-brand bg-brand-soft' : 'border-border bg-surface'}`}>
              <CalendarClock className="h-4 w-4 text-brand" />
              <span className="flex-1 text-[13.5px] font-medium text-ink">{fmtDate(s.date)} · {s.time}</span>
              {r.chosenSlotId === s.id && <StatusBadge tone="success">Confirmed</StatusBadge>}
            </div>
          ))}
        </div>
        {r.status === 'Alternate Time Proposed' && r.alternateSlots.length > 0 && (
          <>
            <p className="mb-2 mt-4 text-[13px] font-semibold text-ink">Alternate times proposed</p>
            <div className="flex flex-col gap-2">{r.alternateSlots.map((s) => <div key={s.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-3"><Clock className="h-4 w-4 text-warning" /><span className="text-[13.5px] text-ink">{fmtDate(s.date)} · {s.time}</span></div>)}</div>
          </>
        )}

        {r.declineReason && <div className="mt-4 rounded-card border border-error/30 bg-[#F7E9EA] p-3.5"><p className="text-[13px] font-semibold text-ink">Declined</p><p className="mt-0.5 text-[12.5px] text-[#7a2b30]">{r.declineReason}</p></div>}
      </div>

      {/* sticky actions */}
      {r.status !== 'Declined' && r.status !== 'Cancelled' && (
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
          {received ? (
            r.status === 'Meeting Confirmed' ? (
              <PrimaryButton full onClick={() => meeting && navigate(`/collaborate/meetings/${meeting.id}`)}>View Meeting</PrimaryButton>
            ) : (
              <div className="flex flex-col gap-2">
                <PrimaryButton full onClick={() => setSheet('accept')}><Check className="h-4 w-4" /> Accept</PrimaryButton>
                <div className="grid grid-cols-2 gap-2.5">
                  <SecondaryButton onClick={() => setSheet('alternate')}>Alternate Time</SecondaryButton>
                  <SecondaryButton onClick={() => setSheet('decline')} className="!text-error">Decline</SecondaryButton>
                </div>
              </div>
            )
          ) : (
            r.status === 'Meeting Confirmed' ? (
              <PrimaryButton full onClick={() => meeting && navigate(`/collaborate/meetings/${meeting.id}`)}>View Meeting</PrimaryButton>
            ) : (
              <div className="flex gap-2.5">
                <SecondaryButton onClick={() => flash('Reminder sent')} className="min-w-[130px]"><Send className="h-4 w-4" /> Remind</SecondaryButton>
                <PrimaryButton full onClick={() => setConfirmWithdraw(true)}><Trash2 className="h-4 w-4" /> Withdraw</PrimaryButton>
              </div>
            )
          )}
        </div>
      )}

      {/* Accept sheet */}
      {sheet === 'accept' && (
        <Sheet title="Confirm a meeting" onClose={() => setSheet(null)}>
          <p className="mb-3 text-[13px] text-muted">Choose one proposed slot to confirm.</p>
          <div className="flex flex-col gap-2">
            {r.slots.map((s) => (
              <button key={s.id} onClick={() => setChosenSlot(s.id)} className={`tap flex items-center justify-between rounded-control border px-4 py-3 text-[14px] font-semibold ${chosenSlot === s.id ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>
                {fmtDate(s.date)} · {s.time}{chosenSlot === s.id && <Check className="h-4 w-4 text-brand" />}
              </button>
            ))}
          </div>
          <div className="mt-4"><PrimaryButton full onClick={accept}>Confirm Meeting</PrimaryButton></div>
        </Sheet>
      )}
      {/* Alternate sheet */}
      {sheet === 'alternate' && (
        <Sheet title="Propose alternate times" onClose={() => setSheet(null)}>
          <div className="flex flex-col gap-2">
            {altSlots.map((s, i) => (
              <div key={s.id} className="flex gap-2">
                <input type="date" aria-label={`Alt ${i + 1} date`} value={s.date} onChange={(e) => setAltSlots((p) => p.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} className="min-h-[44px] flex-1 rounded-control border border-border bg-bg px-3 text-[14px] text-ink outline-none focus:border-brand" />
                <input type="time" aria-label={`Alt ${i + 1} time`} value={s.time} onChange={(e) => setAltSlots((p) => p.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} className="min-h-[44px] w-[110px] rounded-control border border-border bg-bg px-3 text-[14px] text-ink outline-none focus:border-brand" />
              </div>
            ))}
          </div>
          <div className="mt-3"><TextArea label="Message" value={altMsg} onChange={setAltMsg} maxLength={200} rows={2} placeholder="Optional" /></div>
          <div className="mt-4"><PrimaryButton full onClick={sendAlternate}>Send Alternate Times</PrimaryButton></div>
        </Sheet>
      )}
      {/* Decline sheet */}
      {sheet === 'decline' && (
        <Sheet title="Decline request" onClose={() => setSheet(null)}>
          <div className="flex flex-col gap-3">
            <SelectField label="Reason (optional)" value={declineReason} onChange={setDeclineReason} options={DECLINE_REASONS} optional />
            <TextArea label="Private note (not shared)" value={declineNote} onChange={setDeclineNote} maxLength={200} rows={2} placeholder="Optional" />
          </div>
          <div className="mt-4"><button onClick={decline} className="tap min-h-[48px] w-full rounded-control bg-error text-[15px] font-semibold text-white">Confirm Decline</button></div>
        </Sheet>
      )}

      <ConfirmSheet open={confirmWithdraw} title="Withdraw this request?" body="The recipient will no longer see it." confirmLabel="Withdraw" danger onConfirm={() => { collab.withdrawRequest(r.id); setConfirmWithdraw(false); flash('Request withdrawn') }} onCancel={() => setConfirmWithdraw(false)} />
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between px-4 py-2.5"><span className="text-[13px] text-muted">{label}</span><span className="max-w-[62%] truncate text-[13px] font-semibold text-ink">{value}</span></div>
}
function Block({ title, text }: { title: string; text: string }) {
  return <section className="mt-5"><h2 className="mb-1.5 font-serif text-[16px] text-ink">{title}</h2><p className="text-[13.5px] leading-relaxed text-muted">{text}</p></section>
}
function Sheet({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative max-h-[88%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[20px] text-ink">{title}</h3><button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button></div>
        {children}
      </div>
    </div>
  )
}
