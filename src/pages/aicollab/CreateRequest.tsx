import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import Avatar from '../../components/Avatar'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { useAiCollab } from '../../state/AiCollabContext'
import { getMatchCreator } from '../../aicollab/creators'
import type { CollabFormat } from '../../aicollab/types'

const FORMATS: CollabFormat[] = ['Online', 'In Person', 'Hybrid']
export const DRAFT_KEY = 'iica_collab_request_draft'

export default function CreateRequest() {
  const { creatorId } = useParams()
  const navigate = useNavigate()
  const { state } = useAuth()
  const access = membershipAccess(state)
  const { current } = useAiCollab()
  const creator = getMatchCreator(creatorId)

  const seed = useMemo(() => ({
    title: current ? `${current.role} for ${current.purpose !== 'Not specified' ? current.purpose : 'a collaboration'}` : '',
    description: current?.originalText ?? '',
    skill: current && current.skill !== 'Not specified' ? current.skill : '',
    genre: current && current.genre !== 'Not specified' ? current.genre : '',
    proposedDate: current && current.preferredDate !== 'Not specified' ? current.preferredDate : '',
    format: (current?.format === 'Flexible' ? 'In Person' : current?.format ?? 'In Person') as CollabFormat,
    locationOrPlatform: current && current.location !== 'Any location' && current.location !== 'Near Me' ? current.location : '',
    budget: current && current.budget !== 'Not specified' ? current.budget : '',
    additionalNote: '',
  }), [current])

  const [f, setF] = useState(seed)
  const [touched, setTouched] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }))

  if (!access.isActiveMember) return <Navigate to="/collaborate/matches" replace />
  if (!creator || !current) return <Navigate to="/collaborate" replace />

  const err = {
    title: !f.title.trim() ? 'Title required' : '',
    description: !f.description.trim() ? 'Description required' : '',
    location: f.format === 'In Person' && !f.locationOrPlatform.trim() ? 'Location required for in-person' : '',
    budget: f.budget.trim() && !/\d/.test(f.budget) ? 'Enter a valid amount' : '',
  }
  const valid = !err.title && !err.description && !err.location && !err.budget

  const toReview = () => {
    setTouched(true)
    if (!valid) return
    const draft = {
      requirementId: current.id, receiverUserId: creator.slug, receiverName: creator.name,
      ...f, locationOrPlatform: f.locationOrPlatform.trim() || (f.format === 'Online' ? 'To be decided' : ''),
      budget: f.budget.trim() || 'Not specified',
    }
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch { /* */ }
    navigate('/collaborate/new/review')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="Collaboration Request" fallback="/collaborate/matches" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
          <Avatar name={creator.name} src={creator.photo} size={42} />
          <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{creator.name}</p><p className="truncate text-[12px] text-muted">{creator.category} · {creator.city}</p></div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <TextField label="Collaboration title" value={f.title} onChange={(v) => set('title', v.slice(0, 100))} error={touched ? err.title : ''} placeholder="A short title" />
          <TextArea label="Purpose / description" value={f.description} onChange={(v) => set('description', v)} maxLength={600} rows={3} error={touched ? err.description : ''} placeholder="What’s the collaboration about?" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Skill" optional value={f.skill} onChange={(v) => set('skill', v)} />
            <TextField label="Genre" optional value={f.genre} onChange={(v) => set('genre', v)} />
          </div>
          <TextField label="Proposed date" optional value={f.proposedDate} onChange={(v) => set('proposedDate', v)} placeholder="e.g. This Weekend, 12 Sep" />
          <SelectField label="Format" value={f.format} onChange={(v) => set('format', v as CollabFormat)} options={FORMATS} />
          <TextField label={f.format === 'Online' ? 'Online platform' : 'Location'} value={f.locationOrPlatform} onChange={(v) => set('locationOrPlatform', v)} error={touched ? err.location : ''} placeholder={f.format === 'Online' ? 'Zoom / Google Meet / To be decided' : 'City or venue'} optional={f.format !== 'In Person'} />
          <TextField label="Budget" optional value={f.budget} onChange={(v) => set('budget', v)} error={touched ? err.budget : ''} placeholder="e.g. ₹10,000" />
          <TextArea label="Additional note" value={f.additionalNote} onChange={(v) => set('additionalNote', v)} maxLength={300} rows={2} placeholder="Optional" />
        </div>
        <p className="mt-3 text-[11.5px] text-muted">Private contact details aren’t shared yet — they open only after the request is accepted.</p>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={toReview}>Review Request <ArrowRight className="h-4 w-4" /></PrimaryButton>
      </div>
    </div>
  )
}
