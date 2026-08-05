import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Sparkles, Pencil, ArrowRight, RotateCcw, Check } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { useAiCollab } from '../../state/AiCollabContext'
import { setAuthReturn } from '../../lib/authReturn'
import type { CollabFormat } from '../../aicollab/types'

const FORMATS: CollabFormat[] = ['Online', 'In Person', 'Hybrid', 'Flexible']

export default function ConfirmRequirement() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const access = membershipAccess(state)
  const { current, updateRequirement, clearRequirement } = useAiCollab()
  const [edit, setEdit] = useState(false)

  if (!current) return <Navigate to="/collaborate" replace />
  const r = current

  const showMatches = () => {
    if (access.isGuest) { setAuthReturn('/collaborate/matches'); navigate('/login'); return }
    navigate('/collaborate/matches')
  }
  const startOver = () => { clearRequirement(); navigate('/collaborate') }

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="Confirm Your Requirement" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="flex items-center gap-1.5 text-brand"><Sparkles className="h-4 w-4" /><span className="text-[11px] font-semibold uppercase tracking-[0.12em]">Here’s what we understood</span></div>
        <p className="mt-1.5 rounded-control border border-border bg-surface px-3 py-2 text-[13px] italic leading-relaxed text-muted">“{r.originalText}”</p>

        {!edit ? (
          <>
            <div className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
              <Field label="Looking for" value={r.role} />
              <Field label="Skill / Genre" value={[r.skill, r.genre].filter((x) => x && x !== 'Not specified').join(' · ') || 'Not specified'} />
              <Field label="Location" value={r.nearMe ? 'Near Me' : r.location} />
              <Field label="Format" value={r.format} />
              <Field label="Preferred date" value={r.preferredDate} />
              <Field label="Budget" value={r.budget} />
              <Field label="Purpose" value={r.purpose} />
              {r.additionalDetails && <Field label="Additional details" value={r.additionalDetails} />}
            </div>
            <button onClick={() => setEdit(true)} className="tap mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand"><Pencil className="h-3.5 w-3.5" /> Edit details</button>
          </>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            <TextField label="Collaboration role" value={r.role} onChange={(v) => updateRequirement({ role: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Skill" value={r.skill} onChange={(v) => updateRequirement({ skill: v })} />
              <TextField label="Genre" value={r.genre} onChange={(v) => updateRequirement({ genre: v })} />
            </div>
            <TextField label="Location" value={r.location} onChange={(v) => updateRequirement({ location: v, nearMe: /near me/i.test(v) })} hint="Type a city, “Any location”, or “Near Me”." />
            <SelectField label="Format" value={r.format} onChange={(v) => updateRequirement({ format: v as CollabFormat })} options={FORMATS} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Preferred date" value={r.preferredDate} onChange={(v) => updateRequirement({ preferredDate: v })} />
              <TextField label="Budget" optional value={r.budget} onChange={(v) => updateRequirement({ budget: v })} />
            </div>
            <TextArea label="Additional details" value={r.additionalDetails} onChange={(v) => updateRequirement({ additionalDetails: v })} maxLength={300} rows={2} placeholder="Anything else relevant" />
            <SecondaryButton full onClick={() => setEdit(false)}><Check className="h-4 w-4" /> Done editing</SecondaryButton>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={showMatches}>Show Matches <ArrowRight className="h-4 w-4" /></PrimaryButton>
        <button onClick={startOver} className="tap mx-auto mt-2 flex min-h-[40px] items-center justify-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink"><RotateCcw className="h-3.5 w-3.5" /> Start over</button>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="max-w-[60%] text-right text-[13px] font-semibold text-ink">{value || 'Not specified'}</span>
    </div>
  )
}
