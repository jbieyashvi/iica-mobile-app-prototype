import { useNavigate } from 'react-router-dom'
import ProductBuilderShell from '../../../components/shop/ProductBuilderShell'
import TextField from '../../../components/form/TextField'
import SelectField from '../../../components/form/SelectField'
import Toggle from '../../../components/form/Toggle'
import { useShop } from '../../../state/ShopContext'
import { Licence } from '../../../shop/types'

const LICENCES: Licence[] = ['Personal Use', 'Commercial Use', 'Custom Licence']

export default function StepPDelivery() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useShop()
  const t = draft.type

  return (
    <ProductBuilderShell step={3} onContinue={() => navigate('/creator/products/create/media')}>
      <h2 className="mb-4 font-serif text-[22px] text-ink">Delivery & access</h2>
      <div className="flex flex-col gap-4">
        {t === 'Masterclass' && (
          <>
            <SelectField label="Access duration" value={draft.accessDuration ?? ''} onChange={(v) => saveDraft({ accessDuration: v })} options={['Lifetime', '1 year', '6 months', '3 months']} />
            <div className="rounded-card border border-border bg-surface p-4"><Toggle label="Certificate offered" checked={!!draft.certificate} onChange={(v) => saveDraft({ certificate: v })} /></div>
          </>
        )}
        {t === 'Digital' && (
          <>
            <SelectField label="Licence type" value={draft.licence ?? ''} onChange={(v) => saveDraft({ licence: v as Licence })} options={LICENCES} />
            <TextField label="Download limit" optional value={draft.downloadLimit ?? ''} onChange={(v) => saveDraft({ downloadLimit: v })} placeholder="e.g. 5 downloads / Unlimited" />
            <TextField label="Usage instructions" optional value={draft.usage ?? ''} onChange={(v) => saveDraft({ usage: v })} />
          </>
        )}
        {t === 'Physical' && (
          <>
            <TextField label="Shipping regions" value={draft.shippingRegions ?? ''} onChange={(v) => saveDraft({ shippingRegions: v })} placeholder="e.g. India" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Processing time" optional value={draft.processing ?? ''} onChange={(v) => saveDraft({ processing: v })} placeholder="2–3 days" />
              <TextField label="Delivery estimate" optional value={draft.deliveryEstimate ?? ''} onChange={(v) => saveDraft({ deliveryEstimate: v })} placeholder="5–7 days" />
            </div>
            <SelectField label="Shipping cost" value={draft.shippingType ?? ''} onChange={(v) => saveDraft({ shippingType: v as 'Free' | 'Flat Rate' })} options={['Free', 'Flat Rate']} />
            {draft.shippingType === 'Flat Rate' && <TextField label="Flat rate (₹)" type="number" value={String(draft.shippingCost ?? '')} onChange={(v) => saveDraft({ shippingCost: Number(v) || 0 })} />}
            <div className="rounded-card border border-border bg-surface p-4"><Toggle label="Returns accepted" checked={!!draft.returnEligible} onChange={(v) => saveDraft({ returnEligible: v })} /></div>
            {draft.returnEligible && <TextField label="Return window" optional value={draft.returnWindow ?? ''} onChange={(v) => saveDraft({ returnWindow: v })} placeholder="e.g. 7 days" />}
            <TextField label="Care instructions" optional value={draft.care ?? ''} onChange={(v) => saveDraft({ care: v })} />
          </>
        )}
      </div>
    </ProductBuilderShell>
  )
}
