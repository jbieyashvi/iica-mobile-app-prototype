import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderPlus, ChevronRight, X, Lock, Globe, Link2 } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import PrimaryButton from '../../../components/PrimaryButton'
import { useContentStore } from '../../../state/ContentContext'

const COVERS = [
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80&auto=format&fit=crop',
]
const visIcon = { Public: Globe, 'Members Only': Lock, Unlisted: Link2 }

export default function Collections() {
  const navigate = useNavigate()
  const { collections, collectionContent, createCollection } = useContentStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Collections" right={
        <button onClick={() => setOpen(true)} aria-label="New collection" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><FolderPlus className="h-5 w-5" /></button>
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <p className="text-[13px] text-muted">Group your content into themed collections.</p>
        <div className="mt-4 flex flex-col gap-3">
          {collections.map((c) => {
            const count = collectionContent(c.id).length
            const Icon = visIcon[c.visibility]
            return (
              <button key={c.id} onClick={() => navigate(`/creator/collections/${c.id}`)} className="tap flex gap-3 rounded-card border border-border bg-surface p-3 text-left hover:border-ink/20">
                <img src={c.cover} alt="" className="h-16 w-16 shrink-0 rounded-[10px] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[16px] text-ink">{c.name}</p>
                  <p className="line-clamp-1 text-[12.5px] text-muted">{c.description}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11.5px] text-muted"><Icon className="h-3 w-3" /> {c.visibility} · {count} item{count === 1 ? '' : 's'}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 self-center text-muted" />
              </button>
            )
          })}
        </div>
      </div>
      {open && <CreateSheet onClose={() => setOpen(false)} onSave={(c) => { const col = createCollection(c); setOpen(false); navigate(`/creator/collections/${col.id}`) }} />}
    </div>
  )
}

function CreateSheet({ onClose, onSave }: { onClose: () => void; onSave: (c: { name: string; description: string; cover: string; visibility: 'Public' | 'Members Only' | 'Unlisted' }) => void }) {
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
          <TextArea label="Description" value={description} onChange={setDescription} maxLength={200} rows={2} />
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Cover image</p>
            <div className="flex gap-2">{COVERS.map((c) => <button key={c} onClick={() => setCover(c)} className={`h-16 flex-1 overflow-hidden rounded-[8px] border-2 ${cover === c ? 'border-brand' : 'border-transparent'}`}><img src={c} alt="" className="h-full w-full object-cover" /></button>)}</div>
          </div>
          <SelectField label="Visibility" value={visibility} onChange={(x) => setVisibility(x as 'Public' | 'Members Only' | 'Unlisted')} options={['Public', 'Members Only', 'Unlisted']} />
          <PrimaryButton full disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), description, cover, visibility })}>Save Collection</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
