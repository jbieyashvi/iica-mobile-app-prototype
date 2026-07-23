import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Share2, Download, Settings2, PencilLine, AlertTriangle, Eye } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import CreateProgress from '../../components/content/CreateProgress'
import MediaViewer from '../../components/content/MediaViewer'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useContentStore } from '../../state/ContentContext'
import { buildRecord } from '../../content/mockContent'

type Lens = 'Guest' | 'Registered User' | 'IICA Member'
const LENSES: Lens[] = ['Guest', 'Registered User', 'IICA Member']

export default function Preview() {
  const navigate = useNavigate()
  const { draft, publish } = useContentStore()
  const isUpdate = draft.type === 'Artist Update'
  const [lens, setLens] = useState<Lens>('Guest')

  const rec = useMemo(() => buildRecord(draft, draft.id ?? 'preview', { status: 'published' }), [draft])

  // Required-field check → drives the disabled Publish + missing list.
  const missing: { section: string; label: string }[] = []
  if (!draft.title?.trim()) missing.push({ section: 'Details', label: 'Title' })
  if (draft.type === 'Image' && !draft.altText?.trim()) missing.push({ section: 'Details', label: 'Alt text' })
  if (isUpdate && !draft.updateText?.trim()) missing.push({ section: 'Details', label: 'Update text' })
  if (!draft.thumbnail && !isUpdate) missing.push({ section: 'Upload', label: 'A file or demo file' })
  const canPublish = missing.length === 0

  const membersOnlyBlocked = rec.visibility === 'Members Only' && lens !== 'IICA Member'
  const scheduled = !!draft.scheduleAt

  const doPublish = () => {
    const r = publish(scheduled ? 'scheduled' : 'published')
    navigate('/content/create/success', { state: { id: r.id } })
  }
  const saveDraft = () => {
    const r = publish('draft')
    navigate('/creator/content', { state: { toast: 'Saved to drafts', id: r.id } })
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Preview" />
      <CreateProgress step="Preview" isUpdate={isUpdate} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-2">
        {/* Preview-as switcher */}
        <div className="flex items-center gap-1 rounded-control border border-border bg-surface p-1">
          {LENSES.map((l) => (
            <button key={l} onClick={() => setLens(l)} className={`tap flex-1 rounded-[8px] py-2 text-[11.5px] font-semibold ${lens === l ? 'bg-brand text-white' : 'text-muted'}`}>{l}</button>
          ))}
        </div>

        {!canPublish && (
          <div className="mt-3 rounded-card border border-warning/30 bg-[#F7F0E4] p-3">
            <div className="flex items-center gap-2 text-warning"><AlertTriangle className="h-4 w-4" /><p className="text-[13px] font-semibold text-ink">Needs attention before publishing</p></div>
            <ul className="mt-1.5 space-y-0.5 text-[12.5px] text-[#7a5412]">
              {missing.map((m) => <li key={m.label}>• {m.label} — <button onClick={() => navigate(`/content/create/${m.section.toLowerCase()}`)} className="font-semibold underline">edit {m.section}</button></li>)}
            </ul>
          </div>
        )}

        {/* Card preview */}
        <div className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
          <div className="p-3">
            <div className="flex items-center gap-2.5">
              <Avatar name={rec.creator} src={rec.creatorAvatar} size={38} />
              <div><p className="text-[13.5px] font-semibold text-ink">{rec.creator}</p><p className="text-[11.5px] text-muted">{rec.type} · {rec.visibility}</p></div>
              <div className="ml-auto"><StatusBadge tone={rec.visibility === 'Public' ? 'success' : rec.visibility === 'Draft' ? 'neutral' : 'warning'}>{rec.visibility}</StatusBadge></div>
            </div>

            <div className="mt-3">
              {membersOnlyBlocked ? (
                <div className="flex aspect-[16/10] flex-col items-center justify-center rounded-card border border-dashed border-border bg-bg text-center">
                  <Eye className="h-6 w-6 text-muted" />
                  <p className="mt-2 text-[13px] font-semibold text-ink">Members-only content</p>
                  <p className="text-[12px] text-muted">Visible to IICA members</p>
                </div>
              ) : <MediaViewer item={rec} canDownload={rec.download === 'download'} />}
            </div>

            <h1 className="mt-3 font-serif text-[20px] leading-tight text-ink">{rec.title || 'Untitled'}</h1>
            {rec.description && <p className="mt-1 text-[13.5px] leading-relaxed text-ink/90">{rec.description}</p>}
            {rec.tags.length > 0 && <p className="mt-1.5 text-[12px] text-brand-dark">{rec.tags.map((t) => '#' + t.replace(/\s+/g, '')).join(' ')}</p>}
            {rec.credits.length > 0 && <p className="mt-2 text-[12px] text-muted">{rec.credits.map((c) => `${c.name} — ${c.role}`).join(' · ')}</p>}

            <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-[13px] text-muted">
              {rec.allowLikes && <span className="flex items-center gap-1.5"><Heart className="h-5 w-5" /> Like</span>}
              {rec.allowComments && <span className="flex items-center gap-1.5"><MessageCircle className="h-5 w-5" /> Comment</span>}
              {rec.allowSharing && <span className="flex items-center gap-1.5"><Share2 className="h-5 w-5" /> Share</span>}
              <span className="ml-auto flex items-center gap-1.5"><Bookmark className="h-5 w-5" /></span>
              {rec.download === 'download' && <Download className="h-5 w-5" />}
            </div>
            {lens === 'Guest' && (rec.allowLikes || rec.allowComments) && (
              <p className="mt-2 text-[11.5px] text-muted">Guests can view and share. Sign in to like, comment or save.</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <SecondaryButton onClick={() => navigate('/content/create/details')}><PencilLine className="h-4 w-4" /> Edit Details</SecondaryButton>
          <SecondaryButton onClick={() => navigate('/content/create/settings')}><Settings2 className="h-4 w-4" /> Edit Settings</SecondaryButton>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={saveDraft} className="min-w-[130px]">Save Draft</SecondaryButton>
          <PrimaryButton full disabled={!canPublish} onClick={doPublish}>{scheduled ? 'Schedule' : 'Publish Content'}</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
