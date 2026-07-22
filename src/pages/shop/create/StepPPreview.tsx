import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Pencil } from 'lucide-react'
import { useShop } from '../../../state/ShopContext'
import { usePortfolio } from '../../../state/PortfolioContext'
import { useAuth } from '../../../state/AuthContext'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import Checkbox from '../../../components/form/Checkbox'
import StatusBadge from '../../../components/StatusBadge'
import { inr } from '../../../shop/pricing'

export default function StepPPreview() {
  const navigate = useNavigate()
  const { draft, publishDraft } = useShop()
  const { portfolio } = usePortfolio()
  const { state } = useAuth()
  const [mode, setMode] = useState<'guest' | 'customer'>('guest')
  const [ack, setAck] = useState(false)

  const d = draft
  const contentOk = d.type === 'Masterclass' ? (d.syllabus?.some((s) => s.lessons.length) ?? false)
    : d.type === 'Digital' ? !!d.fileFormat : (d.stock ?? 0) >= 0 && !!d.sku
  const checks = [
    { label: 'Details complete', ok: !!d.title && !!d.summary && !!d.category },
    { label: 'Pricing valid', ok: d.free || (d.price ?? 0) > 0 },
    { label: 'Product content complete', ok: contentOk },
    { label: 'Delivery information complete', ok: d.type === 'Masterclass' ? !!d.accessDuration : d.type === 'Digital' ? !!d.licence : !!d.shippingRegions },
    { label: 'Cover image present', ok: !!(d.cover || d.images?.[0]) },
    { label: 'Policies acknowledged', ok: ack },
  ]
  const canPublish = checks.every((c) => c.ok)

  const publish = (status: 'published' | 'pending') => {
    const p = publishDraft({ id: portfolio.slug, name: portfolio.basics.fullName || state.name, avatar: portfolio.basics.photo }, status)
    navigate('/creator/products/create/success', { state: { productId: p.id, status } })
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg/90 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={() => navigate('/creator/products/create/media')} aria-label="Back" className="tap flex h-11 items-center gap-1 rounded-control pl-1 pr-2 text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /><span className="text-[13px] font-semibold">Back</span></button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold text-ink">Preview</h1>
        <span className="h-11 w-11" />
      </header>

      <div className="shrink-0 px-[18px] pt-3">
        <div className="flex gap-1 rounded-control bg-surface p-1">
          {(['guest', 'customer'] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={`tap flex-1 rounded-[7px] py-1.5 text-[12.5px] font-semibold capitalize ${mode === m ? 'bg-brand text-white' : 'text-muted'}`}>As {m}</button>)}
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-4">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="aspect-[4/3] w-full bg-brand-soft">{(d.cover || d.images?.[0]) && <img src={d.cover || d.images?.[0]} alt="" className="h-full w-full object-cover" />}</div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <StatusBadge tone="brand">{d.type}</StatusBadge>
              <button onClick={() => navigate('/creator/products/create/details')} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Pencil className="h-3 w-3" /> Edit</button>
            </div>
            <h2 className="mt-2 font-serif text-[22px] leading-tight text-ink">{d.title || 'Untitled product'}</h2>
            <p className="mt-1 text-[13px] text-muted">{d.summary}</p>
            <p className="mt-3 text-[16px] font-bold text-ink">{d.free ? 'Free' : inr(d.price ?? 0)}</p>
          </div>
        </div>

        <h3 className="mb-2 mt-6 text-[12px] font-bold uppercase tracking-wide text-muted">Before you publish</h3>
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 px-3.5 py-2.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${c.ok ? 'bg-success text-white' : 'bg-border text-muted'}`}><Check className="h-3 w-3" strokeWidth={3} /></span>
              <span className="flex-1 text-[13.5px] text-ink">{c.label}</span>
              {!c.ok && c.label !== 'Policies acknowledged' && <span className="text-[11.5px] font-semibold text-error">Incomplete</span>}
            </div>
          ))}
        </div>
        <div className="mt-4"><Checkbox checked={ack} onChange={setAck}>I confirm this product follows IICA's policies.</Checkbox></div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => publish('pending')} disabled={!canPublish} className="min-w-[120px]">Submit Review</SecondaryButton>
          <PrimaryButton full disabled={!canPublish} onClick={() => publish('published')}>Publish</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
