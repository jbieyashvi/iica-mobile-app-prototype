import { useNavigate } from 'react-router-dom'
import { UploadCloud, CheckCircle2 } from 'lucide-react'
import ProductBuilderShell from '../../../components/shop/ProductBuilderShell'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { useShop } from '../../../state/ShopContext'
import { Entry } from '../../../portfolio/types'
import { DIGITAL_TYPES, Lesson, SkillLevel, Section, Variant } from '../../../shop/types'
import { useState } from 'react'

const LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
const lessonFields: FieldDef[] = [
  { key: 'title', label: 'Lesson title', type: 'text' },
  { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 12m', half: true },
  { key: 'freePreview', label: 'Free preview', type: 'toggle' },
]
const variantFields: FieldDef[] = [
  { key: 'name', label: 'Variant (e.g. Size: M)', type: 'text' },
  { key: 'price', label: 'Price (₹)', type: 'number', half: true },
  { key: 'stock', label: 'Stock', type: 'number', half: true },
]

export default function StepPContent() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useShop()
  const [fileAdded, setFileAdded] = useState(!!draft.fileFormat)
  const t = draft.type

  const canContinue = t === 'Masterclass' ? (draft.syllabus?.some((s) => s.lessons.length) ?? false)
    : t === 'Digital' ? !!draft.digitalType && fileAdded
      : (draft.stock ?? 0) >= 0 && !!draft.sku

  // Masterclass syllabus stored as one section holding lessons (prototype)
  const lessons = draft.syllabus?.[0]?.lessons ?? []
  const setLessons = (items: Entry[]) => {
    const sec: Section = { id: 's1', title: draft.syllabus?.[0]?.title || 'Course content', description: '', lessons: items as unknown as Lesson[] }
    saveDraft({ syllabus: [sec] })
  }

  return (
    <ProductBuilderShell step={1} canContinue={canContinue} onContinue={() => navigate('/creator/products/create/pricing')}>
      {t === 'Masterclass' && (
        <>
          <h2 className="mb-4 font-serif text-[22px] text-ink">Masterclass content</h2>
          <div className="flex flex-col gap-4">
            <TextField label="Instructor" value={draft.instructor ?? ''} onChange={(v) => saveDraft({ instructor: v })} />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Skill level" value={draft.level ?? ''} onChange={(v) => saveDraft({ level: v as SkillLevel })} options={LEVELS} />
              <TextField label="Total duration" value={draft.duration ?? ''} onChange={(v) => saveDraft({ duration: v })} placeholder="e.g. 4h 20m" />
            </div>
            <TextArea label="Learning outcomes (one per line)" value={(draft.outcomes ?? []).join('\n')} onChange={(v) => saveDraft({ outcomes: v.split('\n').filter(Boolean) })} maxLength={600} rows={3} placeholder="Write a complete song…" />
            <TextField label="Requirements" optional value={draft.requirements ?? ''} onChange={(v) => saveDraft({ requirements: v })} />
            <TextField label="Target audience" optional value={draft.audience ?? ''} onChange={(v) => saveDraft({ audience: v })} />
            <div>
              <p className="mb-2 text-[13px] font-semibold text-ink">Syllabus lessons</p>
              <RepeatableEditor items={lessons as unknown as Entry[]} onChange={setLessons} fields={lessonFields} addLabel="Add Lesson" emptyText="Add at least one lesson." makeSummary={(e) => ({ title: String(e.title || 'Lesson'), sub: String(e.duration || '') })} />
            </div>
          </div>
        </>
      )}

      {t === 'Digital' && (
        <>
          <h2 className="mb-4 font-serif text-[22px] text-ink">Digital product</h2>
          <div className="flex flex-col gap-4">
            <SelectField label="Digital product type" value={draft.digitalType ?? ''} onChange={(v) => saveDraft({ digitalType: v })} options={DIGITAL_TYPES} />
            {draft.digitalType === 'Other' && <TextField label="Custom type" value={draft.customType ?? ''} onChange={(v) => saveDraft({ customType: v })} />}
            <div>
              <p className="mb-1.5 text-[13px] font-semibold text-ink">Product file</p>
              <button onClick={() => { setFileAdded(true); saveDraft({ fileFormat: draft.fileFormat || 'ZIP', fileSize: draft.fileSize || '210 MB' }) }} className={`tap flex h-24 w-full items-center justify-center gap-2 rounded-card border border-dashed ${fileAdded ? 'border-success bg-[#EAF3EE] text-success' : 'border-border bg-surface text-muted'}`}>{fileAdded ? <><CheckCircle2 className="h-5 w-5" /> File uploaded</> : <><UploadCloud className="h-5 w-5" /> Upload file (max 500MB)</>}</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="File format" value={draft.fileFormat ?? ''} onChange={(v) => saveDraft({ fileFormat: v })} placeholder=".zip, .pdf" />
              <TextField label="File size" value={draft.fileSize ?? ''} onChange={(v) => saveDraft({ fileSize: v })} placeholder="e.g. 210 MB" />
            </div>
            <TextField label="Version" optional value={draft.version ?? ''} onChange={(v) => saveDraft({ version: v })} placeholder="e.g. 1.0" />
            <TextField label="Sample / preview link" optional value={draft.sampleUrl ?? ''} onChange={(v) => saveDraft({ sampleUrl: v })} placeholder="https://…" />
          </div>
        </>
      )}

      {t === 'Physical' && (
        <>
          <h2 className="mb-4 font-serif text-[22px] text-ink">Product information</h2>
          <div className="flex flex-col gap-4">
            <TextField label="SKU" value={draft.sku ?? ''} onChange={(v) => saveDraft({ sku: v })} placeholder="e.g. MK-JRNL-01" />
            <TextField label="Materials" optional value={draft.materials ?? ''} onChange={(v) => saveDraft({ materials: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Dimensions" optional value={draft.dimensions ?? ''} onChange={(v) => saveDraft({ dimensions: v })} placeholder="21 × 14 cm" />
              <TextField label="Weight" optional value={draft.weight ?? ''} onChange={(v) => saveDraft({ weight: v })} placeholder="340 g" />
            </div>
            <TextField label="Country of origin" optional value={draft.origin ?? ''} onChange={(v) => saveDraft({ origin: v })} placeholder="India" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Stock quantity" type="number" value={String(draft.stock ?? '')} onChange={(v) => saveDraft({ stock: Number(v) || 0 })} />
              <TextField label="Low-stock alert" type="number" optional value={String(draft.lowStock ?? '')} onChange={(v) => saveDraft({ lowStock: Number(v) || 0 })} />
            </div>
            <div>
              <p className="mb-2 text-[13px] font-semibold text-ink">Variants <span className="font-normal text-muted">Optional</span></p>
              <RepeatableEditor items={(draft.variants ?? []) as unknown as Entry[]} onChange={(items) => saveDraft({ variants: items as unknown as Variant[] })} fields={variantFields} addLabel="Add Variant" emptyText="No variants — single option." makeSummary={(e) => ({ title: String(e.name || 'Variant'), sub: `₹${e.price || 0} · ${e.stock || 0} in stock` })} />
            </div>
          </div>
        </>
      )}
    </ProductBuilderShell>
  )
}
