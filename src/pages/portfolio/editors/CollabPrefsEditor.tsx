import { Sparkles } from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import SelectField from '../../../components/form/SelectField'
import ChipSelect from '../../../components/form/ChipSelect'
import TextArea from '../../../components/form/TextArea'
import TextField from '../../../components/form/TextField'
import Toggle from '../../../components/form/Toggle'
import { usePortfolio } from '../../../state/PortfolioContext'
import { CollabPrefs } from '../../../portfolio/types'
import { useEditorNav } from './common'

const AVAILABILITY = ['Available', 'Selectively Available', 'Not Available']
const OPEN_TO = [
  'Live performances', 'Music collaborations', 'Workshops', 'Teaching',
  'Brand collaborations', 'Commissioned work', 'Remote projects', 'Cultural events', 'Other',
]
const CONTACT = ['IICA messages', 'Email', 'Phone', 'Through manager']

export default function CollabPrefsEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('collabPrefs')
  const c = portfolio.collabPrefs

  const set = <K extends keyof CollabPrefs>(k: K, v: CollabPrefs[K]) => {
    setSection('collabPrefs', { ...c, [k]: v })
    bump()
  }

  const toggleOpen = (v: string) =>
    set('openTo', c.openTo.includes(v) ? c.openTo.filter((x) => x !== v) : [...c.openTo, v])

  return (
    <EditorShell title="Collaboration Preferences" revision={rev} onSaveContinue={goNext} saveLabel="Save & Finish">
      <div className="mb-5 flex items-start gap-2.5 rounded-card border border-border bg-brand-soft px-3.5 py-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p className="text-[12.5px] leading-relaxed text-[#6d3357]">
          This information powers IICA's AI collaboration matching — it helps us
          recommend you to the right artists.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <SelectField
          label="Availability"
          value={c.availability}
          onChange={(v) => set('availability', v)}
          options={AVAILABILITY}
        />

        <ChipSelect
          label="Open to"
          options={OPEN_TO}
          selected={c.openTo}
          onToggle={toggleOpen}
        />

        <TextArea
          label="Collaboration statement"
          value={c.statement}
          onChange={(v) => set('statement', v.slice(0, 500))}
          maxLength={500}
          rows={4}
          placeholder="Describe the kind of collaborations you're looking for."
        />

        <TextField
          label="Preferred collaboration locations"
          optional
          value={c.locations}
          onChange={(v) => set('locations', v)}
          placeholder="e.g. Bhubaneswar, Kolkata, Delhi"
        />

        <SelectField
          label="Preferred contact method"
          value={c.contactMethod}
          onChange={(v) => set('contactMethod', v)}
          options={CONTACT}
          optional
        />

        <div className="border-t border-border pt-4">
          <Toggle
            label="Accept remote collaboration"
            description="Show that you're open to working remotely"
            checked={c.remote}
            onChange={(v) => set('remote', v)}
          />
        </div>
        <Toggle
          label="Show “Request Collaboration” on my profile"
          description="Adds a collaboration CTA to your public portfolio"
          checked={c.showCTA}
          onChange={(v) => set('showCTA', v)}
        />
      </div>
    </EditorShell>
  )
}
