import { useNavigate } from 'react-router-dom'
import BuilderShell from '../../../components/events/BuilderShell'
import ImageUpload from '../../../components/form/ImageUpload'
import TextField from '../../../components/form/TextField'
import Toggle from '../../../components/form/Toggle'
import { useEvents } from '../../../state/EventsContext'

const ACCENTS = [
  { name: 'Brand', value: '#9D2567' },
  { name: 'Plum', value: '#592049' },
  { name: 'Forest', value: '#227A52' },
  { name: 'Amber', value: '#B77818' },
  { name: 'Ink', value: '#191718' },
]

export default function StepMedia() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useEvents()
  const images = draft.images ?? []

  const setImage = (i: number, url: string) => {
    const next = [...images]
    if (url) next[i] = url
    else next.splice(i, 1)
    saveDraft({ images: next })
  }

  return (
    <BuilderShell step={4} canContinue={!!draft.cover} onContinue={() => navigate('/events/create/preview')}>
      <h2 className="mb-1 font-serif text-[22px] text-ink">Media & display</h2>
      <p className="mb-5 text-[12.5px] text-muted">Add visuals that make your event stand out.</p>

      <div className="flex flex-col gap-5">
        <div>
          <ImageUpload label="Event cover image" value={draft.cover ?? ''} onChange={(v) => saveDraft({ cover: v })} aspect="aspect-[16/9]" />
          <p className="mt-1 text-[11.5px] text-muted">Recommended: 1600×900 (16:9), under 5MB.</p>
        </div>

        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">Additional images <span className="font-normal text-muted">Optional</span></p>
          <div className="grid grid-cols-2 gap-3">
            <ImageUpload label="Image 2" value={images[0] ?? ''} onChange={(v) => setImage(0, v)} aspect="aspect-square" optional />
            <ImageUpload label="Image 3" value={images[1] ?? ''} onChange={(v) => setImage(1, v)} aspect="aspect-square" optional />
          </div>
        </div>

        <TextField label="Promo video link" optional value={draft.promoVideo ?? ''} onChange={(v) => saveDraft({ promoVideo: v })} placeholder="YouTube / Vimeo URL" />

        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">Accent colour</p>
          <div className="flex gap-2.5">
            {ACCENTS.map((a) => (
              <button key={a.value} aria-label={a.name} onClick={() => saveDraft({ accent: a.value })} className={`tap h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-bg ${draft.accent === a.value ? 'ring-brand' : 'ring-transparent'}`} style={{ background: a.value }} />
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-4">
          <Toggle label="Request featured placement" description="Ask IICA to feature this event in discovery" checked={!!draft.featuredRequest} onChange={(v) => saveDraft({ featuredRequest: v })} />
        </div>
      </div>
    </BuilderShell>
  )
}
