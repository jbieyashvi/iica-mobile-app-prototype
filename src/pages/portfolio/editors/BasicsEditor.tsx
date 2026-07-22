import { MapPin } from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import TextField from '../../../components/form/TextField'
import SelectField from '../../../components/form/SelectField'
import ImageUpload from '../../../components/form/ImageUpload'
import Toggle from '../../../components/form/Toggle'
import { usePortfolio } from '../../../state/PortfolioContext'
import { ProfileBasics } from '../../../portfolio/types'
import { useEditorNav } from './common'

const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say']

export default function BasicsEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('basics')
  const b = portfolio.basics

  const set = <K extends keyof ProfileBasics>(k: K, v: ProfileBasics[K]) => {
    setSection('basics', { ...b, [k]: v })
    bump()
  }

  return (
    <EditorShell title="Profile Basics" revision={rev} onSaveContinue={goNext}>
      {/* Live header preview */}
      <div className="mb-6 overflow-hidden rounded-card border border-border bg-surface">
        <div className="relative h-20 bg-brand-soft">
          {b.cover && <img src={b.cover} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="px-4 pb-4">
          <div className="-mt-8 h-16 w-16 overflow-hidden rounded-full border-4 border-surface bg-brand-soft">
            {b.photo && <img src={b.photo} alt="" className="h-full w-full object-cover" />}
          </div>
          <p className="mt-2 font-serif text-[20px] leading-tight text-ink">
            {b.fullName || 'Your name'}
          </p>
          <p className="text-[13px] text-muted">
            {b.headline || 'Your professional headline'}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-muted">
            <MapPin className="h-3 w-3" />
            {[b.city, b.country].filter(Boolean).join(', ') || 'City, Country'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ImageUpload
          label="Profile photo"
          value={b.photo}
          onChange={(v) => set('photo', v)}
          aspect="aspect-square"
          rounded="card"
        />
        <ImageUpload
          label="Cover image"
          value={b.cover}
          onChange={(v) => set('cover', v)}
          aspect="aspect-square"
          optional
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <TextField label="Full name" value={b.fullName} onChange={(v) => set('fullName', v)} />
        <TextField
          label="Stage / professional name"
          optional
          value={b.stageName}
          onChange={(v) => set('stageName', v)}
        />
        <div>
          <TextField
            label="Professional headline"
            value={b.headline}
            onChange={(v) => set('headline', v.slice(0, 120))}
            placeholder="e.g. Bharatanatyam dancer & music artist"
          />
          <p className="mt-1 text-right text-[11.5px] text-muted">{b.headline.length}/120</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="City" value={b.city} onChange={(v) => set('city', v)} />
          <TextField label="Country" value={b.country} onChange={(v) => set('country', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Date of birth" type="date" value={b.dob} onChange={(v) => set('dob', v)} />
          <SelectField
            label="Gender"
            optional
            value={b.gender}
            onChange={(v) => set('gender', v)}
            options={GENDERS}
          />
        </div>
        <TextField
          label="Languages"
          value={b.languages}
          onChange={(v) => set('languages', v)}
          placeholder="e.g. Odia, Hindi, English"
        />
        <TextField
          label="Pronouns"
          optional
          value={b.pronouns}
          onChange={(v) => set('pronouns', v)}
          placeholder="e.g. she/her"
        />
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <Toggle
          label="Public profile"
          description={
            b.visibility === 'Public'
              ? 'Anyone can view your portfolio'
              : 'Only IICA members can view your portfolio'
          }
          checked={b.visibility === 'Public'}
          onChange={(v) => set('visibility', v ? 'Public' : 'Members Only')}
        />
      </div>
    </EditorShell>
  )
}
