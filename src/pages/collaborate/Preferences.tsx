import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import SelectField from '../../components/form/SelectField'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import ChipSelect from '../../components/form/ChipSelect'
import Toggle from '../../components/form/Toggle'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { useCollab } from '../../state/CollabContext'
import { CollabPrefs, LOOKING_FOR, Availability, Compensation } from '../../collab/types'

const DOMAINS = ['Music', 'Dance', 'Theatre', 'Visual Arts', 'Photography', 'Film & Media', 'Literature', 'Fashion', 'Cultural Education']
const AVAIL: Availability[] = ['Available', 'Selectively Available', 'Not Available']
const COMP: Compensation[] = ['Paid', 'Unpaid', 'Revenue Share', 'Open to Discussion']

export default function Preferences() {
  const navigate = useNavigate()
  const { prefs, savePrefs } = useCollab()
  const [v, setV] = useState<CollabPrefs>(prefs)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  // Save always works (no dirty gating). Persist immediately, confirm, return.
  const save = () => {
    if (saving) return
    setSaving(true)
    savePrefs(v)
    setTimeout(() => navigate('/collaborate', { state: { savedPrefs: true } }), 650)
  }
  const set = <K extends keyof CollabPrefs>(k: K, val: CollabPrefs[K]) => setV((s) => ({ ...s, [k]: val }))
  const toggleArr = (k: 'lookingFor' | 'domains', val: string) =>
    setV((s) => ({ ...s, [k]: s[k].includes(val) ? s[k].filter((x) => x !== val) : [...s[k], val] }))

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Collaboration Preferences" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">This helps IICA generate relevant collaborator recommendations for you.</p>

        <Section title="Availability">
          <div className="flex flex-col gap-2">
            {AVAIL.map((a) => (
              <button key={a} onClick={() => set('availability', a)} className={`tap flex min-h-[46px] items-center justify-between rounded-control border px-4 text-[14px] font-semibold ${v.availability === a ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>
                {a}{v.availability === a && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Looking for">
          <ChipSelect label="" options={LOOKING_FOR} selected={v.lookingFor} onToggle={(x) => toggleArr('lookingFor', x)} />
        </Section>

        <Section title="Creative preferences">
          <div className="flex flex-col gap-4">
            <ChipSelect label="Preferred creative domains" options={DOMAINS} selected={v.domains} onToggle={(x) => toggleArr('domains', x)} />
            <TextField label="Required / complementary skills" optional value={v.skills} onChange={(x) => set('skills', x)} placeholder="e.g. Mixing, Percussion, Visuals" />
            <TextField label="Genres / styles" optional value={v.genres} onChange={(x) => set('genres', x)} placeholder="e.g. Fusion, Classical" />
            <SelectField label="Experience preference" optional value={v.experience} onChange={(x) => set('experience', x)} options={['Any', 'Emerging (0–5 yrs)', 'Established (5–10 yrs)', 'Senior (10+ yrs)']} />
            <TextField label="Languages" optional value={v.languages} onChange={(x) => set('languages', x)} placeholder="e.g. Hindi, English" />
          </div>
        </Section>

        <Section title="Location">
          <div className="flex flex-col gap-4">
            <TextField label="Preferred cities" optional value={v.cities} onChange={(x) => set('cities', x)} placeholder="e.g. Mumbai, Bengaluru" />
            <TextField label="Preferred countries" optional value={v.countries} onChange={(x) => set('countries', x)} placeholder="e.g. India" />
            <SelectField label="Maximum travel distance" optional value={v.maxTravel} onChange={(x) => set('maxTravel', x)} options={['Within city', 'Up to 100 km', 'Up to 500 km', 'Anywhere in India', 'International']} />
            <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
              <Toggle label="Remote collaboration accepted" checked={v.remoteOk} onChange={(x) => set('remoteOk', x)} />
              <Toggle label="In-person preferred" checked={v.inPersonPref} onChange={(x) => set('inPersonPref', x)} />
            </div>
          </div>
        </Section>

        <Section title="Project intent">
          <div className="flex flex-col gap-4">
            <TextArea label="Collaboration statement" value={v.statement} onChange={(x) => set('statement', x.slice(0, 500))} maxLength={500} rows={4} placeholder="What kind of collaborations are you looking for?" />
            <TextField label="Project goal" optional value={v.goal} onChange={(x) => set('goal', x)} placeholder="e.g. Release a fusion single" />
            <TextField label="Approximate timeline" optional value={v.timeline} onChange={(x) => set('timeline', x)} placeholder="e.g. 1–3 months" />
            <SelectField label="Compensation" value={v.compensation} onChange={(x) => set('compensation', x as Compensation)} options={COMP} />
            <SelectField label="Preferred contact method" optional value={v.contactMethod} onChange={(x) => set('contactMethod', x)} options={['IICA messages', 'Email', 'Phone']} />
          </div>
        </Section>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => setPreview(true)} className="min-w-[120px]">Preview</SecondaryButton>
          <PrimaryButton full disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save Preferences'}</PrimaryButton>
        </div>
      </div>

      {saving && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[60] flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">Collaboration preferences saved</span>
        </div>
      )}

      {preview && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setPreview(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[20px] text-ink">Your matching profile</h3><button aria-label="Close" onClick={() => setPreview(false)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button></div>
            <div className="flex flex-col gap-2 text-[13px]">
              <Line label="Availability" value={v.availability} />
              <div><p className="text-muted">Looking for</p><div className="mt-1 flex flex-wrap gap-1.5">{v.lookingFor.length ? v.lookingFor.map((x) => <StatusBadge key={x} tone="brand">{x}</StatusBadge>) : <span className="text-ink">—</span>}</div></div>
              <Line label="Domains" value={v.domains.join(', ') || '—'} />
              <Line label="Statement" value={v.statement || '—'} />
              <Line label="Compensation" value={v.compensation} />
            </div>
            <p className="mt-4 text-[11.5px] text-muted">This is how the AI reads your collaboration intent.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-7 first:mt-5"><h2 className="mb-3 font-serif text-[18px] text-ink">{title}</h2>{children}</section>
}
function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3"><span className="text-muted">{label}</span><span className="max-w-[62%] text-right font-semibold text-ink">{value}</span></div>
}
