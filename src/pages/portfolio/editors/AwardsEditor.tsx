import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Award, Entry } from '../../../portfolio/types'
import { useEditorNav, } from './common'
import { yearOf } from './TimelineEditor'

const RECOGNITION = ['Winner', 'Finalist', 'Nominee', 'Special Mention', 'Certification']

const fields: FieldDef[] = [
  { key: 'name', label: 'Award name', type: 'text' },
  { key: 'org', label: 'Awarding organisation', type: 'text' },
  { key: 'year', label: 'Year / date', type: 'text', placeholder: 'e.g. 2016' },
  { key: 'category', label: 'Category', type: 'text', optional: true },
  { key: 'project', label: 'Associated project', type: 'text', optional: true },
  { key: 'recognitionType', label: 'Recognition type', type: 'select', options: RECOGNITION },
  { key: 'description', label: 'Description', type: 'textarea', maxLength: 400, optional: true },
  { key: 'image', label: 'Certificate / image', type: 'image', optional: true },
  { key: 'link', label: 'Verification link', type: 'url', optional: true, placeholder: 'https://…' },
  { key: 'featured', label: 'Feature on profile', type: 'toggle' },
]

export default function AwardsEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('awards')

  const setItems = (items: Entry[]) => {
    setSection('awards', items as unknown as Award[])
    bump()
  }

  return (
    <EditorShell title="Awards & Recognition" revision={rev} onSaveContinue={goNext}>
      <p className="mb-4 text-[12.5px] leading-relaxed text-muted">
        Add wins, nominations and certifications. Shown newest first.
      </p>
      <RepeatableEditor
        items={portfolio.awards as unknown as Entry[]}
        onChange={setItems}
        fields={fields}
        sort={(a, b) => yearOf(String(b.year)) - yearOf(String(a.year))}
        addLabel="Add Award"
        emptyText="No awards yet. Add your recognitions and certifications."
        makeSummary={(e) => ({
          title: String(e.name || 'Untitled'),
          sub: [e.org, String(e.year).slice(0, 4)].filter(Boolean).join(' · '),
          badge: String(e.recognitionType || ''),
          image: String(e.image || ''),
        })}
      />
    </EditorShell>
  )
}
