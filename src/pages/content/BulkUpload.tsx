import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, Plus, CheckCircle2, AlertTriangle, Layers } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import SelectField from '../../components/form/SelectField'
import TagInput from '../../components/form/TagInput'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useContentStore } from '../../state/ContentContext'
import { CONTENT_CATEGORIES, ContentType, DEMO_FILES, DEFAULT_SETTINGS } from '../../content/types'

interface QueueItem { id: string; title: string; type: ContentType; thumbnail: string; ok: boolean }
const TYPES: ContentType[] = ['Video', 'Image', 'Audio', 'PDF']
let seq = 0

export default function BulkUpload() {
  const navigate = useNavigate()
  const { publishRecords } = useContentStore()
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [category, setCategory] = useState('Visual Arts')
  const [tags, setTags] = useState<string[]>(['Cultural Storytelling'])
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const addDemo = () => {
    if (queue.length >= 10) { flash('Maximum 10 files'); return }
    const type = TYPES[queue.length % TYPES.length]
    const d = DEMO_FILES[type]!
    // ~1 in 4 arrives as a simulated failed item so "remove failed" is demonstrable.
    const ok = (queue.length % 4) !== 3
    setQueue((q) => [...q, { id: `bulk-${seq++}`, title: d.fileName.replace(/\.[^.]+$/, ''), type, thumbnail: d.preview, ok }])
  }
  const setTitle = (id: string, title: string) => setQueue((q) => q.map((x) => (x.id === id ? { ...x, title } : x)))
  const remove = (id: string) => setQueue((q) => q.filter((x) => x.id !== id))

  const publishAll = (status: 'published' | 'draft') => {
    const valid = queue.filter((x) => x.ok)
    if (valid.length === 0) { flash('Add valid files first'); return }
    publishRecords(valid.map((x) => ({
      ...DEFAULT_SETTINGS, type: x.type, title: x.title, description: '', category, tags,
      thumbnail: x.thumbnail, cover: x.thumbnail, images: x.type === 'Image' ? [x.thumbnail] : [], credits: [], collectionId: null,
    })), status)
    navigate('/creator/content', { state: { toast: status === 'published' ? `${valid.length} published` : `${valid.length} saved as draft` } })
  }

  const failed = queue.filter((x) => !x.ok).length

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Bulk Upload" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="flex items-center gap-2 text-brand"><Layers className="h-4 w-4" /><p className="text-[13px] font-semibold">Upload up to 10 files with shared details</p></div>

        <button onClick={addDemo} className="tap mt-3 flex w-full items-center justify-center gap-2 rounded-card border-2 border-dashed border-border bg-surface px-6 py-6 text-[14px] font-semibold text-brand-dark hover:border-brand/40"><Sparkles className="h-5 w-5" /> Add Demo File ({queue.length}/10)</button>

        {queue.length > 0 && (
          <>
            <div className="mt-4 flex flex-col gap-2.5">
              {queue.map((x) => (
                <div key={x.id} className={`flex items-center gap-3 rounded-card border bg-surface p-2.5 ${x.ok ? 'border-border' : 'border-error/30'}`}>
                  <img src={x.thumbnail} alt="" className="h-11 w-14 shrink-0 rounded-[8px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <input value={x.title} onChange={(e) => setTitle(x.id, e.target.value)} className="w-full rounded-[7px] border border-border bg-bg px-2 py-1 text-[13px] font-semibold text-ink outline-none focus:border-brand" />
                    <p className={`mt-1 flex items-center gap-1 text-[11px] ${x.ok ? 'text-success' : 'text-error'}`}>{x.ok ? <><CheckCircle2 className="h-3 w-3" /> {x.type} · ready</> : <><AlertTriangle className="h-3 w-3" /> {x.type} · upload failed</>}</p>
                  </div>
                  <button onClick={() => remove(x.id)} aria-label="Remove" className="tap flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-error"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            {failed > 0 && <button onClick={() => setQueue((q) => q.filter((x) => x.ok))} className="tap mt-2 text-[12.5px] font-semibold text-error">Remove {failed} failed item{failed === 1 ? '' : 's'}</button>}

            <div className="mt-5 flex flex-col gap-4">
              <p className="text-[13px] font-semibold text-ink">Shared details</p>
              <SelectField label="Category" value={category} onChange={setCategory} options={CONTENT_CATEGORIES} />
              <TagInput label="Tags" value={tags} onChange={setTags} suggestions={['Cultural Storytelling', 'Creative Direction', 'Series']} />
            </div>
          </>
        )}
      </div>

      {queue.length > 0 && (
        <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <div className="flex gap-2.5">
            <SecondaryButton onClick={() => publishAll('draft')} className="min-w-[130px]"><Plus className="h-4 w-4" /> Save Drafts</SecondaryButton>
            <PrimaryButton full onClick={() => publishAll('published')}>Publish All</PrimaryButton>
          </div>
        </div>
      )}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
