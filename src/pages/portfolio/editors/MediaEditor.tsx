import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import MediaEmbed from '../../../components/portfolio/MediaEmbed'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Entry, MediaItem } from '../../../portfolio/types'
import { VIDEO_CATEGORIES } from '../../../lib/youtube'
import { useEditorNav } from './common'

const MEDIA_TYPES = [
  'YouTube Video', 'Spotify Track', 'Spotify Album', 'Audio', 'Video', 'Other External Media',
]

const isYouTube = (e: Entry) => String(e.type || '').includes('YouTube')

const fields: FieldDef[] = [
  { key: 'type', label: 'Media type', type: 'select', options: MEDIA_TYPES },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'url', label: 'URL', type: 'url', placeholder: 'youtube.com/watch?v=… or youtu.be/…' },
  { key: 'category', label: 'Video category', type: 'select', options: [...VIDEO_CATEGORIES], showIf: isYouTube },
  { key: 'customCategory', label: 'Custom category label', type: 'text', showIf: (e) => isYouTube(e) && e.category === 'Other' },
  { key: 'thumbnail', label: 'Thumbnail', type: 'image', optional: true },
  { key: 'releaseDate', label: 'Publish / release date', type: 'date', optional: true },
  { key: 'duration', label: 'Duration (e.g. 6:12)', type: 'text', optional: true, showIf: isYouTube },
  { key: 'description', label: 'Short description', type: 'textarea', maxLength: 300, optional: true },
  { key: 'credits', label: 'Credits / collaborators', type: 'text', optional: true },
  { key: 'tags', label: 'Tags (comma separated)', type: 'text', optional: true, showIf: isYouTube },
  { key: 'featured', label: 'Feature this media', type: 'toggle' },
  { key: 'showInArchive', label: 'Show in IICA Archive', type: 'toggle', default: true, showIf: isYouTube },
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
        Add YouTube videos and Spotify tracks. Paste a YouTube link to get a
        preview. YouTube videos with “Show in IICA Archive” enabled appear in
        the public Archive. Only one item can be featured.
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
