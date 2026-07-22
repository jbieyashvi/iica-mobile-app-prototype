import { useNavigate } from 'react-router-dom'
import ProductBuilderShell from '../../../components/shop/ProductBuilderShell'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import TagInput from '../../../components/form/TagInput'
import Checkbox from '../../../components/form/Checkbox'
import { useShop } from '../../../state/ShopContext'
import { PRODUCT_CATEGORIES } from '../../../shop/types'
import { useState } from 'react'

export default function StepPDetails() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useShop()
  const [terms, setTerms] = useState(false)
  const canContinue = !!draft.title?.trim() && !!draft.summary?.trim() && !!draft.category && terms

  return (
    <ProductBuilderShell step={0} canContinue={canContinue} onContinue={() => navigate('/creator/products/create/content')}>
      <h2 className="mb-1 font-serif text-[22px] text-ink">{draft.type} details</h2>
      <p className="mb-5 text-[12.5px] text-muted">Describe your product for buyers.</p>
      <div className="flex flex-col gap-4">
        <div>
          <TextField label="Product title" value={draft.title ?? ''} onChange={(v) => saveDraft({ title: v.slice(0, 100) })} placeholder="e.g. The Art of Indian Songwriting" />
          <p className="mt-1 text-right text-[11.5px] text-muted">{(draft.title ?? '').length}/100</p>
        </div>
        <div>
          <TextField label="Short summary" value={draft.summary ?? ''} onChange={(v) => saveDraft({ summary: v.slice(0, 160) })} placeholder="One line that sells it" />
          <p className="mt-1 text-right text-[11.5px] text-muted">{(draft.summary ?? '').length}/160</p>
        </div>
        <TextArea label="Full description" value={draft.description ?? ''} onChange={(v) => saveDraft({ description: v.slice(0, 3000) })} maxLength={3000} rows={5} placeholder="Describe what buyers get" />
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Category" value={draft.category ?? ''} onChange={(v) => saveDraft({ category: v })} options={PRODUCT_CATEGORIES} />
          <TextField label="Subcategory" optional value={draft.subcategory ?? ''} onChange={(v) => saveDraft({ subcategory: v })} />
        </div>
        <TagInput label="Tags" value={draft.tags ?? []} onChange={(v) => saveDraft({ tags: v })} placeholder="Add a tag and press Enter" />
        <TextField label="Language" optional value={draft.language ?? ''} onChange={(v) => saveDraft({ language: v })} placeholder="e.g. Hindi, English" />
        <div className="rounded-control bg-surface px-3.5 py-3 text-[12px] text-muted ring-1 ring-border">Products are published after a short review in production. Autosaved as you type.</div>
        <Checkbox checked={terms} onChange={setTerms}>I confirm this product follows IICA's seller policies.</Checkbox>
      </div>
    </ProductBuilderShell>
  )
}
