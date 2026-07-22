import { useNavigate } from 'react-router-dom'
import ProductBuilderShell from '../../../components/shop/ProductBuilderShell'
import TextField from '../../../components/form/TextField'
import Toggle from '../../../components/form/Toggle'
import { useShop } from '../../../state/ShopContext'
import { COMMISSION_RATE } from '../../../shop/types'
import { inr, commission, creatorEarnings } from '../../../shop/pricing'

export default function StepPPricing() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useShop()
  const free = draft.free ?? false
  const price = draft.price ?? 0
  const canContinue = free || price > 0

  return (
    <ProductBuilderShell step={2} canContinue={canContinue} onContinue={() => navigate('/creator/products/create/delivery')}>
      <h2 className="mb-4 font-serif text-[22px] text-ink">Pricing</h2>
      <div className="flex flex-col gap-4">
        {draft.type !== 'Physical' && (
          <div className="rounded-card border border-border bg-surface p-4"><Toggle label="Free product" description="Offer this at no cost" checked={free} onChange={(v) => saveDraft({ free: v, price: v ? 0 : draft.price })} /></div>
        )}
        {!free && (
          <>
            <TextField label="Price (₹)" type="number" value={String(draft.price ?? '')} onChange={(v) => saveDraft({ price: Number(v) || 0 })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Compare-at price" optional type="number" value={String(draft.compareAt ?? '')} onChange={(v) => saveDraft({ compareAt: Number(v) || undefined })} placeholder="Original" />
              <TextField label="Discount %" optional type="number" value={String(draft.discount ?? '')} onChange={(v) => saveDraft({ discount: Number(v) || undefined })} />
            </div>
            <div className="flex flex-col gap-1.5 rounded-card border border-border bg-surface p-4 text-[13px]">
              <div className="flex justify-between"><span className="text-muted">Product price</span><span className="font-semibold text-ink">{inr(price)}</span></div>
              <div className="flex justify-between"><span className="text-muted">IICA commission ({Math.round(COMMISSION_RATE * 100)}%)</span><span className="font-semibold text-ink">− {inr(commission(price))}</span></div>
              <div className="flex justify-between border-t border-border pt-1.5"><span className="text-muted">Estimated earnings</span><span className="font-bold text-brand">{inr(creatorEarnings(price))}</span></div>
              <p className="text-[11px] text-muted">Prices include tax where applicable.</p>
            </div>
          </>
        )}
      </div>
    </ProductBuilderShell>
  )
}
