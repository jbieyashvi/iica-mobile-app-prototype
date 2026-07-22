import EditorShell from '../../../components/portfolio/EditorShell'
import TextField from '../../../components/form/TextField'
import SelectField from '../../../components/form/SelectField'
import TagInput from '../../../components/form/TagInput'
import { usePortfolio } from '../../../state/PortfolioContext'
import { DomainSkills } from '../../../portfolio/types'
import { useEditorNav } from './common'

const DOMAINS = [
  'Music', 'Dance', 'Theatre', 'Visual Arts', 'Photography',
  'Film & Media', 'Literature', 'Fashion', 'Cultural Education', 'Other',
]

const SKILL_SUGGESTIONS = [
  'Choreography', 'Composition', 'Vocals', 'Improvisation', 'Stage Production',
  'Direction', 'Teaching', 'Sound Design',
]

export default function DomainEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('domain')
  const d = portfolio.domain

  const set = <K extends keyof DomainSkills>(k: K, v: DomainSkills[K]) => {
    setSection('domain', { ...d, [k]: v })
    bump()
  }

  return (
    <EditorShell title="Domain & Skills" revision={rev} onSaveContinue={goNext}>
      <div className="flex flex-col gap-4">
        <SelectField
          label="Primary creative domain"
          value={d.primaryDomain}
          onChange={(v) => set('primaryDomain', v)}
          options={DOMAINS}
        />
        {d.primaryDomain === 'Other' && (
          <TextField
            label="Your domain"
            value={d.customDomain}
            onChange={(v) => set('customDomain', v)}
            placeholder="e.g. Puppetry"
          />
        )}
        <TextField
          label="Secondary domains"
          optional
          value={d.secondaryDomains}
          onChange={(v) => set('secondaryDomains', v)}
          placeholder="e.g. Music, Theatre"
        />
        <TextField
          label="Sub-domains"
          optional
          value={d.subdomains}
          onChange={(v) => set('subdomains', v)}
          placeholder="e.g. Bharatanatyam, Fusion"
        />

        <TagInput
          label="Skills"
          value={d.skills}
          onChange={(v) => set('skills', v)}
          suggestions={SKILL_SUGGESTIONS}
          placeholder="Add a skill and press Enter"
        />

        <TextField
          label="Years of experience"
          type="number"
          value={d.experience}
          onChange={(v) => set('experience', v)}
          placeholder="e.g. 14"
        />
        <TextField
          label="Performance languages"
          optional
          value={d.performanceLanguages}
          onChange={(v) => set('performanceLanguages', v)}
          placeholder="e.g. Odia, Hindi"
        />
        <TextField
          label="Artistic styles / genres"
          optional
          value={d.styles}
          onChange={(v) => set('styles', v)}
          placeholder="e.g. Classical, Contemporary Fusion"
        />
      </div>
    </EditorShell>
  )
}
