import EditorShell from '../../../components/portfolio/EditorShell'
import TextArea from '../../../components/form/TextArea'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Entry, JourneyChapter } from '../../../portfolio/types'
import { useEditorNav } from './common'

const fields: FieldDef[] = [
  { key: 'heading', label: 'Chapter heading', type: 'text', placeholder: 'e.g. My First Performance' },
  { key: 'description', label: 'Description', type: 'textarea', maxLength: 1000 },
  { key: 'date', label: 'Year / date', type: 'text', optional: true, placeholder: 'e.g. 2011' },
  { key: 'image', label: 'Image', type: 'image', optional: true },
]

export default function AboutEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('about')
  const a = portfolio.about

  const setBio = (v: string) => {
    setSection('about', { ...a, shortBio: v.slice(0, 500) })
    bump()
  }
  const setChapters = (items: Entry[]) => {
    setSection('about', { ...a, chapters: items as unknown as JourneyChapter[] })
    bump()
  }

  return (
    <EditorShell title="About & Life Journey" revision={rev} onSaveContinue={goNext}>
      <h2 className="font-serif text-[20px] text-ink">Short bio</h2>
      <p className="mt-0.5 text-[12.5px] text-muted">
        Shown near the top of your public portfolio.
      </p>
      <div className="mt-3">
        <TextArea
          label="Short bio"
          value={a.shortBio}
          onChange={setBio}
          maxLength={500}
          rows={5}
          placeholder="Introduce yourself and your practice."
        />
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="font-serif text-[20px] text-ink">Life journey</h2>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
          Tell your story in chapters. The public portfolio shows a shortened
          preview with a “Read Full Journey” link.
        </p>
        <div className="mt-4">
          <RepeatableEditor
            items={a.chapters as unknown as Entry[]}
            onChange={setChapters}
            fields={fields}
            addLabel="Add Chapter"
            emptyText="No chapters yet. Add your first journey chapter."
            makeSummary={(e) => ({
              title: String(e.heading || 'Untitled chapter'),
              sub: [e.date, e.description].filter(Boolean).join(' · ').slice(0, 60),
              image: String(e.image || ''),
            })}
          />
        </div>
      </div>
    </EditorShell>
  )
}
