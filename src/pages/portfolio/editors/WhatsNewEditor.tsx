import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Entry, Announcement } from '../../../portfolio/types'
import { ANNOUNCEMENT_TYPES, CTA_LABELS, RELATED_TYPES } from '../../../config/announcements'
import { useEditorNav } from './common'

const isOther = (e: Entry) => e.type === 'Other'
const hasRelated = (e: Entry) => !!e.relatedType && e.relatedType !== 'None'

const fields: FieldDef[] = [
  { key: 'type', label: 'Announcement type', type: 'select', options: [...ANNOUNCEMENT_TYPES] },
  { key: 'customType', label: 'Custom type label', type: 'text', showIf: isOther },
  { key: 'title', label: 'Title', type: 'text', maxLength: 100 },
  { key: 'description', label: 'Short description', type: 'textarea', maxLength: 200 },
  { key: 'date', label: 'Date / expected date', type: 'date' },
  { key: 'time', label: 'Time', type: 'text', optional: true, placeholder: 'e.g. 7:00 PM' },
  { key: 'location', label: 'Location', type: 'text', optional: true },
  { key: 'image', label: 'Image', type: 'image', optional: true },
  { key: 'cta', label: 'CTA label', type: 'text', optional: true, placeholder: CTA_LABELS[0] },
  { key: 'ctaUrl', label: 'CTA link', type: 'url', optional: true, placeholder: 'https://… or /internal-route' },
  { key: 'relatedType', label: 'Link to an IICA item', type: 'select', options: [...RELATED_TYPES], optional: true },
  { key: 'relatedId', label: 'Item id / slug', type: 'text', optional: true, showIf: hasRelated, placeholder: 'e.g. event id, video id, product id' },
  { key: 'featured', label: 'Feature this announcement', type: 'toggle' },
  { key: 'published', label: 'Publish (show on public profile)', type: 'toggle', default: true },
]

export default function WhatsNewEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('whats-new')

  const setItems = (items: Entry[]) => {
    setSection('announcements', items.slice(0, 10) as unknown as Announcement[])
    bump()
  }

  return (
    <EditorShell title="What’s New" revision={rev} onSaveContinue={goNext}>
      <p className="mb-4 text-[12.5px] leading-relaxed text-muted">
        Share upcoming shows, releases, events and important announcements. Up
        to 10 active announcements. Published ones appear near the top of your
        public profile; drafts stay private.
      </p>

      <RepeatableEditor
        items={portfolio.announcements as unknown as Entry[]}
        onChange={setItems}
        fields={fields}
        addLabel="Add Announcement"
        emptyText="No announcements yet. Add your first What’s New update."
        makeSummary={(e) => ({
          title: String(e.title || 'Untitled'),
          sub: `${e.type === 'Other' ? (e.customType || 'Other') : e.type}${e.date ? ` · ${e.date}` : ''}`,
          badge: e.published ? (e.featured ? 'Featured' : 'Published') : 'Draft',
          image: String(e.image || ''),
        })}
      />
    </EditorShell>
  )
}
