import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Collaboration, Entry } from '../../../portfolio/types'
import { iicaArtists } from '../../../portfolio/mockPortfolio'
import { useEditorNav } from './common'

const PROJECT_TYPES = ['Performance', 'Recording', 'Installation', 'Workshop', 'Film', 'Other']

const artistOptions = [...iicaArtists.map((a) => a.name), 'External artist']

const fields: FieldDef[] = [
  { key: 'artistName', label: 'Collaborating artist', type: 'select', options: artistOptions },
  { key: 'externalName', label: 'Artist name', type: 'text', showIf: (d) => d.artistName === 'External artist', placeholder: 'External artist name' },
  { key: 'project', label: 'Project name', type: 'text' },
  { key: 'date', label: 'Collaboration date', type: 'text', optional: true, placeholder: 'e.g. 2024' },
  { key: 'role', label: 'Your role', type: 'text', optional: true },
  { key: 'projectType', label: 'Project type', type: 'select', options: PROJECT_TYPES, optional: true },
  { key: 'description', label: 'Short description', type: 'textarea', maxLength: 400, optional: true },
  { key: 'link', label: 'Project / media link', type: 'url', optional: true, placeholder: 'https://…' },
  { key: 'image', label: 'Collaboration image', type: 'image', optional: true },
  { key: 'awarded', label: 'Did this work receive an award?', type: 'toggle' },
  { key: 'awardName', label: 'Award name', type: 'text', showIf: (d) => !!d.awarded },
  { key: 'awardYear', label: 'Award year', type: 'text', showIf: (d) => !!d.awarded, optional: true },
  { key: 'awardCategory', label: 'Award category', type: 'text', showIf: (d) => !!d.awarded, optional: true },
  { key: 'awardOrg', label: 'Awarding organisation', type: 'text', showIf: (d) => !!d.awarded, optional: true },
]

const avatarFor = (name: string) => iicaArtists.find((a) => a.name === name)?.avatar

export default function CollaborationsEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('collaborations')

  const setItems = (items: Entry[]) => {
    const mapped = (items as unknown as Collaboration[]).map((c) => ({
      ...c,
      artistId: iicaArtists.find((a) => a.name === c.artistName)?.id ?? '',
    }))
    setSection('collaborations', mapped)
    bump()
  }

  return (
    <EditorShell title="Collaborations" revision={rev} onSaveContinue={goNext}>
      <p className="mb-4 text-[12.5px] leading-relaxed text-muted">
        Add projects with other artists. Select an IICA artist to link their
        profile, or add an external collaborator.
      </p>
      <RepeatableEditor
        items={portfolio.collaborations as unknown as Entry[]}
        onChange={setItems}
        fields={fields}
        addLabel="Add Collaboration"
        emptyText="No collaborations yet. Add a project you worked on with another artist."
        makeSummary={(e) => {
          const name =
            e.artistName === 'External artist'
              ? String(e.externalName || 'External artist')
              : String(e.artistName || 'Artist')
          return {
            title: String(e.project || 'Untitled project'),
            sub: [name, e.date].filter(Boolean).join(' · '),
            badge: e.awarded ? 'Awarded' : undefined,
            image: avatarFor(String(e.artistName)) || String(e.image || ''),
          }
        }}
      />
    </EditorShell>
  )
}
