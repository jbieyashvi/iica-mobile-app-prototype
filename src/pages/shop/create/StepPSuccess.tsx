import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Copy, Check, ExternalLink, Share2, Settings, FolderPlus } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import StatusBadge from '../../../components/StatusBadge'
import { useShop } from '../../../state/ShopContext'

export default function StepPSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getProduct } = useShop()
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')

  const st = location.state as { productId?: string; status?: string }
  const p = getProduct(st?.productId)
  if (!p) return <BackHeader title="Published" />
  const pending = st?.status === 'pending'
  const url = `iica.app/product/${p.id}`
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Product Submitted" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <div className="flex flex-col items-center pt-6 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${pending ? 'bg-[#F7F0E4] text-warning' : 'bg-[#EAF3EE] text-success'}`}><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></div>
          <h1 className="mt-5 font-serif text-[27px] leading-tight text-ink">Your product has been submitted</h1>
          <div className="mt-3">{pending ? <StatusBadge tone="warning">Pending Review</StatusBadge> : <StatusBadge tone="success">Published</StatusBadge>}</div>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">{pending ? 'It will appear in the shop once reviewed.' : "It's now live in the shop and on your portfolio store."}</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
          <div className="aspect-[16/9] w-full bg-brand-soft">{p.cover && <img src={p.cover} alt="" className="h-full w-full object-cover" />}</div>
          <div className="p-4"><p className="font-serif text-[17px] text-ink">{p.title}</p><p className="mt-0.5 text-[12.5px] text-muted">{p.type}</p></div>
        </div>

        <div className="mt-4 rounded-card border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Product link</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="truncate font-mono text-[13px] font-semibold text-ink">{url}</span>
            <button onClick={() => { navigator.clipboard?.writeText('https://' + url); setCopied(true); setTimeout(() => setCopied(false), 1600) }} className={`tap flex h-10 shrink-0 items-center gap-1.5 rounded-control border px-3 text-[13px] font-semibold ${copied ? 'border-success/40 bg-[#EAF3EE] text-success' : 'border-border bg-bg text-ink'}`}>{copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}</button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => navigate(`/product/${p.id}`)}><ExternalLink className="h-4 w-4" /> View Product</PrimaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => navigate(`/creator/products/${p.id}`)}><Settings className="h-4 w-4" /> Manage</SecondaryButton>
            <SecondaryButton onClick={() => navigate(`/artist/${p.sellerId}/share`)}><Share2 className="h-4 w-4" /> Share</SecondaryButton>
          </div>
          <SecondaryButton full onClick={() => flash('Added to portfolio store')}><FolderPlus className="h-4 w-4" /> Add to Portfolio Store</SecondaryButton>
          <button onClick={() => navigate('/creator/products')} className="tap mt-1 min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Go to My Products</button>
        </div>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
