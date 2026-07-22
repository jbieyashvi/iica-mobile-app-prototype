import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Handshake } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import PrimaryButton from '../../components/PrimaryButton'
import StatusBadge from '../../components/StatusBadge'
import { usePublicArtist } from '../../data/usePublicArtist'
import { useAuth } from '../../state/AuthContext'

const PROJECT_TYPES = ['Performance', 'Recording', 'Workshop', 'Installation', 'Film', 'Live show', 'Other']
const MODES = ['In person', 'Remote', 'Either']

export default function ArtistCollaborate() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { artist } = usePublicArtist(slug)
  const { state } = useAuth()

  const [purpose, setPurpose] = useState('')
  const [type, setType] = useState('')
  const [desc, setDesc] = useState('')
  const [role, setRole] = useState('')
  const [mode, setMode] = useState('')
  const [location, setLocation] = useState('')
  const [slots, setSlots] = useState('')
  const [timeline, setTimeline] = useState('')
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [sent, setSent] = useState(false)

  if (!artist) return <BackHeader title="Collaborate" />

  // Non-members: explain the restriction (do not silently redirect).
  if (state.role !== 'active') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Collaborate" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Handshake className="h-8 w-8" strokeWidth={1.6} />
          </div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Collaborate through IICA</h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
            Sending collaboration requests is available to active IICA creators.
            Become a member to connect and work with {artist.name.split(' ')[0]}.
          </p>
          <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate('/membership')}>Become a Member</PrimaryButton>
            <button onClick={() => navigate(`/artist/${artist.slug}`)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    )
  }

  const errors = {
    purpose: !purpose.trim() ? 'Required' : '',
    type: !type ? 'Required' : '',
    desc: desc.trim().length < 10 ? 'Add a few more details' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  const openConfirm = () => {
    setTouched(true)
    if (valid) setConfirm(true)
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Request Sent" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success">
            <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
          </div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Collaboration request sent</h1>
          <div className="mt-3"><StatusBadge tone="warning">Pending</StatusBadge></div>
          <p className="mt-3 max-w-[300px] text-[14px] leading-relaxed text-muted">
            {artist.name} has been notified. You'll hear back through IICA messages.
          </p>
          <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate('/collaborate')}>View Request</PrimaryButton>
            <button onClick={() => navigate(`/artist/${artist.slug}`)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">
              Return to Portfolio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Request Collaboration" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        {/* artist summary */}
        <div className="mt-2 flex items-center gap-3 rounded-card border border-border bg-surface p-3">
          <Avatar name={artist.name} src={artist.photo} size={44} />
          <div className="min-w-0">
            <p className="truncate font-serif text-[17px] leading-tight text-ink">{artist.name}</p>
            <p className="truncate text-[12.5px] text-muted">{artist.headline}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <TextField label="Collaboration purpose" value={purpose} onChange={setPurpose} placeholder="e.g. Co-produce a single" error={touched ? errors.purpose : ''} />
          <SelectField label="Project type" value={type} onChange={setType} options={PROJECT_TYPES} error={touched ? errors.type : ''} />
          <TextArea label="Short project description" value={desc} onChange={setDesc} maxLength={500} rows={4} placeholder="Describe the project" error={touched ? errors.desc : ''} />
          <TextField label="Your role / request" optional value={role} onChange={setRole} placeholder="e.g. Looking for a vocalist" />
          <SelectField label="Preferred collaboration mode" value={mode} onChange={setMode} options={MODES} optional />
          <TextField label="Preferred location" optional value={location} onChange={setLocation} placeholder="e.g. Mumbai" />
          <TextField label="Suggested date / time slots" optional value={slots} onChange={setSlots} placeholder="e.g. Weekends in September" />
          <TextField label="Expected timeline" optional value={timeline} onChange={setTimeline} placeholder="e.g. 4–6 weeks" />
          <TextField label="Project / media link" optional value={link} onChange={setLink} placeholder="https://…" />
          <TextArea label="Personal message" value={message} onChange={setMessage} maxLength={500} rows={3} placeholder="Add a note for the artist" />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={openConfirm}>Send Collaboration Request</PrimaryButton>
      </div>

      {confirm && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setConfirm(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Send this request?</h2>
            <div className="mt-3 flex flex-col divide-y divide-border rounded-card border border-border">
              <Row label="To" value={artist.name} />
              <Row label="Purpose" value={purpose} />
              <Row label="Type" value={type} />
              {mode && <Row label="Mode" value={mode} />}
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <PrimaryButton full onClick={() => { setConfirm(false); setSent(true) }}>Send Request</PrimaryButton>
              <button onClick={() => setConfirm(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="max-w-[62%] truncate text-[13px] font-semibold text-ink">{value}</span>
    </div>
  )
}
