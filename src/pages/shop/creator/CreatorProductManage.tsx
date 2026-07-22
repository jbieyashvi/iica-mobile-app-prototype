import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, Pencil, Copy, Share2, Archive, Trash2 } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import StatusBadge from '../../../components/StatusBadge'
import SecondaryButton from '../../../components/SecondaryButton'
import ConfirmSheet from '../../../components/portfolio/ConfirmSheet'
import { useShop } from '../../../state/ShopContext'
import { inr, creatorEarnings } from '../../../shop/pricing'

export default function CreatorProductManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, orders, loadDraft, duplicateProduct, archiveProduct, deleteDraft } = useShop()
  const [confirm, setConfirm] = useState<'archive' | 'delete' | null>(null)
  const [toast, setToast] = useState('')
  const p = getProduct(id)
  if (!p) return <BackHeader title="Product" />
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const productOrders = orders.filter((o) => o.items.some((i) => i.productId === p.id))
  const soldOut = p.type === 'Physical' && (p.stock ?? 0) <= 0
  const revenue = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((a, i) => a + creatorEarnings(i.price * i.qty), 0), 0)

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Manage Product" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="flex items-center gap-3">
          <img src={p.cover} alt="" className="h-16 w-16 rounded-[10px] object-cover" />
          <div className="min-w-0 flex-1"><p className="truncate font-serif text-[17px] text-ink">{p.title}</p><p className="text-[12.5px] text-muted">{p.type} · {p.free ? 'Free' : inr(p.price)}</p></div>
          <StatusBadge tone={p.status === 'archived' ? 'neutral' : p.status === 'draft' ? 'warning' : soldOut ? 'error' : 'success'}>{soldOut ? 'Out of Stock' : p.status === 'published' ? 'Live' : p.status}</StatusBadge>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Mini label="Sales" value={String(p.sales ?? 0)} />
          <Mini label={p.type === 'Physical' ? 'Stock' : 'Access'} value={p.type === 'Physical' ? String(p.stock ?? 0) : 'Digital'} />
          <Mini label="Revenue" value={inr(revenue)} />
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <SecondaryButton full onClick={() => navigate(`/product/${p.id}`)}><ExternalLink className="h-4 w-4" /> View in Shop</SecondaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => { loadDraft(p); navigate('/creator/products/create/details') }}><Pencil className="h-4 w-4" /> Edit</SecondaryButton>
            <SecondaryButton onClick={() => { duplicateProduct(p.id); flash('Duplicated as draft'); navigate('/creator/products') }}><Copy className="h-4 w-4" /> Duplicate</SecondaryButton>
            <SecondaryButton onClick={() => navigate(`/artist/${p.sellerId}/share`)}><Share2 className="h-4 w-4" /> Share</SecondaryButton>
            <SecondaryButton onClick={() => navigate('/creator/orders')}>View Orders</SecondaryButton>
          </div>
          {p.status === 'draft' ? (
            <button onClick={() => setConfirm('delete')} className="tap flex min-h-[48px] items-center justify-center gap-2 rounded-control border border-error/30 bg-surface text-[14px] font-semibold text-error"><Trash2 className="h-4 w-4" /> Delete Draft</button>
          ) : p.status !== 'archived' && (
            <button onClick={() => setConfirm('archive')} className="tap flex min-h-[48px] items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink"><Archive className="h-4 w-4" /> Archive Product</button>
          )}
          {productOrders.length > 0 && p.status !== 'archived' && p.status !== 'draft' && <p className="text-center text-[11.5px] text-muted">Products with order history can be archived, not deleted.</p>}
        </div>
      </div>

      <ConfirmSheet open={confirm === 'archive'} title="Archive this product?" body="It will be hidden from the shop but kept for your records." confirmLabel="Archive" onConfirm={() => { archiveProduct(p.id); setConfirm(null); flash('Archived'); navigate('/creator/products') }} onCancel={() => setConfirm(null)} />
      <ConfirmSheet open={confirm === 'delete'} title="Delete this draft?" body="This can't be undone." confirmLabel="Delete" danger onConfirm={() => { deleteDraft(p.id); setConfirm(null); navigate('/creator/products') }} onCancel={() => setConfirm(null)} />
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-card border border-border bg-surface p-3 text-center"><p className="font-serif text-[18px] leading-none text-ink">{value}</p><p className="mt-1 text-[10.5px] uppercase tracking-wide text-muted">{label}</p></div>
}
