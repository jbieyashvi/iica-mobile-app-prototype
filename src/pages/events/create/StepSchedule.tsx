import { useNavigate } from 'react-router-dom'
import BuilderShell from '../../../components/events/BuilderShell'
import TextField from '../../../components/form/TextField'
import Toggle from '../../../components/form/Toggle'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { useEvents } from '../../../state/EventsContext'
import { Entry } from '../../../portfolio/types'
import { ScheduleItem } from '../../../events/types'

const scheduleFields: FieldDef[] = [
  { key: 'start', label: 'Start time', type: 'text', placeholder: 'e.g. 19:00', half: true },
  { key: 'end', label: 'End time', type: 'text', placeholder: 'e.g. 20:30', half: true },
  { key: 'title', label: 'Session title', type: 'text' },
  { key: 'host', label: 'Host / performer', type: 'text', optional: true },
  { key: 'description', label: 'Short description', type: 'textarea', maxLength: 200, optional: true },
]

export default function StepSchedule() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useEvents()

  const startAt = draft.startDate && draft.startTime ? `${draft.startDate}T${draft.startTime}` : ''
  const endAt = draft.endDate && draft.endTime ? `${draft.endDate}T${draft.endTime}` : ''
  const endInvalid = !!startAt && !!endAt && endAt <= startAt
  const regInvalid = !!draft.regClose && !!startAt && draft.regClose > startAt

  const canContinue = !!draft.startDate && !!draft.startTime && !!draft.endDate && !!draft.endTime && !endInvalid && !regInvalid

  return (
    <BuilderShell step={1} canContinue={canContinue} onContinue={() => navigate('/events/create/venue')}>
      <h2 className="mb-1 font-serif text-[22px] text-ink">Date & schedule</h2>
      <p className="mb-5 text-[12.5px] text-muted">When does your event take place?</p>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Start date" type="date" value={draft.startDate ?? ''} onChange={(v) => saveDraft({ startDate: v, endDate: draft.endDate || v })} />
          <TextField label="Start time" type="time" value={draft.startTime ?? ''} onChange={(v) => saveDraft({ startTime: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="End date" type="date" value={draft.endDate ?? ''} onChange={(v) => saveDraft({ endDate: v })} />
          <TextField label="End time" type="time" value={draft.endTime ?? ''} onChange={(v) => saveDraft({ endTime: v })} error={endInvalid ? 'End must be after start' : ''} />
        </div>
        <TextField label="Timezone" value={draft.timezone ?? 'IST (GMT+5:30)'} onChange={(v) => saveDraft({ timezone: v })} />

        <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
          <Toggle label="Multi-day event" checked={!!draft.multiDay} onChange={(v) => saveDraft({ multiDay: v })} />
          <Toggle label="Recurring event" checked={!!draft.recurring} onChange={(v) => saveDraft({ recurring: v })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="Registration closes" type="datetime-local" value={draft.regClose ?? ''} onChange={(v) => saveDraft({ regClose: v })} error={regInvalid ? 'Must be before event starts' : ''} optional />
          <TextField label="Doors / entry time" type="time" value={draft.doorTime ?? ''} onChange={(v) => saveDraft({ doorTime: v })} optional />
        </div>

        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">Schedule items</p>
          <RepeatableEditor
            items={(draft.schedule ?? []) as unknown as Entry[]}
            onChange={(items) => saveDraft({ schedule: items as unknown as ScheduleItem[] })}
            fields={scheduleFields}
            addLabel="Add Schedule Item"
            emptyText="No schedule items yet. Break your event into sessions."
            makeSummary={(e) => ({ title: String(e.title || 'Session'), sub: [e.start, e.end].filter(Boolean).join('–') })}
          />
        </div>
      </div>
    </BuilderShell>
  )
}
