import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { useCollab } from '../../state/CollabContext'
import { getCandidate } from '../../collab/mockCollab'
import { CollabMode, Compensation, MeetingSlot } from '../../collab/types'
import { demoCollaborationRequest, futureISO } from '../../demo/demoData'

const TYPES = ['Live Performance', 'Music Collaboration', 'Workshop', 'Recording', 'Content Collaboration', 'Commissioned Work', 'Other']
const MODES: CollabMode[] = ['In Person', 'Remote', 'Either']
const COMP: Compensation[] = ['Paid', 'Unpaid', 'Revenue Share', 'Open to Discussion']

export default function RequestForm() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const collab = useCollab()
  const c = getCandidate(artistId)

  const [purpose, setPurpose] = useState(demoCollaborationRequest.purpose)
  const [project, setProject] = useState(demoCollaborationRequest.project)
  const [type, setType] = useState(demoCollaborationRequest.projectType)
  const [desc, setDesc] = useState(demoCollaborationRequest.description)
  const [why, setWhy] = useState('')
  const [role, setRole] = useState(demoCollaborationRequest.role)
  const [mode, setMode] = useState<CollabMode>(demoCollaborationRequest.mode)
  const [location, setLocation] = useState(demoCollaborationRequest.location)
  const [timeline, setTimeline] = useState(demoCollaborationRequest.timeline)
  const [comp, setComp] = useState<Compensation>(demoCollaborationRequest.compensation)
  const [slots, setSlots] = useState<MeetingSlot[]>([
    { id: 's1', date: futureISO(9), time: '17:00' },
    { id: 's2', date: futureISO(12), time: '11:00' },
    { id: 's3', date: futureISO(15), time: '18:30' },
  ])
  const [link, setLink] = useState('')
  const [message, setMessage] = useState(demoCollaborationRequest.message)
  const [touched, setTouched] = useState(false)
  const [review, setReview] = useState(false)
  const [sent, setSent] = useState(false)

  if (!c) return <BackHeader title="Request" />

  const filledSlots = slots.filter((s) => s.date && s.time)
  const errors = {
    purpose: !purpose.trim() ? 'Required' : '',
    project: !project.trim() ? 'Required' : '',
    type: !type ? 'Required' : '',
    desc: desc.trim().length < 10 ? 'Add a few details' : '',
    slots: filledSlots.length < 1 ? 'Add at least one slot' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  const openReview = () => { setTouched(true); if (valid) setReview(true) }

  const send = () => {
    collab.sendRequest({
      artistId: c.id, artistName: c.name, artistPhoto: c.photo, matchPercent: c.matchPercent,
      purpose, project, projectType: type, description: desc, why, role, mode, location, timeline,
      compensation: comp, slots: filledSlots, alternateSlots: [], link, message,
    })
    setReview(false); setSent(true)
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Request Sent" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Request sent</h1>
          <div className="mt-3"><StatusBadge tone="warning">Pending</StatusBadge></div>
          <p className="mt-3 max-w-[300px] text-[14px] leading-relaxed text-muted">{c.name} has been notified. You'll hear back through IICA.</p>
          <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate('/collaborate/requests')}>View Request</PrimaryButton>
            <SecondaryButton full onClick={() => navigate('/collaborate/recommendations')}>Continue Discovering</SecondaryButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Request Collaboration" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <div className="mt-2 flex items-center gap-3 rounded-card border border-border bg-surface p-3">
          <img src={c.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
          <div className="min-w-0"><p className="truncate font-serif text-[16px] text-ink">{c.name}</p><p className="truncate text-[12px] text-muted">{c.headline} · {c.matchPercent}% match</p></div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <TextField label="Collaboration purpose" value={purpose} onChange={setPurpose} placeholder="e.g. Live percussion for my set" error={touched ? errors.purpose : ''} />
          <TextField label="Project name" value={project} onChange={setProject} error={touched ? errors.project : ''} />
          <SelectField label="Project type" value={type} onChange={setType} options={TYPES} error={touched ? errors.type : ''} />
          <TextArea label="Brief project description" value={desc} onChange={setDesc} maxLength={500} rows={4} error={touched ? errors.desc : ''} placeholder="Describe the collaboration" />
          <TextArea label="Why collaborate with this artist" value={why} onChange={setWhy} maxLength={300} rows={3} placeholder="Optional but recommended" />
          <TextField label="Proposed role for them" optional value={role} onChange={setRole} placeholder="e.g. Session percussionist" />
          <SelectField label="Collaboration mode" value={mode} onChange={(x) => setMode(x as CollabMode)} options={MODES} />
          <TextField label="Location" optional value={location} onChange={setLocation} placeholder="e.g. Mumbai / Remote" />
          <TextField label="Project timeline" optional value={timeline} onChange={setTimeline} placeholder="e.g. 4–6 weeks" />
          <SelectField label="Compensation" value={comp} onChange={(x) => setComp(x as Compensation)} options={COMP} />

          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Preferred meeting slots <span className="font-normal text-muted">· at least 3 suggested</span></p>
            <div className="flex flex-col gap-2">
              {slots.map((s, i) => (
                <div key={s.id} className="flex gap-2">
                  <input type="date" aria-label={`Slot ${i + 1} date`} value={s.date} onChange={(e) => setSlots((p) => p.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} className="min-h-[44px] flex-1 rounded-control border border-border bg-surface px-3 text-[14px] text-ink outline-none focus:border-brand" />
                  <input type="time" aria-label={`Slot ${i + 1} time`} value={s.time} onChange={(e) => setSlots((p) => p.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} className="min-h-[44px] w-[110px] rounded-control border border-border bg-surface px-3 text-[14px] text-ink outline-none focus:border-brand" />
                </div>
              ))}
            </div>
            {touched && errors.slots && <p className="mt-1 text-[12px] font-medium text-error">{errors.slots}</p>}
          </div>

          <TextField label="Project / work link" optional value={link} onChange={setLink} placeholder="https://…" />
          <TextArea label="Personal message" value={message} onChange={setMessage} maxLength={400} rows={3} placeholder="Add a note" />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={openReview}>Review Request</PrimaryButton>
      </div>

      {review && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setReview(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative max-h-[88%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Review request</h2>
            <div className="mt-3 flex flex-col divide-y divide-border rounded-card border border-border">
              <Row label="To" value={c.name} />
              <Row label="Purpose" value={purpose} />
              <Row label="Project" value={project} />
              <Row label="Type" value={type} />
              <Row label="Mode" value={mode} />
              <Row label="Compensation" value={comp} />
              <Row label="Slots" value={`${filledSlots.length} proposed`} />
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <PrimaryButton full onClick={send}>Send Collaboration Request</PrimaryButton>
              <button onClick={() => setReview(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between px-3.5 py-2.5"><span className="text-[13px] text-muted">{label}</span><span className="max-w-[62%] truncate text-[13px] font-semibold text-ink">{value}</span></div>
}
