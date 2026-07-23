import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Trash2, FolderPlus, Sparkles } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import CreateProgress from '../../components/content/CreateProgress'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import TagInput from '../../components/form/TagInput'
import Toggle from '../../components/form/Toggle'
import PrimaryButton from '../../components/PrimaryButton'
import { useContentStore } from '../../state/ContentContext'
import { ContentDraft, ContentType, CONTENT_CATEGORIES, UPDATE_TYPES, Credit } from '../../content/types'
import { demoContentDetails } from '../../content/mockContent'

const LANGS = ['English', 'Hindi', 'Tamil', 'Bengali', 'Marathi', 'Kannada', 'Telugu', 'Other']

export default function Details() {
  const navigate = useNavigate()
  const { draft, saveDraft, collections, createCollection } = useContentStore()
  const type = (draft.type ?? 'Image') as ContentType
  const isUpdate = type === 'Artist Update'

  // Prefill empty common fields with realistic demo data (all editable). Draft
  // values (incl. type-specific + settings) are kept; only empties are filled.
  const init = useMemo<ContentDraft>(() => ({
    ...draft,
    title: draft.title || demoContentDetails.title,
    description: draft.description || demoContentDetails.description,
    fullDescription: draft.fullDescription || demoContentDetails.fullDescription,
    category: draft.category || demoContentDetails.category,
    customCategory: draft.customCategory || '',
    tags: draft.tags?.length ? draft.tags : (demoContentDetails.tags ?? []),
    language: draft.language || 'English',
    collectionId: draft.collectionId ?? null,
    credits: draft.credits?.length ? draft.credits : (demoContentDetails.credits ?? []),
    releaseDate: draft.releaseDate || demoContentDetails.releaseDate,
  }), [draft])

  const [v, setV] = useState<ContentDraft>(init)
  const set = <K extends keyof ContentDraft>(k: K, val: ContentDraft[K]) => setV((s) => ({ ...s, [k]: val }))
  const [newCol, setNewCol] = useState(false)

  const setCredit = (i: number, patch: Partial<Credit>) =>
    setV((s) => ({ ...s, credits: (s.credits ?? []).map((c, k) => (k === i ? { ...c, ...patch } : c)) }))
  const addCredit = () => setV((s) => ({ ...s, credits: [...(s.credits ?? []), { name: '', role: '' }] }))
  const removeCredit = (i: number) => setV((s) => ({ ...s, credits: (s.credits ?? []).filter((_, k) => k !== i) }))

  const valid = !!v.title?.trim() && (!isUpdate || !!v.updateText?.trim())

  const onContinue = () => {
    saveDraft(v)
    navigate('/content/create/settings')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Content Details" />
      <CreateProgress step="Details" isUpdate={isUpdate} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-2">
        {isUpdate ? (
          <Section title="Update">
            <SelectField label="Update type" value={v.updateType ?? 'Announcement'} onChange={(x) => set('updateType', x as ContentDraft['updateType'])} options={UPDATE_TYPES} />
            <TextField label="Headline" value={v.headline ?? v.title ?? ''} onChange={(x) => { set('headline', x); set('title', x) }} placeholder="A short headline" />
            <TextArea label="Update text" value={v.updateText ?? ''} onChange={(x) => { set('updateText', x); set('description', x.slice(0, 300)); set('fullDescription', x) }} maxLength={2000} rows={5} placeholder="Share your announcement or creative update" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="CTA label" optional value={v.ctaLabel ?? ''} onChange={(x) => set('ctaLabel', x)} placeholder="e.g. Listen now" />
              <TextField label="CTA URL" optional value={v.ctaUrl ?? ''} onChange={(x) => set('ctaUrl', x)} placeholder="https://" />
            </div>
          </Section>
        ) : (
          <Section title="About this content">
            <TextField label="Title" value={v.title ?? ''} onChange={(x) => set('title', x.slice(0, 100))} placeholder="Give it a clear title" hint={`${(v.title ?? '').length}/100`} />
            <TextArea label="Short description" value={v.description ?? ''} onChange={(x) => set('description', x)} maxLength={300} rows={2} placeholder="A one-line summary shown in feeds" />
            <TextArea label="Full description" value={v.fullDescription ?? ''} onChange={(x) => set('fullDescription', x)} maxLength={2000} rows={4} placeholder="Tell the story behind this work" />
          </Section>
        )}

        <Section title="Classification">
          <SelectField label="Primary category" value={v.category ?? ''} onChange={(x) => set('category', x)} options={CONTENT_CATEGORIES} />
          {v.category === 'Other' && <TextField label="Custom category" value={v.customCategory ?? ''} onChange={(x) => set('customCategory', x)} placeholder="Name your category" />}
          <TagInput label="Tags" value={v.tags ?? []} onChange={(x) => set('tags', x)} suggestions={['Cultural Storytelling', 'Creative Direction', 'Movement', 'Collaboration', 'Tutorial']} />
          <SelectField label="Language" value={v.language ?? 'English'} onChange={(x) => set('language', x)} options={LANGS} />
          <TextField label="Creation / release date" type="date" value={v.releaseDate ?? ''} onChange={(x) => set('releaseDate', x)} />
        </Section>

        {/* Type-specific */}
        {type === 'Video' && (
          <Section title="Video details">
            <TextField label="Duration" optional value={v.duration ?? ''} onChange={(x) => set('duration', x)} placeholder="2:14" />
            <SelectField label="Orientation" optional value={v.orientation ?? 'Landscape'} onChange={(x) => set('orientation', x)} options={['Landscape', 'Portrait', 'Square']} />
            <TextField label="Featured clip start" optional value={v.caption ?? ''} onChange={(x) => set('caption', x)} placeholder="e.g. 0:32" />
            <Toggle label="Captions available" checked={!!v.captionsAvailable} onChange={(x) => set('captionsAvailable', x)} />
            <TextField label="Content warning" optional value={v.contentWarning ?? ''} onChange={(x) => set('contentWarning', x)} placeholder="If applicable" />
          </Section>
        )}
        {type === 'Image' && (
          <Section title="Image details">
            <TextField label="Alt text" value={v.altText ?? ''} onChange={(x) => set('altText', x)} placeholder="Describe the image (required)" />
            <TextField label="Caption" optional value={v.caption ?? ''} onChange={(x) => set('caption', x)} placeholder="A short caption" />
            <Toggle label="Series / gallery post" description="Show as a multi-image gallery (up to 10)" checked={!!v.gallery} onChange={(x) => set('gallery', x)} />
          </Section>
        )}
        {type === 'Audio' && (
          <Section title="Audio details">
            <TextField label="Track title" value={v.trackTitle ?? v.title ?? ''} onChange={(x) => set('trackTitle', x)} />
            <TextField label="Artist / performer" value={v.performer ?? ''} onChange={(x) => set('performer', x)} placeholder="Performer name" />
            <TextField label="Genre" optional value={v.genre ?? ''} onChange={(x) => set('genre', x)} placeholder="e.g. Contemporary" />
            <TextField label="Duration" optional value={v.duration ?? ''} onChange={(x) => set('duration', x)} placeholder="3:42" />
            <TextArea label="Lyrics / transcript" value={v.lyrics ?? ''} onChange={(x) => set('lyrics', x)} maxLength={2000} rows={3} placeholder="Optional" />
          </Section>
        )}
        {type === 'PDF' && (
          <Section title="Document details">
            <SelectField label="Document type" value={v.docType ?? 'Guide'} onChange={(x) => set('docType', x)} options={['Guide', 'Portfolio', 'Sheet Music', 'Written Work', 'Other']} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Page count" optional value={String(v.pages ?? '')} onChange={(x) => set('pages', Number(x) || undefined)} placeholder="18" />
              <TextField label="Preview pages" optional value={String(v.previewPages ?? '')} onChange={(x) => set('previewPages', Number(x) || undefined)} placeholder="3" />
            </div>
            <TextArea label="Table of contents" value={v.toc ?? ''} onChange={(x) => set('toc', x)} maxLength={500} rows={3} placeholder="Optional short outline" />
          </Section>
        )}

        {!isUpdate && (
          <Section title="Credits & collaborators">
            {(v.credits ?? []).map((c, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="flex-1"><TextField label={i === 0 ? 'Name' : ''} value={c.name} onChange={(x) => setCredit(i, { name: x })} placeholder="Name" /></div>
                <div className="flex-1"><TextField label={i === 0 ? 'Role' : ''} value={c.role} onChange={(x) => setCredit(i, { role: x })} placeholder="Role" /></div>
                <button onClick={() => removeCredit(i)} aria-label="Remove" className="tap mb-1 flex h-[46px] w-[44px] items-center justify-center rounded-control border border-border text-muted hover:text-error"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={addCredit} className="tap flex min-h-[40px] items-center gap-2 text-[13px] font-semibold text-brand"><Plus className="h-4 w-4" /> Add credit</button>
          </Section>
        )}

        <Section title="Collection">
          <div className="flex flex-col gap-2">
            <CollectionRow label="No Collection" active={!v.collectionId} onClick={() => set('collectionId', null)} />
            {collections.map((c) => <CollectionRow key={c.id} label={c.name} active={v.collectionId === c.id} onClick={() => set('collectionId', c.id)} />)}
            <button onClick={() => setNewCol(true)} className="tap flex min-h-[46px] items-center gap-2 rounded-control border border-dashed border-border px-4 text-[13px] font-semibold text-brand hover:border-brand/50"><FolderPlus className="h-4 w-4" /> Create New Collection</button>
          </div>
        </Section>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full disabled={!valid} onClick={onContinue}>Continue to Settings</PrimaryButton>
      </div>

      {newCol && <NewCollectionSheet onClose={() => setNewCol(false)} onSave={(c) => { const col = createCollection(c); set('collectionId', col.id); setNewCol(false) }} />}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6 first:mt-3"><h2 className="mb-3 font-serif text-[18px] text-ink">{title}</h2><div className="flex flex-col gap-4">{children}</div></section>
}
function CollectionRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`tap flex min-h-[46px] items-center justify-between rounded-control border px-4 text-[14px] font-semibold ${active ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>
      {label}{active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
    </button>
  )
}

const COVERS = [
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80&auto=format&fit=crop',
]
function NewCollectionSheet({ onClose, onSave }: { onClose: () => void; onSave: (c: { name: string; description: string; cover: string; visibility: 'Public' | 'Members Only' | 'Unlisted' }) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState(COVERS[0])
  const [visibility, setVisibility] = useState<'Public' | 'Members Only' | 'Unlisted'>('Public')
  return (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative max-h-[86%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[20px] text-ink">New collection</h3><button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button></div>
        <div className="flex flex-col gap-4">
          <TextField label="Collection name" value={name} onChange={setName} placeholder="e.g. Visual Storytelling" />
          <TextArea label="Description" value={description} onChange={setDescription} maxLength={200} rows={2} placeholder="What ties this collection together?" />
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Cover image</p>
            <div className="flex gap-2">
              {COVERS.map((c) => <button key={c} onClick={() => setCover(c)} className={`h-16 flex-1 overflow-hidden rounded-[8px] border-2 ${cover === c ? 'border-brand' : 'border-transparent'}`}><img src={c} alt="" className="h-full w-full object-cover" /></button>)}
            </div>
          </div>
          <SelectField label="Visibility" value={visibility} onChange={(x) => setVisibility(x as 'Public' | 'Members Only' | 'Unlisted')} options={['Public', 'Members Only', 'Unlisted']} />
          <PrimaryButton full disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), description, cover, visibility })}><Sparkles className="h-4 w-4" /> Save Collection</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
