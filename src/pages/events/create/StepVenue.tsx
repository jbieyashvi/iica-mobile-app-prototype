import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import BuilderShell from '../../../components/events/BuilderShell'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import { useEvents } from '../../../state/EventsContext'
import { OnlineInfo } from '../../../events/types'

const PLATFORMS = ['Zoom', 'Google Meet', 'YouTube Live', 'Other']

export default function StepVenue() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useEvents()
  const format = draft.format ?? 'In person'
  const showPhysical = format === 'In person' || format === 'Hybrid'
  const showOnline = format === 'Online' || format === 'Hybrid'

  const setOnline = (patch: Partial<OnlineInfo>) =>
    saveDraft({ online: { platform: '', link: '', instructions: '', ...(draft.online ?? {}), ...patch } })

  const canContinue = showPhysical ? !!draft.venueName?.trim() && !!draft.city?.trim() : !!draft.online?.platform

  return (
    <BuilderShell step={2} canContinue={canContinue} onContinue={() => navigate('/events/create/tickets')}>
      <h2 className="mb-1 font-serif text-[22px] text-ink">Venue & access</h2>
      <p className="mb-5 text-[12.5px] text-muted">Where will attendees join you?</p>

      {showPhysical && (
        <div className="flex flex-col gap-4">
          <TextField label="Venue name" value={draft.venueName ?? ''} onChange={(v) => saveDraft({ venueName: v })} />
          <TextField label="Address" value={draft.address ?? ''} onChange={(v) => saveDraft({ address: v })} optional />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="City" value={draft.city ?? ''} onChange={(v) => saveDraft({ city: v })} />
            <TextField label="State" value={draft.state ?? ''} onChange={(v) => saveDraft({ state: v })} optional />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Country" value={draft.country ?? ''} onChange={(v) => saveDraft({ country: v })} optional />
            <TextField label="Postal code" value={draft.postal ?? ''} onChange={(v) => saveDraft({ postal: v })} optional />
          </div>
          <div className="flex h-28 items-center justify-center rounded-card border border-border bg-brand-soft text-brand"><MapPin className="h-7 w-7" /><span className="ml-2 text-[12px] font-semibold text-brand-dark">Map location placeholder</span></div>
          <TextArea label="Venue instructions" value={draft.venueInstructions ?? ''} onChange={(v) => saveDraft({ venueInstructions: v })} maxLength={300} rows={2} placeholder="Entry gate, ID rules…" />
          <TextField label="Accessibility information" value={draft.accessibility ?? ''} onChange={(v) => saveDraft({ accessibility: v })} optional />
          <TextField label="Parking information" value={draft.parking ?? ''} onChange={(v) => saveDraft({ parking: v })} optional />
        </div>
      )}

      {showOnline && (
        <div className={`flex flex-col gap-4 ${showPhysical ? 'mt-8 border-t border-border pt-6' : ''}`}>
          {showPhysical && <h3 className="font-serif text-[18px] text-ink">Online access</h3>}
          <SelectField label="Platform" value={draft.online?.platform ?? ''} onChange={(v) => setOnline({ platform: v })} options={PLATFORMS} />
          <TextField label="Private joining link" value={draft.online?.link ?? ''} onChange={(v) => setOnline({ link: v })} placeholder="https://…" hint="Revealed to attendees only after they register." />
          <TextArea label="Joining instructions" value={draft.online?.instructions ?? ''} onChange={(v) => setOnline({ instructions: v })} maxLength={300} rows={2} placeholder="Join 5 minutes early…" />
        </div>
      )}
    </BuilderShell>
  )
}
