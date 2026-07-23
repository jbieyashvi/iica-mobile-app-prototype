import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2, Plus } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import TagInput from '../../../components/form/TagInput'
import Toggle from '../../../components/form/Toggle'
import PrimaryButton from '../../../components/PrimaryButton'
import { useContentStore } from '../../../state/ContentContext'
import { ContentRecord, CONTENT_CATEGORIES, Visibility, Credit } from '../../../content/types'

const COVERS = [
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80&auto=format&fit=crop',
]

export default function CreatorContentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRecord, collections, updateRecord } = useContentStore()
  const item = getRecord(id)
  const [v, setV] = useState<ContentRecord | undefined>(item)
  const [confirmThumb, setConfirmThumb] = useState(false)
  if (!item || !v) return <BackHeader title="Edit Content" />
  const set = <K extends keyof ContentRecord>(k: K, val: ContentRecord[K]) => setV((s) => (s ? { ...s, [k]: val } : s))

  const setCredit = (i: number, patch: Partial<Credit>) => set('credits', v.credits.map((c, k) => (k === i ? { ...c, ...patch } : c)))
  const addCredit = () => set('credits', [...v.credits, { name: '', role: '' }])
  const removeCredit = (i: number) => set('credits', v.credits.filter((_, k) => k !== i))

  const save = () => { updateRecord(item.id, v); navigate(-1) }

  const isPublished = item.status === 'published'

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Edit Content" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <Section title="Thumbnail">
          <div className="grid grid-cols-4 gap-2">
            {COVERS.map((c) => (
              <button key={c} onClick={() => { if (isPublished) setConfirmThumb(true); else set('thumbnail', c) }} className={`h-16 overflow-hidden rounded-[8px] border-2 ${v.thumbnail === c ? 'border-brand' : 'border-transparent'}`}><img src={c} alt="" className="h-full w-full object-cover" /></button>
            ))}
          </div>
          {isPublished && <p className="mt-1.5 text-[11.5px] text-muted">Media for published content is protected. Changing it needs confirmation.</p>}
        </Section>

        <Section title="Details">
          <TextField label="Title" value={v.title} onChange={(x) => set('title', x.slice(0, 100))} />
          <TextArea label="Short description" value={v.description} onChange={(x) => set('description', x)} maxLength={300} rows={2} />
          <TextArea label="Full description" value={v.fullDescription} onChange={(x) => set('fullDescription', x)} maxLength={2000} rows={4} />
          <SelectField label="Category" value={v.category} onChange={(x) => set('category', x)} options={CONTENT_CATEGORIES} />
          <TagInput label="Tags" value={v.tags} onChange={(x) => set('tags', x)} />
        </Section>

        <Section title="Credits">
          {v.credits.map((c, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1"><TextField label={i === 0 ? 'Name' : ''} value={c.name} onChange={(x) => setCredit(i, { name: x })} placeholder="Name" /></div>
              <div className="flex-1"><TextField label={i === 0 ? 'Role' : ''} value={c.role} onChange={(x) => setCredit(i, { role: x })} placeholder="Role" /></div>
              <button onClick={() => removeCredit(i)} aria-label="Remove" className="tap mb-1 flex h-[46px] w-[44px] items-center justify-center rounded-control border border-border text-muted hover:text-error"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={addCredit} className="tap flex min-h-[40px] items-center gap-2 text-[13px] font-semibold text-brand"><Plus className="h-4 w-4" /> Add credit</button>
        </Section>

        <Section title="Collection">
          <SelectField label="Collection" value={collections.find((c) => c.id === v.collectionId)?.name ?? 'No Collection'} onChange={(name) => set('collectionId', collections.find((c) => c.name === name)?.id ?? null)} options={['No Collection', ...collections.map((c) => c.name)]} />
        </Section>

        <Section title="Visibility & engagement">
          <SelectField label="Visibility" value={v.visibility} onChange={(x) => set('visibility', x as Visibility)} options={['Public', 'Members Only', 'Unlisted', 'Draft']} />
          <Toggle label="Allow likes" checked={v.allowLikes} onChange={(x) => set('allowLikes', x)} />
          <Toggle label="Allow comments" checked={v.allowComments} onChange={(x) => set('allowComments', x)} />
          <Toggle label="Allow sharing" checked={v.allowSharing} onChange={(x) => set('allowSharing', x)} />
          <Toggle label="Allow download" checked={v.download === 'download'} onChange={(x) => set('download', x ? 'download' : 'view')} />
        </Section>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={save}>Save Changes</PrimaryButton>
      </div>

      {confirmThumb && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setConfirmThumb(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h3 className="font-serif text-[20px] text-ink">Replace media on published content?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">This content is already live. Replacing its media will update the public page.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <button onClick={() => setConfirmThumb(false)} className="tap min-h-[46px] rounded-control border border-border bg-surface text-[14px] font-semibold text-ink">Keep current media</button>
              <button onClick={() => setConfirmThumb(false)} className="tap min-h-[46px] rounded-control bg-brand text-[14px] font-semibold text-white">Understood — pick a new one</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6 first:mt-1"><h2 className="mb-3 font-serif text-[18px] text-ink">{title}</h2><div className="flex flex-col gap-4">{children}</div></section>
}
