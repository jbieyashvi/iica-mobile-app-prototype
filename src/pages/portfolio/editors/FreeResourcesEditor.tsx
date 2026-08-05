import { useRef, useState } from 'react'
import { FileText, Trash2, Plus, Upload, Check, AlertTriangle } from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import ImageUpload from '../../../components/form/ImageUpload'
import { usePortfolio } from '../../../state/PortfolioContext'
import { FreeResource } from '../../../portfolio/types'
import { PRODUCT_CATEGORIES } from '../../../shop/types'
import { useEditorNav } from './common'

const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Kannada', 'Malayalam', 'Gujarati', 'Punjabi', 'Other']
// Prototype localStorage budget — larger PDFs are kept as a reference only.
const MAX_PDF_BYTES = 4 * 1024 * 1024

const newId = () => 'fr' + Math.random().toString(36).slice(2, 9)

const emptyDraft = (): FreeResource => ({
  id: newId(), title: '', description: '', cover: '', pdfName: '', pdfData: '',
  author: '', category: '', year: '', language: '',
})

export default function FreeResourcesEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('free-resources')
  const list = portfolio.freeResources

  const [draft, setDraft] = useState<FreeResource>(emptyDraft)
  const [touched, setTouched] = useState(false)
  const [fileError, setFileError] = useState('')
  const [fileNote, setFileNote] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof FreeResource>(k: K, v: FreeResource[K]) =>
    setDraft((d) => ({ ...d, [k]: v }))

  const save = (next: FreeResource[]) => {
    setSection('freeResources', next)
    bump()
  }

  const onPickFile = (file?: File) => {
    setFileError('')
    setFileNote('')
    if (!file) return
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
    if (!isPdf) {
      setFileError('Only PDF files are allowed. Please choose a .pdf file.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (file.size > MAX_PDF_BYTES) {
      // Keep the reference (name) but skip inlining to stay within prototype storage.
      set('pdfName', file.name)
      set('pdfData', '')
      setFileNote('Large file — saved by name only for this prototype. The reader will show a preview placeholder.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      set('pdfName', file.name)
      set('pdfData', typeof reader.result === 'string' ? reader.result : '')
    }
    reader.onerror = () => setFileError('Could not read that file. Try another PDF.')
    reader.readAsDataURL(file)
  }

  const errors = {
    title: !draft.title.trim() ? 'Required' : '',
    pdf: !draft.pdfName ? 'Attach a PDF file' : '',
  }
  const canAdd = !errors.title && !errors.pdf && !fileError

  const add = () => {
    setTouched(true)
    if (!canAdd) return
    save([...list, draft])
    setDraft(emptyDraft())
    setTouched(false)
    setFileNote('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const remove = (id: string) => save(list.filter((r) => r.id !== id))

  return (
    <EditorShell title="Free Resources" revision={rev} onSaveContinue={goNext}>
      <p className="mb-4 text-[13px] leading-relaxed text-muted">
        Share free PDFs and e-books with your audience. Every resource is shown
        publicly as a <span className="font-semibold text-ink">Free</span> download —
        no payment, cart or checkout.
      </p>

      {/* Existing resources */}
      {list.length > 0 && (
        <div className="mb-6 flex flex-col gap-2.5">
          {list.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-brand-soft text-brand-dark">
                {r.cover ? <img src={r.cover} alt="" className="h-full w-full object-cover" /> : <FileText className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{r.title}</p>
                <p className="truncate text-[12px] text-muted">
                  <span className="font-semibold text-success">Free</span>
                  {r.category ? ` · ${r.category}` : ''}{r.year ? ` · ${r.year}` : ''}
                </p>
                <p className="truncate text-[11px] text-muted">{r.pdfName}</p>
              </div>
              <button
                aria-label={`Remove ${r.title}`}
                onClick={() => remove(r.id)}
                className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border text-muted hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      <div className="rounded-card border border-dashed border-border bg-surface p-4">
        <p className="mb-3 text-[13px] font-semibold text-ink">Add a resource</p>
        <div className="flex flex-col gap-4">
          <TextField label="Resource title" value={draft.title} onChange={(v) => set('title', v)} placeholder="e.g. A Beginner’s Guide to Folk Art" error={touched ? errors.title : ''} />
          <TextArea label="Short description" value={draft.description} onChange={(v) => set('description', v)} maxLength={280} rows={3} placeholder="One or two lines about this resource" />
          <ImageUpload label="Cover image" value={draft.cover} onChange={(v) => set('cover', v)} optional aspect="aspect-[3/2]" />

          {/* PDF upload */}
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink">PDF file</p>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => onPickFile(e.target.files?.[0])}
              className="hidden"
              aria-label="Choose PDF file"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="tap flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control border border-border bg-bg text-[14px] font-semibold text-ink hover:border-ink/25"
            >
              {draft.pdfName ? <><Check className="h-4 w-4 text-success" /> {draft.pdfName}</> : <><Upload className="h-4 w-4" /> Choose PDF</>}
            </button>
            {touched && errors.pdf && !fileError && (
              <p className="mt-1 text-[12px] font-medium text-error">{errors.pdf}</p>
            )}
            {fileError && (
              <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-error">
                <AlertTriangle className="h-3.5 w-3.5" /> {fileError}
              </p>
            )}
            {fileNote && <p className="mt-1 text-[12px] text-muted">{fileNote}</p>}
            <p className="mt-1 text-[11px] text-muted">PDF only. Stored locally in this prototype — not uploaded to a server.</p>
          </div>

          <TextField label="Author / creator name" value={draft.author} onChange={(v) => set('author', v)} placeholder="Your name" optional />
          <SelectField label="Category" value={draft.category} onChange={(v) => set('category', v)} options={[...PRODUCT_CATEGORIES]} placeholder="Select a category" optional />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Published year" value={draft.year} onChange={(v) => set('year', v)} placeholder="2026" optional />
            <SelectField label="Language" value={draft.language} onChange={(v) => set('language', v)} options={LANGUAGES} placeholder="Select" optional />
          </div>

          <button
            onClick={add}
            className="tap flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control bg-ink text-[14px] font-semibold text-white hover:bg-ink/90"
          >
            <Plus className="h-[18px] w-[18px]" /> Add Resource
          </button>
        </div>
      </div>
    </EditorShell>
  )
}
