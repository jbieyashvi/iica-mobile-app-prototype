import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BuilderShell from '../../../components/events/BuilderShell'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import TagInput from '../../../components/form/TagInput'
import { useEvents } from '../../../state/EventsContext'
import { EVENT_CATEGORIES, EventCategory, EventFormat } from '../../../events/types'

const FORMATS: EventFormat[] = ['In person', 'Online', 'Hybrid']

export default function StepDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const { draft, saveDraft, setFlowOrigin } = useEvents()

  // Capture the logical entry point once, from the route state passed by the
  // action that opened Create Event. Ignored if absent (e.g. step nav / refresh).
  useEffect(() => {
    setFlowOrigin((location.state as { from?: string } | null)?.from)
  }, [location.state, setFlowOrigin])

  const canContinue = !!draft.title?.trim() && !!draft.category &&
    (draft.category !== 'Others' || !!draft.customCategory?.trim()) && !!draft.summary?.trim()

  return (
    <BuilderShell step={0} canContinue={canContinue} onContinue={() => navigate('/events/create/schedule')}>
      <h2 className="mb-1 font-serif text-[22px] text-ink">Event details</h2>
      <p className="mb-5 text-[12.5px] text-muted">Tell attendees what your event is about.</p>

      <div className="flex flex-col gap-4">
        <TextField label="Event title" value={draft.title ?? ''} onChange={(v) => saveDraft({ title: v })} placeholder="e.g. Echoes of Ujjain" />
        <SelectField label="Category" value={draft.category ?? ''} onChange={(v) => saveDraft({ category: v as EventCategory })} options={EVENT_CATEGORIES} />
        {draft.category === 'Others' && (
          <TextField label="Custom event category" value={draft.customCategory ?? ''} onChange={(v) => saveDraft({ customCategory: v })} placeholder="Describe the category" hint="This category will be reviewed before being added to the platform." />
        )}
        <div>
          <TextField label="Short summary" value={draft.summary ?? ''} onChange={(v) => saveDraft({ summary: v.slice(0, 160) })} placeholder="One line that sells your event" />
          <p className="mt-1 text-right text-[11.5px] text-muted">{(draft.summary ?? '').length}/160</p>
        </div>
        <TextArea label="Full description" value={draft.description ?? ''} onChange={(v) => saveDraft({ description: v.slice(0, 3000) })} maxLength={3000} rows={5} placeholder="Describe the experience" />

        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">Event format</p>
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button key={f} onClick={() => saveDraft({ format: f })} className={`tap flex-1 rounded-control border py-2.5 text-[13px] font-semibold ${draft.format === f ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`}>{f}</button>
            ))}
          </div>
        </div>

        <TextField label="Language" optional value={draft.language ?? ''} onChange={(v) => saveDraft({ language: v })} placeholder="e.g. Hindi, English" />
        <TextField label="Suitable audience" optional value={draft.audience ?? ''} onChange={(v) => saveDraft({ audience: v })} placeholder="e.g. All ages" />
        <TagInput label="Tags" value={draft.tags ?? []} onChange={(v) => saveDraft({ tags: v })} placeholder="Add a tag and press Enter" />
        <TextArea label="What attendees can expect" value={draft.expect ?? ''} onChange={(v) => saveDraft({ expect: v.slice(0, 500) })} maxLength={500} rows={3} placeholder="Set expectations" />
      </div>
    </BuilderShell>
  )
}
