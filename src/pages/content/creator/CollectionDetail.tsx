import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronUp, ChevronDown, X, Trash2, Plus, PencilLine } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import PrimaryButton from '../../../components/PrimaryButton'
import { useContentStore } from '../../../state/ContentContext'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { collections, records, collectionContent, setCollection, updateCollection, deleteCollection } = useContentStore()
  const col = collections.find((c) => c.id === id)
  const [order, setOrder] = useState<string[] | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1500) }
  if (!col) return <BackHeader title="Collection" />

  const base = collectionContent(col.id)
  const items = order ? order.map((i) => base.find((b) => b.id === i)!).filter(Boolean) : base
  const available = useMemo(() => records.filter((r) => r.createdByMe && r.collectionId !== col.id), [records, col.id])

  const move = (i: number, dir: -1 | 1) => {
    const arr = items.map((x) => x.id)
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setOrder(arr)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Collection" right={
        <button onClick={() => setEditOpen(true)} aria-label="Edit" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><PencilLine className="h-5 w-5" /></button>
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="aspect-[16/9] w-full overflow-hidden bg-brand-soft"><img src={col.cover} alt="" className="h-full w-full object-cover" /></div>
          <div className="p-4"><h1 className="font-serif text-[20px] leading-tight text-ink">{col.name}</h1><p className="mt-1 text-[13px] text-muted">{col.description}</p><p className="mt-1 text-[11.5px] text-muted">{col.visibility} · {items.length} item{items.length === 1 ? '' : 's'}</p></div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h2 className="font-serif text-[17px] text-ink">Content</h2>
          <button onClick={() => setAddOpen(true)} className="tap flex items-center gap-1 text-[12.5px] font-semibold text-brand"><Plus className="h-4 w-4" /> Add content</button>
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          {items.length === 0 && <p className="rounded-card border border-dashed border-border bg-surface px-4 py-8 text-center text-[13px] text-muted">No content in this collection yet.</p>}
          {items.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-2.5">
              <img src={r.thumbnail} alt="" className="h-12 w-16 shrink-0 rounded-[8px] object-cover" />
              <button onClick={() => navigate(`/creator/content/${r.id}`)} className="tap min-w-0 flex-1 text-left"><p className="truncate text-[13.5px] font-semibold text-ink">{r.title}</p><p className="text-[11.5px] text-muted">{r.type} · {r.status}</p></button>
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} aria-label="Move up" className="tap flex h-6 w-6 items-center justify-center text-muted hover:text-ink"><ChevronUp className="h-4 w-4" /></button>
                <button onClick={() => move(i, 1)} aria-label="Move down" className="tap flex h-6 w-6 items-center justify-center text-muted hover:text-ink"><ChevronDown className="h-4 w-4" /></button>
              </div>
              <button onClick={() => { setCollection(r.id, null); flash('Removed') }} aria-label="Remove" className="tap flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-error"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        <button
          onClick={() => { if (items.length === 0) { deleteCollection(col.id); navigate('/creator/collections') } else flash('Empty the collection before deleting') }}
          className="tap mt-6 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control border border-error/30 bg-bg text-[14px] font-semibold text-error hover:bg-[#F7E9EA]"
        >
          <Trash2 className="h-4 w-4" /> Delete Collection
        </button>
        <p className="mt-1.5 text-center text-[11.5px] text-muted">Deleting keeps your content — it moves to No Collection.</p>
      </div>

      {addOpen && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setAddOpen(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative max-h-[80%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-4" style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}>
            <div className="mb-2 flex items-center justify-between"><h3 className="font-serif text-[19px] text-ink">Add content</h3><button aria-label="Close" onClick={() => setAddOpen(false)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted"><X className="h-5 w-5" /></button></div>
            {available.length === 0 ? <p className="py-6 text-center text-[13px] text-muted">All your content is already here.</p> : (
              <div className="flex flex-col gap-2">
                {available.map((r) => (
                  <button key={r.id} onClick={() => { setCollection(r.id, col.id); flash('Added') }} className="tap flex items-center gap-3 rounded-control border border-border bg-bg p-2 text-left hover:border-ink/25">
                    <img src={r.thumbnail} alt="" className="h-10 w-14 shrink-0 rounded-[7px] object-cover" />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{r.title}</span>
                    <Plus className="h-4 w-4 text-brand" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {editOpen && <EditSheet name={col.name} description={col.description} onClose={() => setEditOpen(false)} onSave={(n, d) => { updateCollection(col.id, { name: n, description: d }); setEditOpen(false); flash('Collection updated') }} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-[60] flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function EditSheet({ name, description, onClose, onSave }: { name: string; description: string; onClose: () => void; onSave: (n: string, d: string) => void }) {
  const [n, setN] = useState(name)
  const [d, setD] = useState(description)
  return (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[20px] text-ink">Edit collection</h3><button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted"><X className="h-5 w-5" /></button></div>
        <div className="flex flex-col gap-4">
          <TextField label="Name" value={n} onChange={setN} />
          <TextArea label="Description" value={d} onChange={setD} maxLength={200} rows={2} />
          <PrimaryButton full disabled={!n.trim()} onClick={() => onSave(n.trim(), d)}>Save</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
