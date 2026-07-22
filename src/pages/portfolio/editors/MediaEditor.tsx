import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import MediaEmbed from '../../../components/portfolio/MediaEmbed'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Entry, MediaItem } from '../../../portfolio/types'
import { useEditorNav } from './common'

const MEDIA_TYPES = [
  'YouTube Video', 'Spotify Track', 'Spotify Album', 'Audio', 'Video', 'Other External Media',
]

const fields: FieldDef[] = [
  { key: 'type', label: 'Media type', type: 'select', options: MEDIA_TYPES },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'url', label: 'URL', type: 'url', placeholder: 'https://…' },
  { key: 'thumbnail', label: 'Thumbnail', type: 'image', optional: true },
  { key: 'releaseDate', label: 'Release date', type: 'date', optional: true },
  { key: 'description', label: 'Short description', type: 'textarea', maxLength: 300, optional: true },
  { key: 'credits', label: 'Credits', type: 'text', optional: true },
  { key: 'featured', label: 'Feature this media', type: 'toggle' },
]

export default function MediaEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('media')

  const setItems = (items: Entry[]) => {
    const media = items as unknown as MediaItem[]
    // enforce a single featured item
    const lastFeatured = [...media].reverse().find((m) => m.featured)
    const normalised = media.map((m) => ({
      ...m,
      featured: lastFeatured ? m.id === lastFeatured.id : false,
    }))
    setSection('media', normalised)
    bump()
  }

  const featured = portfolio.media.find((m) => m.featured)

  return (
    <EditorShell title="Watch & Listen" revision={rev} onSaveContinue={goNext}>
      <p className="mb-4 text-[12.5px] leading-relaxed text-muted">
        Showcase videos and tracks. YouTube and Spotify links get a preview.
        Only one item can be featured.
      </p>

      {featured && (
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-brand">
            Featured
          </p>
          <MediaEmbed item={featured} />
        </div>
      )}

      <RepeatableEditor
        items={portfolio.media as unknown as Entry[]}
        onChange={setItems}
        fields={fields}
        addLabel="Add Media"
        emptyText="No media yet. Add a video or track to showcase your work."
        makeSummary={(e) => ({
          title: String(e.title || 'Untitled'),
          sub: String(e.type || ''),
          badge: e.featured ? 'Featured' : undefined,
          image: String(e.thumbnail || ''),
        })}
      />
    </EditorShell>
  )
}
