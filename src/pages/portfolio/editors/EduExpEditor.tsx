import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { usePortfolio } from '../../../state/PortfolioContext'
import { EducationEntry, Entry, ExperienceEntry } from '../../../portfolio/types'
import { useEditorNav } from './common'

const eduFields: FieldDef[] = [
  { key: 'institution', label: 'Institution', type: 'text' },
  { key: 'course', label: 'Course / degree', type: 'text' },
  { key: 'field', label: 'Field', type: 'text', optional: true },
  { key: 'startYear', label: 'Start year', type: 'text', optional: true, half: true },
  { key: 'endYear', label: 'End year', type: 'text', optional: true, half: true },
  { key: 'description', label: 'Description', type: 'textarea', maxLength: 300, optional: true },
]

const expFields: FieldDef[] = [
  { key: 'org', label: 'Organisation / project', type: 'text' },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'startDate', label: 'Start date', type: 'text', optional: true, placeholder: 'e.g. 2019' },
  { key: 'current', label: 'Currently working here', type: 'toggle' },
  { key: 'endDate', label: 'End date', type: 'text', optional: true, showIf: (d) => !d.current, placeholder: 'e.g. 2023' },
  { key: 'description', label: 'Description', type: 'textarea', maxLength: 300, optional: true },
]

export default function EduExpEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('education')

  const setEdu = (items: Entry[]) => {
    setSection('education', items as unknown as EducationEntry[])
    bump()
  }
  const setExp = (items: Entry[]) => {
    setSection('experience', items as unknown as ExperienceEntry[])
    bump()
  }

  return (
    <EditorShell title="Education & Experience" revision={rev} onSaveContinue={goNext}>
      <h2 className="font-serif text-[20px] text-ink">Education</h2>
      <p className="mt-0.5 mb-4 text-[12.5px] text-muted">Training and formal study.</p>
      <RepeatableEditor
        items={portfolio.education as unknown as Entry[]}
        onChange={setEdu}
        fields={eduFields}
        addLabel="Add Education"
        emptyText="No education entries yet."
        makeSummary={(e) => ({
          title: String(e.course || e.institution || 'Untitled'),
          sub: [e.institution, [e.startYear, e.endYear].filter(Boolean).join('–')]
            .filter(Boolean)
            .join(' · '),
        })}
      />

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="font-serif text-[20px] text-ink">Experience</h2>
        <p className="mt-0.5 mb-4 text-[12.5px] text-muted">Professional roles and projects.</p>
        <RepeatableEditor
          items={portfolio.experience as unknown as Entry[]}
          onChange={setExp}
          fields={expFields}
          addLabel="Add Experience"
          emptyText="No experience entries yet."
          makeSummary={(e) => ({
            title: String(e.role || 'Untitled'),
            sub: [e.org, e.current ? 'Present' : e.endDate].filter(Boolean).join(' · '),
          })}
        />
      </div>
    </EditorShell>
  )
}
