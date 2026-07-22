import { useParams, useNavigate } from 'react-router-dom'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { getProduct } from '../../data/exploreData'
import { inr } from '../../events/format'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const p = getProduct(id)
  if (!p) return <BackHeader title="Product" />

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        <div className="relative">
          <BackHeader transparent />
          <div className="aspect-square w-full overflow-hidden bg-brand-soft"><img src={p.image} alt="" className="h-full w-full object-cover" /></div>
        </div>
        <div className="px-[18px] pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{p.kind}</span>
          <h1 className="mt-1 font-serif text-[24px] leading-tight text-ink">{p.title}</h1>
          <p className="mt-1 text-[13px] text-muted">By {p.creator}</p>
          <p className="mt-3 text-[22px] font-bold text-ink">{inr(p.price)}</p>

          <div className="mt-6 rounded-card border border-border bg-surface p-4 text-center">
            <StatusBadge tone="neutral">Coming next</StatusBadge>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">The full shop experience — with cart and secure checkout — will be available in the next prototype phase.</p>
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => navigate('/explore/shop')} className="min-w-[120px]">Back to Shop</SecondaryButton>
          <PrimaryButton full disabled>Buy — coming soon</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
